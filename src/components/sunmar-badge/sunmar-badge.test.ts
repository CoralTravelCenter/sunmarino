import { afterEach, describe, expect, it } from 'vitest';
import type { Instance } from 'tippy.js';
import { registerSunmarComponents } from '../../registry/register-components';
import type { SunmarBadge } from './sunmar-badge';

registerSunmarComponents();

describe('sunmar-badge', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('renders the information button from the info-button attribute', async () => {
    const badge = document.createElement('sunmar-badge') as SunmarBadge;
    badge.setAttribute('info-button', '');
    document.body.append(badge);

    await badge.updateComplete;

    expect(badge.infoButton).toBe(true);
    expect(badge.shadowRoot?.querySelector('#sunmar-shild-info-button')).not.toBeNull();
    expect(badge.shadowRoot?.querySelector('#sunmar-shild-info-button svg')).not.toBeNull();
  });

  it('uses custom tooltip content from the tooltip template', async () => {
    const badge = document.createElement('sunmar-badge') as SunmarBadge;
    badge.setAttribute('info-button', '');
    badge.innerHTML = '<template slot="tooltip"><strong data-tooltip-title>Свои условия</strong></template>';
    document.body.append(badge);

    await badge.updateComplete;

    const button = badge.shadowRoot?.querySelector<HTMLElement>('#sunmar-shild-info-button') as
      | (HTMLElement & { _tippy?: Instance })
      | null;
    const content = button?._tippy?.props.content;

    expect(content).toBeInstanceOf(HTMLElement);
    expect((content as HTMLElement).classList.contains('sunmar-tooltip-content')).toBe(true);
    expect((content as HTMLElement).querySelector('[data-tooltip-title]')?.textContent).toBe('Свои условия');
  });
});
