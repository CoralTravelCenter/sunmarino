import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Tabs',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Доступные табы с единым состоянием в \`sunmar-tabs\`.

**Контракт**
- \`sunmar-tab\` содержит нативный \`button\`
- \`sunmar-tab-content\` содержит семантический контент панели
- одинаковый \`value\` связывает кнопку и панель
- \`sunmar-tab[forced]\` задаёт начальную активную вкладку
- служебные slots, ARIA и состояние \`active\` устанавливает контейнер

**Parts**
- \`sunmar-tabs::part(root|nav|panels)\`
- \`sunmar-tab::part(control)\`
- \`sunmar-tab-content::part(content)\`

Клавиатура: стрелки, \`Home\`, \`End\`. Пользовательское переключение создаёт
\`sunmar-tabs-change\` с \`detail: { value, previousValue }\`.
Для программного переключения используется \`tabs.forced('value')\`; пользовательское событие при этом не создаётся.
`
      }
    }
  }
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <sunmar-tabs value="turkey" style="max-width:1080px; margin:0 auto;">
      <sunmar-tab value="april"><button type="button">Почему апрель?</button></sunmar-tab>
      <sunmar-tab value="turkey" forced><button type="button">Турция</button></sunmar-tab>
      <sunmar-tab value="egypt"><button type="button">Египет</button></sunmar-tab>

      <sunmar-tab-content value="april"><h3>Почему апрель?</h3><p>Контент апреля.</p></sunmar-tab-content>
      <sunmar-tab-content value="turkey"><h3>Турция</h3><p>Контент Турции.</p></sunmar-tab-content>
      <sunmar-tab-content value="egypt"><h3>Египет</h3><p>Контент Египта.</p></sunmar-tab-content>
    </sunmar-tabs>
  `
};
