import { afterEach, describe, expect, it, vi } from 'vitest';
import { registerSunmarComponents } from '../../registry/register-components';
import type { SunmarTabs } from './sunmar-tabs';
registerSunmarComponents();
async function settle(tabs: SunmarTabs) {
  await tabs.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 0));
  await tabs.updateComplete;
}
async function mount() {
  document.body.innerHTML = `<sunmar-tabs aria-label="Разделы" value="first">
    <sunmar-tab value="first"><button type="button">Первый</button></sunmar-tab>
    <sunmar-tab value="second"><button type="button">Второй</button></sunmar-tab>
    <sunmar-tab-content value="first">Один</sunmar-tab-content>
    <sunmar-tab-content value="second">Два</sunmar-tab-content>
  </sunmar-tabs>`;
  const tabs = document.querySelector('sunmar-tabs')!;
  await settle(tabs); return tabs;
}
afterEach(() => document.body.replaceChildren());
describe('SunmarTabs', () => {
  it('normalizes the initial value without scheduling a follow-up update', async () => {
    document.body.innerHTML = `<sunmar-tabs value="missing">
      <sunmar-tab value="first"><button type="button">Первый</button></sunmar-tab>
      <sunmar-tab-content value="first">Один</sunmar-tab-content>
    </sunmar-tabs>`;
    const tabs = document.querySelector('sunmar-tabs')!;

    await expect(tabs.updateComplete).resolves.toBe(true);
    expect(tabs.value).toBe('first');
  });

  it('uses the same duplicate availability rules for clicks, keyboard and fallback', async () => {
    const tabs = await mount();
    const first = tabs.querySelector('sunmar-tab')!;
    tabs.insertAdjacentHTML('beforeend', '<sunmar-tab value="first"><button type="button">Дубль</button></sunmar-tab>');
    first.querySelector('button')!.disabled = true;
    await settle(tabs);
    const buttons = tabs.querySelectorAll('button');
    expect(tabs.value).toBe('second');
    buttons[2].click();
    expect(tabs.value).toBe('second');
    buttons[1].dispatchEvent(new KeyboardEvent('keydown', {
      key: 'ArrowRight', bubbles: true, composed: true, cancelable: true
    }));
    expect(tabs.value).toBe('second');
    expect(document.activeElement).toBe(buttons[1]);
    first.remove();
    await settle(tabs);
    expect(buttons[2].getAttribute('aria-disabled')).toBe('false');
    buttons[2].click();
    expect(tabs.value).toBe('first');
    expect(buttons[2].getAttribute('aria-selected')).toBe('true');
    expect(tabs.querySelectorAll('sunmar-tab-content[active]')).toHaveLength(1);
  });

  it('connects buttons and panels without duplicating a tab host ID', async () => {
    const tabs = await mount();
    const tab = tabs.querySelector('sunmar-tab')!; tab.id = 'consumer-tab';
    const button = tab.querySelector('button')!;
    const panel = tabs.querySelector('sunmar-tab-content')!;
    await settle(tabs);
    expect(button.getAttribute('aria-selected')).toBe('true');
    expect(button.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.getAttribute('aria-labelledby')).toBe(button.id);
    expect(button.id).not.toBe(tab.id);
  });
  it('distributes new pairs and updates selected values through properties', async () => {
    const tabs = await mount();
    const tab = document.createElement('sunmar-tab'); tab.value = 'third';
    tab.innerHTML = '<button type="button">Третий</button>';
    const panel = document.createElement('sunmar-tab-content'); panel.value = 'third';
    tabs.append(tab, panel); tabs.value = 'third'; await settle(tabs);
    expect(tab.slot).toBe('tab'); expect(panel.slot).toBe('panel');
    expect(panel.hasAttribute('active')).toBe(true);
    tab.value = 'renamed'; panel.value = 'renamed'; await settle(tabs);
    tabs.value = 'renamed'; await settle(tabs);
    expect(tab.hasAttribute('selected')).toBe(true);
  });
  it('falls back when the current button is disabled, replaced, or removed', async () => {
    const tabs = await mount();
    const tab = tabs.querySelector('sunmar-tab')!;
    tab.querySelector('button')!.disabled = true; await settle(tabs);
    expect(tabs.value).toBe('second');
    tab.innerHTML = '<button type="button">Новая кнопка</button>'; await settle(tabs);
    tabs.value = 'first'; await settle(tabs); expect(tabs.value).toBe('first');
    tab.remove(); await settle(tabs); expect(tabs.value).toBe('second');
  });
  it('restores owned attributes on removal but preserves consumer edits', async () => {
    const tabs = await mount(); const tab = tabs.querySelector('sunmar-tab')!;
    const button = tab.querySelector('button')!;
    button.setAttribute('aria-controls', 'consumer-change');
    tab.remove(); await settle(tabs);
    expect(tab.hasAttribute('slot')).toBe(false);
    expect(tab.hasAttribute('selected')).toBe(false);
    expect(button.hasAttribute('role')).toBe(false);
    expect(button.hasAttribute('id')).toBe(false);
    expect(button.getAttribute('aria-controls')).toBe('consumer-change');
  });
  it('restores original attributes and reconnects without replacing content', async () => {
    const tabs = document.createElement('sunmar-tabs');
    tabs.innerHTML = '<sunmar-tab value="one" slot="original"><button type="button" role="button" tabindex="3" id="custom">Один</button></sunmar-tab><sunmar-tab-content value="one" role="region">Текст</sunmar-tab-content>';
    document.body.append(tabs); await settle(tabs);
    const tab = tabs.querySelector('sunmar-tab')!; const button = tab.querySelector('button')!;
    tabs.remove();
    expect(tab.slot).toBe('original'); expect(button.getAttribute('role')).toBe('button');
    expect(button.tabIndex).toBe(3); expect(button.id).toBe('custom');
    document.body.append(tabs); await settle(tabs);
    expect(button.getAttribute('role')).toBe('tab'); expect(tab.slot).toBe('tab');
    expect(tab.querySelector('button')).toBe(button);
  });
  it('keeps IDs unique when prepending and reordering pairs', async () => {
    const tabs = await mount(); const existingId = tabs.querySelector('button')!.id;
    tabs.insertAdjacentHTML('afterbegin', '<sunmar-tab value="new"><button type="button">Новый</button></sunmar-tab><sunmar-tab-content value="new">Новый</sunmar-tab-content>');
    await settle(tabs);
    const ids = Array.from(tabs.querySelectorAll('[id]'), (element) => element.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(tabs.querySelectorAll('button')[1].id).toBe(existingId);
  });
  it('emits only user changes after ARIA has synchronized and handles keyboard', async () => {
    const tabs = await mount(); const events = vi.fn((event: Event) => {
      expect(tabs.querySelector('sunmar-tab[selected]')?.getAttribute('value')).toBe((event as CustomEvent).detail.value);
    });
    tabs.addEventListener('sunmar-tabs-change', events);
    const buttons = tabs.querySelectorAll('button');
    buttons[1].click(); await settle(tabs);
    expect(events).toHaveBeenCalledOnce();
    expect(events.mock.calls[0][0]).toMatchObject({ bubbles: true, composed: true, detail: { value: 'second', previousValue: 'first' } });
    buttons[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true, composed: true, cancelable: true }));
    await settle(tabs); expect(tabs.value).toBe('first'); expect(document.activeElement).toBe(buttons[0]);
    tabs.value = 'second'; await settle(tabs); expect(events).toHaveBeenCalledTimes(2);
  });
  it('ignores nested tabs events in the outer group', async () => {
    const tabs = await mount();
    const panel = tabs.querySelector('sunmar-tab-content')!;
    panel.innerHTML = '<sunmar-tabs><sunmar-tab value="first"><button type="button">A</button></sunmar-tab><sunmar-tab value="second"><button type="button">B</button></sunmar-tab><sunmar-tab-content value="first">A</sunmar-tab-content><sunmar-tab-content value="second">B</sunmar-tab-content></sunmar-tabs>';
    const nested = panel.querySelector('sunmar-tabs')!; await settle(nested);
    nested.querySelectorAll('button')[1].click(); await settle(nested);
    expect(nested.value).toBe('second'); expect(tabs.value).toBe('first');
  });
  it('normalizes removal of the selected value attribute', async () => {
    const tabs = await mount(); tabs.value = 'second'; await settle(tabs);
    tabs.removeAttribute('value'); await settle(tabs);
    expect(tabs.value).toBe('first');
    expect(tabs.querySelector('button')!.getAttribute('aria-selected')).toBe('true');
  });
  it('applies forced selection when initially empty content arrives only once', async () => {
    const tabs = document.createElement('sunmar-tabs'); document.body.append(tabs); await settle(tabs);
    tabs.innerHTML = '<sunmar-tab value="a"><button type="button">A</button></sunmar-tab><sunmar-tab value="b" forced><button type="button">B</button></sunmar-tab><sunmar-tab-content value="a">A</sunmar-tab-content><sunmar-tab-content value="b">B</sunmar-tab-content>';
    await settle(tabs); expect(tabs.value).toBe('b');
    tabs.value = 'a'; await settle(tabs); expect(tabs.value).toBe('a');
    tabs.remove(); document.body.append(tabs); await settle(tabs); expect(tabs.value).toBe('a');
  });
  it('skips disabled buttons and wraps keyboard selection', async () => {
    const tabs = await mount();
    tabs.insertAdjacentHTML('beforeend', '<sunmar-tab value="third"><button type="button">Третий</button></sunmar-tab><sunmar-tab-content value="third">Три</sunmar-tab-content>');
    tabs.querySelectorAll('button')[1].disabled = true; await settle(tabs);
    const buttons = tabs.querySelectorAll('button');
    buttons[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, composed: true }));
    await settle(tabs); expect(tabs.value).toBe('third');
    buttons[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, composed: true }));
    await settle(tabs); expect(tabs.value).toBe('first');
  });
  it('handles duplicates, unmatched and empty pairs with one active panel at most', async () => {
    const tabs = await mount();
    tabs.insertAdjacentHTML('beforeend', '<sunmar-tab value="first"><button type="button">Дубль</button></sunmar-tab><sunmar-tab-content value="first">Дубль</sunmar-tab-content><sunmar-tab-content>Пустой</sunmar-tab-content>');
    await settle(tabs);
    expect(tabs.querySelectorAll('sunmar-tab-content[active]')).toHaveLength(1);
    expect(tabs.querySelectorAll('button')[2].getAttribute('aria-disabled')).toBe('true');
    tabs.querySelectorAll('button').forEach((button) => button.disabled = true); await settle(tabs);
    expect(tabs.value).toBe(''); expect(tabs.querySelectorAll('sunmar-tab-content[active]')).toHaveLength(0);
  });
});
