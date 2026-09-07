import { afterEach, describe, expect, it } from 'vitest';
import { registerSunmarComponents } from '../../registry/register-components';

registerSunmarComponents();

describe('SunmarCardsGrid', () => {
  afterEach(() => document.body.replaceChildren());

  it('projects cards without changing consumer markup', async () => {
    const grid = document.createElement('sunmar-cards-grid');
    grid.setAttribute('layout', '1/2/3/1');
    grid.innerHTML = '<sunmar-card></sunmar-card><sunmar-card></sunmar-card>';
    const cards = Array.from(grid.children);
    document.body.append(grid);
    await grid.updateComplete;

    expect(grid.getAttribute('layout')).toBe('1/2/3/1');
    const root = grid.shadowRoot?.querySelector<HTMLElement>('[part="grid"]');
    expect(root?.style.getPropertyValue('--sunmar-cards-grid-columns')).toBe('1');
    expect(root?.style.getPropertyValue('--sunmar-cards-grid-columns-768')).toBe('2');
    expect(root?.style.getPropertyValue('--sunmar-cards-grid-columns-1024')).toBe('3');
    expect(root?.style.getPropertyValue('--sunmar-cards-grid-columns-1280')).toBe('1');
    expect(grid.shadowRoot?.querySelector('slot')?.assignedElements()).toEqual(cards);
    expect(Array.from(grid.children)).toEqual(cards);
  });

  it('inherits the last column count for omitted breakpoints', async () => {
    const grid = document.createElement('sunmar-cards-grid');
    grid.layout = '1/2/3';
    document.body.append(grid);
    await grid.updateComplete;

    const root = grid.shadowRoot!.querySelector<HTMLElement>('[part="grid"]')!;
    expect(root.style.getPropertyValue('--sunmar-cards-grid-columns-1280')).toBe('3');
  });
});
