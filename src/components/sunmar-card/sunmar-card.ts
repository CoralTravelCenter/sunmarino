import { LitElement, css, html, unsafeCSS } from 'lit';
import { queryAssignedElements, state } from 'lit/decorators.js';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-card.scss?inline';

export const SUNMAR_CARD_TAG_NAME = 'sunmar-card';

export class SunmarCard extends LitElement {
  static styles = [componentBaseStyles, css`${unsafeCSS(styles)}`];

  @state()
  private hasActions = false;

  @queryAssignedElements({ slot: 'actions', flatten: true })
  private actionElements!: Element[];

  private readonly syncActions = (): void => {
    this.hasActions = this.actionElements.length > 0;
  };

  protected willUpdate(): void {
    if (!this.hasUpdated) {
      this.hasActions = Array.from(this.children).some(
        (child) => child.getAttribute('slot') === 'actions',
      );
    }
  }

  protected render() {
    return html`
      <article class="root" part="root">
        <div class="media" part="media"><slot name="media"></slot></div>
        <div class="content" part="content">
          <div class="title" part="title"><slot name="title"></slot></div>
          <div class="text" part="text"><slot name="text"></slot></div>
          <div class="actions" part="actions" ?hidden=${!this.hasActions}>
            <slot name="actions" @slotchange=${this.syncActions}></slot>
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
