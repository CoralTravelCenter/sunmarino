import type { Preview } from '@storybook/web-components-vite';
import '../src/index';

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
