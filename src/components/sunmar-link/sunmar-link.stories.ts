import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Link',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Action-компонент на нативной ссылке. Поддерживает те же visual variants, что и button, но сохраняет поведение anchor.'
      }
    }
  }
};

export default meta;

type Story = StoryObj;

export const Primary: Story = {
  render: () => html`
    <sunmar-link href="https://www.sunmar.ru/" target="_blank" type="primary">
      Открыть Sunmar
    </sunmar-link>
  `
};

export const Secondary: Story = {
  render: () => html`
    <sunmar-link href="#details" type="secondary">Подробнее</sunmar-link>
  `
};

export const NeutralWithIcon: Story = {
  render: () => html`
    <sunmar-link href="#favorite" type="neutral">
      <span slot="suffix">→</span>
      Перейти
    </sunmar-link>
  `
};

export const FullWidth: Story = {
  render: () => html`
    <div style="width: 360px;">
      <sunmar-link href="#full-width" type="primary" full-width>
        Ссылка на всю ширину
      </sunmar-link>
    </div>
  `
};

export const Disabled: Story = {
  render: () => html`
    <sunmar-link href="https://www.sunmar.ru/" type="primary" disabled>
      Недоступная ссылка
    </sunmar-link>
  `
};
