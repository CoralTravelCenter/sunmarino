import './styles/sunmar-tokens-runtime.scss';

export { SunmarShell } from './components/sunmar-shell/sunmar-shell';
export { SunmarModal } from './components/sunmar-modal/sunmar-modal';
export { SunmarButton } from './components/sunmar-button/sunmar-button';
export { SunmarButtonGroup } from './components/sunmar-button-group/sunmar-button-group';
export { SunmarLink } from './components/sunmar-link/sunmar-link';
export { SunmarImage } from './components/sunmar-image/sunmar-image';
export { SunmarKv } from './components/sunmar-kv/sunmar-kv';
export { SunmarAccordion } from './components/sunmar-accordion/sunmar-accordion';
export { SunmarAccordionItem } from './components/sunmar-accordion-item/sunmar-accordion-item';
export { SunmarTabs } from './components/sunmar-tabs/sunmar-tabs';
export { SunmarTabsNav } from './components/sunmar-tabs-nav/sunmar-tabs-nav';
export { SunmarTabTrigger } from './components/sunmar-tab-trigger/sunmar-tab-trigger';
export { SunmarTabPanel } from './components/sunmar-tab-panel/sunmar-tab-panel';
export { hostReactAppReady } from './utils/dom/host-react-app-ready';
export { preloadScript } from './utils/dom/preload-script';
export { vimeoAutoPlay } from './utils/video/vimeo-auto-play';
export { registerSunmarComponents } from './registry/register-components';

import { registerSunmarComponents } from './registry/register-components';
registerSunmarComponents();
