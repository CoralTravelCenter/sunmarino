import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const panelStyle = `
  padding: 24px;
  border-radius: 24px;
  background: #f5f5f8;
  color: #1a1a1a;
`;

const externalControlCode = `<div class="tabs-controls">
  <button type="button" data-tab-target="april">Почему апрель?</button>
  <button type="button" data-tab-target="turkey">Турция</button>
  <button type="button" data-tab-target="egypt">Египет</button>
</div>

<sunmar-tabs id="travel-tabs" value="turkey">
  <sunmar-tabs-nav slot="nav">
    <sunmar-tab-trigger value="april">Почему апрель?</sunmar-tab-trigger>
    <sunmar-tab-trigger value="turkey">Турция</sunmar-tab-trigger>
    <sunmar-tab-trigger value="egypt">Египет</sunmar-tab-trigger>
  </sunmar-tabs-nav>

  <sunmar-tab-panel value="april">Контент апреля</sunmar-tab-panel>
  <sunmar-tab-panel value="turkey">Контент Турции</sunmar-tab-panel>
  <sunmar-tab-panel value="egypt">Контент Египта</sunmar-tab-panel>
</sunmar-tabs>

<script>
  const tabs = document.querySelector('#travel-tabs');

  document.querySelectorAll('[data-tab-target]').forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.getAttribute('data-tab-target');
      if (!tabs || !value) {
        return;
      }

      tabs.value = value;
    });
  });
</script>`;

const meta: Meta = {
  title: 'Components/Tabs',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Компонент семейства tabs с единым owner state в \`sunmar-tabs\`.

**Семантический контракт**
- \`sunmar-tabs\` хранит текущее значение вкладки в \`value\`
- в \`slot="nav"\` ожидается \`sunmar-tabs-nav\`
- внутри \`sunmar-tabs-nav\` ожидаются \`sunmar-tab-trigger\`
- в default slot \`sunmar-tabs\` ожидаются \`sunmar-tab-panel\`

**Attributes**
- \`sunmar-tabs[value]\` — текущее активное значение вкладки
- \`sunmar-tab-trigger[value]\` — стабильный технический идентификатор trigger
- \`sunmar-tab-trigger[selected]\` — служебное состояние, синхронизируется контейнером
- \`sunmar-tab-trigger[disabled]\` — исключает trigger из выбора и клавиатурной навигации
- \`sunmar-tab-panel[value]\` — идентификатор панели
- \`sunmar-tab-panel[active]\` — служебное состояние, синхронизируется контейнером

**Slots**
- \`sunmar-tabs\`: \`nav\`, default
- \`sunmar-tabs-nav\`: default
- \`sunmar-tab-trigger\`: default
- \`sunmar-tab-panel\`: default

**Parts**
- \`sunmar-tabs-nav::part(list)\`
- \`sunmar-tab-trigger::part(control)\`
- \`sunmar-tab-panel::part(content)\`

**Поведение**
- \`sunmar-tabs\` сам синхронизирует \`selected\` у trigger и \`active\` у panel
- клавиатурная навигация поддерживает \`ArrowLeft/ArrowRight\`, \`ArrowUp/ArrowDown\`, \`Home\`, \`End\`
- при пользовательском переключении компонент dispatches \`sunmar-tabs-change\`
- при внешнем \`tabs.value = ...\` компонент обновляет состояние реактивно, без дополнительного imperative API

**Как использовать?**
Внешнее управление делается через reactive property \`value\`. Это и есть правильный controlled-сценарий:

\`\`\`html
${externalControlCode}
\`\`\`
`
      }
    }
  }
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="max-width: 1080px; margin: 0 auto;">
      <sunmar-tabs value="turkey">
        <sunmar-tabs-nav slot="nav">
          <sunmar-tab-trigger value="april">Почему апрель?</sunmar-tab-trigger>
          <sunmar-tab-trigger value="turkey">Турция</sunmar-tab-trigger>
          <sunmar-tab-trigger value="egypt">Египет</sunmar-tab-trigger>
        </sunmar-tabs-nav>

        <sunmar-tab-panel value="april">
          <div style=${panelStyle}>
            <h3 style="margin: 0;">Почему апрель?</h3>
            <p style="margin: 16px 0 0;">
              Базовый demo tabs-family: контейнер владеет state, trigger отвечает за переключение,
              panel — только за показ контента.
            </p>
          </div>
        </sunmar-tab-panel>

        <sunmar-tab-panel value="turkey">
          <div style=${panelStyle}>
            <h3 style="margin: 0;">Турция</h3>
            <p style="margin: 16px 0 0;">
              Эта панель выбрана по умолчанию через \`value="turkey"\` на \`sunmar-tabs\`.
            </p>
          </div>
        </sunmar-tab-panel>

        <sunmar-tab-panel value="egypt">
          <div style=${panelStyle}>
            <h3 style="margin: 0;">Египет</h3>
            <p style="margin: 16px 0 0;">
              Третья панель нужна для проверки visual contract и переключения по клавиатуре.
            </p>
          </div>
        </sunmar-tab-panel>
      </sunmar-tabs>
    </div>
  `
};

export const ControlledByButtons: Story = {
  name: 'Внешнее управление кнопками',
  parameters: {
    docs: {
      source: {
        code: externalControlCode
      }
    }
  },
  render: () => {
    const root = document.createElement('div');
    root.style.maxWidth = '1080px';
    root.style.margin = '0 auto';
    root.style.display = 'grid';
    root.style.gap = '24px';

    root.innerHTML = `
      <div style="display:flex; flex-wrap:wrap; gap:12px;">
        <button type="button" data-tab-target="april">Почему апрель?</button>
        <button type="button" data-tab-target="turkey">Турция</button>
        <button type="button" data-tab-target="egypt">Египет</button>
      </div>

      <sunmar-tabs value="turkey">
        <sunmar-tabs-nav slot="nav">
          <sunmar-tab-trigger value="april">Почему апрель?</sunmar-tab-trigger>
          <sunmar-tab-trigger value="turkey">Турция</sunmar-tab-trigger>
          <sunmar-tab-trigger value="egypt">Египет</sunmar-tab-trigger>
        </sunmar-tabs-nav>

        <sunmar-tab-panel value="april">
          <div style="${panelStyle}">
            <h3 style="margin: 0;">Почему апрель?</h3>
            <p style="margin: 16px 0 0;">
              Эта панель переключается внешними кнопками через \`tabs.value = 'april'\`.
            </p>
          </div>
        </sunmar-tab-panel>

        <sunmar-tab-panel value="turkey">
          <div style="${panelStyle}">
            <h3 style="margin: 0;">Турция</h3>
            <p style="margin: 16px 0 0;">
              Внешний control не кликает trigger напрямую, а меняет reactive value контейнера.
            </p>
          </div>
        </sunmar-tab-panel>

        <sunmar-tab-panel value="egypt">
          <div style="${panelStyle}">
            <h3 style="margin: 0;">Египет</h3>
            <p style="margin: 16px 0 0;">
              Это controlled-сценарий: внешний UI управляет tabs через одно source of truth.
            </p>
          </div>
        </sunmar-tab-panel>
      </sunmar-tabs>
    `;

    const tabs = root.querySelector('sunmar-tabs');
    const buttons = root.querySelectorAll<HTMLButtonElement>('[data-tab-target]');

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const value = button.getAttribute('data-tab-target');
        if (!tabs || !value) {
          return;
        }

        tabs.value = value;
      });
    });

    return root;
  }
};
