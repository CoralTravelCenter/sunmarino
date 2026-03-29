import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const demoHref = 'https://www.sunmar.ru';

const meta: Meta = {
  title: 'Components/Link',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Базовый action-компонент на нативной ссылке \`<a>\`.

**Семантический контракт**
- внутри всегда рендерится нативный \`<a>\`
- компонент отвечает за визуальный контракт и раскладку слотов, а не за внешний layout страницы

**Attributes**
- \`type\` — визуальный вариант: \`primary\`, \`secondary\`, \`neutral\`
- \`href\` — адрес перехода
- \`target\` — target нативной ссылки
- \`rel\` — rel нативной ссылки
- \`download\` — download-атрибут нативной ссылки
- \`disabled\` — отключает навигацию и переводит компонент в disabled-состояние

**Slots**
- default slot — текстовая label
- \`slot="prefix"\` — ведущая иконка или короткий inline-контент
- \`slot="suffix"\` — завершающая иконка или короткий inline-контент

**Parts**
- \`control\` — нативный \`a\`
- \`content\` — внутренняя flex-обертка контента
- \`label\` — зона текстовой подписи
- \`prefix\`, \`suffix\` — слоты для иконок и вспомогательного inline-контента

**Поведение**
- если \`target="_blank"\`, компонент сам добавляет безопасный \`rel\`: \`noopener noreferrer\`
- disabled-состояние убирает навигацию, ставит \`aria-disabled\` и исключает ссылку из tab order
- компонент не управляет шириной, позиционированием и внешними отступами

**Ограничения**
- prefix/suffix рассчитаны на короткий inline-контент
- если нужен submit/reset action, используйте \`sunmar-button\`, а не \`sunmar-link\`
`
      }
    }
  }
};

export default meta;

type Story = StoryObj;

export const Primary: Story = {
  render: () => html`
    <sunmar-link type="primary" href=${demoHref}>Подобрать тур</sunmar-link>
  `
};

export const Secondary: Story = {
  render: () => html`
    <sunmar-link type="secondary" href=${demoHref}>Подробнее</sunmar-link>
  `
};

export const NeutralWithIcon: Story = {
  render: () => html`
    <sunmar-link type="neutral" href=${demoHref}>
      <span slot="prefix">★</span>
      В избранное
    </sunmar-link>
  `
};

export const Disabled: Story = {
  render: () => html`
    <sunmar-link type="primary" href=${demoHref} disabled>Недоступно</sunmar-link>
  `
};
