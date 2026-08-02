import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import coastImageUrl from '../../dev/assets/cards/coast.jpg?url';
import resortImageUrl from '../../dev/assets/cards/resort.jpg?url';

const meta: Meta = {
  title: 'Components/Image',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Обёртка над нативными \`picture\`, \`source\` и \`img\`.

**Attributes**
- \`src\`, \`alt\`, \`width\`, \`height\`, \`loading\` передаются fallback-изображению
- \`srcset\`, \`sizes\`, \`media\` задают опциональный \`source\`
- \`loading\` принимает только \`eager\` или \`lazy\`
- положительные \`width\` и \`height\` резервируют место до загрузки изображения

**Parts**
- \`picture\`
- \`img\`
`
      }
    }
  }
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <sunmar-image
      src=${coastImageUrl}
      alt="Побережье Турции"
      width="720"
      height="480"
      loading="lazy"
      style="display:block; width:min(calc(100vw - 32px), 720px);"
    ></sunmar-image>
  `
};

export const ArtDirection: Story = {
  render: () => html`
    <sunmar-image
      srcset=${coastImageUrl}
      media="(min-width: 768px)"
      src=${resortImageUrl}
      alt="Курорт у моря"
      width="720"
      height="480"
      style="display:block; width:min(calc(100vw - 32px), 720px);"
    ></sunmar-image>
  `
};
