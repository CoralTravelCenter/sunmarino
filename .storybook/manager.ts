import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Sunmarino UI',
    brandUrl: '/',
    brandImage: 'https://b2ccdn.sunmar.ru/content/logos/main_logo_14052024055416.svg',
  }),
});
