import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import coastImageUrl from '../../dev/assets/cards/coast.jpg?url';

const meta: Meta = {
  title: 'Components/Card',
  tags: ['autodocs'],
  parameters: { layout: 'centered' }
};

export default meta;
type Story = StoryObj;

export const Mobile: Story = {
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

export const Reversed: Story = {
  render: () => html`
    <sunmar-card reversed>
      <sunmar-image slot="media" src=${coastImageUrl} width="720" height="480" alt="Побережье Турции"></sunmar-image>
      <h3 slot="title">Турция</h3>
      <p slot="text">Семейные отели и отдых у моря.</p>
    </sunmar-card>
  `
};

export const Vertical: Story = {
  render: () => html`
    <sunmar-card vertical style="display:block; width:min(100%, 360px);">
      <sunmar-image slot="media" src=${coastImageUrl} width="720" height="480" alt="Побережье Турции"></sunmar-image>
      <h3 slot="title">Турция</h3>
      <p slot="text">Семейные отели и отдых у моря.</p>
    </sunmar-card>
  `
};
