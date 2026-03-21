import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Button Group',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Layout-компонент для action-layer. Группирует кнопки и ссылки, сохраняя wrap и gap на уровне visual contract.'
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
      <sunmar-link href="#details" type="secondary">Подробнее</sunmar-link>
    </sunmar-button-group>
  `
};

export const Wrapping: Story = {
  render: () => html`
    <div style="width: 320px;">
      <sunmar-button-group>
        <sunmar-button type="primary">Первый action</sunmar-button>
        <sunmar-button type="secondary">Второй action</sunmar-button>
        <sunmar-link href="#third" type="neutral">Третий action</sunmar-link>
      </sunmar-button-group>
    </div>
  `
};
