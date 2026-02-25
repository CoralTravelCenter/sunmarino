import { LitElement, css, html, unsafeCSS } from 'lit';
import simplebarStyles from 'simplebar/dist/simplebar.css?inline';
import { attachCustomScrollbar, type CustomScrollbarHandle } from '../../utils/scroll/custom-scrollbar';
import styles from './sunmar-sticky-nav.scss?inline';

export const SUNMAR_STICKY_NAV_TAG_NAME = 'sunmar-sticky-nav';
export type SunmarStickyNavScrollbarMode = 'custom' | 'native';

export class SunmarStickyNav extends LitElement {
  static properties = {
    topOffset: { type: Number, reflect: true, attribute: 'top-offset' },
    scrollbar: { type: String, reflect: true }
  };

  static styles = css`
    ${unsafeCSS(simplebarStyles)}
    ${unsafeCSS(styles)}
  `;

  topOffset = 0;
  scrollbar: SunmarStickyNavScrollbarMode = 'custom';
  private customScrollbarHandle: CustomScrollbarHandle | null = null;
  private customScrollbarSetupToken = 0;

  connectedCallback(): void {
    super.connectedCallback();
    this.syncTopOffset();
    this.repositionAfterClosestRowOuterContainer();

    if (this.hasUpdated) {
      this.syncCustomScrollbarState();
    }
  }

  updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has('topOffset')) {
      this.syncTopOffset();
    }

    if (changedProperties.has('scrollbar')) {
      this.syncCustomScrollbarState();
    }
  }

  disconnectedCallback(): void {
    this.teardownCustomScrollbar();
    super.disconnectedCallback();
  }

  firstUpdated(): void {
    this.syncCustomScrollbarState();
  }

  protected render() {
    return html`
      <nav class="root" part="root">
        <slot name="nav-link" part="items" @slotchange=${this.onNavSlotChange}></slot>
      </nav>
    `;
  }

  private syncTopOffset(): void {
    const parsedValue = Number(this.topOffset);
    const safeValue = Number.isFinite(parsedValue) ? Math.max(0, parsedValue) : 0;
    this.style.top = `${safeValue}px`;
  }

  private repositionAfterClosestRowOuterContainer(): void {
    const rowOuterContainer = this.closest<HTMLElement>('.row-outer-container');
    const parent = rowOuterContainer?.parentElement;

    if (!rowOuterContainer || !parent) {
      return;
    }

    if (rowOuterContainer.nextElementSibling === this) {
      return;
    }

    rowOuterContainer.insertAdjacentElement('afterend', this);
  }

  private readonly onNavSlotChange = (): void => {
    this.customScrollbarHandle?.recalculate();
  };

  private syncCustomScrollbarState(): void {
    if (this.isNativeScrollbarMode) {
      this.teardownCustomScrollbar();
      return;
    }

    void this.setupCustomScrollbar();
  }

  private teardownCustomScrollbar(): void {
    this.customScrollbarSetupToken += 1;
    this.customScrollbarHandle?.destroy();
    this.customScrollbarHandle = null;
  }

  private async setupCustomScrollbar(): Promise<void> {
    if (this.isNativeScrollbarMode) {
      return;
    }

    if (this.customScrollbarHandle) {
      this.customScrollbarHandle.recalculate();
      return;
    }

    const root = this.renderRoot.querySelector<HTMLElement>('.root');
    if (!root) {
      return;
    }

    const setupToken = ++this.customScrollbarSetupToken;

    const handle = await attachCustomScrollbar(root, {
      autoHide: false,
      forceVisible: 'x',
      clickOnTrack: true
    });

    if (setupToken !== this.customScrollbarSetupToken || !this.isConnected) {
      handle.destroy();
      return;
    }

    this.customScrollbarHandle = handle;
    this.customScrollbarHandle.recalculate();
  }

  private get isNativeScrollbarMode(): boolean {
    return this.scrollbar === 'native';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_STICKY_NAV_TAG_NAME]: SunmarStickyNav;
  }
}
