import { LitElement, css, html, nothing, unsafeCSS } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-image.scss?inline';

export const SUNMAR_IMAGE_TAG_NAME = 'sunmar-image';

export type SunmarImageLoading = 'eager' | 'lazy';

export class SunmarImage extends LitElement {
  static properties = {
    src: { type: String },
    srcset: { type: String },
    sizes: { type: String },
    media: { type: String },
    alt: { type: String },
    width: { type: Number },
    height: { type: Number },
    loading: { type: String }
  };

  static styles = [componentBaseStyles, css`
    ${unsafeCSS(styles)}
  `];

  src = '';
  srcset = '';
  sizes = '';
  media = '(min-width: 768px)';
  alt = '';
  width?: number;
  height?: number;
  loading?: SunmarImageLoading;

  protected render() {
    const srcset = this.srcset.trim();
    const sizes = this.sizes.trim();
    const media = this.media.trim();
    const src = this.src.trim();

    return html`
      <picture class="picture" part="picture">
        ${srcset
          ? html`
              <source
                srcset=${srcset}
                sizes=${ifDefined(sizes || undefined)}
                media=${ifDefined(media || undefined)}
              />
            `
          : nothing}
        <img
          class="img"
          part="img"
          src=${ifDefined(src || undefined)}
          alt=${this.alt}
          width=${ifDefined(this.width)}
          height=${ifDefined(this.height)}
          loading=${ifDefined(this.loading)}
        />
      </picture>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_IMAGE_TAG_NAME]: SunmarImage;
  }
}
