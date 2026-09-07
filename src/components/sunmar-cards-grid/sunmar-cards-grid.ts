import { LitElement, css, html, unsafeCSS } from 'lit';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-cards-grid.scss?inline';

export const SUNMAR_CARDS_GRID_TAG_NAME = 'sunmar-cards-grid';
const DEFAULT_LAYOUT = 1;
const LAYOUT_PARTS = 4;

function parseLayout(value: string): number[] {
  const parts = value.split('/').slice(0, LAYOUT_PARTS);
  const columns: number[] = [];

  for (let index = 0; index < LAYOUT_PARTS; index += 1) {
    const parsed = Number(parts[index]);
    const previous = columns[index - 1] ?? DEFAULT_LAYOUT;
    columns.push(Number.isInteger(parsed) && parsed >= 1 && parsed <= 3 ? parsed : previous);
  }

  return columns;
}

export class SunmarCardsGrid extends LitElement {
  static properties = {
    layout: { type: String }
  };

  static styles = [componentBaseStyles, css`${unsafeCSS(styles)}`];

  layout = String(DEFAULT_LAYOUT);

  protected render() {
    const [base, at768, at1024, at1280] = parseLayout(this.layout);
    const layoutStyles = [
      `--sunmar-cards-grid-columns:${base}`,
      `--sunmar-cards-grid-columns-768:${at768}`,
      `--sunmar-cards-grid-columns-1024:${at1024}`,
      `--sunmar-cards-grid-columns-1280:${at1280}`
    ].join(';');

    return html`<div class="grid" part="grid" style=${layoutStyles}><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_CARDS_GRID_TAG_NAME]: SunmarCardsGrid;
  }
}
