import { styleMap } from 'lit/directives/style-map.js';
import documentation from '../../../docs/sunmar-image-contract.md?raw';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import coastImageUrl from '../../dev/assets/cards/coast.jpg?url';
import resortImageUrl from '../../dev/assets/cards/resort.jpg?url';

const meta: Meta = {
  title: 'Компоненты/Image',
  id: 'components-image',
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
  "src": coastImageUrl,
  "srcset": "",
  "sizes": "",
  "media": "(min-width: 768px)",
  "alt": "Побережье Турции",
  "width": 720,
  "height": 480,
  "loading": "lazy",
  "objectFit": "cover",
  "objectPosition": "center center",
  "displayHeight": "320px"
};
type PlaygroundArgs = typeof playgroundArgs;

export const Playground: StoryObj<PlaygroundArgs> = {
  name: 'Песочница',
  args: playgroundArgs,
  decorators: [(story, context) => html`
    <div class="storybook-demo storybook-demo--image" style=${styleMap({
      '--sunmarino-image-height': context.args.displayHeight,
      '--sunmarino-image-object-fit': context.args.objectFit,
      '--sunmarino-image-object-position': context.args.objectPosition
    })}>${story()}</div>
  `],
  argTypes: {
  "src": {
    "description": "src — адрес основного изображения img.",
    "control": {
      "type": "text"
    },
    "table": {
      "category": "Параметры компонента",
      "defaultValue": {
        "summary": "Пустая строка"
      }
    }
  },
  "srcset": {
    "description": "srcset — источники одного source. Пустая строка удаляет source.",
    "control": {
      "type": "text"
    },
    "table": {
      "category": "Параметры компонента",
      "defaultValue": {
        "summary": ""
      }
    }
  },
  "sizes": {
    "description": "sizes — ожидаемая ширина изображения для source; применяется вместе с srcset.",
    "control": {
      "type": "text"
    },
    "table": {
      "category": "Параметры компонента",
      "defaultValue": {
        "summary": ""
      }
    }
  },
  "media": {
    "description": "media — условие выбора source. Пустая строка снимает ограничение.",
    "control": {
      "type": "text"
    },
    "table": {
      "category": "Параметры компонента",
      "defaultValue": {
        "summary": "(min-width: 768px)"
      }
    }
  },
  "alt": {
    "description": "alt — описание изображения. Для декоративного изображения оставьте пустым.",
    "control": {
      "type": "text"
    },
    "table": {
      "category": "Параметры компонента",
      "defaultValue": {
        "summary": ""
      }
    }
  },
  "width": {
    "description": "width — исходная ширина изображения; число ≥ 1, дробная часть отбрасывается.",
    "control": {
      "type": "number"
    },
    "table": {
      "category": "Параметры компонента",
      "defaultValue": {
        "summary": "Не задано"
      }
    }
  },
  "height": {
    "description": "height — исходная высота изображения; число ≥ 1.",
    "control": {
      "type": "number"
    },
    "table": {
      "category": "Параметры компонента",
      "defaultValue": {
        "summary": "Не задано"
      }
    }
  },
  "loading": {
    "description": "loading — lazy откладывает загрузку, eager запрашивает сразу. Без значения решает браузер.",
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
      "lazy",
      "eager"
    ]
  },
  "objectFit": {
    "description": "--sunmarino-image-object-fit — заполнение области.",
    "control": {
      "type": "select"
    },
    "table": {
      "category": "CSS-настройки",
      "defaultValue": {
        "summary": "cover"
      }
    },
    "options": [
      "cover",
      "contain",
      "fill",
      "none",
      "scale-down"
    ]
  },
  "objectPosition": {
    "description": "--sunmarino-image-object-position — положение изображения.",
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
  "displayHeight": {
    "description": "--sunmarino-image-height — отображаемая высота, например 320px или auto.",
    "control": {
      "type": "text"
    },
    "table": {
      "category": "CSS-настройки",
      "defaultValue": {
        "summary": "auto"
      }
    }
  }
},
  parameters: {
    controls: { disable: false, expanded: true },
    docs: { description: { story: 'Изменяйте параметры в Controls. Настройки примера не являются атрибутами компонента.' }, source: { type: 'dynamic' } }
  },
  render: (args) => html`
    <sunmar-image src=${args.src} srcset=${args.srcset} sizes=${args.sizes} media=${args.media}
      alt=${args.alt} width=${args.width} height=${args.height} loading=${args.loading}>
    </sunmar-image>
  `
};

export const Default: Story = {
  name: "Обычное изображение",
  parameters: { docs: { description: { story: "Без srcset создаётся только img. width и height описывают исходные размеры, CSS ограничивает отображаемую ширину." } } },
  decorators: [(story) => html`<div class="storybook-demo storybook-demo--image">${story()}</div>`],
  render: () => html`
    <sunmar-image
      src=${coastImageUrl}
      alt="Побережье Турции"
      width="720"
      height="480"
      loading="lazy"
    ></sunmar-image>
  `
};

export const ArtDirection: Story = {
  name: "Разные изображения для экранов",
  parameters: { docs: { description: { story: "До 768px браузер использует src, от 768px — source из srcset. Измените ширину окна примера." } } },
  decorators: [(story) => html`<div class="storybook-demo storybook-demo--image">${story()}</div>`],
  render: () => html`
    <sunmar-image
      srcset=${coastImageUrl}
      media="(min-width: 768px)"
      src=${resortImageUrl}
      alt="Курорт у моря"
      width="720"
      height="480"
    ></sunmar-image>
  `
};
