import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import coastImageUrl from '../../dev/assets/cards/coast.jpg?url';
import resortImageUrl from '../../dev/assets/cards/resort.jpg?url';
import mountainsImageUrl from '../../dev/assets/cards/mountains.jpg?url';

const meta: Meta = {
  title: 'Components/Slider',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' }
};

export default meta;
type Story = StoryObj;

export const Cards: Story = {
  render: () => html`
    <sunmar-slider
      aria-label="Направления отдыха"
      slides-per-view="1"
      slides-per-view-768="2"
      slides-per-view-1024="3"
      slides-to-scroll="auto"
      gap="24"
      loop
      style="display:block; padding:24px;"
    >
      ${[
        ['Турция', coastImageUrl],
        ['Курорт', resortImageUrl],
        ['Горы', mountainsImageUrl],
        ['Побережье', coastImageUrl],
        ['Отель', resortImageUrl],
        ['Озеро', mountainsImageUrl]
      ].map(([title, src]) => html`
        <sunmar-slide>
          <sunmar-card vertical>
            <sunmar-image slot="media" src=${src} width="720" height="480" alt=""></sunmar-image>
            <h3 slot="title">${title}</h3>
            <p slot="text">Короткое описание направления.</p>
          </sunmar-card>
        </sunmar-slide>
      `)}
    </sunmar-slider>
  `
};
