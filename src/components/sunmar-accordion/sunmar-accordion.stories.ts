import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Accordion',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Группа нативных disclosure-элементов на основе \`details/summary\`.

**Attributes sunmar-accordion**
- \`mode="multiple"\` — можно открыть несколько элементов; значение по умолчанию
- \`mode="single"\` — при открытии элемента закрывается ранее открытый
- \`faq\` — добавляет JSON-LD \`FAQPage\` по содержимому элементов

**Attributes sunmar-accordion-item**
- \`open\` — открытое состояние
- \`disabled\` — блокирует пользовательское переключение; программное изменение open разрешено

**Slots**
- \`slot="header"\` — заголовок элемента
- default slot — содержимое панели
`
      }
    }
  }
};

export default meta;
type Story = StoryObj;

export const Multiple: Story = {
  render: () => html`
    <sunmar-accordion style="display:block; width:min(calc(100vw - 32px), 720px);">
      <sunmar-accordion-item open>
        <span slot="header">Что входит в стоимость тура?</span>
        <p>Перелёт, проживание, трансфер и медицинская страховка.</p>
      </sunmar-accordion-item>
      <sunmar-accordion-item>
        <span slot="header">Можно ли изменить даты?</span>
        <p>Условия изменения зависят от выбранного тарифа и партнёров тура.</p>
      </sunmar-accordion-item>
      <sunmar-accordion-item disabled>
        <span slot="header">Недоступный вопрос</span>
        <p>Этот элемент нельзя открыть.</p>
      </sunmar-accordion-item>
    </sunmar-accordion>
  `
};

export const SingleFaq: Story = {
  render: () => html`
    <sunmar-accordion mode="single" faq style="display:block; width:min(calc(100vw - 32px), 720px);">
      <sunmar-accordion-item open>
        <span slot="header">Когда приезжать в аэропорт?</span>
        <p>Рекомендуем приехать не позднее чем за три часа до вылета.</p>
      </sunmar-accordion-item>
      <sunmar-accordion-item>
        <span slot="header">Где получить документы?</span>
        <p>Документы доступны в личном кабинете после подтверждения тура.</p>
      </sunmar-accordion-item>
    </sunmar-accordion>
  `
};


export const DynamicFaq: Story = {
  name: 'Обновление FAQ',
  render: () => html`
    <div style="width:min(calc(100vw - 32px), 720px);">
      <button type="button" @click=${(event: MouseEvent) => {
        const group = (event.currentTarget as HTMLButtonElement).parentElement!.querySelector('sunmar-accordion')!;
        const answer = group.querySelector('p')!;
        answer.textContent = answer.textContent === 'Первоначальный ответ.'
          ? 'Ответ обновлён. JSON-LD содержит тот же текст.'
          : 'Первоначальный ответ.';
      }}>Обновить ответ</button>
      <sunmar-accordion faq>
        <sunmar-accordion-item open>
          <span slot="header">Как обновляется ответ?</span>
          <p>Первоначальный ответ.</p>
        </sunmar-accordion-item>
      </sunmar-accordion>
    </div>
  `
};

export const DisabledOpen: Story = {
  name: 'Открытый недоступный пункт',
  render: () => html`
    <sunmar-accordion-item open disabled>
      <span slot="header">Условия бронирования</span>
      <p>Содержимое доступно для чтения, пользовательское переключение заблокировано.</p>
    </sunmar-accordion-item>
  `
};
