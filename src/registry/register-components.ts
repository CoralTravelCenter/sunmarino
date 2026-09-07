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
  SUNMAR_TAB_TAG_NAME,
  SunmarTab
} from '../components/sunmar-tabs/sunmar-tab';
import {
  SUNMAR_TAB_CONTENT_TAG_NAME,
  SunmarTabContent
} from '../components/sunmar-tabs/sunmar-tab-content';
import {
  SUNMAR_STICKY_NAV_TAG_NAME,
  SunmarStickyNav
} from '../components/sunmar-sticky-nav/sunmar-sticky-nav';
import {
  SUNMAR_CARD_TAG_NAME,
  SunmarCard
} from '../components/sunmar-card/sunmar-card';
import {
  SUNMAR_SLIDE_TAG_NAME,
  SunmarSlide
} from '../components/sunmar-slide/sunmar-slide';
import {
  SUNMAR_SLIDER_TAG_NAME,
  SunmarSlider
} from '../components/sunmar-slider/sunmar-slider';

const sunmarComponentRegistryEntries = [
  [SUNMAR_MODAL_TAG_NAME, SunmarModal],
  [SUNMAR_BUTTON_TAG_NAME, SunmarButton],
  [SUNMAR_BUTTON_GROUP_TAG_NAME, SunmarButtonGroup],
  [SUNMAR_IMAGE_TAG_NAME, SunmarImage],
  [SUNMAR_KV_TAG_NAME, SunmarKv],
  [SUNMAR_ACCORDION_TAG_NAME, SunmarAccordion],
  [SUNMAR_ACCORDION_ITEM_TAG_NAME, SunmarAccordionItem],
  [SUNMAR_TABS_TAG_NAME, SunmarTabs],
  [SUNMAR_TAB_TAG_NAME, SunmarTab],
  [SUNMAR_TAB_CONTENT_TAG_NAME, SunmarTabContent],
  [SUNMAR_STICKY_NAV_TAG_NAME, SunmarStickyNav],
  [SUNMAR_CARD_TAG_NAME, SunmarCard],
  [SUNMAR_SLIDE_TAG_NAME, SunmarSlide],
  [SUNMAR_SLIDER_TAG_NAME, SunmarSlider]
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
