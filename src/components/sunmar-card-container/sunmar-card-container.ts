import { LitElement, css, html, unsafeCSS } from 'lit';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-card-container.scss?inline';

export const SUNMAR_CARD_CONTAINER_TAG_NAME = 'sunmar-card-container';

export class SunmarCardContainer extends LitElement {
  static styles = [componentBaseStyles, css`
    ${unsafeCSS(styles)}
  `];

  protected render() {
    return html`
      <section class="root" part="root">
        <div class="cards" part="cards">
          <slot></slot>
        </div>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_CARD_CONTAINER_TAG_NAME]: SunmarCardContainer;
  }
}
