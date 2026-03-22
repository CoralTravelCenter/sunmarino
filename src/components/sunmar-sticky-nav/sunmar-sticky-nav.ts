import { LitElement, css, html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { componentBaseStyles } from '../../styles/component-base';
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

  private responsiveTopOffset = MOBILE_TOP_OFFSET;

  private isRelocating = false;
  private navLinks: HTMLAnchorElement[] = [];
  private sectionLinkMap = new Map<HTMLElement, HTMLAnchorElement>();
  private activeSections = new Set<HTMLElement>();
  private sectionObserver: IntersectionObserver | null = null;
  private currentActiveLink: HTMLAnchorElement | null = null;

  private readonly handleWindowResize = (): void => {
    this.syncResponsiveTopOffset();
    this.syncStickyOffset();
    this.setupSectionObserver();
  };

  private readonly handleNavLinksSlotChange = (event: Event): void => {
    const slot = event.target as HTMLSlotElement;
    this.syncNavLinks(slot);
  };

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

  private teardownSectionObserver(): void {
    this.sectionObserver?.disconnect();
    this.sectionObserver = null;
    this.activeSections.clear();
  }

  private getActivationOffset(): number {
    return this.resolvedTopOffset + this.offsetHeight;
  }

  private clearActiveNavLinks(): void {
    for (const navLink of this.navLinks) {
      navLink.classList.remove('active');
      navLink.removeAttribute('aria-current');
    }

    this.currentActiveLink = null;
  }

  private setActiveNavLink(navLink: HTMLAnchorElement | null): void {
    if (this.currentActiveLink === navLink) {
      return;
    }

    for (const currentNavLink of this.navLinks) {
      const isActive = currentNavLink === navLink;
      currentNavLink.classList.toggle('active', isActive);

      if (isActive) {
        currentNavLink.setAttribute('aria-current', 'true');
      } else {
        currentNavLink.removeAttribute('aria-current');
      }
    }

    this.currentActiveLink = navLink;
  }

  private syncActiveNavLink(): void {
    if (this.sectionLinkMap.size === 0) {
      this.clearActiveNavLinks();
      return;
    }

    for (const section of this.sectionLinkMap.keys()) {
      if (this.activeSections.has(section)) {
        this.setActiveNavLink(this.sectionLinkMap.get(section) ?? null);
        return;
      }
    }

    this.clearActiveNavLinks();
  }

  private setupSectionObserver(): void {
    this.teardownSectionObserver();
    this.rebuildSectionLinkMap();

    if (this.sectionLinkMap.size === 0 || typeof IntersectionObserver === 'undefined') {
      this.clearActiveNavLinks();
      return;
    }

    const topRootMargin = -this.getActivationOffset();

    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const section = entry.target;

          if (!(section instanceof HTMLElement) || !this.sectionLinkMap.has(section)) {
            continue;
          }

          if (entry.intersectionRatio >= 0.3) {
            this.activeSections.add(section);
          } else {
            this.activeSections.delete(section);
          }
        }

        this.syncActiveNavLink();
      },
      {
        root: null,
        rootMargin: `${topRootMargin}px 0px 0px 0px`,
        threshold: 0.3,
      }
    );

    for (const section of this.sectionLinkMap.keys()) {
      this.sectionObserver.observe(section);
    }
    
    this.syncActiveNavLink();
  }

  private getResponsiveTopOffset(): number {
    if (window.innerWidth >= DESKTOP_MIN_WIDTH) {
      return DESKTOP_TOP_OFFSET;
    }

    if (window.innerWidth >= TABLET_MIN_WIDTH) {
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

    window.addEventListener('resize', this.handleWindowResize);
    this.syncResponsiveTopOffset();
    this.syncStickyOffset();

    if (this.hasUpdated) {
      this.syncNavLinks();
    }
  }

  updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has('topOffset')) {
      this.syncStickyOffset();
      this.setupSectionObserver();
    }
  }

  firstUpdated(): void {
    this.syncNavLinks();
  }

  disconnectedCallback(): void {
    if (!this.isRelocating) {
      window.removeEventListener('resize', this.handleWindowResize);
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
