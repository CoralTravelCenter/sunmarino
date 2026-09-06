import { afterEach, describe, expect, it } from 'vitest';
import { registerSunmarComponents } from '../../registry/register-components';
import type { SunmarAccordion } from './sunmar-accordion';
import type { SunmarAccordionItem } from '../sunmar-accordion-item/sunmar-accordion-item';

registerSunmarComponents();

async function settle(group: SunmarAccordion) {
  await group.updateComplete;
  await Promise.all(Array.from(group.querySelectorAll('sunmar-accordion-item'), (item) => item.updateComplete));
  await new Promise((resolve) => setTimeout(resolve, 10));
  await group.updateComplete;
  await Promise.all(Array.from(group.querySelectorAll('sunmar-accordion-item'), (item) => item.updateComplete));
}

async function mount(attributes = '') {
  document.body.innerHTML = `<sunmar-accordion ${attributes}>
    <sunmar-accordion-item open><span slot="header">Первый вопрос</span><p>Первый ответ</p></sunmar-accordion-item>
    <sunmar-accordion-item><span slot="header">Второй вопрос</span><p>Второй ответ</p></sunmar-accordion-item>
  </sunmar-accordion>`;
  const group = document.querySelector('sunmar-accordion')!;
  await settle(group);
  return group;
}

const items = (group: SunmarAccordion) => Array.from(group.children) as SunmarAccordionItem[];
const details = (item: SunmarAccordionItem) => item.shadowRoot!.querySelector('details')!;
const faq = () => {
  const script = document.querySelector('script[type="application/ld+json"]');
  return script ? JSON.parse(script.textContent!) : null;
};

afterEach(() => document.body.replaceChildren());

describe('SunmarAccordion', () => {
  it('keeps multiple items open by default and normalizes invalid mode', async () => {
    const group = await mount('mode="invalid"');
    const [first, second] = items(group);
    second.open = true;
    await settle(group);
    expect(group.mode).toBe('multiple');
    expect([first.open, second.open]).toEqual([true, true]);
  });

  it('coordinates programmatic changes in single mode', async () => {
    const group = await mount('mode="single"');
    const [first, second] = items(group);
    second.open = true;
    await settle(group);
    expect([first.open, second.open]).toEqual([false, true]);
    expect(details(first).open).toBe(false);
    second.removeAttribute('open');
    await settle(group);
    expect(second.open).toBe(false);
  });

  it('coordinates native toggle events and permits closing all items', async () => {
    const group = await mount('mode="single"');
    const [first, second] = items(group);
    details(second).open = true;
    details(second).dispatchEvent(new Event('toggle'));
    await settle(group);
    expect([first.open, second.open]).toEqual([false, true]);
    details(second).open = false;
    details(second).dispatchEvent(new Event('toggle'));
    await settle(group);
    expect(items(group).every((item) => !item.open)).toBe(true);
  });

  it('normalizes existing and added open items when single mode applies', async () => {
    const group = await mount();
    const [first, second] = items(group);
    second.open = true;
    await settle(group);
    group.mode = 'single';
    await settle(group);
    expect([first.open, second.open]).toEqual([true, false]);
    const added = document.createElement('sunmar-accordion-item');
    added.open = true;
    group.append(added);
    await settle(group);
    expect(items(group).filter((item) => item.open)).toHaveLength(1);
  });

  it('keeps the first initially open item in single mode', async () => {
    document.body.innerHTML = `<sunmar-accordion mode="single">
      <sunmar-accordion-item open>Первый</sunmar-accordion-item>
      <sunmar-accordion-item open>Второй</sunmar-accordion-item>
    </sunmar-accordion>`;
    const group = document.querySelector('sunmar-accordion')!;
    await settle(group);
    expect(items(group).map((item) => item.open)).toEqual([true, false]);
  });

  it('blocks disabled activation while allowing explicit open changes', async () => {
    const group = await mount();
    const second = items(group)[1];
    second.disabled = true;
    await settle(group);
    const summary = second.shadowRoot!.querySelector('summary')!;
    expect(summary.getAttribute('aria-disabled')).toBe('true');
    expect(summary.tabIndex).toBe(-1);
    expect(summary.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))).toBe(false);
    second.open = true;
    await settle(group);
    expect(details(second).open).toBe(true);
    second.disabled = false;
    await settle(group);
    expect(summary.hasAttribute('aria-disabled')).toBe(false);
    expect(summary.hasAttribute('tabindex')).toBe(false);
  });

  it('keeps nested group toggles independent', async () => {
    const group = await mount('mode="single"');
    const [first, second] = items(group);
    second.innerHTML += `<sunmar-accordion mode="single"><sunmar-accordion-item><span slot="header">Вложенный</span>Ответ</sunmar-accordion-item></sunmar-accordion>`;
    const nested = second.querySelector('sunmar-accordion')!;
    await settle(group);
    const child = items(nested)[0];
    details(child).open = true;
    details(child).dispatchEvent(new Event('toggle'));
    await settle(group);
    expect(first.open).toBe(true);
    expect(second.open).toBe(false);
    expect(child.open).toBe(true);
  });

  it('preserves content and restores coordination after reconnect', async () => {
    const group = await mount('mode="single"');
    const [first, second] = items(group);
    const content = first.querySelector('p');
    group.remove();
    document.body.append(group);
    await settle(group);
    second.open = true;
    await settle(group);
    expect(first.open).toBe(false);
    expect(first.querySelector('p')).toBe(content);
  });
});

