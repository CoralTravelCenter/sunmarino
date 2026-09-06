import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('./embla-loader', () => ({
  loadEmbla: vi.fn(() => new Promise(() => undefined))
}));

import { registerSunmarComponents } from '../../registry/register-components';
import type { SunmarSlider } from './sunmar-slider';

registerSunmarComponents();

describe('SunmarSlider', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('keeps an accessible native-scroll fallback while Embla is loading', async () => {
    document.body.innerHTML = `
      <sunmar-slider aria-label="Предложения">
        <sunmar-slide>Первый</sunmar-slide>
        <sunmar-slide>Второй</sunmar-slide>
      </sunmar-slider>
    `;
    const slider = document.querySelector<SunmarSlider>('sunmar-slider');
    await slider?.updateComplete;

    expect(slider?.getAttribute('role')).toBe('region');
    expect(slider?.getAttribute('aria-roledescription')).toBe('carousel');
    expect(slider?.hasAttribute('embla-ready')).toBe(false);
    expect(slider?.shadowRoot?.querySelectorAll<HTMLButtonElement>('.navigation button')[0].disabled)
      .toBe(true);
    expect(slider?.shadowRoot?.querySelectorAll<HTMLButtonElement>('.navigation button')[1].disabled)
      .toBe(true);
  });
});
