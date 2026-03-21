import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Button',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Базовый action-компонент на нативном \`button\`.

**Semantic contract**
- внутри всегда рендерится нативный \`<button>\`
- компонент отвечает за visual contract и slot layout, а не за внешний layout страницы

**Attributes**
- \`type\` — visual variant: \`primary\`, \`secondary\`, \`neutral\`
- \`disabled\` — переводит control в disabled-состояние
- \`native-type\` — нативный \`button\` type: \`button\`, \`submit\`, \`reset\`

**Slots**
- default slot — текстовая label
- \`slot="prefix"\` — ведущая иконка или короткий inline-контент
- \`slot="suffix"\` — завершающая иконка или короткий inline-контент

**Parts**
- \`control\` — нативный \`button\`
- \`content\` — внутренняя flex-обертка контента
- \`label\` — зона текстовой подписи
- \`prefix\`, \`suffix\` — слоты для иконок и вспомогательного inline-контента

**Behavior**
- disabled-состояние прокидывается на нативный \`button\`
- компонент не управляет шириной, позиционированием и внешними отступами
- для layout нескольких action-элементов рекомендуется \`sunmar-button-group\`

**Constraints**
- prefix/suffix рассчитаны на короткий inline-контент
- если нужен переход по ссылке, используйте \`sunmar-link\`, а не \`sunmar-button\`
`
      }
    }
  }
};

export default meta;

type Story = StoryObj;

export const Primary: Story = {
  render: () => html`
    <sunmar-button type="primary">Подобрать тур</sunmar-button>
  `
};

export const Secondary: Story = {
  render: () => html`
    <sunmar-button type="secondary">Подробнее</sunmar-button>
  `
};

export const NeutralWithIcon: Story = {
  render: () => html`
    <sunmar-button type="neutral">
      <span slot="prefix">★</span>
      Избранное
    </sunmar-button>
  `
};

export const Disabled: Story = {
  render: () => html`
    <sunmar-button type="primary" disabled>Недоступно</sunmar-button>
  `
};
