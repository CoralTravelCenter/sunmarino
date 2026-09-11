import { LitElement, css, html, unsafeCSS } from 'lit';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-lead.scss?inline';

export const SUNMAR_LEAD_TAG_NAME = 'sunmar-lead';

export class SunmarLead extends LitElement {
  static styles = [componentBaseStyles, css`${unsafeCSS(styles)}`];

  protected render() {
    return html`<div class="root" part="root"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_LEAD_TAG_NAME]: SunmarLead;
  }
}
