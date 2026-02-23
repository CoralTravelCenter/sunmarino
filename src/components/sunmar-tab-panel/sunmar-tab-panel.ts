import { LitElement, css, html, unsafeCSS } from 'lit';
import styles from './sunmar-tab-panel.scss?inline';

export const SUNMAR_TAB_PANEL_TAG_NAME = 'sunmar-tab-panel';

export class SunmarTabPanel extends LitElement {
  static properties = {
    value: { type: String, reflect: true },
    active: { type: Boolean, reflect: true }
  };

  static styles = css`
    ${unsafeCSS(styles)}
  `;

  value = '';
  active = false;

  connectedCallback(): void {
    super.connectedCallback();
    this.hidden = !this.active;
  }

  updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has('active')) {
      this.hidden = !this.active;
    }
  }

  protected render() {
    return html`
      <div class="root" part="root">
        <div class="panel" part="panel" role="tabpanel">
          <div class="content" part="content">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_TAB_PANEL_TAG_NAME]: SunmarTabPanel;
  }
}
