import './suppress-lit-dev-warnings';
import '../index';
import PREVIEW_HTML from './markup.html?raw'

function renderPreview(target: HTMLElement): void {
  target.innerHTML = PREVIEW_HTML;
  setupModalDemo(target);
}

function setupModalDemo(scope: ParentNode): void {
  const opener = scope.querySelector<HTMLButtonElement>('#open-modal-demo');
  const closer = scope.querySelector<HTMLButtonElement>('#close-modal-demo');
  const modal = scope.querySelector<HTMLElement & { show(): void; hide(): void }>('#modal-demo');

  opener?.addEventListener('click', () => modal?.show());
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
