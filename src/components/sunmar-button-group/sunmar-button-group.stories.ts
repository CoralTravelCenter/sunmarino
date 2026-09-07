import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Button Group',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Layout-компонент для action-layer.

**Коротко**
- группирует несколько action-элементов в один визуальный блок
- держит единый \`gap\` и \`wrap\`
- принимает action-компоненты через default slot
- не меняет семантику и события вложенных нативных элементов
`
      }
    }
  }
};

export default meta;

type Story = StoryObj;

export const Preview: Story = {
  render: () => html`
    <sunmar-button-group>
      <sunmar-button type="primary"><button type="button">Подобрать тур</button></sunmar-button>
      <sunmar-button type="neutral"><button type="button">В избранное</button></sunmar-button>
      <sunmar-button type="secondary"><a href="#details">Подробнее</a></sunmar-button>
    </sunmar-button-group>
  `
};

export const InheritedSettings: Story = {
  render: () => html`
    <sunmar-button-group type="secondary" size="large">
      <sunmar-button><button type="button">От группы</button></sunmar-button>
      <sunmar-button type="primary"><button type="button">Свой тип</button></sunmar-button>
      <sunmar-button size="small"><a href="#details">Свой размер</a></sunmar-button>
    </sunmar-button-group>
  `
};

export const ResponsiveDirection: Story = {
  render: () => html`
    <style>
      .responsive-button-group { --sunmarino-button-group-direction: column; }
      @media (min-width: 768px) {
        .responsive-button-group { --sunmarino-button-group-direction: row; }
      }
    </style>
    <sunmar-button-group class="responsive-button-group" type="secondary">
      <sunmar-button><button type="button">Подобрать тур</button></sunmar-button>
      <sunmar-button><a href="#details">Подробнее</a></sunmar-button>
    </sunmar-button-group>
  `
};
