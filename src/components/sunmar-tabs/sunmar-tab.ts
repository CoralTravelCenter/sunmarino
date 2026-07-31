import { LitElement, css, html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-tab.scss?inline';

export const SUNMAR_TAB_TAG_NAME = 'sunmar-tab';

export class SunmarTab extends LitElement {
  static styles = [componentBaseStyles, css`${unsafeCSS(styles)}`];

  @property({ type: String }) value = '';
  @property({ type: Boolean }) forced = false;

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap { [SUNMAR_TAB_TAG_NAME]: SunmarTab }
}
