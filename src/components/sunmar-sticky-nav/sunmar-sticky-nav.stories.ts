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
          'Горизонтальная sticky-навигация со slot-driven ссылками и responsive offset. Для корректной работы внутри Storybook показывается в контексте row-outer-container.'
      }
    }
  }
};

export default meta;

type Story = StoryObj;

const renderStickyNavStory = (topOffset?: number) => html`
  <div style="min-height: 1200px; background: #ffffff;">
    <div class="row-outer-container" style="padding: 32px; background: #f5f5f8;">
      <div style="max-width: 960px; margin: 0 auto;">
        <h2 class="sunmar-h2" style="margin: 0 0 16px;">Контекст hero-блока</h2>
        <p class="sunmar-text" style="margin: 0;">
          Sticky-nav сначала монтируется внутри контейнера, затем переносится после него для нативного position: sticky.
        </p>
        <sunmar-sticky-nav top-offset=${ifDefined(topOffset?.toString())}>
          <a slot="nav-link" href="#about" class="active">О проекте</a>
          <a slot="nav-link" href="#details">Детали</a>
          <a slot="nav-link" href="#faq">FAQ</a>
          <a slot="nav-link" href="#contacts">Контакты</a>
        </sunmar-sticky-nav>
      </div>
    </div>
    <div style="max-width: 960px; margin: 0 auto; padding: 32px;">
      <section id="about" style="min-height: 320px;">
        <h3 class="sunmar-h3">О проекте</h3>
      </section>
      <section id="details" style="min-height: 320px;">
        <h3 class="sunmar-h3">Детали</h3>
      </section>
      <section id="faq" style="min-height: 320px;">
        <h3 class="sunmar-h3">FAQ</h3>
      </section>
      <section id="contacts" style="min-height: 320px;">
        <h3 class="sunmar-h3">Контакты</h3>
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
