import { ifDefined } from 'lit/directives/if-defined.js';
import documentation from '../../../docs/sunmar-slider-contract.md?raw';
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
  title: 'Компоненты/Слайдер',
  id: 'components-slider',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: { description: { component: documentation.replace(/^# .+\n/, '') } }
  }
};

export default meta;
type Story = StoryObj;

const playgroundArgs = {
  "slidesPerView": 1,
  "slidesPerView768": 2,
  "slidesPerView1024": 3,
  "slidesPerView1280": 3,
  "slidesPerView1440": 4,
  "slidesToScroll": "1",
  "disabledFrom": "none",
  "align": "start",
  "dragFree": false,
  "loop": false,
  "gap": 16,
  "count": 6,
  "ariaLabel": "Направления отдыха"
};
type PlaygroundArgs = typeof playgroundArgs;

export const Playground: StoryObj<PlaygroundArgs> = {
  name: 'Песочница',
  args: playgroundArgs,
  argTypes: {
  "slidesPerView": {
    "description": "slides-per-view / slidesPerView — видимых слайдов от 1; допускается дробное число.",
    "control": {
      "type": "number"
    },
    "table": {
      "category": "Параметры компонента",
      "defaultValue": {
        "summary": "1"
      }
    }
  },
  "slidesPerView768": {
    "description": "slides-per-view-768 / slidesPerView768 — число видимых слайдов от ширины окна 768px.",
    "control": {
      "type": "number"
    },
    "table": {
      "category": "Параметры компонента",
      "defaultValue": {
        "summary": "Наследуется с предыдущего брейкпоинта"
      }
    }
  },
  "slidesPerView1024": {
    "description": "slides-per-view-1024 / slidesPerView1024 — число видимых слайдов от ширины окна 1024px.",
    "control": {
      "type": "number"
    },
    "table": {
      "category": "Параметры компонента",
      "defaultValue": {
        "summary": "Наследуется с предыдущего брейкпоинта"
      }
    }
  },
  "slidesPerView1280": {
    "description": "slides-per-view-1280 / slidesPerView1280 — число видимых слайдов от ширины окна 1280px.",
    "control": {
      "type": "number"
    },
    "table": {
      "category": "Параметры компонента",
      "defaultValue": {
        "summary": "Наследуется с предыдущего брейкпоинта"
      }
    }
  },
  "slidesPerView1440": {
    "description": "slides-per-view-1440 / slidesPerView1440 — число видимых слайдов от ширины окна 1440px.",
    "control": {
      "type": "number"
    },
    "table": {
      "category": "Параметры компонента",
      "defaultValue": {
        "summary": "Наследуется с предыдущего брейкпоинта"
      }
    }
  },
  "slidesToScroll": {
    "description": "slides-to-scroll / slidesToScroll — шаг переключения: auto или число в строке.",
    "control": {
      "type": "select"
    },
    "table": {
      "category": "Параметры компонента",
      "defaultValue": {
        "summary": "1"
      }
    },
    "options": [
      "1",
      "2",
      "3",
      "auto"
    ]
  },
  "disabledFrom": {
    "description": "disabled-from / disabledFrom — ширина окна, с которой карусель становится сеткой.",
    "control": {
      "type": "select"
    },
    "table": {
      "category": "Параметры компонента",
      "defaultValue": {
        "summary": "Не задано"
      }
    },
    "options": [
      "none",
      "768",
      "1024",
      "1280",
      "1440"
    ]
  },
  "align": {
    "description": "align — выравнивание позиции карусели.",
    "control": {
      "type": "select"
    },
    "table": {
      "category": "Параметры компонента",
      "defaultValue": {
        "summary": "start"
      }
    },
    "options": [
      "start",
      "center",
      "end"
    ]
  },
  "dragFree": {
    "description": "drag-free / dragFree — свободное перетаскивание без привязки к позиции.",
    "control": {
      "type": "boolean"
    },
    "table": {
      "category": "Параметры компонента",
      "defaultValue": {
        "summary": "false"
      }
    }
  },
  "loop": {
    "description": "loop — запрос зацикливания; Embla может отключить его при недостатке слайдов.",
    "control": {
      "type": "boolean"
    },
    "table": {
      "category": "Параметры компонента",
      "defaultValue": {
        "summary": "false"
      }
    }
  },
  "gap": {
    "description": "gap — интервал между слайдами в пикселях, число ≥ 0.",
    "control": {
      "type": "number"
    },
    "table": {
      "category": "Параметры компонента",
      "defaultValue": {
        "summary": "16"
      }
    }
  },
  "count": {
    "description": "Количество непосредственных sunmar-slide. Ноль показывает пустое состояние.",
    "control": {
      "type": "range",
      "min": 0,
      "max": 12,
      "step": 1
    },
    "table": {
      "category": "Содержимое и настройки примера",
      "defaultValue": {
        "summary": "6"
      }
    }
  },
  "ariaLabel": {
    "description": "aria-label — доступное имя карусели.",
    "control": {
      "type": "text"
    },
    "table": {
      "category": "Параметры компонента",
      "defaultValue": {
        "summary": "Не задано"
      }
    }
  }
},
  parameters: {
    controls: { disable: false, expanded: true },
    docs: { description: { story: 'Изменяйте параметры в Controls. Настройки примера не являются атрибутами компонента.' }, source: { type: 'dynamic' } }
  },
  render: (args) => html`
    ${sliderDemoStyles}
    <sunmar-slider class="slider-demo" aria-label=${args.ariaLabel}
      slides-per-view=${args.slidesPerView} slides-per-view-768=${args.slidesPerView768}
      slides-per-view-1024=${args.slidesPerView1024} slides-per-view-1280=${args.slidesPerView1280}
      slides-per-view-1440=${args.slidesPerView1440} slides-to-scroll=${args.slidesToScroll}
      disabled-from=${ifDefined(args.disabledFrom === 'none' ? undefined : args.disabledFrom)}
      align=${args.align} ?drag-free=${args.dragFree} ?loop=${args.loop} gap=${args.gap}>
      ${Array.from({ length: args.count }, (_, index) => html`
        <sunmar-slide>
          <sunmar-card>
            <sunmar-image slot="media" src=${[coastImageUrl, resortImageUrl, mountainsImageUrl][index % 3]} width="720" height="480" alt=""></sunmar-image>
            <h3 slot="title">Направление ${index + 1}</h3>
            <p slot="text">Отдых у моря и новые впечатления.</p>
            <sunmar-button slot="actions"><a href="#tour">Подробнее</a></sunmar-button>
          </sunmar-card>
        </sunmar-slide>
      `)}
    </sunmar-slider>
  `
};

export const Cards: Story = {
  name: "Карточки в карусели",
  parameters: { docs: { description: { story: "Перетаскивайте слайды или используйте управление. Число видимых карточек меняется от 768px и 1024px. Для loop нужно достаточно содержимого." } } },
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
          <sunmar-card>
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
  name: "Сетка от 1024px",
  parameters: { docs: { description: { story: "До 1024px работает карусель, от 1024px — сетка без управления. Уменьшение окна снова включает карусель." } } },
  render: () => html`
    ${sliderDemoStyles}
    <sunmar-slider class="slider-demo" aria-label="Направления отдыха"
      slides-per-view="1.5" slides-per-view-768="2" slides-per-view-1024="3"
      disabled-from="1024" gap="24">
      ${['Турция', 'Египет', 'ОАЭ', 'Мальдивы'].map((title) => html`
        <sunmar-slide><sunmar-card><sunmar-image slot="media" src=${coastImageUrl} alt="" width="720" height="480"></sunmar-image><h3 slot="title">${title}</h3><p slot="text">Отдых у моря.</p></sunmar-card></sunmar-slide>
      `)}
    </sunmar-slider>
  `
};

export const SingleSlide: Story = {
  name: "Один слайд",
  parameters: { docs: { description: { story: "При одной позиции переключать нечего: управление скрывается, даже если запрошен loop." } } },
  render: () => html`
    ${sliderDemoStyles}
    <sunmar-slider class="slider-demo" aria-label="Предложение отдыха" loop>
      <sunmar-slide><sunmar-card><sunmar-image slot="media" src=${coastImageUrl} alt="" width="720" height="480"></sunmar-image><h3 slot="title">Отдых у моря</h3><p slot="text">Предложение для вашего отпуска.</p></sunmar-card></sunmar-slide>
    </sunmar-slider>
  `
};

export const Empty: Story = {
  name: "Пустой слайдер",
  parameters: { docs: { description: { story: "Без sunmar-slide компонент не создаёт заглушку и кнопки. Текст пустого состояния при необходимости добавляет приложение." } } },
  render: () => html`<sunmar-slider aria-label="Предложения отдыха"></sunmar-slider>`
};
