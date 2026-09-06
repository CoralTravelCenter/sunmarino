import { afterEach, describe, expect, it, vi } from 'vitest';
import { registerSunmarComponents } from '../../registry/register-components';
import type { SunmarButton, SunmarButtonType } from './sunmar-button';

registerSunmarComponents();

// Lit resolves false when updated() schedules another update. Bound the wait
// so a normalization loop fails the test instead of waiting indefinitely.
async function settle(button: SunmarButton): Promise<void> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    if (await button.updateComplete) return;
  }
  throw new Error('sunmar-button did not finish updating');
}

function mount(): SunmarButton {
  const button = document.createElement('sunmar-button');
  document.body.append(button);
  return button;
}

describe('SunmarButton public contract', () => {
  afterEach(() => document.body.replaceChildren());

  it('defaults to primary and accepts an empty slot without creating a control', async () => {
    const button = mount();
    await settle(button);

    expect(button.type).toBe('primary');
    expect(button.hasAttribute('type')).toBe(false);
    expect(button.getAttribute('data-resolved-type')).toBe('primary');
    expect(button.shadowRoot?.querySelector('slot')?.assignedElements()).toEqual([]);
    expect(button.shadowRoot?.querySelector('button, a')).toBeNull();
    expect(button.hasAttribute('role')).toBe(false);
    expect(button.hasAttribute('tabindex')).toBe(false);
  });

  it.each(['primary', 'secondary', 'neutral'] as const)(
    'accepts %s through HTML and JavaScript after connection', async (type) => {
      const button = mount();
      button.type = 'neutral';
      await settle(button);
      button.setAttribute('type', type);
      await settle(button);
      expect(button.type).toBe(type);

      button.type = 'secondary';
      await settle(button);
      button.type = type;
      await settle(button);
      expect(button.type).toBe(type);
      expect(button.getAttribute('type')).toBe(type);
    }
  );

  it.each(['', 'unknown', 'PRIMARY', ' primary '])(
    'falls back to primary for the HTML value %j', async (value) => {
      const button = mount();
      button.type = 'secondary';
      await settle(button);
      button.setAttribute('type', value);
      await settle(button);
      expect(button.type).toBe('primary');
      expect(button.getAttribute('type')).toBe('primary');
      expect(button.getAttribute('data-resolved-type')).toBe('primary');
    }
  );

  it.each(['', 'unknown', 'PRIMARY', ' primary ', null, undefined, 42])(
    'falls back to primary for the JavaScript value %j', async (value) => {
      const button = mount();
      button.type = 'neutral';
      await settle(button);
      // Exercise untyped consumers of the published JavaScript bundle.
      button.type = value as SunmarButtonType;
      await settle(button);
      expect(button.type).toBe('primary');
      expect(button.getAttribute('type')).toBe('primary');
      expect(button.getAttribute('data-resolved-type')).toBe('primary');
    }
  );

  it('returns to primary when type is removed', async () => {
    const button = mount();
    button.type = 'secondary';
    await settle(button);
    button.removeAttribute('type');
    await settle(button);
    expect(button.type).toBe('primary');
    expect(button.hasAttribute('type')).toBe(false);
    expect(button.getAttribute('data-resolved-type')).toBe('primary');
  });

  it('repairs invalid or removed attributes even when the property is already primary', async () => {
    const button = mount();
    await settle(button);
    for (const value of ['unknown', 'PRIMARY', '', null]) {
      if (value === null) button.removeAttribute('type');
      else button.setAttribute('type', value);
      await settle(button);
      expect(button.type).toBe('primary');
      expect(button.getAttribute('type')).toBe(value === null ? null : 'primary');
      expect(button.getAttribute('data-resolved-type')).toBe('primary');
    }
  });

  it('normalizes an invalid attribute supplied before connection', async () => {
    const button = document.createElement('sunmar-button');
    button.setAttribute('type', 'unknown');
    document.body.append(button);
    await settle(button);
    expect(button.type).toBe('primary');
    expect(button.getAttribute('type')).toBe('primary');
  });

  it('preserves the native control, form attributes and listeners across updates and reconnection', async () => {
    const button = mount();
    const native = document.createElement('button');
    native.type = 'submit';
    native.setAttribute('form', 'booking');
    native.name = 'action';
    native.value = 'search';
    native.setAttribute('aria-label', 'Найти тур');
    native.textContent = 'Поиск';
    const onClick = vi.fn();
    native.addEventListener('click', onClick);
    button.append(native);
    const originalMarkup = native.outerHTML;
    await settle(button);
    button.type = 'secondary';
    await settle(button);
    button.remove();
    document.body.append(button);
    await settle(button);

    expect(button.firstElementChild).toBe(native);
    expect(native.outerHTML).toBe(originalMarkup);
    expect(button.shadowRoot?.querySelector('slot')?.assignedElements()).toEqual([native]);
    native.click();
    expect(onClick).toHaveBeenCalledOnce();
    native.disabled = true;
    native.click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('accepts replacement slot content without changing link attributes or listeners', async () => {
    const button = mount();
    button.append(document.createElement('button'));
    await settle(button);
    const link = document.createElement('a');
    link.setAttribute('href', '#offers');
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Предложения';
    const onClick = vi.fn((event: Event) => event.preventDefault());
    link.addEventListener('click', onClick);
    const originalMarkup = link.outerHTML;
    button.replaceChildren(link);
    button.type = 'neutral';
    await settle(button);

    expect(button.shadowRoot?.querySelector('slot')?.assignedElements()).toEqual([link]);
    expect(link.outerHTML).toBe(originalMarkup);
    link.click();
    expect(onClick).toHaveBeenCalledOnce();
  });
});
