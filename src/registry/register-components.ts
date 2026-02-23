import {
  SUNMAR_SHELL_TAG_NAME,
  SunmarShell
} from '../components/sunmar-shell/sunmar-shell';
import {
  SUNMAR_MODAL_TAG_NAME,
  SunmarModal
} from '../components/sunmar-modal/sunmar-modal';
import {
  SUNMAR_BUTTON_TAG_NAME,
  SunmarButton
} from '../components/sunmar-button/sunmar-button';
import {
  SUNMAR_BUTTON_GROUP_TAG_NAME,
  SunmarButtonGroup
} from '../components/sunmar-button-group/sunmar-button-group';
import {
  SUNMAR_LINK_TAG_NAME,
  SunmarLink
} from '../components/sunmar-link/sunmar-link';
import {
  SUNMAR_IMAGE_TAG_NAME,
  SunmarImage
} from '../components/sunmar-image/sunmar-image';
import {
  SUNMAR_KV_TAG_NAME,
  SunmarKv
} from '../components/sunmar-kv/sunmar-kv';
import {
  SUNMAR_ACCORDION_TAG_NAME,
  SunmarAccordion
} from '../components/sunmar-accordion/sunmar-accordion';
import {
  SUNMAR_ACCORDION_ITEM_TAG_NAME,
  SunmarAccordionItem
} from '../components/sunmar-accordion-item/sunmar-accordion-item';
import {
  SUNMAR_TABS_TAG_NAME,
  SunmarTabs
} from '../components/sunmar-tabs/sunmar-tabs';
import {
  SUNMAR_TABS_NAV_TAG_NAME,
  SunmarTabsNav
} from '../components/sunmar-tabs-nav/sunmar-tabs-nav';
import {
  SUNMAR_TAB_TRIGGER_TAG_NAME,
  SunmarTabTrigger
} from '../components/sunmar-tab-trigger/sunmar-tab-trigger';
import {
  SUNMAR_TAB_PANEL_TAG_NAME,
  SunmarTabPanel
} from '../components/sunmar-tab-panel/sunmar-tab-panel';

const sunmarComponentRegistryEntries = [
  [SUNMAR_SHELL_TAG_NAME, SunmarShell],
  [SUNMAR_MODAL_TAG_NAME, SunmarModal],
  [SUNMAR_BUTTON_TAG_NAME, SunmarButton],
  [SUNMAR_BUTTON_GROUP_TAG_NAME, SunmarButtonGroup],
  [SUNMAR_LINK_TAG_NAME, SunmarLink],
  [SUNMAR_IMAGE_TAG_NAME, SunmarImage],
  [SUNMAR_KV_TAG_NAME, SunmarKv],
  [SUNMAR_ACCORDION_TAG_NAME, SunmarAccordion],
  [SUNMAR_ACCORDION_ITEM_TAG_NAME, SunmarAccordionItem],
  [SUNMAR_TABS_TAG_NAME, SunmarTabs],
  [SUNMAR_TABS_NAV_TAG_NAME, SunmarTabsNav],
  [SUNMAR_TAB_TRIGGER_TAG_NAME, SunmarTabTrigger],
  [SUNMAR_TAB_PANEL_TAG_NAME, SunmarTabPanel]
] as const;

export function registerSunmarComponents(registry?: CustomElementRegistry): void {
  const targetRegistry =
    registry ?? (typeof window !== 'undefined' ? window.customElements : undefined);

  if (!targetRegistry) {
    return;
  }

  for (const [tagName, elementCtor] of sunmarComponentRegistryEntries) {
    if (!targetRegistry.get(tagName)) {
      targetRegistry.define(tagName, elementCtor);
    }
  }
}
