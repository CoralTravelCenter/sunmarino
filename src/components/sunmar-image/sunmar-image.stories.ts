import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Image',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Семантический media-компонент на базе picture/img. Поддерживает object-fit и object-position через CSS custom properties.'
      }
    }
  }
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="width: 480px; height: 320px;">
      <sunmar-image
        src="https://b2ccdn.sunmar.ru/content/landing-pages/rb-summer/rb-kv-mo.jpg"
        srcset="https://b2ccdn.sunmar.ru/content/landing-pages/rb-summer/rb-kv.jpg"
        media="(min-width: 768px)"
        alt="Раннее бронирование туров"
      ></sunmar-image>
    </div>
  `
};

export const CustomObjectPosition: Story = {
  render: () => html`
    <div style="width: 480px; height: 320px;">
      <sunmar-image
        style="--sunmar-image-object-position: 60% center;"
        src="https://b2ccdn.sunmar.ru/content/landing-pages/rb-summer/rb-kv-mo.jpg"
        srcset="https://b2ccdn.sunmar.ru/content/landing-pages/rb-summer/rb-kv.jpg"
        media="(min-width: 768px)"
        alt="Кастомное позиционирование изображения"
      ></sunmar-image>
    </div>
  `
};
