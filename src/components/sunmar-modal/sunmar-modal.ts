import { LitElement, css, html, nothing, unsafeCSS } from 'lit';
import { property, query, queryAssignedElements, state } from 'lit/decorators.js';
import { componentBaseStyles } from '../../styles/component-base';
import { acquirePageScrollLock, releasePageScrollLock } from '../../utils/scroll/no-scroll';
import { pushModal, removeModal, topModal } from './modal-stack';
import styles from './sunmar-modal.scss?inline';

export const SUNMAR_MODAL_TAG_NAME = 'sunmar-modal';
export const SUNMAR_MODAL_OPEN_EVENT = 'sunmar-modal-open';
export const SUNMAR_MODAL_CLOSE_EVENT = 'sunmar-modal-close';
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

let modalIdCounter = 0;

export class SunmarModal extends LitElement {
  static styles = [componentBaseStyles, css`
    ${unsafeCSS(styles)}
  `];

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: Boolean, attribute: 'disable-close-on-backdrop' })
  disableCloseOnBackdrop = false;

  @property({ type: Boolean, attribute: 'disable-close-on-esc' })
  disableCloseOnEsc = false;

  @property({ type: String, attribute: 'aria-label' })
  ariaLabel: string | null = null;

  @property({ type: String, attribute: 'aria-labelledby' })
  ariaLabelledby: string | null = null;

  @state()
  private hasActions = false;

  private hasScrollLock = false;
  private hasDocumentHandlers = false;
  private previouslyFocusedElement: HTMLElement | null = null;
  private active = false;
  private labelObserver?: MutationObserver;

  @state()
  private externalLabel = '';

  @query('.dialog')
  private dialog!: HTMLElement | null;

  @query('.close')
  private closeButton!: HTMLButtonElement | null;

  @queryAssignedElements({ slot: 'actions', flatten: true })
  private actionElements!: Element[];

  private readonly syncExternalLabel = (): void => {
    const root = this.getRootNode() as Document | ShadowRoot;
    const ids = this.ariaLabelledby?.trim().split(/\s+/) ?? [];
    this.externalLabel = ids.map((id) => root.getElementById?.(id)?.textContent?.trim() ?? '')
      .filter(Boolean).join(' ');
  };
  private readonly titleId = `sunmar-modal-title-${++modalIdCounter}`;

  private readonly onDocumentKeydown = (event: KeyboardEvent): void => {
    if (!this.open || topModal(this.ownerDocument) !== this) {
      return;
    }

    if (event.key === 'Escape' && !this.disableCloseOnEsc) {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.hide();
      return;
    }

    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  };

  connectedCallback(): void {
    super.connectedCallback();
    this.labelObserver ??= new MutationObserver(this.syncExternalLabel);
    this.labelObserver.observe(this.getRootNode(), {
      childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['id']
    });
    this.syncExternalLabel();

    if (this.open) {
      this.activateModal();
      void this.updateComplete.then(() => this.focusInitialElement());
    }
  }

  disconnectedCallback(): void {
    this.labelObserver?.disconnect();
    this.deactivateModal(true);
    super.disconnectedCallback();
  }

  protected willUpdate(changed: Map<PropertyKey, unknown>): void {
    if (this.open && changed.has('open')) {
      this.hasActions = Array.from(this.children).some(
        (child) => child.getAttribute('slot') === 'actions',
      );
    }
  }

  updated(changedProperties: Map<string, unknown>): void {
    if (!this.isConnected) return;
    if (changedProperties.has('ariaLabelledby')) this.syncExternalLabel();
    if (!changedProperties.has('open')) {
      return;
    }

    const previousOpen = changedProperties.get('open');

    if (this.open) {
      this.activateModal();
      this.focusInitialElement();
    } else {
      this.deactivateModal(true);
    }

    if (!this.open && previousOpen === undefined) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent(this.open ? SUNMAR_MODAL_OPEN_EVENT : SUNMAR_MODAL_CLOSE_EVENT, {
        bubbles: true,
        composed: true
      })
    );
  }

  show(): void {
    this.open = true;
  }

  hide(): void {
    this.open = false;
  }

  toggle(): void {
    this.open = !this.open;
  }

  protected render() {
    if (!this.open) {
      return nothing;
    }

    const ariaLabel = this.ariaLabel?.trim() || this.externalLabel || undefined;
    const ariaLabelledby = ariaLabel
      ? undefined
      : this.titleId;

    return html`
      <div class="overlay" part="overlay" @click=${this.handleBackdropClick}>
        <section
          class="dialog"
          part="dialog"
          role="dialog"
          aria-modal="true"
          aria-label=${ariaLabel ?? nothing}
          aria-labelledby=${ariaLabelledby ?? nothing}
          tabindex="-1"
          @click=${this.stopPropagation}
        >
          <header class="header" part="header">
            <h2 id=${this.titleId} class="title" part="title">
              <slot name="title">Диалог</slot>
            </h2>
            <button
              class="close"
              type="button"
              part="close"
              aria-label="Закрыть диалог"
              @click=${this.hide}
            >
              X
            </button>
          </header>
          <div class="body" part="body">
            <slot></slot>
          </div>
          <footer class="actions" part="actions" ?hidden=${!this.hasActions}>
            <slot name="actions" @slotchange=${this.syncActions}></slot>
          </footer>
        </section>
      </div>
    `;
  }

  private handleBackdropClick = (): void => {
    if (!this.disableCloseOnBackdrop && topModal(this.ownerDocument) === this) {
      this.hide();
    }
  };

  private stopPropagation = (event: Event): void => {
    event.stopPropagation();
  };

  private readonly syncActions = (): void => {
    this.hasActions = this.actionElements.length > 0;
  };

  private toggleDocumentHandlers(enabled: boolean): void {
    if (enabled === this.hasDocumentHandlers) {
      return;
    }

    this.hasDocumentHandlers = enabled;

    if (enabled) {
      this.ownerDocument.addEventListener('keydown', this.onDocumentKeydown, true);
      return;
    }

    this.ownerDocument.removeEventListener('keydown', this.onDocumentKeydown, true);
  }

  private syncScrollLock(shouldLock: boolean): void {
    if (shouldLock && !this.hasScrollLock) {
      acquirePageScrollLock();
      this.hasScrollLock = true;
      return;
    }

    if (!shouldLock && this.hasScrollLock) {
      releasePageScrollLock();
      this.hasScrollLock = false;
    }
  }

  private activateModal(): void {
    if (!this.isConnected || !this.open || this.active) return;
    this.active = true;
    if (!this.previouslyFocusedElement) {
      this.previouslyFocusedElement = this.getDeepActiveElement();
    }

    this.toggleDocumentHandlers(true);
    this.syncScrollLock(true);
    pushModal(this);
  }

  private deactivateModal(restoreFocus: boolean): void {
    if (!this.active) return;
    this.active = false;
    this.toggleDocumentHandlers(false);
    this.syncScrollLock(false);
    const wasTop = removeModal(this);

    const elementToRestore = this.previouslyFocusedElement;
    this.previouslyFocusedElement = null;

    if (restoreFocus && wasTop && elementToRestore?.isConnected && !this.hasInertAncestor(elementToRestore)) {
      elementToRestore.focus({ preventScroll: true });
    } else if (restoreFocus && wasTop) {
      (topModal(this.ownerDocument) as SunmarModal | undefined)?.focusInitialElement();
    }
  }

  private focusInitialElement(): void {
    if (!this.open || !this.isConnected || topModal(this.ownerDocument) !== this) {
      return;
    }

    const autofocusElement = this.getFocusableElements().find((element) =>
      element.hasAttribute('autofocus')
    );
    const lightDomElement = this.getFocusableElements().find((element) => element !== this.closeButton);
    const fallbackElement = this.closeButton;
    const dialog = this.dialog;

    (autofocusElement ?? lightDomElement ?? fallbackElement ?? dialog)?.focus({
      preventScroll: true
    });
  }

  private trapFocus(event: KeyboardEvent): void {
    const focusableElements = this.getFocusableElements();
    const dialog = this.dialog;

    if (!focusableElements.length) {
      event.preventDefault();
      dialog?.focus({ preventScroll: true });
      return;
    }

    const activeElement = this.getDeepActiveElement();
    const currentIndex = activeElement ? focusableElements.indexOf(activeElement) : -1;
    const isAtStart = currentIndex <= 0;
    const isAtEnd = currentIndex === focusableElements.length - 1;

    if (event.shiftKey && isAtStart) {
      event.preventDefault();
      focusableElements[focusableElements.length - 1]?.focus({ preventScroll: true });
      return;
    }

    if (!event.shiftKey && (isAtEnd || currentIndex === -1)) {
      event.preventDefault();
      focusableElements[0]?.focus({ preventScroll: true });
    }
  }

  private getFocusableElements(): HTMLElement[] {
    const result: HTMLElement[] = [];
    const visit = (element: Element): void => {
      if (element instanceof HTMLElement && (element.hidden || element.inert)) return;
      if (element instanceof HTMLElement && element.matches(FOCUSABLE_SELECTOR)
        && !element.matches(':disabled') && element.tabIndex >= 0
        && element.getClientRects().length > 0
        && getComputedStyle(element).visibility !== 'hidden') result.push(element);
      const children = element instanceof HTMLSlotElement
        ? (element.assignedElements({ flatten: true }).length
          ? element.assignedElements({ flatten: true }) : Array.from(element.children))
        : Array.from((element.shadowRoot ?? element).children);
      children.forEach(visit);
    };
    Array.from(this.renderRoot.children).forEach(visit);
    return result;
  }

  private hasInertAncestor(element: HTMLElement): boolean {
    let current: Element | null = element;
    while (current) {
      if (current instanceof HTMLElement && current.inert) return true;
      const root: Node = current.getRootNode();
      current = current.assignedSlot ?? current.parentElement ?? (root instanceof ShadowRoot ? root.host : null);
    }
    return false;
  }

  private getDeepActiveElement(): HTMLElement | null {
    let activeElement: Element | null = this.ownerDocument.activeElement;

    while (activeElement?.shadowRoot?.activeElement) {
      activeElement = activeElement.shadowRoot.activeElement;
    }

    return activeElement instanceof HTMLElement ? activeElement : null;
  }


}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_MODAL_TAG_NAME]: SunmarModal;
  }
}
