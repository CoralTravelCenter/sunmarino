import { afterEach, describe, expect, it } from 'vitest';
import { registerSunmarComponents } from '../../registry/register-components';
import type { SunmarTabs } from './sunmar-tabs';

registerSunmarComponents();

describe('SunmarTabs', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('connects the selected tab with its panel', async () => {
    document.body.innerHTML = `
      <sunmar-tabs value="first">
        <sunmar-tab value="first"><button type="button">Первый</button></sunmar-tab>
        <sunmar-tab value="second"><button type="button">Второй</button></sunmar-tab>
        <sunmar-tab-content value="first">Один</sunmar-tab-content>
        <sunmar-tab-content value="second">Два</sunmar-tab-content>
      </sunmar-tabs>
    `;
    const tabs = document.querySelector<SunmarTabs>('sunmar-tabs');
    await tabs?.updateComplete;

    const buttons = tabs?.querySelectorAll('button');
    expect(buttons?.[0].getAttribute('aria-selected')).toBe('true');
    expect(buttons?.[1].getAttribute('aria-selected')).toBe('false');
    expect(tabs?.querySelector('sunmar-tab-content[active]')?.getAttribute('value')).toBe('first');
  });
});
