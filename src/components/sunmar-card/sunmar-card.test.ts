import { afterEach, describe, expect, it, vi } from 'vitest';
import { registerSunmarComponents } from '../../registry/register-components';
import type { SunmarCard } from './sunmar-card';

registerSunmarComponents();

function mount(): SunmarCard {
  const card = document.createElement('sunmar-card');
  card.innerHTML = `
    <sunmar-image slot="media" src="/coast.jpg" alt="Побережье"></sunmar-image>
    <h3 slot="title">Турция</h3>
    <p slot="text">Отдых у моря.</p>
  `;
  document.body.append(card);
  return card;
}

function actions(card: SunmarCard): HTMLElement {
  return card.shadowRoot!.querySelector<HTMLElement>('[part="actions"]')!;
}

async function expectActionsHidden(card: SunmarCard, hidden: boolean): Promise<void> {
  await card.updateComplete;
  // Observe native slotchange and the resulting Lit update without dispatching
  // artificial events or calling the component's private handler.
  await vi.waitFor(() => expect(actions(card).hidden).toBe(hidden));
}

describe('SunmarCard content contract', () => {
  afterEach(() => document.body.replaceChildren());

  it('projects the required slots without changing their elements or heading level', async () => {
    const card = mount();
    const children = Array.from(card.children);
    const markup = card.innerHTML;
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector('article')?.getAttribute('part')).toBe('root');
    for (const name of ['media', 'title', 'text']) {
      const slot = card.shadowRoot?.querySelector<HTMLSlotElement>(`slot[name="${name}"]`);
      expect(slot?.assignedElements()).toEqual([card.querySelector(`[slot="${name}"]`)]);
    }
    expect(Array.from(card.children)).toEqual(children);
    expect(card.innerHTML).toBe(markup);
    expect(card.querySelector('[slot="title"]')?.localName).toBe('h3');
    await expectActionsHidden(card, true);
  });

  it('shows and hides actions as elements are added and removed', async () => {
    const card = mount();
    await expectActionsHidden(card, true);
    const first = document.createElement('button');
    first.slot = 'actions';
    first.textContent = 'Подробнее';
    card.append(first);
    await expectActionsHidden(card, false);
    const second = document.createElement('a');
    second.slot = 'actions';
    second.href = '#offers';
    card.append(second);
    first.remove();
    await expectActionsHidden(card, false);
    second.remove();
    await expectActionsHidden(card, true);
  });

  it('shows an actions group provided before the card connects', async () => {
    const card = document.createElement('sunmar-card');
    card.innerHTML = '<sunmar-button-group slot="actions"><sunmar-button><button type="button">Подробнее</button></sunmar-button></sunmar-button-group>';
    document.body.append(card);
    await expectActionsHidden(card, false);
  });

  it('tracks reassignment of the actions slot', async () => {
    const card = mount();
    const action = document.createElement('button');
    card.append(action);
    await expectActionsHidden(card, true);
    action.slot = 'actions';
    await expectActionsHidden(card, false);
    action.removeAttribute('slot');
    await expectActionsHidden(card, true);
  });

  it('treats an assigned empty group as content, not as an absent slot', async () => {
    const card = mount();
    await expectActionsHidden(card, true);
    const group = document.createElement('sunmar-button-group');
    group.slot = 'actions';
    card.append(group);
    await expectActionsHidden(card, false);
    group.remove();
    await expectActionsHidden(card, true);
  });

  it('preserves actions and their listeners through content replacement and reconnection', async () => {
    const card = mount();
    await expectActionsHidden(card, true);
    const group = document.createElement('sunmar-button-group');
    group.slot = 'actions';
    const action = document.createElement('button');
    action.type = 'button';
    action.textContent = 'Подобрать тур';
    const onClick = vi.fn();
    action.addEventListener('click', onClick);
    group.append(action);
    card.append(group);
    await expectActionsHidden(card, false);
    const title = document.createElement('h2');
    title.slot = 'title';
    title.textContent = 'Новое направление';
    card.querySelector('[slot="title"]')!.replaceWith(title);
    card.remove();
    document.body.append(card);
    await expectActionsHidden(card, false);
    expect(card.querySelector('[slot="title"]')).toBe(title);
    expect(card.querySelector('[slot="actions"]')).toBe(group);
    expect(group.firstElementChild).toBe(action);
    action.click();
    expect(onClick).toHaveBeenCalledOnce();
    group.remove();
    await expectActionsHidden(card, true);
  });
});
