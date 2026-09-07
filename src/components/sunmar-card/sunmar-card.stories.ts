import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import coastImageUrl from '../../dev/assets/cards/coast.jpg?url';

const meta: Meta = {
  title: 'Components/Card',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Раскладка автоматически зависит от ширины карточки: вертикальная до 1024px и горизонтальная от 1024px. Атрибут reversed меняет порядок колонок. Слоты media, title, text обязательны; actions необязателен.'
      }
    }
  }
};

export default meta;
type Story = StoryObj;

export const Mobile: Story = {
  name: 'Узкая карточка (раскладка зависит от окна)',
  render: () => html`
    <sunmar-card style="display:block; width:min(100%, 360px);">
      <sunmar-image
        slot="media"
        src=${coastImageUrl}
        width="720"
        height="480"
        alt="Побережье Турции"
      ></sunmar-image>
      <h3 slot="title">Турция</h3>
      <p slot="text">Семейные отели и отдых у моря.</p>
      <sunmar-button slot="actions" type="primary"><a href="#tour">Купить тур</a></sunmar-button>
      <sunmar-button slot="actions" type="neutral"><a href="#hot">Горящие туры</a></sunmar-button>
    </sunmar-card>
  `
};

export const WithButtonGroup: Story = {
  render: () => html`
    <sunmar-card style="width:min(100%, 360px);">
      <sunmar-image slot="media" src=${coastImageUrl} width="720" height="480" alt="Побережье Турции"></sunmar-image>
      <h3 slot="title">Турция</h3>
      <p slot="text">Семейные отели и отдых у моря.</p>
      <sunmar-button-group slot="actions" type="secondary">
        <sunmar-button><a href="#details">Подробнее</a></sunmar-button>
        <sunmar-button type="primary"><button type="button">Подобрать тур</button></sunmar-button>
      </sunmar-button-group>
    </sunmar-card>
  `
};

export const Reversed: Story = {
  render: () => html`
    <sunmar-card reversed>
      <sunmar-image slot="media" src=${coastImageUrl} width="720" height="480" alt="Побережье Турции"></sunmar-image>
      <h3 slot="title">Турция</h3>
      <p slot="text">Семейные отели и отдых у моря.</p>
    </sunmar-card>
  `
};

export const Responsive: Story = {
  render: () => html`
    <sunmar-card style="display:block; width:min(100%, 360px);">
      <sunmar-image slot="media" src=${coastImageUrl} width="720" height="480" alt="Побережье Турции"></sunmar-image>
      <h3 slot="title">Турция</h3>
      <p slot="text">Семейные отели и отдых у моря.</p>
    </sunmar-card>
  `
};
