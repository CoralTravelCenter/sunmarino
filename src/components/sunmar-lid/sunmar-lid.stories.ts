import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Lid',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Текстовый компонент с semantic light DOM контентом. Отвечает за layout-зоны title, text и actions.'
      }
    }
  }
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="max-width: 840px;">
      <sunmar-lid>
        <h2 class="sunmar-h2" slot="title">Заголовок блока</h2>
        <p class="sunmar-text" slot="text">
          Описание блока с обычным текстом. Компонент ожидает semantic content в light DOM и управляет только layout-структурой.
        </p>
      </sunmar-lid>
    </div>
  `
};

export const WithActions: Story = {
  render: () => html`
    <div style="max-width: 840px;">
      <sunmar-lid>
        <h2 class="sunmar-h2" slot="title">Лид с CTA</h2>
        <p class="sunmar-text" slot="text">
          Default slot используется как зона для кнопки или дополнительного action-контента.
        </p>
        <sunmar-button type="primary">Подобрать тур</sunmar-button>
      </sunmar-lid>
    </div>
  `
};

export const TitleOnly: Story = {
  render: () => html`
    <div style="max-width: 840px;">
      <sunmar-lid>
        <h2 class="sunmar-h2" slot="title">Лид только с заголовком</h2>
      </sunmar-lid>
    </div>
  `
};
