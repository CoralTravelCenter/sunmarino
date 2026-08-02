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
        {
          title: 'Турция',
          src: coastImageUrl,
          text: 'Семейные отели и отдых у моря.',
          action: 'Выбрать тур'
        },
        {
          title: 'Курорт',
          src: resortImageUrl,
          text: 'Большой выбор отелей с разными концепциями питания и развлечениями для всей семьи.',
          action: 'Подробнее'
        },
        {
          title: 'Горы',
          src: mountainsImageUrl,
          text: 'Активный отдых и свежий воздух.',
          action: ''
        },
        {
          title: 'Побережье',
          src: coastImageUrl,
          text: 'Пляжный отдых.',
          action: 'Смотреть туры'
        },
        {
          title: 'Отель для спокойного отдыха',
          src: resortImageUrl,
          text: 'Комфортные номера, просторная территория и собственный пляж.',
          action: ''
        },
        {
          title: 'Озеро',
          src: mountainsImageUrl,
          text: 'Маршруты среди живописных гор и озёр.',
          action: 'Узнать больше'
        }
      ].map(({ title, src, text, action }) => html`
        <sunmar-slide>
          <sunmar-card vertical>
            <sunmar-image slot="media" src=${src} width="720" height="480" alt=""></sunmar-image>
            <h3 slot="title">${title}</h3>
            <p slot="text">${text}</p>
            ${action ? html`
              <sunmar-button slot="actions" type="primary">
                <a href="#tour">${action}</a>
              </sunmar-button>
            ` : null}
          </sunmar-card>
        </sunmar-slide>
      `)}
    </sunmar-slider>
  `
};
