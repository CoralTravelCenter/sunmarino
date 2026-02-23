import { LitElement, css, html, unsafeCSS } from 'lit';
import styles from './sunmar-accordion.scss?inline';

export type SunmarAccordionMode = 'single' | 'multiple';

export const SUNMAR_ACCORDION_TAG_NAME = 'sunmar-accordion';
const ACCORDION_ITEM_TAG_NAME = 'sunmar-accordion-item';
const ACCORDION_ITEM_TOGGLE_REQUEST_EVENT = 'sunmar-accordion-item-toggle-request';

type AccordionItemLike = HTMLElement & {
  open?: boolean;
  disabled?: boolean;
  setOpen?: (next: boolean) => void;
};

type AccordionItemToggleRequestEvent = CustomEvent<{
  item: AccordionItemLike;
}>;

export class SunmarAccordion extends LitElement {
  static properties = {
    mode: { type: String, reflect: true }
  };

  static styles = css`
    ${unsafeCSS(styles)}
  `;

  mode: SunmarAccordionMode = 'multiple';

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener(
      ACCORDION_ITEM_TOGGLE_REQUEST_EVENT,
      this.onItemToggleRequest as EventListener
    );
  }

  disconnectedCallback(): void {
    this.removeEventListener(
      ACCORDION_ITEM_TOGGLE_REQUEST_EVENT,
      this.onItemToggleRequest as EventListener
    );
    super.disconnectedCallback();
  }

  firstUpdated(): void {
    this.normalizeItems();
  }

  updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has('mode')) {
      this.normalizeItems();
    }
  }

  protected render() {
    return html`
      <div class="root" part="root">
        <slot class="items-slot" @slotchange=${this.onSlotChange}></slot>
      </div>
    `;
  }

  private readonly onSlotChange = (): void => {
    this.normalizeItems();
  };

  private readonly onItemToggleRequest = (event: AccordionItemToggleRequestEvent): void => {
    const { item } = event.detail;
    if (!this.contains(item) || item.tagName.toLowerCase() !== ACCORDION_ITEM_TAG_NAME) {
      return;
    }

    const items = this.getItems();
    const isOpen = Boolean(item.open);

    if (this.mode === 'single') {
      if (isOpen) {
        this.setItemOpen(item, false);
        return;
      }

      for (const currentItem of items) {
        this.setItemOpen(currentItem, currentItem === item);
      }
      return;
    }

    this.setItemOpen(item, !isOpen);
  };

  private normalizeItems(): void {
    const items = this.getItems();
    if (!items.length) {
      return;
    }

    if (this.mode !== 'single') {
      return;
    }

    let firstOpenSeen = false;
    for (const item of items) {
      const isOpen = Boolean(item.open);
      if (!isOpen) {
        continue;
      }

      if (!firstOpenSeen) {
        firstOpenSeen = true;
        continue;
      }

      this.setItemOpen(item, false);
    }
  }

  private getItems(): AccordionItemLike[] {
    const slotEl = this.renderRoot.querySelector<HTMLSlotElement>('slot');
    if (!slotEl) {
      return [];
    }

    return slotEl
      .assignedElements({ flatten: true })
      .filter(
        (el): el is AccordionItemLike => el.tagName.toLowerCase() === ACCORDION_ITEM_TAG_NAME
      );
  }

  private setItemOpen(item: AccordionItemLike, next: boolean): void {
    if (typeof item.setOpen === 'function') {
      item.setOpen(next);
      return;
    }

    item.open = next;
    item.toggleAttribute('open', next);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_ACCORDION_TAG_NAME]: SunmarAccordion;
  }
}
