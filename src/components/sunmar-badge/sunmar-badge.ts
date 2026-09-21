import { LitElement, css, html, unsafeCSS } from 'lit';
import type { Instance } from 'tippy.js';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-badge.scss?inline';
import { property } from 'lit/decorators.js';
import { injectTippy } from './scripts/utils/tippy/injectTippy';

export const SUNMAR_BADGE_TAG_NAME = 'sunmar-badge';

const infoButtonTemplate = html`
  <button
    id="sunmar-shild-info-button"
    class="sunmar-shild-info-button"
    type="button"
    aria-label="Подробнее об условиях"
  >
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M6.99935 13.2428C10.221 13.2428 12.8327 10.6312 12.8327 7.4095C12.8327 4.18784 10.221 1.57617 6.99935 1.57617C3.77769 1.57617 1.16602 4.18784 1.16602 7.4095C1.16602 10.6312 3.77769 13.2428 6.99935 13.2428Z" stroke="#E5E5E5" stroke-width="0.833333" />
      <path d="M7 11.2982V5.46484" stroke="#E5E5E5" stroke-width="0.833333" stroke-linejoin="round" />
      <path d="M7 4.81681V3.52051" stroke="#E5E5E5" stroke-width="0.833333" stroke-linejoin="round" />
    </svg>
  </button>
`;

export class SunmarBadge extends LitElement {
  static styles = [componentBaseStyles, css`${unsafeCSS(styles)}`];

  @property({ type: Boolean, attribute: 'info-button' })
  infoButton = false;

  private tippyInstances: Instance[] = [];

  protected updated(changedProperties: Map<PropertyKey, unknown>): void {
    if (!changedProperties.has('infoButton')) {
      return;
    }

    this.destroyTippy();

    const infoButton = this.renderRoot.querySelector<HTMLElement>('#sunmar-shild-info-button');
    const tooltipContent = this.createTooltipContent();
    if (infoButton && tooltipContent) {
      this.tippyInstances = injectTippy(infoButton, tooltipContent);
    }
  }

  disconnectedCallback(): void {
    this.destroyTippy();
    super.disconnectedCallback();
  }

  private destroyTippy(): void {
    for (const instance of this.tippyInstances) {
      instance.destroy();
    }
    this.tippyInstances = [];
  }

  private createTooltipContent(): Element | null {
    const template = this.querySelector<HTMLTemplateElement>('template[slot="tooltip"]');
    if (!template) {
      return null;
    }

    const content = document.createElement('div');
    content.className = 'sunmar-tooltip-content';
    content.append(template.content.cloneNode(true));
    return content;
  }

  protected render(): unknown {
    return html`
      <div class="root" part="root">
        <div class="sunmar-shild-component" id="sunmar-shild-component">
          <img src="https://b2ccdn.coral.ru/content/rak_guarantee.png" alt="" class="sunmar-shild--img">
          <span class="sunmar-shild--text">Бесплатно для туристов</span>
          ${this.infoButton ? infoButtonTemplate : null}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_BADGE_TAG_NAME]: SunmarBadge;
  }
}
