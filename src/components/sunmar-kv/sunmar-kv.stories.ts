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

**Семантический контракт**
- \`slot="title"\` — ожидается семантический заголовок \`h1|h2|h3\`
- \`slot="text"\` — ожидается \`p\`
- \`slot="actions"\` — CTA-контент

**Медиаконтракт**
- \`slot="image"\` — медиаконтент компонента

**API стилизации**
- image positioning: \`--sunmar-image-object-position\`
- доступны \`Parts\`: \`root\`, \`media\`, \`picture\`, \`content\`, \`content-inner\`, \`eyebrow\`, \`title\`, \`text\`
- высоты баннера являются минимальными; длинный контент может увеличить блок
- actions сохраняет собственный display, поэтому группу кнопок можно передавать прямо в slot
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
      <sunmar-button-group slot="actions" type="primary">
        <sunmar-button>
          <button type="button">Подобрать тур</button>
        </sunmar-button>
        <sunmar-button type="secondary">
          <a href="#details">Подробнее</a>
        </sunmar-button>
      </sunmar-button-group>
    </sunmar-kv>
  `
};
