import { LitElement, css, html, nothing, unsafeCSS } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './sunmar-image.scss?inline';

export const SUNMAR_IMAGE_TAG_NAME = 'sunmar-image';

export class SunmarImage extends LitElement {
  static properties = {
    src: { type: String },
    srcset: { type: String },
    media: { type: String },
    alt: { type: String }
  };

  static styles = css`
    ${unsafeCSS(styles)}
  `;

  src = '';
  srcset = '';
  media = '(min-width: 768px)';
  alt = '';

  protected render() {
    const srcset = this.srcset.trim();
    const media = this.media.trim();

    return html`
      <picture class="picture" part="picture">
        ${srcset
          ? html`
              <source
                srcset=${srcset}
                media=${ifDefined(media || undefined)}
              />
            `
          : nothing}
        <img class="img" part="img" src=${this.src} alt=${this.alt} />
      </picture>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_IMAGE_TAG_NAME]: SunmarImage;
  }
}
