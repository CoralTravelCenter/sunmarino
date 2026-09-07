import { LitElement, css, html, unsafeCSS } from 'lit';
import { property, query } from 'lit/decorators.js';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-sticky-nav.scss?inline';

export const SUNMAR_STICKY_NAV_TAG_NAME = 'sunmar-sticky-nav';

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

  @query('slot[name="nav-link"]')
  private navSlot!: HTMLSlotElement | null;

  private contentObserver?: MutationObserver;
  private observerGeneration = 0;
  private readonly linkState = new Map<HTMLAnchorElement, {
    active: boolean; current: string | null; writtenActive: boolean; writtenCurrent: string | null;
  }>();
  private navLinks: HTMLAnchorElement[] = [];
  private sectionLinkMap = new Map<HTMLElement, HTMLAnchorElement>();
  private activeSections = new Set<HTMLElement>();
  private sectionObserver: IntersectionObserver | null = null;
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

  private syncStickyOffset(): void {
    if (typeof this.topOffset === 'number' && Number.isFinite(this.topOffset)) {
      this.style.setProperty(
        '--sunmarino-sticky-nav-top-offset',
        `${Math.max(0, this.topOffset)}px`
      );
      return;
    }

    this.style.removeProperty('--sunmarino-sticky-nav-top-offset');
  }

  private collectNavLinks(slot?: HTMLSlotElement): HTMLAnchorElement[] {
    const navSlot = slot ?? this.navSlot;
    if (!navSlot) {
      return [];
    }

    return navSlot
      .assignedElements({ flatten: true })
      .filter((element): element is HTMLAnchorElement => element instanceof HTMLAnchorElement);
  }

  private syncNavLinks(slot?: HTMLSlotElement): void {
    if (!this.isConnected) return;
    const next = this.collectNavLinks(slot);
    for (const link of this.navLinks) {
      if (!next.includes(link)) this.restoreLink(link);
    }
    this.navLinks = next;
    this.setupSectionObserver();
  }

  private getSectionId(navLink: HTMLAnchorElement): string | null {
    const href = navLink.getAttribute('href')?.trim();

    if (!href) {
      return null;
    }

    let sectionId: string;
    try {
      const target = new URL(href, this.ownerDocument.baseURI);
      const current = new URL(this.ownerDocument.URL);
      if (target.origin !== current.origin || target.pathname !== current.pathname
        || target.search !== current.search || !target.hash) return null;
      sectionId = decodeURIComponent(target.hash.slice(1));
    } catch {
      return null;
    }
    if (!sectionId) return null;

    return sectionId;
  }

  private rebuildSectionLinkMap(): boolean {
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

    const previous = Array.from(this.sectionLinkMap);
    const next = Array.from(nextSectionLinkMap);
    const changed = previous.length !== next.length || next.some(([section, link], index) =>
      previous[index]?.[0] !== section || previous[index]?.[1] !== link);
    this.sectionLinkMap = nextSectionLinkMap;
    return changed;
  }

  private teardownSectionObserver(): void {
    this.observerGeneration++;
    this.sectionObserver?.disconnect();
    this.sectionObserver = null;
    this.activeSections.clear();
  }

  private restoreLink(link: HTMLAnchorElement): void {
    const state = this.linkState.get(link);
    if (!state) return;
    if (link.classList.contains('active') === state.writtenActive) link.classList.toggle('active', state.active);
    if (link.getAttribute('aria-current') === state.writtenCurrent) {
      if (state.current === null) link.removeAttribute('aria-current');
      else link.setAttribute('aria-current', state.current);
    }
    this.linkState.delete(link);
  }

  private clearActiveNavLinks(): void {
    this.setActiveNavLink(null);
  }

  private setActiveNavLink(navLink: HTMLAnchorElement | null): void {
    for (const link of this.navLinks) {
      const active = link.classList.contains('active');
      const current = link.getAttribute('aria-current');
      const previous = this.linkState.get(link);
      const isActive = link === navLink;
      this.linkState.set(link, {
        active: previous && active === previous.writtenActive ? previous.active : active,
        current: previous && current === previous.writtenCurrent ? previous.current : current,
        writtenActive: isActive,
        writtenCurrent: isActive ? 'true' : null
      });
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
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
    const changed = this.rebuildSectionLinkMap();
    if (!changed && this.sectionObserver) {
      this.syncActiveNavLink();
      return;
    }
    this.teardownSectionObserver();

    if (this.sectionLinkMap.size === 0 || typeof IntersectionObserver === 'undefined') {
      this.clearActiveNavLinks();
      return;
    }

    const generation = this.observerGeneration;
    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        if (!this.isConnected || generation !== this.observerGeneration) return;
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
    if (!this.isConnected) return;
    this.syncStickyOffset();
    this.syncNavLinks();
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.contentObserver ??= new MutationObserver(() => this.syncNavLinks());
    this.contentObserver.observe(this, {
      subtree: true, childList: true, attributes: true, attributeFilter: ['href', 'slot']
    });
    this.contentObserver.observe(this.ownerDocument, {
      subtree: true, childList: true, attributes: true, attributeFilter: ['href', 'id', 'slot']
    });
    this.startRelocateTargetWait();

    if (this.hasUpdated) {
      this.initializeAfterRender();
    }
  }

  updated(changedProperties: Map<string, unknown>): void {
    if (!this.isConnected) return;
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
    this.contentObserver?.disconnect();
    this.teardownSectionObserver();
    for (const link of this.navLinks) this.restoreLink(link);
    this.navLinks = [];
    this.sectionLinkMap.clear();

    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_STICKY_NAV_TAG_NAME]: SunmarStickyNav;
  }
}
