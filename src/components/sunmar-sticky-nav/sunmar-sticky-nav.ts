import { LitElement, css, html, unsafeCSS } from 'lit';
import { property, state } from 'lit/decorators.js';
import { observeMinWidth } from '../../utils/dom/observe-media';
import styles from './sunmar-sticky-nav.scss?inline';

export const SUNMAR_STICKY_NAV_TAG_NAME = 'sunmar-sticky-nav';

const ROW_OUTER_CONTAINER_SELECTOR = '.row-outer-container';
const TABLET_MIN_WIDTH = 768;
const DESKTOP_MIN_WIDTH = 993;
const MOBILE_TOP_OFFSET = 81;
const TABLET_TOP_OFFSET = 65;
const DESKTOP_TOP_OFFSET = 16;

export class SunmarStickyNav extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  @property({ type: Number, reflect: true, attribute: 'top-offset' })
  topOffset: number | null = null;

  @state()
  private responsiveTopOffset = MOBILE_TOP_OFFSET;

  private cleanupTabletMedia: (() => void) | null = null;
  private cleanupDesktopMedia: (() => void) | null = null;
  private isRelocating = false;
  private isTabletUp = false;
  private isDesktopUp = false;

  private startResponsiveOffsetObservers(): void {
    if (this.cleanupTabletMedia || this.cleanupDesktopMedia) {
      return;
    }

    this.cleanupTabletMedia = observeMinWidth(TABLET_MIN_WIDTH, (matches) => {
      this.isTabletUp = matches;
      this.syncResponsiveTopOffset();
    });
    this.cleanupDesktopMedia = observeMinWidth(DESKTOP_MIN_WIDTH, (matches) => {
      this.isDesktopUp = matches;
      this.syncResponsiveTopOffset();
    });
  }

  private stopResponsiveOffsetObservers(): void {
    this.cleanupTabletMedia?.();
    this.cleanupTabletMedia = null;
    this.cleanupDesktopMedia?.();
    this.cleanupDesktopMedia = null;
  }

  private relocateForSticky(): boolean {
    const rowOuterContainer = this.closest<HTMLElement>(ROW_OUTER_CONTAINER_SELECTOR);

    if (rowOuterContainer && rowOuterContainer.nextElementSibling !== this) {
      this.isRelocating = true;
      rowOuterContainer.insertAdjacentElement('afterend', this);
      this.isRelocating = false;
      return true;
    }

    return false;
  }

  private syncResponsiveTopOffset(): void {
    this.responsiveTopOffset = this.getResponsiveTopOffset();
  }

  private syncStickyOffset(): void {
    this.style.setProperty('--sunmar-sticky-nav-top-offset', `${this.resolvedTopOffset}px`);
  }

  private getResponsiveTopOffset(): number {
    if (this.isDesktopUp) {
      return DESKTOP_TOP_OFFSET;
    }

    if (this.isTabletUp) {
      return TABLET_TOP_OFFSET;
    }

    return MOBILE_TOP_OFFSET;
  }

  private get resolvedTopOffset(): number {
    if (typeof this.topOffset === 'number' && Number.isFinite(this.topOffset)) {
      return Math.max(0, this.topOffset);
    }

    return this.responsiveTopOffset;
  }

  protected render() {
    return html`
      <nav class="root" part="root">
        <div class="items" part="items">
          <slot class="items-slot" name="nav-link"></slot>
        </div>
      </nav>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();

    if (!this.id) {
      this.id = `${SUNMAR_STICKY_NAV_TAG_NAME}-${crypto.randomUUID()}`;
    }

    if (this.relocateForSticky()) {
      return;
    }

    this.startResponsiveOffsetObservers();
    this.syncStickyOffset();
  }

  updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has('topOffset') || changedProperties.has('responsiveTopOffset')) {
      this.syncStickyOffset();
    }
  }

  disconnectedCallback(): void {
    if (!this.isRelocating) {
      this.stopResponsiveOffsetObservers();
    }

    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_STICKY_NAV_TAG_NAME]: SunmarStickyNav;
  }
}
