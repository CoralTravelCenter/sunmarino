import { LitElement, css, html, unsafeCSS } from 'lit';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-climate-grid.scss?inline';

export const SUNMAR_CLIMATE_GRID_TAG_NAME = 'sunmar-climate-grid';

export class SunmarClimateGrid extends LitElement {
  static styles = [componentBaseStyles, css`${unsafeCSS(styles)}`];

  protected render() {
    return html`<div class="root" part="root"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_CLIMATE_GRID_TAG_NAME]: SunmarClimateGrid;
  }
}
