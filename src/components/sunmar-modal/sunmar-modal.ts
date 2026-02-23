import { LitElement, css, html, nothing, unsafeCSS } from 'lit';
import { acquirePageScrollLock, releasePageScrollLock } from '../../utils/scroll/no-scroll';
import styles from './sunmar-modal.scss?inline';

export const SUNMAR_MODAL_TAG_NAME = 'sunmar-modal';

export class SunmarModal extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    closeOnBackdrop: { type: Boolean, reflect: true, attribute: 'close-on-backdrop' },
    closeOnEsc: { type: Boolean, reflect: true, attribute: 'close-on-esc' }
  };

  static styles = css`
    ${unsafeCSS(styles)}
  `;

  open = false;
  closeOnBackdrop = true;
  closeOnEsc = true;

  private hasScrollLock = false;
  private readonly onDocumentKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.open && this.closeOnEsc) {
      event.preventDefault();
      this.hide();
    }
  };

  connectedCallback(): void {
    super.connectedCallback();
    this.toggleDocumentHandlers(this.open);
    this.syncScrollLock(this.open);
  }

  disconnectedCallback(): void {
    this.toggleDocumentHandlers(false);
    this.syncScrollLock(false);
    super.disconnectedCallback();
  }

  updated(changedProperties: Map<string, unknown>): void {
    if (!changedProperties.has('open')) {
      return;
    }

    const isOpen = this.open;
    this.toggleDocumentHandlers(isOpen);
    this.syncScrollLock(isOpen);
    this.dispatchEvent(
      new CustomEvent(isOpen ? 'sunmar-open' : 'sunmar-close', {
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

    return html`
      <div class="overlay" part="overlay" @click=${this.handleBackdropClick}>
        <section class="dialog" part="dialog" role="dialog" aria-modal="true" @click=${this.stopPropagation}>
          <header class="header" part="header">
            <h2 class="title" part="title">
              <slot name="title">Modal title</slot>
            </h2>
            <button class="close" type="button" part="close" aria-label="Close" @click=${this.hide}>
              X
            </button>
          </header>
          <div class="body" part="body">
            <slot></slot>
          </div>
          <footer class="actions" part="actions">
            <slot name="actions"></slot>
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

  private toggleDocumentHandlers(enabled: boolean): void {
    if (enabled) {
      document.addEventListener('keydown', this.onDocumentKeydown);
      return;
    }

    document.removeEventListener('keydown', this.onDocumentKeydown);
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
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_MODAL_TAG_NAME]: SunmarModal;
  }
}
