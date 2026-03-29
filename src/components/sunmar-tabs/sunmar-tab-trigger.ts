import { LitElement, css, html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-tab-trigger.scss?inline';

export const SUNMAR_TAB_TRIGGER_TAG_NAME = 'sunmar-tab-trigger';
const TAB_TRIGGER_ACTIVATE_EVENT = 'sunmar-tab-trigger-activate';

export class SunmarTabTrigger extends LitElement {
  static styles = [componentBaseStyles, css`
    ${unsafeCSS(styles)}
  `];

  @property({ type: String, reflect: true })
  value = '';

  @property({ type: Boolean, reflect: true })
  selected = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ attribute: false })
  panelId = '';

  protected render() {
    return html`
      <div class="root">
        <button
          class="control"
          part="control"
          type="button"
          role="tab"
          aria-selected=${String(this.selected)}
          aria-controls=${ifDefined(this.panelId || undefined)}
          tabindex=${this.selected ? '0' : '-1'}
          ?disabled=${this.disabled}
          @click=${this.onClick}
        >
          <span class="content">
            <span class="label">
              <slot></slot>
            </span>
          </span>
        </button>
      </div>
    `;
  }

  focus(options?: FocusOptions): void {
    this.renderRoot.querySelector<HTMLButtonElement>('.control')?.focus(options);
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
