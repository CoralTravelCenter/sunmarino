import documentation from '../../../docs/sunmar-button-contract.md?raw';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit';

const meta: Meta = {
  title: 'Компоненты/Button',
  id: 'components-button',
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
  "type": "primary",
  "size": "medium",
  "element": "button",
  "label": "Подобрать тур",
  "disabled": false,
  "href": "#details",
  "icon": false
};
type PlaygroundArgs = typeof playgroundArgs;

export const Playground: StoryObj<PlaygroundArgs> = {
  name: 'Песочница',
  args: playgroundArgs,
  argTypes: {
  "type": {
    "description": "type — визуальный вариант оболочки. Не путайте с type нативной кнопки.",
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
    "description": "size — размер по контракту. Сейчас все три размера выглядят одинаково.",
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
  "element": {
    "description": "Нативный элемент в слоте: button выполняет действие, a переходит по ссылке.",
    "control": {
      "type": "select"
    },
    "table": {
      "category": "Содержимое и настройки примера",
      "defaultValue": {
        "summary": "button"
      }
    },
    "options": [
      "button",
      "a"
    ]
  },
  "label": {
    "description": "Текст нативной кнопки или ссылки.",
    "control": {
      "type": "text"
    },
    "table": {
      "category": "Содержимое и настройки примера",
      "defaultValue": {
        "summary": "Подобрать тур"
      }
    }
  },
  "disabled": {
    "description": "disabled задаётся вложенному button. Для ссылки неприменим.",
    "control": {
      "type": "boolean"
    },
    "table": {
      "category": "Нативный элемент",
      "defaultValue": {
        "summary": "false"
      }
    },
    "if": {
      "arg": "element",
      "eq": "button"
    }
  },
  "href": {
    "description": "href вложенной ссылки.",
    "control": {
      "type": "text"
    },
    "table": {
      "category": "Нативный элемент",
      "defaultValue": {
        "summary": "#details"
      }
    },
    "if": {
      "arg": "element",
      "eq": "a"
    }
  },
  "icon": {
    "description": "Добавить декоративную звезду, скрытую от скринридера.",
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
    <sunmar-button type=${args.type} size=${args.size}>
      ${args.element === 'a'
        ? html`<a href=${args.href}>${args.icon ? html`<span aria-hidden="true">★</span>` : nothing} ${args.label}</a>`
        : html`<button type="button" ?disabled=${args.disabled}>${args.icon ? html`<span aria-hidden="true">★</span>` : nothing} ${args.label}</button>`}
    </sunmar-button>
  `
};

export const Primary: Story = {
  name: "Основная кнопка",
  parameters: { docs: { description: { story: "Главное действие страницы. Визуальный type задаётся оболочке, а type=\"button\" — нативной кнопке." } } },
  render: () => html`
    <sunmar-button type="primary">
      <button type="button">Подобрать тур</button>
    </sunmar-button>
  `
};

export const Secondary: Story = {
  name: "Ссылка",
  parameters: { docs: { description: { story: "Для перехода передайте a с href. Нативная ссылка сохраняет поведение браузера." } } },
  render: () => html`
    <sunmar-button type="secondary">
      <a href="#details">Подробнее</a>
    </sunmar-button>
  `
};

export const NeutralWithIcon: Story = {
  name: "Кнопка с иконкой",
  parameters: { docs: { description: { story: "Декоративная иконка скрыта через aria-hidden. Доступное имя задаётся текстом." } } },
  render: () => html`
    <sunmar-button type="neutral">
      <button type="button"><span aria-hidden="true">★</span> Избранное</button>
    </sunmar-button>
  `
};

export const Disabled: Story = {
  name: "Недоступная кнопка",
  parameters: { docs: { description: { story: "disabled находится на вложенном button: браузер исключает кнопку из Tab-порядка и блокирует нажатие." } } },
  render: () => html`
    <sunmar-button type="primary">
      <button type="button" disabled>Недоступно</button>
    </sunmar-button>
  `
};
