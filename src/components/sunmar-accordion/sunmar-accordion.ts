import { LitElement, css, html, unsafeCSS } from 'lit';
import type { SunmarAccordionItem } from '../sunmar-accordion-item/sunmar-accordion-item';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-accordion.scss?inline';

export type SunmarAccordionMode = 'single' | 'multiple';

export const SUNMAR_ACCORDION_TAG_NAME = 'sunmar-accordion';
const ACCORDION_ITEM_TAG_NAME = 'sunmar-accordion-item';

type AccordionItemToggleRequestEvent = CustomEvent<{
  item: SunmarAccordionItem;
}>;

const normalizeText = (value: string): string => value.replace(/\s+/g, ' ').trim();
const normalizeMode = (value: unknown): SunmarAccordionMode =>
  value === 'single' ? 'single' : 'multiple';

export class SunmarAccordion extends LitElement {
  static properties = {
    mode: {
      reflect: true,
      converter: {
        fromAttribute: normalizeMode,
        toAttribute: normalizeMode
      }
    },
    faq: { type: Boolean }
  };

  static styles = [componentBaseStyles, css`
    ${unsafeCSS(styles)}
  `];

  mode: SunmarAccordionMode = 'multiple';
  faq = false;

  private faqScript: HTMLScriptElement | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    if (this.hasUpdated) {
      this.syncFaqStructuredData();
    }
  }

  disconnectedCallback(): void {
    this.faqScript?.remove();
    this.faqScript = null;
    super.disconnectedCallback();
  }

  updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has('mode')) {
      const normalizedMode = normalizeMode(this.mode);
      if (this.mode !== normalizedMode) {
        this.mode = normalizedMode;
      }

      this.normalizeItems();
    }

    if (changedProperties.has('faq')) {
      this.syncFaqStructuredData();
    }
  }

  protected render() {
    return html`
      <slot
        @slotchange=${this.onSlotChange}
        @sunmar-accordion-item-toggle-request=${this.onItemToggleRequest}
      ></slot>
    `;
  }

  private readonly onSlotChange = (): void => {
    this.normalizeItems();
    this.syncFaqStructuredData();
  };

  private readonly onItemToggleRequest = (event: AccordionItemToggleRequestEvent): void => {
    const { item } = event.detail;
    const items = this.items;
    if (!items.includes(item)) {
      return;
    }

    event.stopPropagation();

    if (this.mode !== 'single' || !item.open) {
      return;
    }

    for (const currentItem of items) {
      if (currentItem !== item) {
        currentItem.open = false;
      }
    }
  };

  private normalizeItems(): void {
    const items = this.items;
    if (!items.length) {
      return;
    }

    if (this.mode !== 'single') {
      return;
    }

    let firstOpenSeen = false;
    for (const item of items) {
      if (!item.open) {
        continue;
      }

      if (!firstOpenSeen) {
        firstOpenSeen = true;
        continue;
      }

      item.open = false;
    }
  }

  private get items(): SunmarAccordionItem[] {
    return Array.from(this.children).filter(
      (element): element is SunmarAccordionItem =>
        element.tagName.toLowerCase() === ACCORDION_ITEM_TAG_NAME
    );
  }

  private syncFaqStructuredData(): void {
    if (!this.faq || !this.isConnected) {
      this.removeFaqStructuredData();
      return;
    }

    const mainEntity = this.items.flatMap((item) => {
      const name = normalizeText(
        item.querySelector<HTMLElement>('[slot="header"]')?.textContent ?? ''
      );
      const text = normalizeText(
        Array.from(item.childNodes)
          .filter(
            (node) =>
              !(node instanceof HTMLElement) || node.getAttribute('slot') !== 'header'
          )
          .map((node) => node.textContent ?? '')
          .join(' ')
      );

      return name && text
        ? [{
            '@type': 'Question',
            name,
            acceptedAnswer: { '@type': 'Answer', text }
          }]
        : [];
    });

    if (!mainEntity.length) {
      this.removeFaqStructuredData();
      return;
    }

    if (!this.faqScript?.isConnected) {
      this.faqScript = this.ownerDocument.createElement('script');
      this.faqScript.type = 'application/ld+json';
      this.parentNode?.insertBefore(this.faqScript, this.nextSibling);
    }

    this.faqScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity
    }).replace(/</g, '\\u003c');
  }

  private removeFaqStructuredData(): void {
    this.faqScript?.remove();
    this.faqScript = null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_ACCORDION_TAG_NAME]: SunmarAccordion;
  }
}