describe('SunmarAccordion FAQ', () => {
  it('updates existing text nodes and slot assignments', async () => {
    const group = await mount('faq');
    expect(faq().mainEntity).toHaveLength(2);
    const first = items(group)[0];
    first.querySelector('p')!.firstChild!.textContent = 'Новый ответ';
    first.querySelector('span')!.firstChild!.textContent = 'Новый вопрос';
    await settle(group);
    expect(faq().mainEntity[0]).toMatchObject({ name: 'Новый вопрос', acceptedAnswer: { text: 'Новый ответ' } });
    first.querySelector('p')!.setAttribute('slot', 'unused');
    await settle(group);
    expect(faq().mainEntity).toHaveLength(1);
  });

  it('extracts only direct assigned headers and default content', async () => {
    const group = await mount('faq');
    const first = items(group)[0];
    first.innerHTML = `<div slot="unused"><span slot="header">Не вопрос</span>Не ответ</div>
      <span slot="header">Вопрос</span><span slot="header">продолжение</span>
      Текст <p slot="">ответа</p>`;
    await settle(group);
    expect(faq().mainEntity[0]).toMatchObject({ name: 'Вопрос продолжение', acceptedAnswer: { text: 'Текст ответа' } });
  });

  it('removes empty data and synchronizes added items', async () => {
    const group = await mount('faq');
    group.replaceChildren();
    await settle(group);
    expect(faq()).toBeNull();
    group.innerHTML = '<sunmar-accordion-item><span slot="header">Вопрос</span>Ответ</sunmar-accordion-item>';
    await settle(group);
    expect(faq().mainEntity).toHaveLength(1);
  });

  it('cleans up on disable and disconnect and rebuilds on reconnect', async () => {
    const group = await mount('faq');
    group.faq = false;
    await settle(group);
    expect(faq()).toBeNull();
    group.faq = true;
    await settle(group);
    expect(faq()).not.toBeNull();
    group.remove();
    items(group)[0].querySelector('p')!.textContent = 'После удаления';
    await settle(group);
    expect(faq()).toBeNull();
    document.body.append(group);
    await settle(group);
    expect(faq().mainEntity[0].acceptedAnswer.text).toBe('После удаления');
    expect(document.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(1);
  });
});
