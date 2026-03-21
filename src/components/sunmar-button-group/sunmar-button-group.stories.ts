import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Button Group',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Layout-компонент для action-layer.

**Purpose**
- группирует несколько action-элементов в один визуальный блок
- держит единый \`gap\` и \`wrap\` на уровне visual contract

**Semantic contract**
- рендерит внутренний контейнер с \`role="group"\`
- сам не добавляет интерактивности и не меняет поведение дочерних action-элементов

**Slots**
- только default slot
- внутрь рекомендуется передавать \`sunmar-button\` и \`sunmar-link\`

**Parts**
- \`group\` — внутренний layout-контейнер

**Behavior**
- элементы располагаются через \`inline-flex\`
- при нехватке места переносятся на новую строку
- spacing между элементами централизован и не зависит от самих кнопок

**What it does not do**
- не управляет active-state
- не является toggle-group
- не синхронизирует selected/pressed состояние детей
- не задает внешнюю ширину родительского контейнера

**Usage note**
- используйте компонент там, где нужен единый блок CTA, например внутри \`slot="actions"\` у \`sunmar-kv\`
`
      }
    }
  }
};

export default meta;

type Story = StoryObj;

export const MixedActions: Story = {
  render: () => html`
    <sunmar-button-group>
      <sunmar-button type="primary">Подобрать тур</sunmar-button>
      <sunmar-button type="neutral">В избранное</sunmar-button>
      <sunmar-button type="secondary">Подробнее</sunmar-button>
    </sunmar-button-group>
  `
};

export const Wrapping: Story = {
  render: () => html`
    <div style="width: 320px;">
      <sunmar-button-group>
        <sunmar-button type="primary">Первый action</sunmar-button>
        <sunmar-button type="secondary">Второй action</sunmar-button>
        <sunmar-button type="neutral">Третий action</sunmar-button>
      </sunmar-button-group>
    </div>
  `
};
