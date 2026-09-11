import { styleMap } from 'lit/directives/style-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import documentation from '../../../docs/sunmar-button-group-contract.md?raw';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Компоненты/Button Group',
  id: 'components-button-group',
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
  "type": "secondary",
  "size": "medium",
  "direction": "row",
  "gap": 16,
  "override": false
};
type PlaygroundArgs = typeof playgroundArgs;

export const Playground: StoryObj<PlaygroundArgs> = {
  name: 'Песочница',
  args: playgroundArgs,
  decorators: [(story, context) => html`
    <div style=${styleMap({ '--sunmarino-button-group-direction': context.args.direction, '--sunmarino-button-group-gap': `${context.args.gap}px` })}>
      ${story()}
    </div>
  `],
  argTypes: {
  "type": {
    "description": "type — общий вариант непосредственных дочерних кнопок.",
    "control": {
      "type": "select"
    },
    "table": {
      "category": "Параметры компонента",
      "defaultValue": {
        "summary": "primary"
      }
    },
    "options": [
      "primary",
      "secondary",
      "neutral"
    ]
  },
  "size": {
    "description": "size — общий размер; визуальные размеры пока одинаковы.",
    "control": {
      "type": "select"
    },
    "table": {
      "category": "Параметры компонента",
      "defaultValue": {
        "summary": "medium"
      }
    },
    "options": [
      "small",
      "medium",
      "large"
    ]
  },
  "direction": {
    "description": "--sunmarino-button-group-direction — CSS-направление группы. Атрибута direction нет.",
    "control": {
      "type": "select"
    },
    "table": {
      "category": "CSS-настройки",
      "defaultValue": {
        "summary": "row"
      }
    },
    "options": [
      "row",
      "column"
    ]
  },
  "gap": {
    "description": "--sunmarino-button-group-gap — интервал в пикселях.",
    "control": {
      "type": "number"
    },
    "table": {
      "category": "CSS-настройки",
      "defaultValue": {
        "summary": "var(--sunmarino-space-s)"
      }
    }
  },
  "override": {
    "description": "Задать второй кнопке собственные primary/small. Выключите, чтобы вернуть наследование.",
    "control": {
      "type": "boolean"
    },
    "table": {
      "category": "Содержимое и настройки примера",
      "defaultValue": {
        "summary": "false"
      }
    }
  }
},
  parameters: {
    controls: { disable: false, expanded: true },
    docs: { description: { story: 'Изменяйте параметры в Controls. Настройки примера не являются атрибутами компонента.' }, source: { type: 'dynamic' } }
  },
  render: (args) => html`
    <sunmar-button-group type=${args.type} size=${args.size}>
      <sunmar-button><button type="button">От группы</button></sunmar-button>
      <sunmar-button type=${ifDefined(args.override ? 'primary' : undefined)} size=${ifDefined(args.override ? 'small' : undefined)}>
        <button type="button">${args.override ? 'Собственные настройки' : 'От группы'}</button>
      </sunmar-button>
      <sunmar-button><a href="#details">Подробнее</a></sunmar-button>
    </sunmar-button-group>
  `
};

export const Preview: Story = {
  name: "Несколько действий",
  parameters: { docs: { description: { story: "Группа объединяет кнопки и ссылки, сохраняя поведение каждого нативного элемента." } } },
  render: () => html`
    <sunmar-button-group>
      <sunmar-button type="primary"><button type="button">Подобрать тур</button></sunmar-button>
      <sunmar-button type="neutral"><button type="button">В избранное</button></sunmar-button>
      <sunmar-button type="secondary"><a href="#details">Подробнее</a></sunmar-button>
    </sunmar-button-group>
  `
};

export const InheritedSettings: Story = {
  name: "Наследование настроек",
  parameters: { docs: { description: { story: "Первая кнопка наследует type и size. Вторая меняет только type, третья — только size. Размеры пока визуально одинаковы." } } },
  render: () => html`
    <sunmar-button-group type="secondary" size="large">
      <sunmar-button><button type="button">От группы</button></sunmar-button>
      <sunmar-button type="primary"><button type="button">Свой тип</button></sunmar-button>
      <sunmar-button size="small"><a href="#details">Свой размер</a></sunmar-button>
    </sunmar-button-group>
  `
};

export const ResponsiveDirection: Story = {
  name: "Адаптивное направление",
  parameters: { docs: { description: { story: "До 768px кнопки идут колонкой, от 768px — строкой. Измените ширину области просмотра. Направление задаёт CSS-переменная, а не атрибут." } } },
  decorators: [(story) => html`<div class="storybook-responsive-button-group">${story()}</div>`],
  render: () => html`
    <sunmar-button-group type="secondary">
      <sunmar-button><button type="button">Подобрать тур</button></sunmar-button>
      <sunmar-button><a href="#details">Подробнее</a></sunmar-button>
    </sunmar-button-group>
  `
};
