import { LitElement, css, html, unsafeCSS } from 'lit';
import styles from './sunmar-tab-trigger.scss?inline';

export const SUNMAR_TAB_TRIGGER_TAG_NAME = 'sunmar-tab-trigger';
const TAB_TRIGGER_ACTIVATE_EVENT = 'sunmar-tab-trigger-activate';

export class SunmarTabTrigger extends LitElement {
  static properties = {
    value: { type: String, reflect: true },
    selected: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true }
  };

  static styles = css`
    ${unsafeCSS(styles)}
  `;

  value = '';
  selected = false;
  disabled = false;

  protected render() {
    return html`
      <div class="root" part="root">
        <button
          class="control"
          part="control"
          type="button"
          role="tab"
          aria-selected=${String(this.selected)}
          tabindex=${this.selected ? '0' : '-1'}
          ?disabled=${this.disabled}
          @click=${this.onClick}
        >
          <span class="content" part="content">
            <span class="label" part="label">
              <slot></slot>
            </span>
          </span>
        </button>
      </div>
    `;
  }

  private readonly onClick = (): void => {
    if (this.disabled) {
      return;
    }

    const value = this.value.trim();
    if (!value) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent(TAB_TRIGGER_ACTIVATE_EVENT, {
        detail: { value, trigger: this },
        bubbles: true,
        composed: true,
      })
    );
  };
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_TAB_TRIGGER_TAG_NAME]: SunmarTabTrigger;
  }
}
