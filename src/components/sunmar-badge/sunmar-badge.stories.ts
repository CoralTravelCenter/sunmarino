import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const STORY_HOTEL_ID = '9436';
const STORY_HOTEL_IDS = '2009,9436,47358,50487';

const setCurrentHotel = (): void => {
  window.dataLayer = [
    {
      event: 'view_item',
      ecommerce: {
        items: [{ item_id: STORY_HOTEL_ID }]
      }
    }
  ];
};

const targetContainer = () => html`
  <div
    class="PhotoGalleryMainCarousel_mainSwiperContainer__storybook"
    style="position: relative; min-height: 120px; padding: 64px 16px 16px; border-radius: 12px; background: #f5f5f8;"
  >
    Целевой блок галереи. Компонент самостоятельно перемещается сюда.
  </div>
`;

const meta: Meta = {
  title: 'Компоненты/Badge',
  id: 'components-badge',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { disable: true },
    docs: {
      description: {
        component: 'Badge проверяет текущий ID отеля из dataLayer и самостоятельно перемещается в начало блока галереи.'
      }
    }
  }
};

export default meta;

type Story = StoryObj;

export const WithTooltip: Story = {
  name: 'С информационной подсказкой',
  parameters: {
    docs: {
      description: {
        story: 'ID 9436 входит в hotel-ids, поэтому badge перемещается из исходного блока в контейнер галереи.'
      }
    }
  },
  render: () => {
    setCurrentHotel();

    return html`
      <div data-badge-source>
        <sunmar-badge hotel-ids=${STORY_HOTEL_IDS} info-button>
          <span>Бесплатно для туристов</span>
          <template slot="tooltip">
            <ul>
              <li>Аннуляция при рекомендации властей не ехать</li>
              <li>Отмена бронирования в любой ситуации</li>
              <li>Перенос дат в течение года</li>
            </ul>
          </template>
        </sunmar-badge>
      </div>
      ${targetContainer()}
    `;
  }
};

export const WithoutTooltip: Story = {
  name: 'Без информационной подсказки',
  parameters: {
    docs: {
      description: {
        story: 'Без info-button отображается только текстовая часть badge.'
      }
    }
  },
  render: () => {
    setCurrentHotel();

    return html`
      <div data-badge-source>
        <sunmar-badge hotel-ids=${STORY_HOTEL_IDS}>
          <span>Бесплатно для туристов</span>
        </sunmar-badge>
      </div>
      ${targetContainer()}
    `;
  }
};
