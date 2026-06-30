import { LitElement, css, html, unsafeCSS } from 'lit';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-topics.scss?inline';

export const SUNMAR_TOPICS_TAG_NAME = 'sunmar-topics';

export class SunmarTopics extends LitElement {
  static styles = [componentBaseStyles, css`
    ${unsafeCSS(styles)}
  `];

  protected render() {
    return html`
      <section class="root" part="root">
        <div class="image image-left" part="image image-left">
          <slot name="img-left"></slot>
        </div>
        <div class="image image-right" part="image image-right">
          <slot name="img-right"></slot>
        </div>
        <div class="inner" part="inner">
          <h2 class="title" part="title">
            <slot name="title"></slot>
          </h2>
          <div class="topics" part="topics">
            <slot></slot>
          </div>
        </div>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_TOPICS_TAG_NAME]: SunmarTopics;
  }
}
