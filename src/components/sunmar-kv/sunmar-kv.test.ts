import { afterEach, describe, expect, it, vi } from 'vitest';
import { registerSunmarComponents } from '../../registry/register-components';
import type { SunmarKv } from './sunmar-kv';

registerSunmarComponents();

function mount(): SunmarKv {
  const kv = document.createElement('sunmar-kv');
  kv.innerHTML = '<sunmar-image slot="image" src="/banner.jpg" alt="Море"></sunmar-image><h1 slot="title">Отдых у моря</h1>';
  document.body.append(kv);
  return kv;
}

function assigned(kv: SunmarKv, name: string): Element[] {
  return kv.shadowRoot!.querySelector<HTMLSlotElement>(`slot[name="${name}"]`)!.assignedElements();
}

describe('SunmarKv content contract', () => {
  afterEach(() => document.body.replaceChildren());

  it('reflects the full-width attribute and property', async () => {
    const kv = mount();
    await kv.updateComplete;

    expect(kv.fullWidth).toBe(false);
    expect(kv.hasAttribute('full-width')).toBe(false);

    kv.fullWidth = true;
    await kv.updateComplete;
    expect(kv.getAttribute('full-width')).toBe('');

    kv.removeAttribute('full-width');
    await kv.updateComplete;
    expect(kv.fullWidth).toBe(false);

    kv.setAttribute('full-width', 'false');
    await kv.updateComplete;
    expect(kv.fullWidth).toBe(true);
  });

  it('projects image and semantic title without rewriting consumer markup', async () => {
    const kv = mount();
    const nodes = Array.from(kv.children);
    const markup = kv.innerHTML;
    await kv.updateComplete;
    expect(kv.shadowRoot?.querySelector('section')?.getAttribute('part')).toBe('root');
    expect(assigned(kv, 'image')).toEqual([nodes[0]]);
    expect(assigned(kv, 'title')).toEqual([nodes[1]]);
    expect(kv.innerHTML).toBe(markup);
    expect(nodes[1].localName).toBe('h1');
  });

  it('accepts missing optional slots without generating placeholder content', async () => {
    const kv = mount();
    await kv.updateComplete;
    for (const name of ['eyebrow', 'text', 'actions']) {
      expect(assigned(kv, name)).toEqual([]);
      expect(kv.shadowRoot?.querySelector(`slot[name="${name}"]`)?.textContent).toBe('');
    }
    expect(kv.shadowRoot?.querySelector('button, a')).toBeNull();
  });

  it('supports dynamic insertion, replacement and removal of optional content', async () => {
    const kv = mount();
    await kv.updateComplete;
    for (const name of ['eyebrow', 'text', 'actions']) {
      const content = document.createElement('p');
      content.slot = name;
      content.textContent = 'Содержимое';
      kv.append(content);
      expect(assigned(kv, name)).toEqual([content]);
      const replacement = document.createElement('div');
      replacement.slot = name;
      content.replaceWith(replacement);
      expect(assigned(kv, name)).toEqual([replacement]);
      replacement.remove();
      expect(assigned(kv, name)).toEqual([]);
    }
  });

  it('preserves a button group and native listeners after reconnection', async () => {
    const kv = mount();
    const group = document.createElement('sunmar-button-group');
    group.slot = 'actions';
    group.type = 'secondary';
    const button = document.createElement('sunmar-button');
    const native = document.createElement('button');
    native.type = 'button';
    native.textContent = 'Подобрать тур';
    const onClick = vi.fn();
    native.addEventListener('click', onClick);
    button.append(native);
    group.append(button);
    kv.append(group);
    await kv.updateComplete;
    await group.updateComplete;
    await button.updateComplete;
    kv.remove();
    document.body.append(kv);
    await kv.updateComplete;
    await button.updateComplete;
    expect(assigned(kv, 'actions')).toEqual([group]);
    expect(group.firstElementChild).toBe(button);
    expect(button.firstElementChild).toBe(native);
    expect(button.type).toBe('secondary');
    native.click();
    expect(onClick).toHaveBeenCalledOnce();
  });
});
