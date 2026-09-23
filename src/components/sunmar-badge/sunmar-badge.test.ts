import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Instance } from 'tippy.js';
import { registerSunmarComponents } from '../../registry/register-components';
import type { SunmarBadge } from './sunmar-badge';

registerSunmarComponents();

describe('sunmar-badge', () => {
  afterEach(() => {
    document.body.replaceChildren();
    delete window.dataLayer;
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

  it('renders arbitrary markup in the default slot', async () => {
    const badge = document.createElement('sunmar-badge') as SunmarBadge;
    badge.innerHTML = '<strong data-badge-content>Любое содержимое</strong>';
    document.body.append(badge);

    await badge.updateComplete;

    const slot = badge.shadowRoot?.querySelector<HTMLSlotElement>('.sunmar-shild--text slot');
    expect(slot?.assignedElements()).toEqual([badge.querySelector('[data-badge-content]')]);
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

  it('attaches itself with the existing hotel and container logic', async () => {
    window.dataLayer = [
      {
        event: 'view_item',
        ecommerce: {
          items: [{ item_id: '9436' }]
        }
      }
    ];

    const source = document.createElement('div');
    const container = document.createElement('div');
    container.className = 'PhotoGalleryMainCarousel_mainSwiperContainer__example';

    const badge = document.createElement('sunmar-badge') as SunmarBadge;
    badge.setAttribute('hotel-ids', '2009, 9436, 47358');
    source.append(badge);
    document.body.append(source);

    await Promise.resolve();
    document.body.append(container);

    await vi.waitFor(() => {
      expect(container.firstElementChild).toBe(badge);
    });

    expect(badge.hidden).toBe(false);
    expect(container.dataset.CoralShildRakInject).toBe('true');
  });
});
