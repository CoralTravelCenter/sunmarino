import { styleMap } from 'lit/directives/style-map.js';
import documentation from '../../../docs/sunmar-kv-contract.md?raw';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit';

const desktopImageUrl = 'https://b2ccdn.sunmar.ru/content/landing-pages/rb-summer/rb-kv.jpg';
const mobileImageUrl = 'https://b2ccdn.sunmar.ru/content/landing-pages/rb-summer/rb-kv-mo.jpg';

const meta: Meta = {
  title: 'Компоненты/Главный баннер',
  id: 'components-kv',
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
  "fullWidth": false,
  "title": "Пора к морю",
  "text": "Выберите направление для следующего отпуска.",
  "eyebrow": "Летний отдых",
  "actions": true,
  "objectPosition": "center center",
  "contentColor": "#ffffff"
};
type PlaygroundArgs = typeof playgroundArgs;

export const Playground: StoryObj<PlaygroundArgs> = {
  name: 'Песочница',
  args: playgroundArgs,
  argTypes: {
  "fullWidth": {
    "description": "full-width / fullWidth — растягивает внутренний баннер до 100vw, убирает скругление и ограничивает высоту 520px. Контент ограничен 1530px.",
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
  "title": {
    "description": "Семантический h1 в слоте title.",
    "control": {
      "type": "text"
    },
    "table": {
      "category": "Содержимое и настройки примера",
      "defaultValue": {
        "summary": "Пора к морю"
      }
    }
  },
  "text": {
    "description": "Описание в слоте text. Пустая строка убирает элемент.",
    "control": {
      "type": "text"
    },
    "table": {
      "category": "Содержимое и настройки примера",
      "defaultValue": {
        "summary": "Выберите направление для следующего отпуска."
      }
    }
  },
  "eyebrow": {
    "description": "Надзаголовок в слоте eyebrow. Пустая строка убирает элемент.",
    "control": {
      "type": "text"
    },
    "table": {
      "category": "Содержимое и настройки примера",
      "defaultValue": {
        "summary": "Летний отдых"
      }
    }
  },
  "actions": {
    "description": "Добавить группу кнопок в слот actions.",
    "control": {
      "type": "boolean"
    },
    "table": {
      "category": "Содержимое и настройки примера",
      "defaultValue": {
        "summary": "true"
      }
    }
  },
  "objectPosition": {
    "description": "--sunmarino-image-object-position — положение фонового изображения.",
    "control": {
      "type": "text"
    },
    "table": {
      "category": "CSS-настройки",
      "defaultValue": {
        "summary": "center center"
      }
    }
  },
  "contentColor": {
    "description": "--sunmarino-kv-content-color — цвет контента; подбирайте с учётом изображения.",
    "control": {
      "type": "color"
    },
    "table": {
      "category": "CSS-настройки",
      "defaultValue": {
        "summary": "Системный светлый текст"
      }
    }
  }
},
  parameters: {
    controls: { disable: false, expanded: true },
    docs: { description: { story: 'Изменяйте параметры в Controls. Настройки примера не являются атрибутами компонента.' }, source: { type: 'dynamic' } }
  },
  render: (args) => html`
    <sunmar-kv ?full-width=${args.fullWidth}
      style=${styleMap({ '--sunmarino-kv-content-color': args.contentColor, '--sunmarino-image-object-position': args.objectPosition })}>
      <sunmar-image slot="image" src=${mobileImageUrl} srcset=${desktopImageUrl} media="(min-width: 768px)" alt="" loading="eager"></sunmar-image>
      ${args.eyebrow ? html`<p slot="eyebrow">${args.eyebrow}</p>` : nothing}
      <h1 slot="title">${args.title}</h1>
      ${args.text ? html`<p slot="text">${args.text}</p>` : nothing}
      ${args.actions ? html`<sunmar-button-group slot="actions">
        <sunmar-button><button type="button">Подобрать тур</button></sunmar-button>
        <sunmar-button type="secondary"><a href="#details">Подробнее</a></sunmar-button>
      </sunmar-button-group>` : nothing}
    </sunmar-kv>
  `
};

export const Default: Story = {
  name: "Баннер с действиями",
  parameters: { docs: { description: { story: "Изображение меняется при ширине окна 768px. Текст и заголовок остаются в HTML страницы, а группа кнопок передаётся в actions." } } },
  render: () => html`
    <sunmar-kv>
      <sunmar-image
        slot="image"
        media="(min-width: 768px)"
        srcset=${desktopImageUrl}
        src=${mobileImageUrl}
        alt="Раннее бронирование туров"
      ></sunmar-image>
      <h1 slot="title">ОчеВИДНАЯ выгода Раннего бронирования</h1>
      <p slot="text">Скидки до 50% и предоплата 20% от стоимости.</p>
      <sunmar-button-group slot="actions" type="primary">
        <sunmar-button>
          <button type="button">Подобрать тур</button>
        </sunmar-button>
        <sunmar-button type="secondary">
          <a href="#details">Подробнее</a>
        </sunmar-button>
      </sunmar-button-group>
    </sunmar-kv>
  `
};
