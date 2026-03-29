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

**Коротко**
- группирует несколько action-элементов в один визуальный блок
- держит единый \`gap\` и \`wrap\`
- полная документация вынесена на отдельную MDX-страницу этого компонента
`
      }
    }
  }
};

export default meta;

type Story = StoryObj;

export const Preview: Story = {
  render: () => html`
    <sunmar-button-group>
      <sunmar-button type="primary">Подобрать тур</sunmar-button>
      <sunmar-button type="neutral">В избранное</sunmar-button>
      <sunmar-button type="secondary">Подробнее</sunmar-button>
    </sunmar-button-group>
  `
};
