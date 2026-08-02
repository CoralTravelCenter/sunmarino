import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Modal',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Доступное модальное окно с управлением фокусом.

**Attributes**
- \`open\` — открытое состояние
- \`close-on-backdrop\` — закрытие по клику на фон
- \`close-on-esc\` — закрытие по Escape
- \`aria-label\` — явное доступное имя; рекомендуется, когда внешний заголовок не используется
- \`aria-labelledby\` — id элемента, задающего доступное имя

**Фокус и фон**
- при открытии фокус переходит на элемент с \`autofocus\`, первый интерактивный light DOM-элемент, кнопку закрытия или dialog
- Tab и Shift+Tab удерживаются внутри модального окна
- после закрытия фокус возвращается на элемент, открывший окно
- фон получает \`inert\` только на время открытого состояния и затем восстанавливается

**Events**
- \`sunmar-open\`
- \`sunmar-close\`
`
      }
    }
  }
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
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
