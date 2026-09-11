import { LitElement, css, html, unsafeCSS } from 'lit';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-promo-terms.scss?inline';

export const SUNMAR_PROMO_TERMS_TAG_NAME = 'sunmar-promo-terms';

export class SunmarPromoTerms extends LitElement {
  static styles = [componentBaseStyles, css`${unsafeCSS(styles)}`];

  protected render() {
    return html`<div class="root" part="root"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_PROMO_TERMS_TAG_NAME]: SunmarPromoTerms;
  }
}
