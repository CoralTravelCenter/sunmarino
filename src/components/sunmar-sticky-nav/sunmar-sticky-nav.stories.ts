import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const introStyle = `
  min-height: 56vh;
  padding: 32px;
  border-radius: 32px;
  background: linear-gradient(180deg, #f5f5f8 0%, #ffffff 100%);
  color: #1a1a1a;
`;

const sectionStyle = `
  min-height: 75vh;
  padding: 32px;
  border-radius: 24px;
  background: #f5f5f8;
  color: #1a1a1a;
`;

const navMarkup = html`
  <sunmar-sticky-nav>
    <a slot="nav-link" href="#april">Почему апрель?</a>
    <a slot="nav-link" href="#turkey">Турция</a>
    <a slot="nav-link" href="#egypt">Египет</a>
  </sunmar-sticky-nav>
`;

const meta: Meta = {
  title: 'Components/Sticky Nav',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Навигация с переходом в fixed-состояние при прокрутке, slot-driven ссылками и автоматическим активным состоянием по \`IntersectionObserver\`.

**Attributes**
- \`top-offset\` — явный override отступа от верхней границы viewport для fixed-состояния

**Slots**
- \`slot="nav-link"\` — рекомендуемый consumer contract: \`<a href="#section-id">...</a>\`

**Поведение**
- если \`top-offset\` не задан, offset выбирается по текущему брейкпоинту при инициализации: mobile \`81\`, tablet \`65\`, desktop \`16\`
- при достижении порога компонент переходит в fixed-состояние
- порог фиксирования определяется через внутренний \`sentinel\`
- active-state по scroll работает только когда у ссылок есть \`href="#id"\`, а на странице есть соответствующие секции с \`id\`
- если target section не найдена, компонент безопасно игнорирует такую ссылку

**API стилизации**
- CSS variables: \`--sunmar-sticky-nav-z-index\`, \`--sunmar-sticky-nav-bg\`, \`--sunmar-sticky-nav-border\`, \`--sunmar-sticky-nav-gap\`
- \`Parts\`: \`root\`
- служебный host-класс: \`sunmar-sticky-nav--stuck\`

**Как использовать?**
- docs ниже показывают только сам компонент и его контракт
- для проверки fixed-поведения и active-state используй отдельную story с демо-секциями
`
      }
    }
  }
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: 'Demo со скроллом',
  parameters: {
    docs: {
      source: {
        code: `<sunmar-sticky-nav top-offset="12">
  <a slot="nav-link" href="#april">Почему апрель?</a>
  <a slot="nav-link" href="#turkey">Турция</a>
  <a slot="nav-link" href="#egypt">Египет</a>
</sunmar-sticky-nav>`
      }
    }
  },
  render: () => html`
    <div style="background: #ffffff; padding: 24px 16px 120px;">
      <div style="max-width: 1280px; margin: 0 auto; display: grid; gap: 24px;">
        <section style=${introStyle}>
          <h2 style="margin: 0;">Промо-блок перед навигацией</h2>
          <p style="max-width: 720px; margin: 16px 0 0;">
            Этот блок нужен, чтобы в canvas было видно момент перехода навигации в fixed-состояние.
            Прокрути страницу вниз: сначала навигация находится в потоке, затем фиксируется у верхней границы.
          </p>
        </section>

        <sunmar-sticky-nav top-offset="12">
          <a slot="nav-link" href="#april">Почему апрель?</a>
          <a slot="nav-link" href="#turkey">Турция</a>
          <a slot="nav-link" href="#egypt">Египет</a>
        </sunmar-sticky-nav>

        <section id="april" style=${sectionStyle}>
          <h2 style="margin: 0;">Почему апрель?</h2>
          <p style="margin: 16px 0 0; max-width: 720px;">
            Первая тестовая секция для проверки fixed-перехода и active-state. При входе в видимую область
            соответствующая ссылка должна стать активной.
          </p>
        </section>

        <section id="turkey" style=${sectionStyle}>
          <h2 style="margin: 0;">Турция</h2>
          <p style="margin: 16px 0 0; max-width: 720px;">
            Вторая секция нужна для проверки переключения активной ссылки при скролле и поведения fixed-навигации
            на длинной странице.
          </p>
        </section>

        <section id="egypt" style=${sectionStyle}>
          <h2 style="margin: 0;">Египет</h2>
          <p style="margin: 16px 0 0; max-width: 720px;">
            Третья секция завершает минимальный сценарий интеграции. На ней удобно проверять, что предыдущие
            ссылки корректно теряют активное состояние.
          </p>
        </section>
      </div>
    </div>
  `
};
