import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const desktopImageUrl = 'https://b2ccdn.sunmar.ru/content/landing-pages/rb-summer/rb-kv.jpg';
const mobileImageUrl = 'https://b2ccdn.sunmar.ru/content/landing-pages/rb-summer/rb-kv-mo.jpg';
const desktopVimeoId = '1162544497';
const mobileVimeoId = '1162544372';

const meta: Meta = {
  title: 'Components/KV',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Hero/KV-компонент с SEO-friendly light DOM контентом, fallback-изображением и опциональным Vimeo background video.'
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

export const WithVideoDesktopAndMobile: Story = {
  render: () => html`
    <sunmar-kv>
      <sunmar-image
        slot="image"
        media="(min-width: 768px)"
        srcset=${desktopImageUrl}
        src=${mobileImageUrl}
        alt="Видео-фон с fallback изображением"
      ></sunmar-image>
      <div slot="video-desktop" data-vimeo-id=${desktopVimeoId}></div>
      <div slot="video-mobile" data-vimeo-id=${mobileVimeoId}></div>
      <h1 slot="title">Hero с фоновым видео</h1>
      <p slot="text">Видео появляется только после успешного playback и остается поверх fallback-картинки.</p>
      <div slot="actions">
        <sunmar-button type="primary">Подобрать тур</sunmar-button>
      </div>
    </sunmar-kv>
  `
};

export const MediaOverrides: Story = {
  render: () => html`
    <sunmar-kv
      style="
        --sunmar-kv-video-width: 140%;
        --sunmar-kv-video-height: 140%;
      "
    >
      <sunmar-image
        slot="image"
        style="--sunmar-image-object-position: 60% center;"
        media="(min-width: 768px)"
        srcset=${desktopImageUrl}
        src=${mobileImageUrl}
        alt="Кастомизированное медиа"
      ></sunmar-image>
      <div slot="video-desktop" data-vimeo-id=${desktopVimeoId}></div>
      <div slot="video-mobile" data-vimeo-id=${mobileVimeoId}></div>
      <h1 slot="title">Кастомизация media API</h1>
      <p slot="text">В этой story задокументированы object-position картинки и sizing API для Vimeo iframe.</p>
    </sunmar-kv>
  `
};
