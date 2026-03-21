import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Button',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Базовый action-компонент на нативном button. Поддерживает visual variants, full-width и слоты prefix/suffix.'
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

export const FullWidth: Story = {
  render: () => html`
    <div style="width: 360px;">
      <sunmar-button type="primary" full-width>Занять всю ширину</sunmar-button>
    </div>
  `
};

export const Disabled: Story = {
  render: () => html`
    <sunmar-button type="primary" disabled>Недоступно</sunmar-button>
  `
};
