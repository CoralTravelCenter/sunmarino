import { afterEach, describe, expect, it } from 'vitest';
import { registerSunmarComponents } from '../../registry/register-components';
import type { SunmarStickyNav } from './sunmar-sticky-nav';

registerSunmarComponents();

describe('SunmarStickyNav', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('ignores a malformed encoded section hash', async () => {
    const navigation = document.createElement('sunmar-sticky-nav') as SunmarStickyNav;
    navigation.disableRelocate = true;
    navigation.innerHTML = '<a slot="nav-link" href="#%ZZ">Раздел</a>';

    document.body.append(navigation);

    await expect(navigation.updateComplete).resolves.toBe(true);
    expect(navigation.querySelector('a')?.classList.contains('active')).toBe(false);
  });
});
