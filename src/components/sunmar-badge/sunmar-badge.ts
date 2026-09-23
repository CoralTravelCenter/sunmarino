import { LitElement, css, html, unsafeCSS } from 'lit';
import type { Instance } from 'tippy.js';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-badge.scss?inline';
import { property } from 'lit/decorators.js';
import { waitForHotelID } from './scripts/badgeLogic/waitForHotelID';
import { waitForElement } from './scripts/utils/mutations.js';
import { injectTippy } from './scripts/badgeLogic/tippy/injectTippy';

export const SUNMAR_BADGE_TAG_NAME = 'sunmar-badge';

const TARGET_SELECTOR = '[class*="PhotoGalleryMainCarousel_mainSwiperContainer__"]';
const INJECTED_DATA_KEY = 'CoralShildRakInject';

const hotelIdsConverter = {
  fromAttribute(value: string | null): string[] {
    return value
      ? value.split(/[\s,;]+/).map((id) => id.trim()).filter(Boolean)
      : [];
  },
  toAttribute(value: string[]): string {
    return value.join(',');
  }
};

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

  @property({ attribute: 'hotel-ids', converter: hotelIdsConverter })
  hotelIds: string[] = [];

  private tippyInstances: Instance[] = [];
  private mountPromise: Promise<void> | null = null;
  private mountedToTarget = false;
  private mountedContainer: HTMLElement | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this.scheduleAutoMount();
  }

  protected updated(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has('infoButton')) {
      this.setupTippy();
    }

    if (changedProperties.has('hotelIds')) {
      this.scheduleAutoMount();
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();

    queueMicrotask(() => {
      if (!this.isConnected) {
        this.destroyTippy();
        if (this.mountedContainer) {
          delete this.mountedContainer.dataset[INJECTED_DATA_KEY];
          this.mountedContainer = null;
          this.mountedToTarget = false;
        }
      }
    });
  }

  private scheduleAutoMount(): void {
    const autoMountEnabled = this.hasAttribute('hotel-ids') || this.hotelIds.length > 0;

    if (
      !autoMountEnabled ||
      !this.isConnected ||
      this.mountedToTarget ||
      this.mountPromise
    ) {
      return;
    }

    this.hidden = true;
    this.mountPromise = this.mountToTarget().finally(() => {
      this.mountPromise = null;
    });
  }

  private async mountToTarget(): Promise<void> {
    if (this.hotelIds.length > 0) {
      const currentHotelId = await waitForHotelID();
      if (!currentHotelId || !this.hotelIds.includes(currentHotelId)) {
        return;
      }
    }

    let devContainer: HTMLElement;

    try {
      devContainer = await waitForElement<HTMLElement>(TARGET_SELECTOR);
    } catch {
      return;
    }

    if (
      !this.isConnected ||
      (devContainer.dataset[INJECTED_DATA_KEY] && !devContainer.contains(this))
    ) {
      return;
    }

    this.mountedToTarget = true;
    this.mountedContainer = devContainer;
    devContainer.dataset[INJECTED_DATA_KEY] = 'true';

    if (this.parentElement !== devContainer) {
      devContainer.prepend(this);
    }

    this.hidden = false;
  }

  private setupTippy(): void {
    this.destroyTippy();

    const infoButton = this.renderRoot.querySelector<HTMLElement>('#sunmar-shild-info-button');
    const tooltipContent = this.createTooltipContent();
    if (infoButton && tooltipContent) {
      this.tippyInstances = injectTippy(infoButton, tooltipContent);
    }
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
          <span class="sunmar-shild--text"><slot></slot></span>
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
