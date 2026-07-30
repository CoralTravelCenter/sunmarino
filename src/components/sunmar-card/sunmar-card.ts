import { LitElement, css, html, unsafeCSS } from 'lit';
import { state } from 'lit/decorators.js';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-card.scss?inline';

export const SUNMAR_CARD_TAG_NAME = 'sunmar-card';

export class SunmarCard extends LitElement {
  static styles = [componentBaseStyles, css`${unsafeCSS(styles)}`];

  @state()
  private hasActions = false;

  private readonly handleActionsSlotChange = (event: Event): void => {
    const slot = event.target;
    if (slot instanceof HTMLSlotElement) {
      this.hasActions = slot.assignedElements({ flatten: true }).length > 0;
    }
  };

  protected render() {
    return html`
      <article class="root" part="root">
        <div class="media" part="media"><slot name="media"></slot></div>
        <div class="content" part="content">
          <div class="title" part="title"><slot name="title"></slot></div>
          <div class="text" part="text"><slot name="text"></slot></div>
          <div class="actions" part="actions" ?hidden=${!this.hasActions}>
            <slot name="actions" @slotchange=${this.handleActionsSlotChange}></slot>
          </div>
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
