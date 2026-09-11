import documentation from '../../../docs/sunmar-sticky-nav-contract.md?raw';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Компоненты/Sticky Navigation',
  id: 'components-sticky-nav',
  tags: ['autodocs'],
  decorators: [(story) => html`<div class="storybook-sticky-demo">${story()}</div>`],
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: { description: { component: documentation.replace(/^# .+\n/, '') } }
  }
};

export default meta;

type Story = StoryObj;

const playgroundArgs = {
  "topOffset": 12,
  "autoOffset": false,
  "disableRelocate": true,
  "teleport": "[data-playground-anchor]"
};
type PlaygroundArgs = typeof playgroundArgs;

export const Playground: StoryObj<PlaygroundArgs> = {
  name: 'Песочница',
  args: playgroundArgs,
  argTypes: {
  "topOffset": {
    "description": "top-offset / topOffset — отступ от верхней границы в пикселях.",
    "control": {
      "type": "number"
    },
    "table": {
      "category": "Параметры компонента",
      "defaultValue": {
        "summary": "81px / 65px / 16px по ширине окна"
      }
    }
  },
  "autoOffset": {
    "description": "Удалить top-offset и использовать адаптивные CSS-значения.",
    "control": {
      "type": "boolean"
    },
    "table": {
      "category": "Содержимое и настройки примера",
      "defaultValue": {
        "summary": "false"
      }
    }
  },
  "disableRelocate": {
    "description": "disable-relocate / disableRelocate — запретить дальнейший перенос. Не возвращает навигацию на старое место.",
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
  "teleport": {
    "description": "teleport — CSS-селектор элемента, после которого будет размещена навигация.",
    "control": {
      "type": "text"
    },
    "table": {
      "category": "Параметры компонента",
      "defaultValue": {
        "summary": ".row-outer-container"
      }
    }
  }
},
  parameters: {
    controls: { disable: false, expanded: true },
    docs: { description: { story: 'Изменяйте параметры в Controls. Настройки примера не являются атрибутами компонента.' }, source: { type: 'dynamic' } }
  },
  render: (args) => html`
    <div data-sticky-page>
      <section data-playground-anchor data-sticky-intro>
        <h2>Навигация по направлениям</h2>
        <p>Прокрутите пример вниз. Для проверки переноса выключите disableRelocate; навигация располагается после этого блока.</p>
      </section>
      <div data-sticky-spacer aria-hidden="true"></div>
      <sunmar-sticky-nav .topOffset=${args.autoOffset ? undefined : args.topOffset}
        ?disable-relocate=${args.disableRelocate} teleport=${args.teleport}>
        <a slot="nav-link" href="#playground-april">Почему апрель?</a>
        <a slot="nav-link" href="#playground-turkey">Турция</a>
        <a slot="nav-link" href="#playground-egypt">Египет</a>
      </sunmar-sticky-nav>
      ${['april', 'turkey', 'egypt'].map((id, index) => html`
        <section id=${`playground-${id}`} data-sticky-section>
          <h2>${['Почему апрель?', 'Турция', 'Египет'][index]}</h2>
          <p>Ссылка получает подсветку, когда раздел достаточно виден в области просмотра.</p>
        </section>
      `)}
    </div>
  `
};

export const Default: Story = {
  name: "Прокрутка и перенос",
  parameters: {
    docs: {
      description: { story: "Навигация переносится после промо-блока. Прокручивайте сам пример: фиксация зависит от предков, подсветка — от видимости секций." },
      source: {
        code: `<sunmar-sticky-nav teleport=".header-actions" top-offset="12">
  <a slot="nav-link" href="#april">Почему апрель?</a>
  <a slot="nav-link" href="#turkey">Турция</a>
  <a slot="nav-link" href="#egypt">Египет</a>
</sunmar-sticky-nav>`
      }
    }
  },
  render: () => html`
    <div data-sticky-page>
      <div data-sticky-layout>
        <section class="header-actions" data-sticky-intro>
          <h2>Промо-блок перед навигацией</h2>
          <p>
            Этот блок нужен, чтобы в canvas было видно нативное sticky-поведение навигации.
            Прокрути страницу вниз: навигация останется у верхней границы с заданным отступом.
          </p>
        </section>

        <sunmar-sticky-nav teleport=".header-actions" top-offset="12">
          <a slot="nav-link" href="#april">Почему апрель?</a>
          <a slot="nav-link" href="#turkey">Турция</a>
          <a slot="nav-link" href="#egypt">Египет</a>
        </sunmar-sticky-nav>

        <section id="april" data-sticky-section>
          <h2>Почему апрель?</h2>
          <p>
            Первая тестовая секция для проверки sticky-поведения и active-state. При входе в видимую область
            соответствующая ссылка должна стать активной.
          </p>
        </section>

        <section id="turkey" data-sticky-section>
          <h2>Турция</h2>
          <p>
            Вторая секция нужна для проверки переключения активной ссылки при скролле и поведения sticky-навигации
            на длинной странице.
          </p>
        </section>

        <section id="egypt" data-sticky-section>
          <h2>Египет</h2>
          <p>
            Третья секция завершает минимальный сценарий интеграции. На ней удобно проверять, что предыдущие
            ссылки корректно теряют активное состояние.
          </p>
        </section>
      </div>
    </div>
  `
};


export const Dynamic: Story = {
  name: "Изменение ссылки и раздела",
  parameters: { docs: { description: { story: "Кнопка одновременно меняет href ссылки и id раздела. Компонент повторно связывает их для подсветки." } } },
  render: () => html`
    <div data-sticky-page>
      <button type="button" @click=${(event: Event) => {
        const root = (event.currentTarget as HTMLElement).parentElement!;
        const link = root.querySelector('a')!;
        const section = root.querySelector('section')!;
        const next = section.id === 'dynamic-first' ? 'dynamic-second' : 'dynamic-first';
        section.id = next;
        link.setAttribute('href', '#' + next);
        link.textContent = next === 'dynamic-first' ? 'Первый раздел' : 'Обновлённый раздел';
      }}>Изменить ссылку и ID раздела</button>
      <sunmar-sticky-nav disable-relocate top-offset="0">
        <a slot="nav-link" href="#dynamic-first">Первый раздел</a>
      </sunmar-sticky-nav>
      <section id="dynamic-first" data-sticky-section>
        <h2>Динамический раздел</h2>
        <p>Подсветка продолжает работать после изменения ID и ссылки.</p>
      </section>
    </div>
  `
};
