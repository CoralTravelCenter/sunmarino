import { LitElement, css, html, nothing, unsafeCSS } from 'lit';
import { state } from 'lit/decorators.js';
import { componentBaseStyles } from '../../styles/component-base';
import { acquirePageScrollLock, releasePageScrollLock } from '../../utils/scroll/no-scroll';
import styles from './sunmar-modal.scss?inline';

export const SUNMAR_MODAL_TAG_NAME = 'sunmar-modal';
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

const enabledByDefaultBooleanConverter = {
  fromAttribute(value: string | null): boolean {
    return value !== 'false';
  },
  toAttribute(value: boolean): string {
    return value ? '' : 'false';
  }
};

let modalIdCounter = 0;

export class SunmarModal extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    closeOnBackdrop: {
      reflect: true,
      attribute: 'close-on-backdrop',
      converter: enabledByDefaultBooleanConverter
    },
    closeOnEsc: {
      reflect: true,
      attribute: 'close-on-esc',
      converter: enabledByDefaultBooleanConverter
    },
    ariaLabel: { type: String, attribute: 'aria-label' },
    ariaLabelledby: { type: String, attribute: 'aria-labelledby' }
  };

  static styles = [componentBaseStyles, css`
    ${unsafeCSS(styles)}
  `];

  open = false;
  closeOnBackdrop = true;
  closeOnEsc = true;
  ariaLabel: string | null = null;
  ariaLabelledby: string | null = null;

  @state()
  private hasActions = false;

  private hasScrollLock = false;
  private hasDocumentHandlers = false;
  private previouslyFocusedElement: HTMLElement | null = null;
  private readonly backgroundInertState = new Map<HTMLElement, boolean>();
  private readonly titleId = `sunmar-modal-title-${++modalIdCounter}`;

  private readonly onDocumentKeydown = (event: KeyboardEvent): void => {
    if (!this.open || !this.ownsCurrentFocus()) {
      return;
    }

    if (event.key === 'Escape' && this.closeOnEsc) {
      event.preventDefault();
      this.hide();
      return;
    }

    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  };

  connectedCallback(): void {
    super.connectedCallback();

    if (this.open) {
      this.activateModal();
      void this.updateComplete.then(() => this.focusInitialElement());
    }
  }

  disconnectedCallback(): void {
    this.deactivateModal(true);
    super.disconnectedCallback();
  }

  updated(changedProperties: Map<string, unknown>): void {
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
      new CustomEvent(this.open ? 'sunmar-open' : 'sunmar-close', {
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

    const ariaLabel = this.ariaLabel?.trim() || undefined;
    const ariaLabelledby = ariaLabel
      ? undefined
      : this.ariaLabelledby?.trim() || this.titleId;

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
              <slot name="title">Modal title</slot>
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
            <slot name="actions" @slotchange=${this.handleActionsSlotChange}></slot>
          </footer>
        </section>
      </div>
    `;
  }

  private handleBackdropClick = (): void => {
    if (this.closeOnBackdrop) {
      this.hide();
    }
  };

  private stopPropagation = (event: Event): void => {
    event.stopPropagation();
  };

  private readonly handleActionsSlotChange = (event: Event): void => {
    const slot = event.target;
    if (slot instanceof HTMLSlotElement) {
      this.hasActions = slot.assignedElements({ flatten: true }).length > 0;
    }
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
    if (!this.previouslyFocusedElement) {
      this.previouslyFocusedElement = this.getDeepActiveElement();
    }

    this.toggleDocumentHandlers(true);
    this.syncScrollLock(true);
    this.setBackgroundInert();
  }

  private deactivateModal(restoreFocus: boolean): void {
    this.toggleDocumentHandlers(false);
    this.syncScrollLock(false);
    this.restoreBackgroundInert();

    const elementToRestore = this.previouslyFocusedElement;
    this.previouslyFocusedElement = null;

    if (restoreFocus && elementToRestore?.isConnected && !elementToRestore.inert) {
      elementToRestore.focus({ preventScroll: true });
    }
  }

  private focusInitialElement(): void {
    if (!this.open || !this.isConnected) {
      return;
    }

    const autofocusElement = this.getFocusableElements().find((element) =>
      element.hasAttribute('autofocus')
    );
    const lightDomElement = this.getLightDomFocusableElements()[0];
    const fallbackElement = this.renderRoot.querySelector<HTMLElement>('.close');
    const dialog = this.renderRoot.querySelector<HTMLElement>('.dialog');

    (autofocusElement ?? lightDomElement ?? fallbackElement ?? dialog)?.focus({
      preventScroll: true
    });
  }

  private trapFocus(event: KeyboardEvent): void {
    const focusableElements = this.getFocusableElements();
    const dialog = this.renderRoot.querySelector<HTMLElement>('.dialog');

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
    const shadowElements = Array.from(
      this.renderRoot.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    );

    return [...shadowElements, ...this.getLightDomFocusableElements()].filter(
      (element, index, elements) =>
        elements.indexOf(element) === index && this.isElementFocusable(element)
    );
  }

  private getLightDomFocusableElements(): HTMLElement[] {
    return Array.from(this.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((element) =>
      this.isElementFocusable(element)
    );
  }

  private isElementFocusable(element: HTMLElement): boolean {
    return (
      !element.hidden &&
      !element.inert &&
      element.tabIndex >= 0 &&
      element.getAttribute('aria-hidden') !== 'true' &&
      element.getClientRects().length > 0
    );
  }

  private ownsCurrentFocus(): boolean {
    const activeElement = this.getDeepActiveElement();
    if (!activeElement) {
      return false;
    }

    const activeRoot = activeElement.getRootNode();
    const focusHost = activeRoot instanceof ShadowRoot ? activeRoot.host : activeElement;
    const owningModal = focusHost.closest(SUNMAR_MODAL_TAG_NAME);

    return owningModal === this;
  }

  private getDeepActiveElement(): HTMLElement | null {
    let activeElement: Element | null = this.ownerDocument.activeElement;

    while (activeElement?.shadowRoot?.activeElement) {
      activeElement = activeElement.shadowRoot.activeElement;
    }

    return activeElement instanceof HTMLElement ? activeElement : null;
  }

  private setBackgroundInert(): void {
    if (this.backgroundInertState.size > 0) {
      return;
    }

    let branch: Node = this;

    while (branch.parentNode) {
      const parent = branch.parentNode;

      if (parent instanceof ShadowRoot) {
        for (const sibling of Array.from(parent.children)) {
          if (sibling === branch || !(sibling instanceof HTMLElement)) {
            continue;
          }

          this.backgroundInertState.set(sibling, sibling.inert);
          sibling.inert = true;
        }

        branch = parent.host;
        continue;
      }

      if (!(parent instanceof HTMLElement)) {
        break;
      }

      for (const sibling of Array.from(parent.children)) {
        if (sibling === branch || !(sibling instanceof HTMLElement)) {
          continue;
        }

        this.backgroundInertState.set(sibling, sibling.inert);
        sibling.inert = true;
      }

      branch = parent;
    }
  }

  private restoreBackgroundInert(): void {
    for (const [element, wasInert] of this.backgroundInertState) {
      element.inert = wasInert;
    }

    this.backgroundInertState.clear();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_MODAL_TAG_NAME]: SunmarModal;
  }
}
