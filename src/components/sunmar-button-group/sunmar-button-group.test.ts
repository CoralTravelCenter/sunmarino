import { afterEach, describe, expect, it } from 'vitest';
import { registerSunmarComponents } from '../../registry/register-components';
import { SunmarButton } from '../sunmar-button/sunmar-button';
import type { SunmarButtonSize } from '../sunmar-button/button-settings';
import { SunmarButtonGroup } from './sunmar-button-group';

registerSunmarComponents();

async function settle(group: SunmarButtonGroup, ...buttons: SunmarButton[]): Promise<void> {
  await group.updateComplete;
  await Promise.all(buttons.map((button) => button.updateComplete));
}

function mount() {
  const group = document.createElement('sunmar-button-group');
  const button = document.createElement('sunmar-button');
  group.append(button);
  document.body.append(group);
  return { group, button };
}

function expectResolved(button: SunmarButton, type: string, size: string): void {
  expect(button.type).toBe(type);
  expect(button.size).toBe(size);
  expect(button.getAttribute('data-resolved-type')).toBe(type);
  expect(button.getAttribute('data-resolved-size')).toBe(size);
}

describe('SunmarButtonGroup settings', () => {
  afterEach(() => document.body.replaceChildren());

  it.each([SunmarButton, SunmarButtonGroup])('preserves properties assigned before registration of %s', async (Component) => {
    const tag = `test-late-${Component.name.toLowerCase()}`;
    const element = document.createElement(tag) as SunmarButton | SunmarButtonGroup;
    element.type = 'secondary';
    element.size = 'large';
    document.body.append(element);
    const Base: CustomElementConstructor = Component;
    customElements.define(tag, class extends Base {});
    await element.updateComplete;
    expect(element.type).toBe('secondary');
    expect(element.size).toBe('large');
    expect(element.getAttribute('type')).toBe('secondary');
    expect(element.getAttribute('size')).toBe('large');
    element.removeAttribute('type');
    element.removeAttribute('size');
    await element.updateComplete;
    expect(element.type).toBe('primary');
    expect(element.size).toBe('medium');
  });

  it('keeps resolved getters and normalization synchronous', () => {
    const { group, button } = mount();
    group.type = 'secondary';
    group.size = 'large';
    expect(button.type).toBe('secondary');
    expect(button.size).toBe('large');
    button.setAttribute('type', 'invalid');
    expect(button.type).toBe('primary');
    expect(button.getAttribute('type')).toBe('primary');
    button.removeAttribute('type');
    expect(button.type).toBe('secondary');
  });

  it('uses defaults without writing explicit settings onto the group or button', async () => {
    const { group, button } = mount();
    await settle(group, button);
    expectResolved(button, 'primary', 'medium');
    for (const element of [group, button]) {
      expect(element.hasAttribute('type')).toBe(false);
      expect(element.hasAttribute('size')).toBe(false);
    }
  });

  it('inherits runtime changes through attributes and JS properties', async () => {
    const { group, button } = mount();
    await settle(group, button);
    group.setAttribute('type', 'secondary');
    group.setAttribute('size', 'large');
    await settle(group, button);
    expectResolved(button, 'secondary', 'large');
    group.type = 'neutral';
    group.size = 'small';
    await settle(group, button);
    expectResolved(button, 'neutral', 'small');
    expect(button.hasAttribute('type')).toBe(false);
    expect(button.hasAttribute('size')).toBe(false);
  });

  it('resolves explicit type and size independently and resumes inheritance after removal', async () => {
    const { group, button } = mount();
    group.type = 'secondary';
    group.size = 'large';
    button.type = 'primary';
    await settle(group, button);
    expectResolved(button, 'primary', 'large');
    button.size = 'small';
    group.type = 'neutral';
    group.size = 'medium';
    await settle(group, button);
    expectResolved(button, 'primary', 'small');
    button.removeAttribute('type');
    await settle(group, button);
    expectResolved(button, 'neutral', 'small');
    button.removeAttribute('size');
    await settle(group, button);
    expectResolved(button, 'neutral', 'medium');
  });

  it('normalizes invalid explicit settings instead of inheriting them', async () => {
    const { group, button } = mount();
    group.type = 'secondary';
    group.size = 'large';
    button.setAttribute('type', 'unknown');
    button.setAttribute('size', 'unknown');
    await settle(group, button);
    expectResolved(button, 'primary', 'medium');
    expect(button.getAttribute('type')).toBe('primary');
    expect(button.getAttribute('size')).toBe('medium');
  });

  it('falls back when group settings are invalid or removed', async () => {
    const { group, button } = mount();
    group.type = 'secondary';
    group.size = 'large';
    await settle(group, button);
    group.setAttribute('type', 'unknown');
    group.setAttribute('size', 'unknown');
    await settle(group, button);
    expectResolved(button, 'primary', 'medium');
    expect(group.getAttribute('type')).toBe('primary');
    expect(group.getAttribute('size')).toBe('medium');
    group.type = 'neutral';
    group.size = 'small';
    await settle(group, button);
    group.removeAttribute('type');
    group.removeAttribute('size');
    await settle(group, button);
    expectResolved(button, 'primary', 'medium');
  });

  it('recalculates settings on insertion, movement between groups and removal from a group', async () => {
    const { group, button } = mount();
    group.type = 'secondary';
    group.size = 'large';
    await settle(group, button);
    const other = document.createElement('sunmar-button-group');
    other.type = 'neutral';
    other.size = 'small';
    document.body.append(other);
    await other.updateComplete;
    other.append(button);
    await settle(other, button);
    expectResolved(button, 'neutral', 'small');
    group.type = 'primary';
    await settle(group, button);
    expectResolved(button, 'neutral', 'small');
    document.body.append(button);
    await button.updateComplete;
    expectResolved(button, 'primary', 'medium');
    group.append(button);
    await settle(group, button);
    expectResolved(button, 'primary', 'large');
  });

  it('preserves explicit settings when moved and when the whole group reconnects', async () => {
    const { group, button } = mount();
    group.type = 'secondary';
    group.size = 'large';
    button.type = 'neutral';
    await settle(group, button);
    group.remove();
    document.body.append(group);
    await settle(group, button);
    expectResolved(button, 'neutral', 'large');
    document.body.append(button);
    await button.updateComplete;
    expectResolved(button, 'neutral', 'medium');
  });

  it('does not apply settings through wrappers or nested groups', async () => {
    const { group } = mount();
    group.type = 'secondary';
    group.size = 'large';
    const wrapper = document.createElement('div');
    const wrapped = document.createElement('sunmar-button');
    wrapper.append(wrapped);
    const nested = document.createElement('sunmar-button-group');
    const inner = document.createElement('sunmar-button');
    nested.append(inner);
    group.append(wrapper, nested);
    await settle(group, wrapped);
    await settle(nested, inner);
    expectResolved(wrapped, 'primary', 'medium');
    expectResolved(inner, 'primary', 'medium');
  });

  it.each(['small', 'medium', 'large'] as const)('supports standalone size %s', async (size) => {
    const button = document.createElement('sunmar-button');
    document.body.append(button);
    button.size = size;
    await button.updateComplete;
    expectResolved(button, 'primary', size);
    expect(button.getAttribute('size')).toBe(size);
    button.removeAttribute('size');
    await button.updateComplete;
    expectResolved(button, 'primary', 'medium');
    expect(button.hasAttribute('size')).toBe(false);
    button.setAttribute('size', size);
    await button.updateComplete;
    expectResolved(button, 'primary', size);
  });

  it.each(['', 'LARGE', ' small ', null, undefined, 42])('normalizes invalid JS size %j', async (size) => {
    const { group, button } = mount();
    group.size = size as SunmarButtonSize;
    button.size = size as SunmarButtonSize;
    await settle(group, button);
    expectResolved(button, 'primary', 'medium');
    expect(group.getAttribute('size')).toBe('medium');
    expect(button.getAttribute('size')).toBe('medium');
  });
});
