import { LitElement, css, html, nothing, unsafeCSS } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-image.scss?inline';

export const SUNMAR_IMAGE_TAG_NAME = 'sunmar-image';

export type SunmarImageLoading = 'eager' | 'lazy';

const normalizeDimension = (value: number | undefined): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : undefined;

const normalizeLoading = (value: string | undefined): SunmarImageLoading | undefined =>
  value === 'eager' || value === 'lazy' ? value : undefined;

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
    const width = normalizeDimension(this.width);
    const height = normalizeDimension(this.height);
    const loading = normalizeLoading(this.loading);

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
          width=${ifDefined(width)}
          height=${ifDefined(height)}
          loading=${ifDefined(loading)}
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
