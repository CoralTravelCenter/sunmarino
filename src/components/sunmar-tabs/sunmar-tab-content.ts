import { LitElement, css, html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-tab-content.scss?inline';

export const SUNMAR_TAB_CONTENT_TAG_NAME = 'sunmar-tab-content';

export class SunmarTabContent extends LitElement {
  static styles = [componentBaseStyles, css`${unsafeCSS(styles)}`];

  @property({ type: String }) value = '';

  protected render() {
    return html`<div part="content"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap { [SUNMAR_TAB_CONTENT_TAG_NAME]: SunmarTabContent }
}
