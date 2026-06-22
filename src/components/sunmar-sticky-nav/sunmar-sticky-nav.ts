import { LitElement, css, html, unsafeCSS } from 'lit';
import { property, state } from 'lit/decorators.js';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-sticky-nav.scss?inline';

export const SUNMAR_STICKY_NAV_TAG_NAME = 'sunmar-sticky-nav';

const TABLET_MIN_WIDTH = 768;
const DESKTOP_MIN_WIDTH = 993;
const MOBILE_TOP_OFFSET = 81;
const TABLET_TOP_OFFSET = 65;
const DESKTOP_TOP_OFFSET = 16;
const SCROLL_TARGET_GAP = 12;

export class SunmarStickyNav extends LitElement {
  static styles = [componentBaseStyles, css`
    ${unsafeCSS(styles)}
  `];

  @property({ type: Number, reflect: true, attribute: 'top-offset' })
  topOffset: number | null = null;

  @state()
  private isStuck = false;

  private responsiveTopOffset = MOBILE_TOP_OFFSET;
  private navLinks: HTMLAnchorElement[] = [];
  private sectionLinkMap = new Map<HTMLElement, HTMLAnchorElement>();
  private activeSections = new Set<HTMLElement>();
  private sectionObserver: IntersectionObserver | null = null;
  private stickyObserver: IntersectionObserver | null = null;
  private currentActiveLink: HTMLAnchorElement | null = null;

  private readonly handleNavLinksSlotChange = (event: Event): void => {
    const slot = event.target as HTMLSlotElement;
    this.syncNavLinks(slot);
  };

  private readonly handleNavClick = (event: MouseEvent): void => {
    if (event.defaultPrevented || event.button !== 0) {
      return;
    }

    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const navLink = event.currentTarget;

    if (!(navLink instanceof HTMLAnchorElement)) {
      return;
    }

    const sectionId = this.getSectionId(navLink);

    if (!sectionId) {
      return;
    }

    const targetSection = this.ownerDocument.getElementById(sectionId);

    if (!targetSection) {
      return;
    }

    const defaultView = this.ownerDocument.defaultView;

    if (!defaultView) {
      return;
    }

    event.preventDefault();
    this.scrollToSection(targetSection, navLink.hash || `#${sectionId}`, defaultView);
  };

  private syncResponsiveTopOffset(): void {
    this.responsiveTopOffset = this.getResponsiveTopOffset();
  }

  private syncStickyOffset(): void {
    this.style.setProperty('--sunmar-sticky-nav-top-offset', `${this.resolvedTopOffset}px`);
  }

  private syncTopOffsetState(): void {
    this.syncResponsiveTopOffset();
    this.syncStickyOffset();
  }

  private syncStickyGeometry(): void {
    this.syncTopOffsetState();
    this.syncReservedHeight();
  }

  private collectNavLinks(slot?: HTMLSlotElement): HTMLAnchorElement[] {
    const navSlot = slot ?? this.renderRoot.querySelector<HTMLSlotElement>('slot[name="nav-link"]');
    if (!navSlot) {
      return [];
    }

    return navSlot
      .assignedElements({ flatten: true })
      .filter((element): element is HTMLAnchorElement => element instanceof HTMLAnchorElement);
  }

  private setupNavLinkListeners(): void {
    for (const navLink of this.navLinks) {
      navLink.addEventListener('click', this.handleNavClick);
    }
  }

  private syncNavLinks(slot?: HTMLSlotElement): void {
    this.teardownNavLinkListeners();
    this.navLinks = this.collectNavLinks(slot);

    this.setupNavLinkListeners();

    this.syncReservedHeight();
    this.setupSectionObserver();
  }

  private teardownNavLinkListeners(): void {
    for (const navLink of this.navLinks) {
      navLink.removeEventListener('click', this.handleNavClick);
    }
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

  private getNavElement(): HTMLElement | null {
    return this.renderRoot.querySelector<HTMLElement>('nav.root');
  }

  private syncReservedHeight(): void {
    const navHeight = this.getNavElement()?.offsetHeight ?? 0;
    this.style.setProperty('--sunmar-sticky-nav-reserved-height', `${navHeight}px`);
  }

  private scrollToSection(targetSection: HTMLElement, hash: string, defaultView: Window): void {
    const navHeight = this.getNavElement()?.offsetHeight ?? 0;
    const overlayCompensation = navHeight + this.resolvedTopOffset + SCROLL_TARGET_GAP;
    const targetTop = defaultView.scrollY + targetSection.getBoundingClientRect().top;
    const nextTop = Math.max(
      0,
      targetTop - overlayCompensation
    );

    defaultView.scrollTo({
      top: nextTop,
      behavior: "smooth",
    });

    defaultView.history.pushState(null, '', hash);
  }

  private teardownSectionObserver(): void {
    this.sectionObserver?.disconnect();
    this.sectionObserver = null;
    this.activeSections.clear();
  }

  private teardownStickyObserver(): void {
    this.stickyObserver?.disconnect();
    this.stickyObserver = null;
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
        threshold: 0.3,
      }
    );

    for (const section of this.sectionLinkMap.keys()) {
      this.sectionObserver.observe(section);
    }
    
    this.syncActiveNavLink();
  }

  private setupStickyObserver(): void {
    this.teardownStickyObserver();

    const sentinel = this.renderRoot.querySelector<HTMLElement>('.sentinel');

    if (!sentinel || typeof IntersectionObserver === 'undefined') {
      return;
    }

    this.stickyObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry && !this.isStuck && !entry.isIntersecting) {
          this.syncStickyGeometry();
        }

        const nextIsStuck = Boolean(
          entry &&
          !entry.isIntersecting &&
          entry.boundingClientRect.top <= this.resolvedTopOffset
        );

        if (this.isStuck !== nextIsStuck) {
          this.isStuck = nextIsStuck;
          this.classList.toggle('sunmar-sticky-nav--stuck', nextIsStuck);
        }
      },
      {
        root: null,
        threshold: 0,
        rootMargin: `${-this.resolvedTopOffset}px 0px 0px 0px`,
      }
    );

    this.stickyObserver.observe(sentinel);
  }

  private getResponsiveTopOffset(): number {
    const defaultView = this.ownerDocument.defaultView;

    if (!defaultView) {
      return MOBILE_TOP_OFFSET;
    }

    if (defaultView.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`).matches) {
      return DESKTOP_TOP_OFFSET;
    }

    if (defaultView.matchMedia(`(min-width: ${TABLET_MIN_WIDTH}px)`).matches) {
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
      <div
        class="sentinel"
        aria-hidden="true"
      ></div>

      <nav
        class=${this.isStuck ? 'root root--stuck' : 'root'}
        part="root"
      >
        <slot
          name="nav-link"
          @slotchange=${this.handleNavLinksSlotChange}
        ></slot>
      </nav>
    `;
  }

  private initializeAfterRender(): void {
    this.syncStickyGeometry();
    this.setupStickyObserver();
    this.syncNavLinks();
    requestAnimationFrame(() => this.syncStickyGeometry());
  }

  connectedCallback(): void {
    super.connectedCallback();

    if (this.hasUpdated) {
      this.initializeAfterRender();
    }
  }

  updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has('topOffset')) {
      this.syncStickyOffset();
    }
  }

  firstUpdated(): void {
    this.initializeAfterRender();
  }

  disconnectedCallback(): void {
    this.teardownNavLinkListeners();
    this.teardownSectionObserver();
    this.teardownStickyObserver();

    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_STICKY_NAV_TAG_NAME]: SunmarStickyNav;
  }
}
