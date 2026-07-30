import { LitElement, css, html, unsafeCSS } from 'lit';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-card.scss?inline';

export const SUNMAR_CARD_TAG_NAME = 'sunmar-card';

export class SunmarCard extends LitElement {
  static styles = [componentBaseStyles, css`${unsafeCSS(styles)}`];

  protected render() {
    return html`
      <article class="root" part="root">
        <div class="media" part="media"><slot name="media"></slot></div>
        <div class="content" part="content">
          <div class="title" part="title"><slot name="title"></slot></div>
          <div class="text" part="text"><slot name="text"></slot></div>
          <div class="actions" part="actions"><slot name="actions"></slot></div>
        </div>
      </article>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_CARD_TAG_NAME]: SunmarCard;
  }
}
