import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Sticky Nav',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Sticky-навигация со slot-driven ссылками, responsive offset и автоматическим active-state по \`IntersectionObserver\`.

**Attributes**
- \`top-offset\` — явный override sticky-отступа от верхней границы viewport
- \`disable-relocate\` — отключает автоматический перенос компонента после ближайшего \`.row-outer-container\`

**Slot contract**
- \`slot="nav-link"\` — рекомендуемый consumer contract: \`<a href="#section-id">...</a>\`

**Behavior**
- если \`top-offset\` не задан, offset вычисляется реактивно: mobile \`81\`, tablet \`65\`, desktop \`16\`
- active-state по scroll работает только когда у ссылок есть \`href="#id"\`, а на странице есть соответствующие секции с \`id\`
- если target section не найдена, компонент безопасно игнорирует такую ссылку

**Styling API**
- CSS variables: \`--sunmar-sticky-nav-z-index\`, \`--sunmar-sticky-nav-bg\`, \`--sunmar-sticky-nav-border\`, \`--sunmar-sticky-nav-gap\`
- part: \`root\`
`
      }
    }
  }
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="background: #ffffff; padding: 24px 0 80px;">
      <sunmar-sticky-nav disable-relocate>
        <a slot="nav-link" href="#april">Почему апрель?</a>
        <a slot="nav-link" href="#turkey" class="active">Турция</a>
        <a slot="nav-link" href="#egypt">Египет</a>
        <a slot="nav-link" href="#maldives">Мальдивы</a>
        <a slot="nav-link" href="#thailand">Таиланд</a>
      </sunmar-sticky-nav>
    </div>
  `
};
