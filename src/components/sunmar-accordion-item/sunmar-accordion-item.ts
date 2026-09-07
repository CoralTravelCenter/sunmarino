import { LitElement, css, html, nothing, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-accordion-item.scss?inline';

export const SUNMAR_ACCORDION_ITEM_TAG_NAME = 'sunmar-accordion-item';
const ACCORDION_ITEM_TOGGLE_REQUEST_EVENT = 'sunmar-accordion-item-toggle-request';

export class SunmarAccordionItem extends LitElement {
  static styles = [componentBaseStyles, css`
    ${unsafeCSS(styles)}
  `];

  @property({ type: Boolean, reflect: true, useDefault: true })
  open = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  protected updated(changed: Map<PropertyKey, unknown>): void {
    if (!changed.has('open') || !this.isConnected) return;
    this.dispatchEvent(
      new CustomEvent(ACCORDION_ITEM_TOGGLE_REQUEST_EVENT, {
        detail: { item: this },
        bubbles: true,
        composed: true
      })
    );
  }

  protected render() {
    return html`
      <details
        class="root"
        part="root"
        ?open=${this.open}
        @toggle=${this.onNativeToggle}
      >
        <summary
          class="trigger"
          part="trigger"
          aria-disabled=${this.disabled ? 'true' : nothing}
          tabindex=${this.disabled ? '-1' : nothing}
          @click=${this.onSummaryClick}
        >
          <span class="trigger-content">
            <slot class="header-slot" name="header"></slot>
          </span>
          <span class="icon" part="icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7" fill="none" focusable="false">
              <path d="M0.75 0.75L5.75 5.75L10.75 0.75" stroke="var(--sunmarino-color-base-icon)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
        </summary>

        <div
          class="panel"
          part="panel"
        >
          <div class="content" part="content">
            <slot></slot>
          </div>
        </div>
      </details>
    `;
  }

  private readonly onSummaryClick = (event: MouseEvent): void => {
    if (this.disabled) {
      event.preventDefault();
    }
  };

  private readonly onNativeToggle = (event: Event): void => {
    const details = event.currentTarget;
    if (!(details instanceof HTMLDetailsElement)) {
      return;
    }

    this.open = details.open;
  };
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_ACCORDION_ITEM_TAG_NAME]: SunmarAccordionItem;
  }
}
