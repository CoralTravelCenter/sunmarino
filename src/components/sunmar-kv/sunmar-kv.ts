import { LitElement, css, html, unsafeCSS } from 'lit';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-kv.scss?inline';

export const SUNMAR_KV_TAG_NAME = 'sunmar-kv';

export class SunmarKv extends LitElement {
  static styles = [componentBaseStyles, css`
    ${unsafeCSS(styles)}
  `];

  protected render() {
    return html`
      <section class="root" part="root">
        <div class="media" part="media">
          <div class="picture" part="picture">
            <slot name="image"></slot>
          </div>
        </div>

        <div class="content" part="content">
          <div class="content-inner" part="content-inner">
            <div class="eyebrow" part="eyebrow">
              <slot name="eyebrow"></slot>
            </div>
            <div class="title" part="title">
              <slot name="title"></slot>
            </div>
            <div class="text" part="text">
              <slot name="text"></slot>
            </div>
            <slot class="actions-slot" name="actions"></slot>
          </div>
        </div>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_KV_TAG_NAME]: SunmarKv;
  }
}
