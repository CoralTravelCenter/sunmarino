import { live } from 'lit/directives/live.js';
import { useArgs } from 'storybook/preview-api';
import documentation from '../../../docs/sunmar-modal-contract.md?raw';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit';

const meta: Meta = {
  title: 'Компоненты/Модальное окно',
  id: 'components-modal',
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
  "open": false,
  "disableCloseOnBackdrop": false,
  "disableCloseOnEsc": false,
  "ariaLabel": "",
  "title": "Подтверждение бронирования",
  "text": "Проверьте выбранные параметры перед продолжением.",
  "actions": true
};
type PlaygroundArgs = typeof playgroundArgs;

export const Playground: StoryObj<PlaygroundArgs> = {
  name: 'Песочница',
  args: playgroundArgs,
  argTypes: {
  "open": {
    "description": "open — текущее состояние. Кнопка, Escape и фон синхронизируют значение в Controls.",
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
  "disableCloseOnBackdrop": {
    "description": "disable-close-on-backdrop / disableCloseOnBackdrop — запретить закрытие по фону.",
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
  "disableCloseOnEsc": {
    "description": "disable-close-on-esc / disableCloseOnEsc — запретить закрытие клавишей Escape.",
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
  "ariaLabel": {
    "description": "aria-label / ariaLabel — явное доступное имя. Пустое значение использует заголовок.",
    "control": {
      "type": "text"
    },
    "table": {
      "category": "Параметры компонента",
      "defaultValue": {
        "summary": "Не задано"
      }
    }
  },
  "title": {
    "description": "Текст в слоте title; компонент сам создаёт h2.",
    "control": {
      "type": "text"
    },
    "table": {
      "category": "Содержимое и настройки примера",
      "defaultValue": {
        "summary": "Подтверждение бронирования"
      }
    }
  },
  "text": {
    "description": "Содержимое слота по умолчанию.",
    "control": {
      "type": "text"
    },
    "table": {
      "category": "Содержимое и настройки примера",
      "defaultValue": {
        "summary": "Проверьте выбранные параметры перед продолжением."
      }
    }
  },
  "actions": {
    "description": "Показать кнопку в слоте actions.",
    "control": {
      "type": "boolean"
    },
    "table": {
      "category": "Содержимое и настройки примера",
      "defaultValue": {
        "summary": "true"
      }
    }
  }
},
  parameters: {
    controls: { disable: false, expanded: true },
    docs: { description: { story: 'Изменяйте параметры в Controls. Настройки примера не являются атрибутами компонента.' }, source: { type: 'dynamic' } }
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<PlaygroundArgs>();
    const onStateChange = (event: Event) => {
      const modal = event.currentTarget as HTMLElementTagNameMap['sunmar-modal'];
      updateArgs({ open: modal.open });
      const output = modal.parentElement?.querySelector('output');
      if (output) output.textContent = `Последнее событие: ${event.type}`;
    };
    return html`
      <div>
        <sunmar-button><button type="button" @click=${(event: Event) => {
          (event.currentTarget as HTMLElement).closest('div')?.querySelector('sunmar-modal')?.show();
        }}>Открыть окно</button></sunmar-button>
        <p><output aria-live="polite">События появятся после открытия или закрытия окна.</output></p>
        <sunmar-modal .open=${live(args.open)} aria-label=${args.ariaLabel}
          ?disable-close-on-backdrop=${args.disableCloseOnBackdrop} ?disable-close-on-esc=${args.disableCloseOnEsc}
          @sunmar-modal-open=${onStateChange} @sunmar-modal-close=${onStateChange}>
          <span slot="title">${args.title}</span>
          <p>${args.text}</p>
          <button type="button" autofocus>Изменить параметры</button>
          ${args.actions ? html`<button slot="actions" type="button" @click=${(event: Event) => {
            (event.currentTarget as HTMLElement).closest('sunmar-modal')?.hide();
          }}>Готово</button>` : nothing}
        </sunmar-modal>
      </div>
    `;
  }
};

export const Default: Story = {
  name: "Открытие и закрытие",
  parameters: { docs: { description: { story: "Откройте окно кнопкой. Проверьте Escape, клик по фону, Tab/Shift+Tab и возврат фокуса. show() и hide() вызываются на sunmar-modal." } } },
  render: () => html`
    <div data-modal-demo>
      <sunmar-button type="primary">
        <button
          type="button"
          @click=${(event: Event) => {
            const root = (event.currentTarget as HTMLElement).closest('[data-modal-demo]');
            root?.querySelector<HTMLElement & { show(): void }>('sunmar-modal')?.show();
          }}
        >
          Открыть окно
        </button>
      </sunmar-button>

      <sunmar-modal aria-label="Подтверждение бронирования">
        <span slot="title">Подтверждение бронирования</span>
        <p>Проверьте выбранные параметры перед продолжением.</p>
        <button autofocus type="button">Изменить параметры</button>
        <button
          slot="actions"
          type="button"
          @click=${(event: Event) => {
            (event.currentTarget as HTMLElement)
              .closest<HTMLElement & { hide(): void }>('sunmar-modal')
              ?.hide();
          }}
        >
          Готово
        </button>
      </sunmar-modal>
    </div>
  `
};


export const Stacked: Story = {
  name: "Два окна",
  parameters: { docs: { description: { story: "Откройте первое, затем второе окно. Escape закрывает верхнее и возвращает фокус в первое. Следующее нажатие закрывает первое." } } },
  render: () => html`
    <div data-modal-demo>
      <button type="button" @click=${(event: Event) => {
        (event.currentTarget as HTMLElement).parentElement!.querySelector('sunmar-modal')!.show();
      }}>Открыть первое окно</button>
      <sunmar-modal aria-label="Первое окно">
        <span slot="title">Первое окно</span>
        <button type="button" @click=${(event: Event) => {
          (event.currentTarget as HTMLElement).closest('[data-modal-demo]')!.querySelectorAll('sunmar-modal')[1].show();
        }}>Открыть второе окно</button>
      </sunmar-modal>
      <sunmar-modal aria-label="Второе окно">
        <span slot="title">Второе окно</span>
        <p>Escape закрывает только это окно и возвращает фокус в первое.</p>
      </sunmar-modal>
    </div>
  `
};

export const ExplicitClose: Story = {
  name: "Закрытие только кнопкой",
  parameters: { docs: { description: { story: "Escape и фон отключены логическими атрибутами. Кнопка закрытия в заголовке остаётся доступной." } } },
  render: () => html`
    <div>
      <button type="button" @click=${(event: Event) => {
        (event.currentTarget as HTMLElement).parentElement!.querySelector('sunmar-modal')!.show();
      }}>Открыть окно</button>
      <sunmar-modal disable-close-on-esc disable-close-on-backdrop>
        <span slot="title">Подтверждение</span>
        <p>Закройте окно кнопкой в заголовке.</p>
      </sunmar-modal>
    </div>
  `
};
