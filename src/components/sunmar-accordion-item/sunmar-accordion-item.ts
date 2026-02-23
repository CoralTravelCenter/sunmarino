import { LitElement, css, html, unsafeCSS } from 'lit';
import styles from './sunmar-accordion-item.scss?inline';

export const SUNMAR_ACCORDION_ITEM_TAG_NAME = 'sunmar-accordion-item';
const ACCORDION_ITEM_TOGGLE_REQUEST_EVENT = 'sunmar-accordion-item-toggle-request';

let accordionItemIdCounter = 0;

export class SunmarAccordionItem extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true }
  };

  static styles = css`
    ${unsafeCSS(styles)}
  `;

  open = false;
  disabled = false;

  private readonly itemUid = ++accordionItemIdCounter;

  setOpen(next: boolean): void {
    this.open = next;
  }

  protected render() {
    const triggerId = `sunmar-accordion-trigger-${this.itemUid}`;
    const panelId = `sunmar-accordion-panel-${this.itemUid}`;

    return html`
      <div class="root" part="root">
        <button
          id=${triggerId}
          class="trigger"
          part="trigger"
          type="button"
          aria-expanded=${String(this.open)}
          aria-controls=${panelId}
          ?disabled=${this.disabled}
          @click=${this.onTriggerClick}
        >
          <span class="trigger-content" part="trigger-content">
            <slot class="header-slot" name="header"></slot>
          </span>
          <span class="icon" part="icon" aria-hidden="true"></span>
        </button>

        <div
          id=${panelId}
          class="panel"
          part="panel"
          role="region"
          aria-labelledby=${triggerId}
          ?hidden=${!this.open}
        >
          <div class="content" part="content">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }

  private readonly onTriggerClick = (): void => {
    if (this.disabled) {
      return;
    }

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
