import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import coastImageUrl from '../../dev/assets/cards/coast.jpg?url';
import resortImageUrl from '../../dev/assets/cards/resort.jpg?url';
import mountainsImageUrl from '../../dev/assets/cards/mountains.jpg?url';

const sliderDemoStyles = html`
  <style>
    .slider-demo {
      display: block;
      padding: 24px;
    }

    @media (min-width: 1280px) {
      .slider-demo {
        padding-inline: 96px;
      }
    }
  </style>
`;

const meta: Meta = {
  title: 'Components/Slider',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Карусель из sunmar-slide. Задайте aria-label или aria-labelledby. Во время загрузки и при ошибке Embla отображается статическая сетка. disabled-from переключает карусель в сетку с указанной ширины окна.' } }
  }
};

export default meta;
type Story = StoryObj;

export const Cards: Story = {
  render: () => html`
    ${sliderDemoStyles}
    <sunmar-slider
      class="slider-demo"
      aria-label="Направления отдыха"
      slides-per-view="1"
      slides-per-view-768="2"
      slides-per-view-1024="3"
      slides-to-scroll="auto"
      gap="24"
      loop
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


export const DisabledFromDesktop: Story = {
  name: 'Сетка от 1024px',
  render: () => html`
    ${sliderDemoStyles}
    <sunmar-slider class="slider-demo" aria-label="Направления отдыха"
      slides-per-view="1.5" slides-per-view-768="2" slides-per-view-1024="3"
      disabled-from="1024" gap="24">
      ${['Турция', 'Египет', 'ОАЭ', 'Мальдивы'].map((title) => html`
        <sunmar-slide><sunmar-card><h3 slot="title">${title}</h3></sunmar-card></sunmar-slide>
      `)}
    </sunmar-slider>
  `
};

export const SingleSlide: Story = {
  name: 'Один слайд с loop',
  render: () => html`
    ${sliderDemoStyles}
    <sunmar-slider class="slider-demo" aria-label="Предложение отдыха" loop>
      <sunmar-slide><sunmar-card><h3 slot="title">Отдых у моря</h3></sunmar-card></sunmar-slide>
    </sunmar-slider>
  `
};

export const Empty: Story = {
  name: 'Без слайдов',
  render: () => html`<sunmar-slider aria-label="Предложения отдыха"></sunmar-slider>`
};
