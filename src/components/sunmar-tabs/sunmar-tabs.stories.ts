import { live } from 'lit/directives/live.js';
import { useArgs } from 'storybook/preview-api';
import documentation from '../../../docs/sunmar-tabs-contract.md?raw';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Компоненты/Tabs',
  id: 'components-tabs',
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
  "value": "turkey",
  "label": "Направления отдыха",
  "disabledEgypt": false
};
type PlaygroundArgs = typeof playgroundArgs;

export const Playground: StoryObj<PlaygroundArgs> = {
  name: 'Песочница',
  args: playgroundArgs,
  argTypes: {
  "value": {
    "description": "value — идентификатор выбранной пары. Программный выбор не создаёт sunmar-tabs-change.",
    "control": {
      "type": "select"
    },
    "table": {
      "category": "Параметры компонента",
      "defaultValue": {
        "summary": "Пустая строка; затем первая доступная пара"
      }
    },
    "options": [
      "april",
      "turkey",
      "egypt"
    ]
  },
  "label": {
    "description": "aria-label / label — доступное имя списка вкладок.",
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
  "disabledEgypt": {
    "description": "disabled на нативной кнопке «Египет». При отключении выбранной вкладки выбирается первая доступная.",
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
  render: function Render(args) {
    const [, updateArgs] = useArgs<PlaygroundArgs>();
    const value = args.disabledEgypt && args.value === 'egypt' ? 'april' : args.value;
    if (value !== args.value) updateArgs({ value });
    return html`
      <div>
        <sunmar-tabs .value=${live(value)} aria-label=${args.label}
          @sunmar-tabs-change=${(event: CustomEvent<{ value: string; previousValue: string | null }>) => {
            updateArgs({ value: event.detail.value });
            const output = (event.currentTarget as HTMLElement).parentElement?.querySelector('output');
            if (output) output.textContent = `sunmar-tabs-change: ${JSON.stringify(event.detail)}`;
          }}>
          <sunmar-tab value="april"><button type="button">Почему апрель?</button></sunmar-tab>
          <sunmar-tab value="turkey"><button type="button">Турция</button></sunmar-tab>
          <sunmar-tab value="egypt"><button type="button" ?disabled=${args.disabledEgypt}>Египет</button></sunmar-tab>
          <sunmar-tab-content value="april"><h3>Почему апрель?</h3><p>Комфортная погода для прогулок.</p></sunmar-tab-content>
          <sunmar-tab-content value="turkey"><h3>Турция</h3><p>Отели для семейного отдыха.</p></sunmar-tab-content>
          <sunmar-tab-content value="egypt"><h3>Египет</h3><p>Море и коралловые рифы.</p></sunmar-tab-content>
        </sunmar-tabs>
        <p><output aria-live="polite">Переключите вкладку мышью или стрелками, чтобы увидеть событие.</output></p>
      </div>
    `;
  }
};

export const Default: Story = {
  name: "Начально выбранная вкладка",
  parameters: { docs: { description: { story: "forced задаёт начальный выбор «Турция». Дальше можно переключаться мышью, стрелками, Home и End." } } },
  decorators: [(story) => html`<div class="storybook-demo storybook-demo--centered storybook-demo--tabs">${story()}</div>`],
  render: () => html`
    <sunmar-tabs aria-label="Направления отдыха" value="turkey">
      <sunmar-tab value="april"><button type="button">Почему апрель?</button></sunmar-tab>
      <sunmar-tab value="turkey" forced><button type="button">Турция</button></sunmar-tab>
      <sunmar-tab value="egypt"><button type="button">Египет</button></sunmar-tab>

      <sunmar-tab-content value="april"><h3>Почему апрель?</h3><p>Контент апреля.</p></sunmar-tab-content>
      <sunmar-tab-content value="turkey"><h3>Турция</h3><p>Контент Турции.</p></sunmar-tab-content>
      <sunmar-tab-content value="egypt"><h3>Египет</h3><p>Контент Египта.</p></sunmar-tab-content>
    </sunmar-tabs>
  `
};


export const Dynamic: Story = {
  name: "Динамические вкладки",
  parameters: { docs: { description: { story: "Добавьте второй раздел, затем отключите его. Выбор возвращается к первому доступному. Программное переключение через value не создаёт пользовательское событие." } } },
  render: () => html`
    <div>
      <button type="button" @click=${(event: Event) => {
        const tabs = (event.currentTarget as HTMLElement).parentElement!.querySelector('sunmar-tabs')!;
        if (!tabs.querySelector('sunmar-tab[value="second"]')) {
          const tab = document.createElement('sunmar-tab');
          tab.value = 'second';
          const button = document.createElement('button');
          button.type = 'button'; button.textContent = 'Второй раздел';
          tab.append(button);
          const panel = document.createElement('sunmar-tab-content');
          panel.value = 'second'; panel.textContent = 'Динамически добавленное содержимое.';
          tabs.append(tab, panel);
        }
        tabs.value = 'second';
      }}>Добавить и выбрать второй раздел</button>
      <button type="button" @click=${(event: Event) => {
        const button = (event.currentTarget as HTMLElement).parentElement!
          .querySelector<HTMLButtonElement>('sunmar-tab[value="second"] > button');
        if (button) button.disabled = !button.disabled;
      }}>Переключить доступность второго раздела</button>
      <sunmar-tabs aria-label="Разделы примера">
        <sunmar-tab value="first"><button type="button">Первый раздел</button></sunmar-tab>
        <sunmar-tab-content value="first"><p>Первоначальное содержимое.</p></sunmar-tab-content>
      </sunmar-tabs>
    </div>
  `
};
