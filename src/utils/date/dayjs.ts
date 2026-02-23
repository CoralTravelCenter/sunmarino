import dayjsFactory from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjsFactory.extend(customParseFormat);
dayjsFactory.extend(localizedFormat);

const localeLoaders: Record<string, () => Promise<unknown>> = {
  en: () => import('dayjs/locale/en'),
  ru: () => import('dayjs/locale/ru')
};

const loadedLocales = new Set<string>(['en']);

export const dayjs = dayjsFactory;

export async function ensureDayjsLocale(locale: string): Promise<void> {
  if (loadedLocales.has(locale)) {
    dayjs.locale(locale);
    return;
  }

  const loader = localeLoaders[locale];
  if (!loader) {
    return;
  }

  await loader();
  loadedLocales.add(locale);
  dayjs.locale(locale);
}
