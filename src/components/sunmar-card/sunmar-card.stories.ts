import { styleMap } from 'lit/directives/style-map.js';
import documentation from '../../../docs/sunmar-card-contract.md?raw';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit';
import coastImageUrl from '../../dev/assets/cards/coast.jpg?url';

const meta: Meta = {
  title: 'Компоненты/Card',
  id: 'components-card',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { disable: true },
    docs: { description: { component: documentation.replace(/^# .+\n/, '') } }
  }
};

export default meta;
type Story = StoryObj;

const playgroundArgs = {
  "reversed": false,
  "width": 360,
  "title": "Отдых на побережье",
  "text": "Выберите отель у моря для спокойного семейного отдыха.",
  "actions": true,
  "background": "#f5f5f8"
};
type PlaygroundArgs = typeof playgroundArgs;

export const Playground: StoryObj<PlaygroundArgs> = {
  name: 'Песочница',
  args: playgroundArgs,
  decorators: [(story, context) => html`
    <div class="storybook-demo" style=${styleMap({ 'max-width': `${context.args.width}px`, '--sunmarino-card-background': context.args.background })}>
      ${story()}
    </div>
  `],
  argTypes: {
  "reversed": {
    "description": "reversed — изображение справа при ширине карточки от 1024px. Это HTML-атрибут без JS-свойства.",
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
  "width": {
    "description": "Ширина карточки в пикселях, ограниченная шириной области просмотра. От 1024px сама карточка становится горизонтальной.",
    "control": {
      "type": "range",
      "min": 280,
      "max": 1440,
      "step": 20
    },
    "table": {
      "category": "Содержимое и настройки примера",
      "defaultValue": {
        "summary": "360"
      }
    }
  },
  "title": {
    "description": "Содержимое слота title — заголовок h3.",
    "control": {
      "type": "text"
    },
    "table": {
      "category": "Содержимое и настройки примера",
      "defaultValue": {
        "summary": "Отдых на побережье"
      }
    }
  },
  "text": {
    "description": "Содержимое слота text.",
    "control": {
      "type": "text"
    },
    "table": {
      "category": "Содержимое и настройки примера",
      "defaultValue": {
        "summary": "Выберите отель у моря для спокойного семейного отдыха."
      }
    }
  },
  "actions": {
    "description": "Показать группу кнопок в необязательном слоте actions.",
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
  "background": {
    "description": "--sunmarino-card-background — фон текстового блока.",
    "control": {
      "type": "color"
    },
    "table": {
      "category": "CSS-настройки",
      "defaultValue": {
        "summary": "Системный цвет фона"
      }
    }
  }
},
  parameters: {
    controls: { disable: false, expanded: true },
    docs: { description: { story: 'Изменяйте параметры в Controls. Настройки примера не являются атрибутами компонента.' }, source: { type: 'dynamic' } }
  },
  render: (args) => html`
    <sunmar-card ?reversed=${args.reversed}>
      <sunmar-image slot="media" src=${coastImageUrl} width="720" height="480" alt="Побережье Турции"></sunmar-image>
      <h3 slot="title">${args.title}</h3>
      <p slot="text">${args.text}</p>
      ${args.actions ? html`<sunmar-button-group slot="actions">
        <sunmar-button><a href="#tour">Подобрать тур</a></sunmar-button>
        <sunmar-button type="neutral"><a href="#details">Подробнее</a></sunmar-button>
      </sunmar-button-group>` : nothing}
    </sunmar-card>
  `
};

export const Mobile: Story = {
  name: "Узкая карточка",
  parameters: { docs: { description: { story: "Ширина карточки 360px: вертикальная раскладка сохраняется даже в широком окне." } } },
  decorators: [(story) => html`<div class="storybook-demo storybook-demo--card-narrow">${story()}</div>`],
  render: () => html`
    <sunmar-card>
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
  name: "Карточка с группой кнопок",
  parameters: { docs: { description: { story: "В слот actions передаётся целая группа. Она управляет интервалами и наследованием кнопок." } } },
  decorators: [(story) => html`<div class="storybook-demo storybook-demo--card-narrow">${story()}</div>`],
  render: () => html`
    <sunmar-card>
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
  name: "Изображение справа",
  parameters: { docs: { description: { story: "Увеличьте область просмотра: reversed меняет порядок колонок только при ширине самой карточки от 1024px." } } },
  decorators: [(story) => html`<div class="storybook-demo storybook-demo--card-wide">${story()}</div>`],
  render: () => html`
    <sunmar-card reversed>
      <sunmar-image slot="media" src=${coastImageUrl} width="720" height="480" alt="Побережье Турции"></sunmar-image>
      <h3 slot="title">Турция</h3>
      <p slot="text">Семейные отели и отдых у моря.</p>
    </sunmar-card>
  `
};

export const Responsive: Story = {
  name: "Адаптивная карточка",
  parameters: { docs: { description: { story: "Карточка ограничена шириной 1200px и доступным местом. Изменяйте ширину области просмотра, чтобы увидеть переход при 1024px." } } },
  decorators: [(story) => html`<div class="storybook-demo storybook-demo--card-wide">${story()}</div>`],
  render: () => html`
    <sunmar-card>
      <sunmar-image slot="media" src=${coastImageUrl} width="720" height="480" alt="Побережье Турции"></sunmar-image>
      <h3 slot="title">Турция</h3>
      <p slot="text">Семейные отели и отдых у моря.</p>
    </sunmar-card>
  `
};
