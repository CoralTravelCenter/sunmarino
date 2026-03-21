import { LitElement, css, html, unsafeCSS } from 'lit';
import { property, state } from 'lit/decorators.js';
import { componentBaseStyles } from '../../styles/component-base';
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
  static styles = [componentBaseStyles, css`
    ${unsafeCSS(styles)}
  `];

  @property({ type: Number, reflect: true, attribute: 'top-offset' })
  topOffset: number | null = null;

  @property({ type: Boolean, reflect: true, attribute: 'disable-relocate' })
  disableRelocate = false;

  @state()
  private responsiveTopOffset = MOBILE_TOP_OFFSET;

  private cleanupTabletMedia: (() => void) | null = null;
  private cleanupDesktopMedia: (() => void) | null = null;
  private isRelocating = false;
  private isTabletUp = false;
  private isDesktopUp = false;
  private navLinks: HTMLAnchorElement[] = [];
  private sectionLinkMap = new Map<HTMLElement, HTMLAnchorElement>();
  private sectionObserver: IntersectionObserver | null = null;
  private stickyNavResizeObserver: ResizeObserver | null = null;

  private readonly handleWindowResize = (): void => {
    this.setupSectionObserver();
  };

  private readonly handleNavLinksSlotChange = (event: Event): void => {
    const slot = event.target as HTMLSlotElement;
    this.syncNavLinks(slot);
  };

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

  private syncNavLinks(slot?: HTMLSlotElement): void {
    const navSlot = slot ?? this.renderRoot.querySelector<HTMLSlotElement>('slot[name="nav-link"]');

    if (!navSlot) {
      this.navLinks = [];
      this.teardownSectionObserver();
      return;
    }

    this.navLinks = navSlot
      .assignedElements({ flatten: true })
      .filter((element): element is HTMLAnchorElement => element instanceof HTMLAnchorElement);

    this.setupSectionObserver();
  }

  private getSectionId(navLink: HTMLAnchorElement): string | null {
    const href = navLink.getAttribute('href')?.trim();

    if (!href) {
      return null;
    }

    const hashIndex = href.indexOf('#');

    if (hashIndex < 0 || hashIndex === href.length - 1) {
      return null;
    }

    const sectionId = decodeURIComponent(href.slice(hashIndex + 1)).trim();

    if (!sectionId) {
      return null;
    }

    return sectionId;
  }

  private rebuildSectionLinkMap(): void {
    const nextSectionLinkMap = new Map<HTMLElement, HTMLAnchorElement>();

    for (const navLink of this.navLinks) {
      const sectionId = this.getSectionId(navLink);

      if (!sectionId) {
        continue;
      }

      const section = this.ownerDocument.getElementById(sectionId);

      if (!section) {
        continue;
      }

      nextSectionLinkMap.set(section, navLink);
    }

    this.sectionLinkMap = nextSectionLinkMap;
  }

  private startStickyNavResizeObserver(): void {
    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    this.stickyNavResizeObserver = new ResizeObserver(() => {
      this.setupSectionObserver();
    });
    this.stickyNavResizeObserver.observe(this);
  }

  private teardownSectionObserver(): void {
    this.sectionObserver?.disconnect();
    this.sectionObserver = null;

    this.stickyNavResizeObserver?.disconnect();
    this.stickyNavResizeObserver = null;

    window.removeEventListener('resize', this.handleWindowResize);
  }

  private getActivationOffset(): number {
    return this.resolvedTopOffset + this.offsetHeight;
  }

  private clearActiveNavLinks(): void {
    for (const navLink of this.navLinks) {
      navLink.classList.remove('active');
    }
  }

  private syncActiveNavLink(): void {
    if (this.sectionLinkMap.size === 0) {
      this.clearActiveNavLinks();
      return;
    }

    const activationOffset = this.getActivationOffset();
    let activeSection: HTMLElement | null = null;
    let lastPassedSection: HTMLElement | null = null;
    let firstUpcomingSection: HTMLElement | null = null;

    for (const section of this.sectionLinkMap.keys()) {
      const { top, bottom } = section.getBoundingClientRect();

      if (top <= activationOffset && bottom > activationOffset) {
        activeSection = section;
        break;
      }

      if (top <= activationOffset) {
        lastPassedSection = section;
        continue;
      }

      if (!firstUpcomingSection) {
        firstUpcomingSection = section;
      }
    }

    activeSection ??= lastPassedSection ?? firstUpcomingSection;

    this.clearActiveNavLinks();

    if (!activeSection) {
      return;
    }

    this.sectionLinkMap.get(activeSection)?.classList.add('active');
  }

  private setupSectionObserver(): void {
    this.teardownSectionObserver();
    this.rebuildSectionLinkMap();

    if (this.sectionLinkMap.size === 0 || typeof IntersectionObserver === 'undefined') {
      this.clearActiveNavLinks();
      return;
    }

    const viewportHeight = window.innerHeight || this.ownerDocument.documentElement.clientHeight;

    if (!viewportHeight) {
      this.clearActiveNavLinks();
      return;
    }

    const activationOffset = Math.min(this.getActivationOffset(), Math.max(viewportHeight - 1, 0));
    const bottomRootMargin = Math.max(viewportHeight - activationOffset - 1, 0);

    this.sectionObserver = new IntersectionObserver(
      () => {
        this.syncActiveNavLink();
      },
      {
        root: null,
        rootMargin: `-${activationOffset}px 0px -${bottomRootMargin}px 0px`,
        threshold: 0,
      }
    );

    for (const section of this.sectionLinkMap.keys()) {
      this.sectionObserver.observe(section);
    }

    this.startStickyNavResizeObserver();
    window.addEventListener('resize', this.handleWindowResize);
    this.syncActiveNavLink();
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
        <slot
          name="nav-link"
          @slotchange=${this.handleNavLinksSlotChange}
        ></slot>
      </nav>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();

    if (!this.id) {
      this.id = `${SUNMAR_STICKY_NAV_TAG_NAME}-${crypto.randomUUID()}`;
    }

    if (!this.disableRelocate && this.relocateForSticky()) {
      return;
    }

    this.startResponsiveOffsetObservers();
    this.syncStickyOffset();

    if (this.hasUpdated) {
      this.syncNavLinks();
    }
  }

  updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has('topOffset') || changedProperties.has('responsiveTopOffset')) {
      this.syncStickyOffset();
      this.setupSectionObserver();
    }
  }

  firstUpdated(): void {
    this.syncNavLinks();
  }

  disconnectedCallback(): void {
    if (!this.isRelocating) {
      this.stopResponsiveOffsetObservers();
      this.teardownSectionObserver();
    }

    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_STICKY_NAV_TAG_NAME]: SunmarStickyNav;
  }
}
