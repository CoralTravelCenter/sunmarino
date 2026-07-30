import { LitElement, css, html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-button.scss?inline';

export type SunmarButtonType = 'primary' | 'secondary' | 'neutral';

export const SUNMAR_BUTTON_TAG_NAME = 'sunmar-button';

export class SunmarButton extends LitElement {
  static styles = [componentBaseStyles, css`
    ${unsafeCSS(styles)}
  `];

  @property({ type: String, reflect: true })
  type: SunmarButtonType = 'primary';

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_BUTTON_TAG_NAME]: SunmarButton;
  }
}
