import './suppress-lit-dev-warnings';
import '../index';
import coastImageUrl from './assets/cards/coast.jpg?url';
import mountainsImageUrl from './assets/cards/mountains.jpg?url';
import resortImageUrl from './assets/cards/resort.jpg?url';
import PREVIEW_HTML from './markup.html?raw';

function replacePlaceholder(markup: string, placeholder: string, value: string): string {
  return markup.split(placeholder).join(value);
}

const previewHtml = [
  ['__COAST_IMAGE_URL__', coastImageUrl],
  ['__MOUNTAINS_IMAGE_URL__', mountainsImageUrl],
  ['__RESORT_IMAGE_URL__', resortImageUrl]
].reduce(
  (markup, [placeholder, value]) => replacePlaceholder(markup, placeholder, value),
  PREVIEW_HTML
);

function renderPreview(target: HTMLElement): void {
  target.innerHTML = previewHtml;
  setupTripModal(target);
}

function setupTripModal(scope: ParentNode): void {
  const closer = scope.querySelector<HTMLButtonElement>('#close-trip');
  const modal = scope.querySelector<HTMLElement & { show(): void; hide(): void }>('#trip-modal');

  scope.querySelectorAll<HTMLButtonElement>('[data-open-trip]').forEach((opener) => {
    opener.addEventListener('click', () => modal?.show());
  });
  closer?.addEventListener('click', () => modal?.hide());
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

function bootstrapPreview(): void {
  const localMount = document.querySelector<HTMLElement>('#app');
  if (localMount) {
    renderPreview(localMount);
    return;
  }

  renderPreview(ensureMonkeyMountPoint());
}

bootstrapPreview();
