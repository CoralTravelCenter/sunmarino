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
- \`disable-close-on-backdrop\` — отключает закрытие по клику на фон
- \`disable-close-on-esc\` — отключает закрытие по Escape
- \`aria-label\` — явное доступное имя; рекомендуется, когда внешний заголовок не используется
- \`aria-labelledby\` — id элемента, задающего доступное имя

**Фокус и фон**
- при открытии фокус переходит на элемент с \`autofocus\`, первый интерактивный light DOM-элемент, кнопку закрытия или dialog
- Tab и Shift+Tab удерживаются внутри модального окна
- после закрытия фокус возвращается на элемент, открывший окно
- фон получает \`inert\` только на время открытого состояния и затем восстанавливается

**Events**
- \`sunmar-modal-open\`
- \`sunmar-modal-close\`
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


export const Stacked: Story = {
  name: 'Два окна',
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
  name: 'Закрытие только кнопкой',
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
