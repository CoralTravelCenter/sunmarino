import '../src/dev/suppress-lit-dev-warnings';
import type { Preview } from '@storybook/web-components-vite';
import '../src/styles/sunmar-tokens-runtime.scss';
import { registerSunmarComponents } from '../src/registry/register-components';

registerSunmarComponents();

const STORYBOOK_FONT_STYLE_ID = 'sunmar-storybook-fonts';

const ensureStorybookFonts = (): void => {
  if (typeof document === 'undefined' || document.getElementById(STORYBOOK_FONT_STYLE_ID)) {
    return;
  }

  const style = document.createElement('style');
  style.id = STORYBOOK_FONT_STYLE_ID;
  style.textContent = `
    @font-face {
      font-family: 'Museo Sans Cyrl';
      src:
        url('https://www.sunmar.ru/fonts/Museo_Sans/Museo_Sans_Cyrill/museosanscyrl-500-webfont.woff2') format('woff2'),
        url('https://www.sunmar.ru/fonts/Museo_Sans/Museo_Sans/MuseoSans_500.otf') format('opentype');
      font-weight: 500;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: 'Museo Sans Cyrl';
      src:
        url('https://www.sunmar.ru/fonts/Museo_Sans/Museo_Sans_Cyrill/museosanscyrl-700-webfont.ttf') format('truetype'),
        url('https://www.sunmar.ru/fonts/Museo_Sans/Museo_Sans/MuseoSans_700.otf') format('opentype');
      font-weight: 700;
      font-style: normal;
      font-display: swap;
    }

    html,
    body,
    #storybook-root {
      font-family: var(--sunmar-font-family);
    }
  `;

  document.head.appendChild(style);
};

ensureStorybookFonts();

const preview: Preview = {
  parameters: {
    layout: 'padded',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    docs: {
      canvas: {
        sourceState: 'shown'
      }
    }
  }
};

export default preview;
