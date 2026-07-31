import { LitElement, css, html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-sticky-nav.scss?inline';

export const SUNMAR_STICKY_NAV_TAG_NAME = 'sunmar-sticky-nav';

const TABLET_MIN_WIDTH = 768;
const DESKTOP_MIN_WIDTH = 992;
const MOBILE_TOP_OFFSET = 81;
const TABLET_TOP_OFFSET = 65;
const DESKTOP_TOP_OFFSET = 16;
const DEFAULT_TELEPORT_SELECTOR = '.row-outer-container';
const RELOCATE_TIMEOUT_MS = 5_000;

export class SunmarStickyNav extends LitElement {
  static styles = [componentBaseStyles, css`
    ${unsafeCSS(styles)}
  `];

  @property({ type: Number, reflect: true, attribute: 'top-offset' })
  topOffset: number | null = null;

  @property({ type: Boolean, reflect: true, attribute: 'disable-relocate' })
  disableRelocate = false;

  @property({ type: String })
  teleport: string | null = null;

  private responsiveTopOffset = MOBILE_TOP_OFFSET;
  private navLinks: HTMLAnchorElement[] = [];
  private sectionLinkMap = new Map<HTMLElement, HTMLAnchorElement>();
  private activeSections = new Set<HTMLElement>();
  private sectionObserver: IntersectionObserver | null = null;
  private currentActiveLink: HTMLAnchorElement | null = null;
  private relocateTargetObserver: MutationObserver | null = null;
  private relocateTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private isRelocating = false;
  private relocatedSelector: string | null = null;

  private readonly handleNavLinksSlotChange = (event: Event): void => {
    const slot = event.target as HTMLSlotElement;
    this.syncNavLinks(slot);
  };

  private startRelocateTargetWait(): void {
    this.cancelRelocateTargetWait();

    const selector = this.resolvedTeleportSelector;
    if (this.disableRelocate || this.relocatedSelector === selector || !this.isConnected) {
      return;
    }

    if (this.relocateToTarget(selector)) {
      return;
    }

    const documentRoot = this.ownerDocument.documentElement;
    if (!documentRoot || typeof MutationObserver === 'undefined') {
      return;
    }

    this.relocateTargetObserver = new MutationObserver(() => {
      if (selector !== this.resolvedTeleportSelector) {
        this.startRelocateTargetWait();
        return;
      }

      this.relocateToTarget(selector);
    });
    this.relocateTargetObserver.observe(documentRoot, { childList: true, subtree: true });

    this.relocateTimeoutId = setTimeout(() => {
      this.cancelRelocateTargetWait();
    }, RELOCATE_TIMEOUT_MS);
  }

  private relocateToTarget(selector: string): boolean {
    let target: Element | null;

    try {
      target = this.closest(selector) ?? this.ownerDocument.querySelector(selector);
    } catch {
      this.cancelRelocateTargetWait();
      return true;
    }

    if (!target) {
      return false;
    }

    this.cancelRelocateTargetWait();

    if (target === this || this.contains(target)) {
      return true;
    }

    this.relocatedSelector = selector;

    if (target.nextElementSibling === this) {
      return true;
    }

    this.isRelocating = true;
    try {
      target.insertAdjacentElement('afterend', this);
    } finally {
      this.isRelocating = false;
    }
    return true;
  }

  private get resolvedTeleportSelector(): string {
    return this.teleport?.trim() || DEFAULT_TELEPORT_SELECTOR;
  }

  private cancelRelocateTargetWait(): void {
    this.relocateTargetObserver?.disconnect();
    this.relocateTargetObserver = null;

    if (this.relocateTimeoutId !== null) {
      clearTimeout(this.relocateTimeoutId);
      this.relocateTimeoutId = null;
    }
  }

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

  private collectNavLinks(slot?: HTMLSlotElement): HTMLAnchorElement[] {
    const navSlot = slot ?? this.renderRoot.querySelector<HTMLSlotElement>('slot[name="nav-link"]');
    if (!navSlot) {
      return [];
    }

    return navSlot
      .assignedElements({ flatten: true })
      .filter((element): element is HTMLAnchorElement => element instanceof HTMLAnchorElement);
  }

  private syncNavLinks(slot?: HTMLSlotElement): void {
    this.navLinks = this.collectNavLinks(slot);
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
      <nav
        class="root"
        part="root"
        aria-label="Навигация по разделам"
      >
        <slot
          name="nav-link"
          @slotchange=${this.handleNavLinksSlotChange}
        ></slot>
      </nav>
    `;
  }

  private initializeAfterRender(): void {
    this.syncTopOffsetState();
    this.syncNavLinks();
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.startRelocateTargetWait();

    if (this.hasUpdated) {
      this.initializeAfterRender();
    }
  }

  updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has('topOffset')) {
      this.syncStickyOffset();
    }

    if (changedProperties.has('disableRelocate') || changedProperties.has('teleport')) {
      if (this.disableRelocate) {
        this.cancelRelocateTargetWait();
      } else {
        this.startRelocateTargetWait();
      }
    }
  }

  firstUpdated(): void {
    this.initializeAfterRender();
  }

  disconnectedCallback(): void {
    if (this.isRelocating) {
      super.disconnectedCallback();
      return;
    }

    this.cancelRelocateTargetWait();
    this.relocatedSelector = null;
    this.teardownSectionObserver();

    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_STICKY_NAV_TAG_NAME]: SunmarStickyNav;
  }
}
