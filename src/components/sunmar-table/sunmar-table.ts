import { LitElement, css, html, unsafeCSS } from 'lit';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-table.scss?inline';

export const SUNMAR_TABLE_TAG_NAME = 'sunmar-table';

export class SunmarTable extends LitElement {
  static styles = [componentBaseStyles, css`${unsafeCSS(styles)}`];

  protected render() {
    return html`<div class="root" part="root"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_TABLE_TAG_NAME]: SunmarTable;
  }
}
