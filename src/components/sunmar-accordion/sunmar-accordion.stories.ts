import { live } from 'lit/directives/live.js';
import documentation from '../../../docs/sunmar-accordion-contract.md?raw';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Компоненты/Аккордеон',
  id: 'components-accordion',
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
  "mode": "multiple",
  "faq": false,
  "firstOpen": true,
  "disabled": false,
  "question": "Что входит в стоимость тура?",
  "answer": "Перелёт, проживание, трансфер и медицинская страховка."
};
type PlaygroundArgs = typeof playgroundArgs;

export const Playground: StoryObj<PlaygroundArgs> = {
  name: 'Песочница',
  args: playgroundArgs,
  argTypes: {
  "mode": {
    "description": "mode — несколько открытых пунктов или не более одного.",
    "control": {
      "type": "select"
    },
    "table": {
      "category": "Параметры компонента",
      "defaultValue": {
        "summary": "multiple"
      }
    },
    "options": [
      "multiple",
      "single"
    ]
  },
  "faq": {
    "description": "faq — создать рядом с группой структурированные данные FAQPage из текста вопросов и ответов.",
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
  "firstOpen": {
    "description": "Программное состояние open первого sunmar-accordion-item. Сброс примера возвращает начальное состояние.",
    "control": {
      "type": "boolean"
    },
    "table": {
      "category": "Содержимое и настройки примера",
      "defaultValue": {
        "summary": "true"
      }
    }
  },
  "disabled": {
    "description": "disabled первого пункта блокирует пользовательское переключение; не закрывает открытый ответ.",
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
  "question": {
    "description": "Слот header первого пункта.",
    "control": {
      "type": "text"
    },
    "table": {
      "category": "Содержимое и настройки примера",
      "defaultValue": {
        "summary": "Что входит в стоимость тура?"
      }
    }
  },
  "answer": {
    "description": "Ответ в слоте по умолчанию первого пункта. При faq обновляет JSON-LD.",
    "control": {
      "type": "text"
    },
    "table": {
      "category": "Содержимое и настройки примера",
      "defaultValue": {
        "summary": "Перелёт, проживание, трансфер и медицинская страховка."
      }
    }
  }
},
  parameters: {
    controls: { disable: false, expanded: true },
    docs: { description: { story: 'Изменяйте параметры в Controls. Настройки примера не являются атрибутами компонента.' }, source: { type: 'dynamic' } }
  },
  render: (args) => html`
    <sunmar-accordion mode=${args.mode} ?faq=${args.faq} style="display:block; max-width:720px;">
      <sunmar-accordion-item .open=${live(args.firstOpen)} ?disabled=${args.disabled}>
        <span slot="header">${args.question}</span><p>${args.answer}</p>
      </sunmar-accordion-item>
      <sunmar-accordion-item>
        <span slot="header">Можно ли изменить даты?</span><p>Условия изменения зависят от выбранного тарифа.</p>
      </sunmar-accordion-item>
      <sunmar-accordion-item>
        <span slot="header">Где получить документы?</span><p>Документы доступны в личном кабинете.</p>
      </sunmar-accordion-item>
    </sunmar-accordion>
  `
};

export const Multiple: Story = {
  name: "Несколько открытых пунктов",
  parameters: { docs: { description: { story: "Можно открыть несколько ответов одновременно. Недоступный пункт не переключается пользователем." } } },
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
  name: "Один ответ и FAQ",
  parameters: { docs: { description: { story: "Открытие второго ответа закрывает первый. faq создаёт рядом с группой JSON-LD FAQPage из текста вопросов и ответов." } } },
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
  name: "Обновление FAQ",
  parameters: { docs: { description: { story: "Нажатие меняет ответ в HTML. Соседний script с JSON-LD обновляется автоматически; увидеть его можно в инструментах разработчика." } } },
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
  name: "Открытый недоступный пункт",
  parameters: { docs: { description: { story: "Ответ остаётся видимым для чтения, но пользовательское раскрытие и закрытие отключены." } } },
  render: () => html`
    <sunmar-accordion-item open disabled>
      <span slot="header">Условия бронирования</span>
      <p>Содержимое доступно для чтения, пользовательское переключение заблокировано.</p>
    </sunmar-accordion-item>
  `
};
