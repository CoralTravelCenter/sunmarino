import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

const meta: Meta = {
  title: 'Components/Sticky Nav',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Sticky-навигация со slot-driven ссылками, responsive offset и автоматическим active-state по IntersectionObserver.'
      }
    }
  }
};

export default meta;

type Story = StoryObj;

const renderStickyNavStory = (topOffset?: number) => html`
  <div style="min-height: 100vh; background: #ffffff; padding: 24px 0 80px;">
    <sunmar-sticky-nav
      disable-relocate
      top-offset=${ifDefined(topOffset?.toString())}
    >
      <a slot="nav-link" href="#april">Почему апрель?</a>
      <a slot="nav-link" href="#turkey">Турция</a>
      <a slot="nav-link" href="#egypt">Египет</a>
      <a slot="nav-link" href="#maldives">Мальдивы</a>
      <a slot="nav-link" href="#thailand">Таиланд</a>
    </sunmar-sticky-nav>

    <div style="display: flex; flex-direction: column; gap: 24px; padding: 24px 0 0;">
      <section id="april" style="min-height: 70vh; padding: 32px; border-radius: 24px; background: #f5f5f8;">
        <h2 class="sunmar-h2" style="margin: 0;">Почему апрель?</h2>
      </section>
      <section id="turkey" style="min-height: 70vh; padding: 32px; border-radius: 24px; background: #f5f5f8;">
        <h2 class="sunmar-h2" style="margin: 0;">Турция</h2>
      </section>
      <section id="egypt" style="min-height: 70vh; padding: 32px; border-radius: 24px; background: #f5f5f8;">
        <h2 class="sunmar-h2" style="margin: 0;">Египет</h2>
      </section>
      <section id="maldives" style="min-height: 70vh; padding: 32px; border-radius: 24px; background: #f5f5f8;">
        <h2 class="sunmar-h2" style="margin: 0;">Мальдивы</h2>
      </section>
      <section id="thailand" style="min-height: 70vh; padding: 32px; border-radius: 24px; background: #f5f5f8;">
        <h2 class="sunmar-h2" style="margin: 0;">Таиланд</h2>
      </section>
    </div>
  </div>
`;

export const Default: Story = {
  render: () => renderStickyNavStory()
};

export const CustomOffset: Story = {
  render: () => renderStickyNavStory(24)
};
