import { LitElement, css, html, unsafeCSS } from 'lit';
import styles from './sunmar-button-group.scss?inline';

export const SUNMAR_BUTTON_GROUP_TAG_NAME = 'sunmar-button-group';

export class SunmarButtonGroup extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  protected render() {
    return html`
      <div class="group" part="group" role="group">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_BUTTON_GROUP_TAG_NAME]: SunmarButtonGroup;
  }
}
