import type { StorybookConfig } from '@storybook/web-components-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)', '../src/stories/**/*.mdx'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: '@storybook/web-components-vite',
  docs: {
    autodocs: 'tag',
    defaultName: 'Документация'
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      build: {
        target: 'es2020'
      }
    });
  }
};

export default config;
