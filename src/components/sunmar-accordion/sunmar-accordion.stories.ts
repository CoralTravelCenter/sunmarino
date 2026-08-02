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
- \`disabled\` — блокирует переключение элемента

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
