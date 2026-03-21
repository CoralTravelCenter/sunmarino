import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const desktopImageUrl = 'https://b2ccdn.sunmar.ru/content/landing-pages/rb-summer/rb-kv.jpg';
const mobileImageUrl = 'https://b2ccdn.sunmar.ru/content/landing-pages/rb-summer/rb-kv-mo.jpg';

const meta: Meta = {
  title: 'Components/KV',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Hero/KV-компонент с SEO-friendly light DOM контентом.

**Semantic contract**
- \`slot="title"\` — ожидается семантический заголовок \`h1|h2|h3\`
- \`slot="text"\` — ожидается \`p\`
- \`slot="actions"\` — CTA-контент

**Media contract**
- \`slot="image"\` — baseline media, остается главным fallback
- \`slot="video-desktop"\` и \`slot="video-mobile"\` — опциональные config-узлы с \`data-vimeo-id\`
- видео проявляется только после успешного playback и не заменяет fallback-картинку до загрузки

**Styling API**
- CSS variables: \`--sunmar-kv-video-width\`, \`--sunmar-kv-video-height\`
- image positioning: \`--sunmar-image-object-position\`
- доступны \`::part(root|media|picture|video|video-frame|content|content-inner|eyebrow|title|text|actions)\`
`
      }
    }
  }
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <sunmar-kv>
      <sunmar-image
        slot="image"
        media="(min-width: 768px)"
        srcset=${desktopImageUrl}
        src=${mobileImageUrl}
        alt="Раннее бронирование туров"
      ></sunmar-image>
      <h1 slot="title">ОчеВИДНАЯ выгода Раннего бронирования</h1>
      <p slot="text">Скидки до 50% и предоплата 20% от стоимости.</p>
      <div slot="actions">
        <sunmar-button type="primary">Подобрать тур</sunmar-button>
      </div>
    </sunmar-kv>
  `
};
