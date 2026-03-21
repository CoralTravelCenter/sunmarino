import { LitElement, css, html, unsafeCSS } from 'lit';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-lid.scss?inline';

export const SUNMAR_LID_TAG_NAME = 'sunmar-lid';

export class SunmarLid extends LitElement {
  static styles = [componentBaseStyles, css`
    ${unsafeCSS(styles)}
  `];

  protected render() {
    return html`
      <div class="root" part="root">
        <div class="title" part="title">
          <slot name="title"></slot>
        </div>
        <div class="text" part="text">
          <slot name="text"></slot>
        </div>
        <div class="actions" part="actions">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_LID_TAG_NAME]: SunmarLid;
  }
}
