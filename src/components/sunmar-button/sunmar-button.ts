import { LitElement, css, html, unsafeCSS } from 'lit';
import styles from './sunmar-button.scss?inline';

export type SunmarButtonType = 'primary' | 'secondary' | 'neutral';
export type SunmarNativeButtonType = 'button' | 'submit' | 'reset';

export const SUNMAR_BUTTON_TAG_NAME = 'sunmar-button';

export class SunmarButton extends LitElement {
  static properties = {
    type: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    nativeType: { type: String, attribute: 'native-type' },
    fullWidth: { type: Boolean, reflect: true, attribute: 'full-width' }
  };

  static styles = css`
    ${unsafeCSS(styles)}
  `;

  type: SunmarButtonType = 'primary';
  disabled = false;
  nativeType: SunmarNativeButtonType = 'button';
  fullWidth = false;

  protected render() {
    return html`
      <button class="control" part="control" type=${this.nativeType} ?disabled=${this.disabled}>
        ${this.renderInnerContent()}
      </button>
    `;
  }

  private renderInnerContent() {
    return html`
      <span class="content" part="content">
        <slot class="prefix-slot" name="prefix" part="prefix"></slot>
        <span class="label" part="label">
          <slot>Узнать больше</slot>
        </span>
        <slot class="suffix-slot" name="suffix" part="suffix"></slot>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_BUTTON_TAG_NAME]: SunmarButton;
  }
}
