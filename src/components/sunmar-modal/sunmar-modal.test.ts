import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { registerSunmarComponents } from '../../registry/register-components';
import { SUNMAR_MODAL_OPEN_EVENT, SUNMAR_MODAL_CLOSE_EVENT, type SunmarModal } from './sunmar-modal';
import { acquirePageScrollLock, releasePageScrollLock } from '../../utils/scroll/no-scroll';
vi.mock('../../utils/scroll/no-scroll', () => ({ acquirePageScrollLock: vi.fn(), releasePageScrollLock: vi.fn() }));
registerSunmarComponents();
async function settle(modal: SunmarModal) {
  await modal.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 0));
  await modal.updateComplete;
}
async function mount(content = '') {
  const modal = document.createElement('sunmar-modal');
  modal.innerHTML = content;
  document.body.append(modal);
  await settle(modal);
  return modal;
}
function key(value: string, shiftKey = false) {
  const event = new KeyboardEvent('keydown', { key: value, shiftKey, bubbles: true, cancelable: true });
  document.dispatchEvent(event);
  return event;
}
beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue([{ width: 10, height: 10 }] as unknown as DOMRectList);
});
afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});
describe('SunmarModal', () => {
  it('emits the new events once per state change', async () => {
    const modal = await mount();
    const opened = vi.fn(); const closed = vi.fn();
    modal.addEventListener(SUNMAR_MODAL_OPEN_EVENT, opened);
    modal.addEventListener(SUNMAR_MODAL_CLOSE_EVENT, closed);
    modal.show(); await settle(modal);
    modal.show(); await settle(modal);
    expect(opened).toHaveBeenCalledOnce();
    expect(opened.mock.calls[0][0]).toMatchObject({ bubbles: true, composed: true });
    modal.toggle(); await settle(modal);
    expect(closed).toHaveBeenCalledOnce();
  });
  it('does not acquire resources after removal before the opening update', async () => {
    const modal = await mount();
    modal.show(); modal.remove(); await settle(modal);
    expect(acquirePageScrollLock).not.toHaveBeenCalled();
    document.body.append(modal); await settle(modal);
    expect(acquirePageScrollLock).toHaveBeenCalledOnce();
    modal.remove();
    expect(releasePageScrollLock).toHaveBeenCalledOnce();
  });
  it('restores focus and preserves original inert state', async () => {
    const opener = document.createElement('button');
    const disabledBackground = document.createElement('div'); disabledBackground.inert = true;
    document.body.append(opener, disabledBackground); opener.focus();
    const modal = await mount('<button autofocus>Первый</button>');
    modal.show(); await settle(modal);
    expect(document.activeElement).toBe(modal.querySelector('button'));
    expect(opener.inert).toBe(true);
    modal.hide(); await settle(modal);
    expect(opener.inert).toBe(false);
    expect(disabledBackground.inert).toBe(true);
    expect(document.activeElement).toBe(opener);
  });
  it('uses native boolean presence for disabling Escape and backdrop', async () => {
    const modal = await mount();
    modal.setAttribute('disable-close-on-esc', 'false');
    modal.setAttribute('disable-close-on-backdrop', '');
    modal.show(); await settle(modal);
    key('Escape');
    modal.shadowRoot!.querySelector<HTMLElement>('.overlay')!.click();
    await settle(modal); expect(modal.open).toBe(true);
    modal.removeAttribute('disable-close-on-esc'); await settle(modal);
    key('Escape'); await settle(modal); expect(modal.open).toBe(false);
  });
  it('closes on backdrop and close button but not content clicks', async () => {
    const modal = await mount('<button>Действие</button>');
    modal.show(); await settle(modal);
    modal.querySelector('button')!.click(); await settle(modal);
    expect(modal.open).toBe(true);
    modal.shadowRoot!.querySelector<HTMLElement>('.overlay')!.click(); await settle(modal);
    expect(modal.open).toBe(false);
    modal.show(); await settle(modal);
    modal.shadowRoot!.querySelector<HTMLElement>('.close')!.click(); await settle(modal);
    expect(modal.open).toBe(false);
  });
  it('keeps only the upper sibling modal active and Escape closes it alone', async () => {
    const background = document.createElement('button'); document.body.append(background);
    const first = await mount(); const second = await mount();
    first.show(); await settle(first);
    second.show(); await settle(second);
    expect(first.inert).toBe(true); expect(second.inert).toBe(false);
    key('Escape'); await settle(second);
    expect(second.open).toBe(false); expect(first.open).toBe(true);
    expect(first.inert).toBe(false); expect(background.inert).toBe(true);
    first.hide(); await settle(first); expect(background.inert).toBe(false);
    expect(acquirePageScrollLock).toHaveBeenCalledTimes(2);
    expect(releasePageScrollLock).toHaveBeenCalledTimes(2);
  });
  it('preserves blocking when a lower modal is closed first and covers new siblings', async () => {
    const first = await mount(); const second = await mount();
    first.show(); await settle(first); second.show(); await settle(second);
    first.hide(); await settle(first);
    const background = document.createElement('button'); document.body.append(background);
    await settle(second);
    expect(background.inert).toBe(true); expect(second.inert).toBe(false);
    second.remove(); expect(background.inert).toBe(false);
  });
  it('resolves external label IDs and tracks text, IDs and fallback', async () => {
    const label = document.createElement('h2'); label.id = 'external-title'; label.textContent = 'Первый';
    document.body.append(label);
    const modal = await mount('<span slot="title">Внутренний</span>');
    modal.setAttribute('aria-labelledby', label.id); modal.show(); await settle(modal);
    const dialog = modal.shadowRoot!.querySelector('.dialog')!;
    expect(dialog.getAttribute('aria-label')).toBe('Первый');
    label.textContent = 'Новый'; await settle(modal);
    expect(dialog.getAttribute('aria-label')).toBe('Новый');
    label.remove(); await settle(modal);
    expect(dialog.hasAttribute('aria-label')).toBe(false);
    expect(dialog.getAttribute('aria-labelledby')).toBe(modal.shadowRoot!.querySelector('h2')!.id);
    modal.ariaLabel = 'Явный'; await settle(modal);
    expect(dialog.getAttribute('aria-label')).toBe('Явный');
  });
  it('traps focus in rendered slot order including open shadow roots', async () => {
    const modal = await mount('<button slot="actions">Последний</button><div id="control"></div>');
    const nested = modal.querySelector('#control')!.attachShadow({ mode: 'open' });
    nested.innerHTML = '<button autofocus>Внутренний</button>';
    modal.show(); await settle(modal);
    expect(nested.activeElement).toBe(nested.querySelector('button'));
    const last = modal.querySelector('button')!;
    last.focus(); expect(key('Tab').defaultPrevented).toBe(true);
    expect(modal.shadowRoot!.activeElement).toBe(modal.shadowRoot!.querySelector('.close'));
    expect(key('Tab', true).defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(last);
  });
  it('updates actions and retains consumer nodes after reconnecting', async () => {
    const modal = await mount('<span slot="title">Заголовок</span>');
    modal.show(); await settle(modal);
    expect(modal.shadowRoot!.querySelector<HTMLElement>('.actions')!.hidden).toBe(true);
    const action = document.createElement('button'); action.slot = 'actions'; modal.append(action);
    await settle(modal);
    expect(modal.shadowRoot!.querySelector<HTMLElement>('.actions')!.hidden).toBe(false);
    modal.remove(); document.body.append(modal); await settle(modal);
    expect(modal.querySelector('button')).toBe(action);
    action.remove(); await settle(modal);
    expect(modal.shadowRoot!.querySelector<HTMLElement>('.actions')!.hidden).toBe(true);
  });
});
