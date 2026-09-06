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
  private contentObserver?: MutationObserver;

  private readonly onContentChange = (records: MutationRecord[]): void => {
    if (records.some((record) => record.type === 'childList' && record.target === this)) {
      this.normalizeItems();
    }
    this.syncFaqStructuredData();
  };

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('sunmar-accordion-item-toggle-request', this.onItemToggleRequest);
    this.contentObserver ??= new MutationObserver(this.onContentChange);
    this.contentObserver.observe(this, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['slot']
    });
    if (this.hasUpdated) {
      this.normalizeItems();
      this.syncFaqStructuredData();
    }
  }

  disconnectedCallback(): void {
    this.removeEventListener('sunmar-accordion-item-toggle-request', this.onItemToggleRequest);
    this.contentObserver?.disconnect();
    this.removeFaqStructuredData();
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
      ></slot>
    `;
  }

  private readonly onSlotChange = (): void => {
    this.normalizeItems();
    this.syncFaqStructuredData();
  };

  private readonly onItemToggleRequest = (event: Event): void => {
    const { item } = (event as AccordionItemToggleRequestEvent).detail;
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
        Array.from(item.children)
          .filter((element) => element.getAttribute('slot') === 'header')
          .map((element) => element.textContent ?? '')
          .join(' ')
      );
      const text = normalizeText(
        Array.from(item.childNodes)
          .filter((node) => node.nodeType === Node.TEXT_NODE || (
            node instanceof Element && !node.getAttribute('slot')
          ))
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
