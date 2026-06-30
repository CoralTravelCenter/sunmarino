import { LitElement, css, html, unsafeCSS } from 'lit';
import { state } from 'lit/decorators.js';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-card.scss?inline';

export const SUNMAR_CARD_TAG_NAME = 'sunmar-card';

export class SunmarCard extends LitElement {
  static styles = [componentBaseStyles, css`
    ${unsafeCSS(styles)}
  `];

  @state()
  private hasFooter = false;

  protected render() {
    return html`
      <article class="card" part="card">
        <div class="media" part="media">
          <slot name="image"></slot>
        </div>
        <div class="body" part="body">
          <div class="header" part="header">
            <slot name="header"></slot>
          </div>
          <div class="content" part="content">
            <slot></slot>
          </div>
          <div class="footer ${this.hasFooter ? '' : 'empty'}" part="footer">
            <slot name="footer" @slotchange=${this.handleFooterSlotChange}></slot>
          </div>
        </div>
      </article>
    `;
  }

  private handleFooterSlotChange = (event: Event): void => {
    const slot = event.target as HTMLSlotElement;
    this.hasFooter = slot.assignedElements({ flatten: true }).length > 0;
  };
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_CARD_TAG_NAME]: SunmarCard;
  }
}
