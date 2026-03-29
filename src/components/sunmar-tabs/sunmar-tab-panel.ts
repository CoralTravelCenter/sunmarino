import { LitElement, css, html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-tab-panel.scss?inline';

export const SUNMAR_TAB_PANEL_TAG_NAME = 'sunmar-tab-panel';

export class SunmarTabPanel extends LitElement {
  static styles = [componentBaseStyles, css`
    ${unsafeCSS(styles)}
  `];

  @property({ type: String, reflect: true })
  value = '';

  @property({ type: Boolean, reflect: true })
  active = false;

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'tabpanel');
    this.hidden = !this.active;
  }

  updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has('active')) {
      this.hidden = !this.active;
    }
  }

  protected render() {
    return html`
      <div class="root">
        <div class="panel">
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
