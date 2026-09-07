import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import coastImageUrl from '../../dev/assets/cards/coast.jpg?url';

const meta: Meta = {
  title: 'Components/Cards Grid',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Адаптивная сетка карточек. Slash-последовательность layout задаёт колонки для base / 768 / 1024 / 1280.'
      }
    }
  }
};

export default meta;
type Story = StoryObj;

export const ThreeColumns: Story = {
  render: () => html`
    <sunmar-cards-grid layout="1/2/3/1" style="padding:24px;">
      ${['Турция', 'Египет', 'ОАЭ'].map((title) => html`
        <sunmar-card>
          <sunmar-image slot="media" src=${coastImageUrl} width="720" height="480" alt=""></sunmar-image>
          <h3 slot="title">${title}</h3>
          <p slot="text">Отдых у моря.</p>
        </sunmar-card>
      `)}
    </sunmar-cards-grid>
  `
};
