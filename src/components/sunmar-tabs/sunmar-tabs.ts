import { LitElement, css, html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-tabs.scss?inline';

export const SUNMAR_TABS_TAG_NAME = 'sunmar-tabs';
const TABS_NAV_TAG_NAME = 'sunmar-tabs-nav';
const TAB_TRIGGER_TAG_NAME = 'sunmar-tab-trigger';
const TAB_PANEL_TAG_NAME = 'sunmar-tab-panel';
const TAB_TRIGGER_ACTIVATE_EVENT = 'sunmar-tab-trigger-activate';
const TABS_CHANGE_EVENT = 'sunmar-tabs-change';

type TabTriggerLike = HTMLElement & {
  value?: string;
  disabled?: boolean;
  selected?: boolean;
  panelId?: string;
  focus?: (options?: FocusOptions) => void;
};

type TabPanelLike = HTMLElement & {
  value?: string;
  active?: boolean;
};

type TabTriggerActivateEvent = CustomEvent<{
  value: string;
  trigger: TabTriggerLike;
}>;

export type SunmarTabsChangeDetail = {
  value: string;
  previousValue: string | null;
};

export class SunmarTabs extends LitElement {
  static styles = [componentBaseStyles, css`
    ${unsafeCSS(styles)}
  `];

  @property({ type: String, reflect: true })
  value = '';

  connectedCallback(): void {
    super.connectedCallback();

    if (!this.id) {
      this.id = `${SUNMAR_TABS_TAG_NAME}-${crypto.randomUUID()}`;
    }

    this.addEventListener(TAB_TRIGGER_ACTIVATE_EVENT, this.onTriggerActivate as EventListener);
    this.addEventListener('keydown', this.onTriggerKeyDown as EventListener);
  }

  disconnectedCallback(): void {
    this.removeEventListener(TAB_TRIGGER_ACTIVATE_EVENT, this.onTriggerActivate as EventListener);
    this.removeEventListener('keydown', this.onTriggerKeyDown as EventListener);
    super.disconnectedCallback();
  }

  firstUpdated(): void {
    this.syncTabsState();
  }

  updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has('value')) {
      this.syncTabsState();
    }
  }

  protected render() {
    return html`
      <div class="root" part="root">
        <div class="nav" part="nav">
          <slot name="nav" class="nav-slot" @slotchange=${this.onNavSlotChange}></slot>
        </div>
        <div class="panels" part="panels">
          <slot class="panels-slot" @slotchange=${this.onPanelsSlotChange}></slot>
        </div>
      </div>
    `;
  }

  private readonly onNavSlotChange = (): void => {
    this.syncTabsState();
  };

  private readonly onPanelsSlotChange = (): void => {
    this.syncTabsState();
  };

  private readonly onTriggerActivate = (event: TabTriggerActivateEvent): void => {
    const { trigger, value } = event.detail;
    if (!this.isTriggerInNav(trigger)) {
      return;
    }

    this.activateValue(value, true);
  };

  private readonly onTriggerKeyDown = (event: KeyboardEvent): void => {
    const trigger = this.getTriggerFromEvent(event);
    if (!trigger || !this.isTriggerInNav(trigger)) {
      return;
    }

    const navigableTriggers = this.getNavigableTriggers();
    if (!navigableTriggers.length) {
      return;
    }

    const currentIndex = navigableTriggers.indexOf(trigger);
    if (currentIndex === -1) {
      return;
    }

    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % navigableTriggers.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (currentIndex - 1 + navigableTriggers.length) % navigableTriggers.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = navigableTriggers.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();

    const nextTrigger = navigableTriggers[nextIndex];
    nextTrigger.focus?.();
    this.activateValue(nextTrigger.value ?? '', true);
  };

  private syncTabsState(): void {
    const triggers = this.getTriggers();
    const panels = this.getPanels();

    const resolvedValue = this.resolveValue(triggers, panels);

    if (resolvedValue !== this.value) {
      this.value = resolvedValue;
    }

    this.syncTabsAccessibility(triggers, panels);

    for (const trigger of triggers) {
      trigger.selected = Boolean(resolvedValue) && trigger.value?.trim() === resolvedValue;
    }

    for (const panel of panels) {
      panel.active = Boolean(resolvedValue) && panel.value?.trim() === resolvedValue;
    }
  }

  private resolveValue(triggers: TabTriggerLike[], panels: TabPanelLike[]): string {
    const panelValues = new Set(
      panels
        .map((panel) => panel.value?.trim() ?? '')
        .filter((value): value is string => value.length > 0)
    );

    const preferredValue = this.value.trim();
    if (preferredValue && panelValues.has(preferredValue)) {
      const matchedTrigger = triggers.find((trigger) => trigger.value?.trim() === preferredValue);
      if (matchedTrigger && !matchedTrigger.disabled) {
        return preferredValue;
      }
    }

    for (const trigger of triggers) {
      const triggerValue = trigger.value?.trim() ?? '';
      if (!triggerValue || trigger.disabled) {
        continue;
      }

      if (panelValues.has(triggerValue)) {
        return triggerValue;
      }
    }

    return '';
  }

  private activateValue(value: string, emitChange: boolean): void {
    const nextValue = value.trim();
    if (!nextValue) {
      return;
    }

    const previousValue = this.value.trim() || null;
    if (previousValue === nextValue) {
      this.syncTabsState();
      return;
    }

    this.value = nextValue;
    this.syncTabsState();

    if (!emitChange) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent<SunmarTabsChangeDetail>(TABS_CHANGE_EVENT, {
        detail: { value: nextValue, previousValue },
        bubbles: true,
        composed: true,
      })
    );
  }

  private syncTabsAccessibility(triggers: TabTriggerLike[], panels: TabPanelLike[]): void {
    for (const panel of panels) {
      const panelValue = panel.value?.trim() ?? '';

      if (panelValue && !panel.id) {
        panel.id = this.createScopedId('panel', panelValue);
      }
    }

    const triggersByValue = new Map(
      triggers
        .map((trigger) => [trigger.value?.trim() ?? '', trigger] as const)
        .filter(([value]) => value.length > 0)
    );

    for (const trigger of triggers) {
      const triggerValue = trigger.value?.trim() ?? '';
      if (triggerValue && !trigger.id) {
        trigger.id = this.createScopedId('tab', triggerValue);
      }

      const panel = panels.find((item) => item.value?.trim() === triggerValue);
      trigger.panelId = panel?.id ?? '';
    }

    for (const panel of panels) {
      const panelValue = panel.value?.trim() ?? '';
      const trigger = triggersByValue.get(panelValue);
      if (trigger?.id) {
        panel.setAttribute('aria-labelledby', trigger.id);
      } else {
        panel.removeAttribute('aria-labelledby');
      }
    }
  }

  private createScopedId(type: 'tab' | 'panel', value: string): string {
    const normalizedValue = value
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const suffix = normalizedValue || crypto.randomUUID();
    return `${this.id}-${type}-${suffix}`;
  }

  private getTriggers(): TabTriggerLike[] {
    const navRoot = this.getNavRoot();
    if (!navRoot) {
      return [];
    }

    return Array.from(navRoot.querySelectorAll<TabTriggerLike>(TAB_TRIGGER_TAG_NAME));
  }

  private getNavigableTriggers(): TabTriggerLike[] {
    const panelValues = new Set(
      this.getPanels()
        .map((panel) => panel.value?.trim() ?? '')
        .filter((value): value is string => value.length > 0)
    );

    return this.getTriggers().filter((trigger) => {
      const value = trigger.value?.trim() ?? '';
      return Boolean(value) && !trigger.disabled && panelValues.has(value);
    });
  }

  private getPanels(): TabPanelLike[] {
    const panelsSlot = this.renderRoot.querySelector<HTMLSlotElement>('slot:not([name])');
    if (!panelsSlot) {
      return [];
    }

    return panelsSlot
      .assignedElements({ flatten: true })
      .filter((el): el is TabPanelLike => el.tagName.toLowerCase() === TAB_PANEL_TAG_NAME);
  }

  private getNavRoot(): HTMLElement | null {
    const navSlot = this.renderRoot.querySelector<HTMLSlotElement>('slot[name="nav"]');
    if (!navSlot) {
      return null;
    }

    const navRoot = navSlot
      .assignedElements({ flatten: true })
      .find((el) => el.tagName.toLowerCase() === TABS_NAV_TAG_NAME);

    return navRoot instanceof HTMLElement ? navRoot : null;
  }

  private isTriggerInNav(trigger: TabTriggerLike): boolean {
    return this.getTriggers().includes(trigger);
  }

  private getTriggerFromEvent(event: KeyboardEvent): TabTriggerLike | null {
    if (!(event.target instanceof Element)) {
      return null;
    }

    const trigger = event.target.closest<TabTriggerLike>(TAB_TRIGGER_TAG_NAME);
    return trigger ?? null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_TABS_TAG_NAME]: SunmarTabs;
  }
}
