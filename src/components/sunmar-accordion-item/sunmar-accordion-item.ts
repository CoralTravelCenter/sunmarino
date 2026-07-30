import { LitElement, css, html, nothing, unsafeCSS } from 'lit';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-accordion-item.scss?inline';

export const SUNMAR_ACCORDION_ITEM_TAG_NAME = 'sunmar-accordion-item';
const ACCORDION_ITEM_TOGGLE_REQUEST_EVENT = 'sunmar-accordion-item-toggle-request';

export class SunmarAccordionItem extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true, useDefault: true },
    disabled: { type: Boolean, reflect: true }
  };

  static styles = [componentBaseStyles, css`
    ${unsafeCSS(styles)}
  `];

  open = false;
  disabled = false;

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
          <span class="icon" part="icon" aria-hidden="true"></span>
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

    this.dispatchEvent(
      new CustomEvent(ACCORDION_ITEM_TOGGLE_REQUEST_EVENT, {
        detail: { item: this },
        bubbles: true,
        composed: true,
      })
    );
  };
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_ACCORDION_ITEM_TAG_NAME]: SunmarAccordionItem;
  }
}
