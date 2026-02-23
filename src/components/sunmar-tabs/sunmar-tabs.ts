import { LitElement, css, html, unsafeCSS } from 'lit';
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
  static properties = {
    value: { type: String, reflect: true }
  };

  static styles = css`
    ${unsafeCSS(styles)}
  `;

  value = '';

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener(TAB_TRIGGER_ACTIVATE_EVENT, this.onTriggerActivate as EventListener);
  }

  disconnectedCallback(): void {
    this.removeEventListener(TAB_TRIGGER_ACTIVATE_EVENT, this.onTriggerActivate as EventListener);
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
    this.dispatchEvent(
      new CustomEvent<SunmarTabsChangeDetail>(TABS_CHANGE_EVENT, {
        detail: { value: nextValue, previousValue },
        bubbles: true,
        composed: true,
      })
    );
  };

  private syncTabsState(): void {
    const triggers = this.getTriggers();
    const panels = this.getPanels();

    const resolvedValue = this.resolveValue(triggers, panels);

    if (resolvedValue !== this.value) {
      this.value = resolvedValue;
    }

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

  private getTriggers(): TabTriggerLike[] {
    const navRoots = this.getNavSlotAssignedElements();
    const collected: TabTriggerLike[] = [];

    for (const root of navRoots) {
      if (root.tagName.toLowerCase() === TAB_TRIGGER_TAG_NAME) {
        collected.push(root as TabTriggerLike);
      }

      const descendants = Array.from(root.querySelectorAll<TabTriggerLike>(TAB_TRIGGER_TAG_NAME));
      collected.push(...descendants);
    }

    return Array.from(new Set(collected));
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

  private getNavSlotAssignedElements(): Element[] {
    const navSlot = this.renderRoot.querySelector<HTMLSlotElement>('slot[name="nav"]');
    if (!navSlot) {
      return [];
    }

    return navSlot.assignedElements({ flatten: true }).filter((el) => {
      const tag = el.tagName.toLowerCase();
      return tag === TABS_NAV_TAG_NAME || tag === TAB_TRIGGER_TAG_NAME;
    });
  }

  private isTriggerInNav(trigger: TabTriggerLike): boolean {
    return this.getTriggers().includes(trigger);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_TABS_TAG_NAME]: SunmarTabs;
  }
}
