import './suppress-lit-dev-warnings';
import '../index';
import { hostReactAppReady } from '../utils/dom/host-react-app-ready';

import PREVIEW_HTML from './markup.html?raw'

const htmlModules = import.meta.glob('./components-envs/*.html', {
  query: '?raw', 
  import: 'default',
  eager: true,
});

const USE_COMPONENTS_ENVS = false; 
// если true - использует markup из соответствующего файла
// если false - берет markup из папки components-envs

function renderPreview(target: HTMLElement): void {
  if (USE_COMPONENTS_ENVS) {
    const combinedHTML = Object.values(htmlModules).join('\n');
    target.innerHTML = combinedHTML;
  } else 
    target.innerHTML = PREVIEW_HTML;
  setupTabsSync(target);
}

function setupTabsSync(scope: ParentNode): void {
  const tabsA = scope.querySelector<HTMLElement & { value?: string }>('#tabs-sync-a');
  const tabsB = scope.querySelector<HTMLElement & { value?: string }>('#tabs-sync-b');

  if (!tabsA || !tabsB) {
    return;
  }

  tabsA.addEventListener('sunmar-tabs-change', ((event: Event) => {
    const customEvent = event as CustomEvent<{ value: string }>;
    tabsB.value = customEvent.detail.value;
  }) as EventListener);

  tabsB.addEventListener('sunmar-tabs-change', ((event: Event) => {
    const customEvent = event as CustomEvent<{ value: string }>;
    tabsA.value = customEvent.detail.value;
  }) as EventListener);
}

function ensureMonkeyMountPoint(): HTMLElement {
  const existing = document.querySelector<HTMLElement>('#monkey-app');
  if (existing) {
    return existing;
  }

  const host = document.createElement('div');
  host.id = 'monkey-app';
  host.style.position = 'fixed';
  host.style.left = '12px';
  host.style.right = '12px';
  host.style.top = '12px';
  host.style.bottom = '12px';
  host.style.overflow = 'auto';
  host.style.zIndex = '2147483647';
  document.body.append(host);
  return host;
}

async function bootstrapPreview(): Promise<void> {
  const localMount = document.querySelector<HTMLElement>('#app');
  if (localMount) {
    renderPreview(localMount);
    return;
  }

  await hostReactAppReady('#__next > div', 250);
  renderPreview(ensureMonkeyMountPoint());
}

void bootstrapPreview();
