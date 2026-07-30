import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Button',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Стилевая оболочка для нативного \`button\` или \`a\` в light DOM.

**Семантический контракт**
- потребитель передает нативный \`<button>\` или \`<a>\` через default slot
- нативный элемент самостоятельно отвечает за семантику, события, форму или навигацию
- компонент отвечает только за визуальный контракт

**Attributes**
- \`type\` — визуальный вариант: \`primary\`, \`secondary\`, \`neutral\`

**Slots**
- default slot — один нативный \`button\` или \`a\`

**Поведение**
- \`type/disabled/form/name/value\` задаются непосредственно на slotted \`button\`
- \`href/target/rel\` задаются непосредственно на slotted \`a\`
- события подписываются на нативный элемент и не эмулируются компонентом
- компонент не управляет шириной, позиционированием и внешними отступами
- для layout нескольких action-элементов рекомендуется \`sunmar-button-group\`
`
      }
    }
  }
};

export default meta;

type Story = StoryObj;

export const Primary: Story = {
  render: () => html`
    <sunmar-button type="primary">
      <button type="button">Подобрать тур</button>
    </sunmar-button>
  `
};

export const Secondary: Story = {
  render: () => html`
    <sunmar-button type="secondary">
      <a href="#details">Подробнее</a>
    </sunmar-button>
  `
};

export const NeutralWithIcon: Story = {
  render: () => html`
    <sunmar-button type="neutral">
      <button type="button"><span aria-hidden="true">★</span> Избранное</button>
    </sunmar-button>
  `
};

export const Disabled: Story = {
  render: () => html`
    <sunmar-button type="primary">
      <button type="button" disabled>Недоступно</button>
    </sunmar-button>
  `
};

export const ExternalForm: Story = {
  render: () => html`
    <div style="display: grid; gap: 16px; min-width: 320px;">
      <form
        id="sunmar-booking-form"
        @submit=${(event: SubmitEvent) => {
          event.preventDefault();
          const form = event.currentTarget as HTMLFormElement;
          const output = form.parentElement?.querySelector<HTMLOutputElement>(
            '#sunmar-booking-output'
          );
          if (output) {
            output.value = 'Форма отправлена';
          }
        }}
      >
        <label>
          Направление
          <input name="destination" value="Турция" />
        </label>
      </form>

      <sunmar-button type="primary">
        <button
          type="submit"
          form="sunmar-booking-form"
          name="action"
          value="search"
        >
          Найти тур
        </button>
      </sunmar-button>
      <sunmar-button type="neutral">
        <button type="reset" form="sunmar-booking-form">Сбросить</button>
      </sunmar-button>
      <output id="sunmar-booking-output" aria-live="polite"></output>
    </div>
  `
};
