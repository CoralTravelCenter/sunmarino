import { LitElement, css, html, nothing, unsafeCSS } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-image.scss?inline';

export const SUNMAR_IMAGE_TAG_NAME = 'sunmar-image';

export type SunmarImageLoading = 'eager' | 'lazy';

const DEFAULT_MEDIA = '(min-width: 768px)';

const normalizeText = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value.trim() : fallback;

const normalizeDimension = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) && value >= 1
    ? Math.floor(value)
    : undefined;

const normalizeLoading = (value: unknown): SunmarImageLoading | undefined =>
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
  media = DEFAULT_MEDIA;
  alt = '';
  width?: number;
  height?: number;
  loading?: SunmarImageLoading;

  protected render() {
    const srcset = normalizeText(this.srcset);
    const sizes = normalizeText(this.sizes);
    const media = normalizeText(this.media, DEFAULT_MEDIA);
    const src = normalizeText(this.src);
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
          alt=${typeof this.alt === 'string' ? this.alt : ''}
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
