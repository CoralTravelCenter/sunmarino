import { LitElement, css, html, unsafeCSS } from 'lit';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-slide.scss?inline';

export const SUNMAR_SLIDE_TAG_NAME = 'sunmar-slide';

export class SunmarSlide extends LitElement {
  static styles = [componentBaseStyles, css`${unsafeCSS(styles)}`];

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute('role')) this.setAttribute('role', 'group');
    if (!this.hasAttribute('aria-roledescription')) {
      this.setAttribute('aria-roledescription', 'slide');
    }
  }

  protected render() {
    return html`<div class="root" part="slide"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_SLIDE_TAG_NAME]: SunmarSlide;
  }
}
