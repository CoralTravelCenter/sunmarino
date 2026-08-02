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

const meta: Meta = {
  title: 'Components/Sticky Nav',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Навигация с нативным \`position: sticky\`, slot-driven ссылками и автоматическим активным состоянием по \`IntersectionObserver\`.

**Attributes**
- \`top-offset\` — явный отступ sticky-навигации от верхней границы viewport
- \`teleport\` — CSS-селектор целевого узла; по умолчанию \`.row-outer-container\`
- \`disable-relocate\` — отключает перенос и имеет приоритет над \`teleport\`

**Slots**
- \`slot="nav-link"\` — рекомендуемый consumer contract: \`<a href="#section-id">...</a>\`

**Поведение**
- цель из \`teleport\` ожидается через \`MutationObserver\` не более 5 секунд; ожидание отменяется при отключении компонента или смене селектора
- некорректный CSS-селектор безопасно игнорируется
- если \`top-offset\` не задан, offset выбирается по текущему брейкпоинту при инициализации: mobile \`81\`, tablet \`65\`, desktop \`16\`
- фиксацию при прокрутке обеспечивает нативный \`position: sticky\`
- переходы выполняют нативные якорные ссылки; компонент не перехватывает клики
- active-state по scroll работает только когда у ссылок есть \`href="#id"\`, а на странице есть соответствующие секции с \`id\`
- если target section не найдена, компонент безопасно игнорирует такую ссылку

**API стилизации**
- CSS variables: \`--sunmar-sticky-nav-z-index\`, \`--sunmar-sticky-nav-bg\`, \`--sunmar-sticky-nav-border\`, \`--sunmar-sticky-nav-gap\`
- \`Parts\`: \`root\`

**Как использовать?**
- docs ниже показывают только сам компонент и его контракт
- для проверки sticky-поведения и active-state используй отдельную story с демо-секциями
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
        code: `<sunmar-sticky-nav teleport=".header-actions" top-offset="12">
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
        <section class="header-actions" style=${introStyle}>
          <h2 style="margin: 0;">Промо-блок перед навигацией</h2>
          <p style="max-width: 720px; margin: 16px 0 0;">
            Этот блок нужен, чтобы в canvas было видно нативное sticky-поведение навигации.
            Прокрути страницу вниз: навигация останется у верхней границы с заданным отступом.
          </p>
        </section>

        <sunmar-sticky-nav teleport=".header-actions" top-offset="12">
          <a slot="nav-link" href="#april">Почему апрель?</a>
          <a slot="nav-link" href="#turkey">Турция</a>
          <a slot="nav-link" href="#egypt">Египет</a>
        </sunmar-sticky-nav>

        <section id="april" style=${sectionStyle}>
          <h2 style="margin: 0;">Почему апрель?</h2>
          <p style="margin: 16px 0 0; max-width: 720px;">
            Первая тестовая секция для проверки sticky-поведения и active-state. При входе в видимую область
            соответствующая ссылка должна стать активной.
          </p>
        </section>

        <section id="turkey" style=${sectionStyle}>
          <h2 style="margin: 0;">Турция</h2>
          <p style="margin: 16px 0 0; max-width: 720px;">
            Вторая секция нужна для проверки переключения активной ссылки при скролле и поведения sticky-навигации
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
