import { LitElement, css, html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-tabs.scss?inline';

export const SUNMAR_TABS_TAG_NAME = 'sunmar-tabs';
const TAB_TAG_NAME = 'sunmar-tab';
const TAB_CONTENT_TAG_NAME = 'sunmar-tab-content';
export const SUNMAR_TABS_CHANGE_EVENT = 'sunmar-tabs-change';

type TabElement = HTMLElement & { value?: string; forced?: boolean };
type TabContentElement = HTMLElement & { value?: string };

export type SunmarTabsChangeDetail = {
  value: string;
  previousValue: string | null;
};

let tabsInstance = 0;

export class SunmarTabs extends LitElement {
  static styles = [componentBaseStyles, css`${unsafeCSS(styles)}`];

  private readonly instanceId = `${SUNMAR_TABS_TAG_NAME}-${++tabsInstance}`;
  private initialized = false;
  private nextId = 0;
  private observer?: MutationObserver;
  private readonly ownedAttributes = new Map<Element, Map<string, { original: string | null; written: string | null }>>();

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', this.onClick);
    this.addEventListener('keydown', this.onKeyDown);
    this.observeChildren();
    if (this.hasUpdated) this.sync();
  }

  disconnectedCallback(): void {
    this.observer?.disconnect();
    this.removeEventListener('click', this.onClick);
    this.removeEventListener('keydown', this.onKeyDown);
    for (const element of this.ownedAttributes.keys()) this.restoreAttributes(element);
    super.disconnectedCallback();
  }

  private observeChildren(): void {
    this.observer ??= new MutationObserver(this.sync);
    this.observer.observe(this, {
      subtree: true, childList: true, attributes: true,
      attributeFilter: ['value', 'disabled', 'forced', 'id', 'slot']
    });
  }

  private writeAttribute(element: Element, name: string, value: string | null): void {
    let attributes = this.ownedAttributes.get(element);
    if (!attributes) {
      attributes = new Map();
      this.ownedAttributes.set(element, attributes);
    }
    const current = element.getAttribute(name);
    const previous = attributes.get(name);
    const original = previous && current === previous.written ? previous.original : current;
    attributes.set(name, { original, written: value });
    if (current === value) return;
    if (value === null) element.removeAttribute(name);
    else element.setAttribute(name, value);
  }

  private restoreAttributes(element: Element): void {
    for (const [name, { original, written }] of this.ownedAttributes.get(element) ?? []) {
      if (element.getAttribute(name) !== written) continue;
      if (original === null) element.removeAttribute(name);
      else element.setAttribute(name, original);
    }
    this.ownedAttributes.delete(element);
  }

  private ensureId(element: Element, type: 'tab' | 'panel'): void {
    if (!element.id) this.writeAttribute(element, 'id', `${this.instanceId}-${type}-${++this.nextId}`);
  }

  @property({ type: String, reflect: true })
  value = '';

  @property({ attribute: 'aria-label' })
  label = '';

  protected render() {
    return html`
      <div class="root" part="root">
        <div
          class="nav"
          part="nav"
          role="tablist"
          aria-label=${ifDefined(this.label || undefined)}
          aria-orientation="horizontal"
        >
          <slot name="tab" @slotchange=${this.sync}></slot>
        </div>
        <div class="panels" part="panels">
          <slot name="panel" @slotchange=${this.sync}></slot>
        </div>
      </div>
    `;
  }

  protected firstUpdated(): void {
    this.sync();
  }

  protected updated(changed: Map<string, unknown>): void {
    if (changed.has('value')) this.sync();
  }

  private readonly sync = (): void => {
    if (!this.isConnected || !this.hasUpdated) return;
    this.observer?.disconnect();
    const tabs = this.tabs;
    const panels = this.panels;
    const managed = new Set<Element>([...tabs, ...panels]);
    tabs.forEach((tab) => { const button = this.getButton(tab); if (button) managed.add(button); });
    for (const element of this.ownedAttributes.keys()) {
      if (!managed.has(element)) this.restoreAttributes(element);
    }
    this.distributeChildren();
    const panelsByValue = new Map<string, TabContentElement>();
    const tabsByValue = new Map<string, TabElement>();

    for (const panel of panels) {
      const panelValue = panel.value?.trim() ?? '';
      if (panelValue && !panelsByValue.has(panelValue)) {
        panelsByValue.set(panelValue, panel);
      }
    }

    for (const tab of tabs) {
      const tabValue = tab.value?.trim() ?? '';
      if (tabValue && this.getButton(tab) && !tabsByValue.has(tabValue)) {
        tabsByValue.set(tabValue, tab);
      }
    }

    const isAvailable = (tab: TabElement): boolean =>
      tabsByValue.get(tab.value?.trim() ?? '') === tab
      && !this.isDisabled(tab)
      && panelsByValue.has(tab.value?.trim() ?? '');
    const forcedValue = this.initialized
      ? ''
      : tabs.find((tab) => tab.forced && isAvailable(tab))?.value?.trim() ?? '';
    const requestedValue = this.value?.trim() ?? '';
    const activeValue = forcedValue
      || tabs.find((tab) => tab.value?.trim() === requestedValue && isAvailable(tab))?.value?.trim()
      || tabs.find(isAvailable)?.value?.trim()
      || '';

    if (tabs.some(isAvailable)) this.initialized = true;

    if (activeValue !== this.value) this.value = activeValue;

    panels.forEach((panel) => {
      const panelValue = panel.value?.trim() ?? '';
      const isPrimaryPanel = panelsByValue.get(panelValue) === panel;
      this.ensureId(panel, 'panel');
      this.writeAttribute(panel, 'role', 'tabpanel');
      this.writeAttribute(panel, 'aria-labelledby', null);
      this.writeAttribute(panel, 'active', activeValue && isPrimaryPanel && panelValue === activeValue ? '' : null);
    });

    tabs.forEach((tab) => {
      const tabValue = tab.value?.trim() ?? '';
      const button = this.getButton(tab);
      const panel = panelsByValue.get(tabValue);
      const available = isAvailable(tab);
      const selected = available && tabValue === activeValue;
      this.writeAttribute(tab, 'selected', selected ? '' : null);
      if (!button) return;
      this.ensureId(button, 'tab');
      this.writeAttribute(button, 'role', 'tab');
      this.writeAttribute(button, 'aria-disabled', String(!available));
      this.writeAttribute(button, 'aria-selected', String(selected));
      this.writeAttribute(button, 'tabindex', selected ? '0' : '-1');
      this.writeAttribute(button, 'aria-controls', null);
      if (tabsByValue.get(tabValue) === tab && panel?.id) {
        this.writeAttribute(button, 'aria-controls', panel.id);
        this.writeAttribute(panel, 'aria-labelledby', button.id);
      }
    });
    this.observeChildren();
  };

  private readonly onClick = (event: Event): void => {
    const tab = this.tabFromEvent(event);
    const button = tab ? this.getButton(tab) : null;
    if (!tab || !button || !this.isAvailableTab(tab) || !event.composedPath().includes(button)) return;
    this.activate(tab.value?.trim() ?? '');
  };

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    const tab = this.tabFromEvent(event);
    if (!tab || !event.composedPath().includes(this.getButton(tab)!)) return;
    const tabs = this.tabs.filter((item) => this.isAvailableTab(item));
    const index = tabs.indexOf(tab);
    if (index < 0) return;

    const next = event.key === 'Home' ? 0
      : event.key === 'End' ? tabs.length - 1
      : ['ArrowRight', 'ArrowDown'].includes(event.key) ? (index + 1) % tabs.length
      : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? (index - 1 + tabs.length) % tabs.length
      : -1;
    if (next < 0) return;
    event.preventDefault();
    this.getButton(tabs[next])?.focus();
    this.activate(tabs[next].value?.trim() ?? '');
  };

  private activate(value: string): void {
    if (!value || value === this.value || !this.canActivate(value)) return;
    const previousValue = this.value || null;
    this.value = value;
    this.sync();
    this.dispatchEvent(new CustomEvent<SunmarTabsChangeDetail>(SUNMAR_TABS_CHANGE_EVENT, {
      detail: { value, previousValue }, bubbles: true, composed: true,
    }));
  }

  private distributeChildren(): void {
    for (const child of Array.from(this.children)) {
      if (child.matches(TAB_TAG_NAME)) this.writeAttribute(child, 'slot', 'tab');
      if (child.matches(TAB_CONTENT_TAG_NAME)) this.writeAttribute(child, 'slot', 'panel');
    }
  }

  private tabFromEvent(event: Event): TabElement | undefined {
    return event.composedPath().find((item): item is TabElement =>
      item instanceof HTMLElement && item.matches(TAB_TAG_NAME) && item.parentElement === this
    );
  }

  private isDisabled(tab: TabElement): boolean {
    return Boolean(this.getButton(tab)?.disabled);
  }

  private canActivate(value: string): boolean {
    const tab = this.tabs.find((item) =>
      item.value?.trim() === value && this.getButton(item)
    );
    return Boolean(tab && this.isAvailableTab(tab));
  }

  private isAvailableTab(tab: TabElement): boolean {
    const value = tab.value?.trim() ?? '';
    if (!value || !this.getButton(tab) || this.isDisabled(tab)) return false;

    const firstTab = this.tabs.find((item) =>
      item.value?.trim() === value && this.getButton(item)
    );
    const firstPanel = this.panels.find((panel) => panel.value?.trim() === value);
    return firstTab === tab && Boolean(firstPanel);
  }

  private getButton(tab: TabElement): HTMLButtonElement | null {
    return tab.querySelector<HTMLButtonElement>(':scope > button');
  }

  private get tabs(): TabElement[] {
    return Array.from(this.querySelectorAll(`:scope > ${TAB_TAG_NAME}`));
  }

  private get panels(): TabContentElement[] {
    return Array.from(this.querySelectorAll(`:scope > ${TAB_CONTENT_TAG_NAME}`));
  }
}

declare global {
  interface HTMLElementTagNameMap { [SUNMAR_TABS_TAG_NAME]: SunmarTabs }
}
