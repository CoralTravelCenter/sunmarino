# Sunmarino Web Components

Стартовый каркас библиотеки компонентов:

- `Lit + TypeScript`
- `SCSS` стили импортируются в компоненты (`*.scss?inline`)
- `vite-plugin-monkey` используется только в `dev`
- production build собирается как библиотека (`es` + `iife`) для подключения через `<script src="...">`
- единый префикс для компонентов: `sunmar-*`
- модалка `sunmar-modal` блокирует скролл через `@fluejs/noscroll`

## Скрипты

- `npm run dev` - локальный dev сервер
- `npm run build` - production build JS (`auto` + `manual`) и `.d.ts` в `dist/`
- `npm run build:js` - только JS-бандлы (`sunmarino.es.js`, `sunmarino.iife.js`, `sunmarino.manual.es.js`)
- `npm run build:types` - только TypeScript declaration files в `dist/types/`
- `npm run build:external` - сборка с external vendor deps (`dayjs`, `@fluejs/noscroll`) для уменьшения размера бандла
- `npm run preview` - просмотр production сборки
- `npm run typecheck` - проверка TypeScript

## Точки входа

- Библиотека (auto register + runtime tokens): `src/index.ts`
- Библиотека (manual, без авто-регистрации): `src/manual.ts`
- Общие re-exports без side effects: `src/exports.ts`
- Dev preview (локально + monkey): `src/dev/playground.ts`
- Scroll util для общих блокировок скролла: `src/utils/scroll/no-scroll.ts`
- DOM util для ожидания host React app: `src/utils/dom/host-react-app-ready.ts`
- Script util для ленивой загрузки внешних скриптов: `src/utils/dom/preload-script.ts`
- Vimeo util (immediate autoplay + cleanup): `src/utils/video/vimeo-auto-play.ts`
- Реестр регистрации компонентов: `src/registry/register-components.ts`
- Runtime экспорт `:root` токенов (автоинъекция в `index.ts`): `src/styles/sunmar-tokens-runtime.scss`
- SCSS mixins (только query helpers + `text-balance`): `src/styles/_mixins.scss`
- Логические группы токенов (явные CSS custom properties): `src/styles/tokens/` (`_breakpoints`, `_spacing`, `_radius`, `_shadows`, `_grid`, `_icons`, `_colors`, `_typography`, `_foundation`)
- Runtime подключение токенов: `src/styles/sunmar-tokens-runtime.scss` (просто импортирует группы токенов)

## Базовые SCSS mixins

- Рекомендуемый подход: токены в компонентах использовать напрямую через `var(--sunmar-...)`
- Mixins оставляем только для query-синтаксиса и `text-balance`
- Исключение: брейкпоинты дублируются в `src/styles/_mixins.scss` как SCSS-карта, потому что CSS custom properties нельзя использовать как источник для `@media/@container`
- `container-min(...)`
- `container-named-min(...)`
- `media-min(...)`
- `media-max(...)`
- `text-balance`
- `scroll-snap-container(...)` (включая кастомизацию скроллбара)

## Style Contract

- `part` используется только как публичный API для внешней стилизации через `::part(...)`
- внутренние стили компонентов пишем через классы внутри shadow DOM
- для контента слотов используем `::slotted(...)`, когда нужно стилизовать переданный внешний узел

## Typography Utilities

- глобальные utility-классы попадают в `styles.css` библиотеки и не зависят от компонентов
- текущий минимальный набор:
  - `sunmar-h2`
  - `sunmar-text`
  - `sunmar-text-balance`
- utility-классы можно вешать на любые теги (`div`, `p`, `span`, `h2` и т.д.)

Пример:

```html
<div class="sunmar-h2 sunmar-text-balance">Заголовок секции</div>
<p class="sunmar-text sunmar-text-balance">Текстовый блок с выравниванием строк.</p>
```

## Регистрация компонентов

- регистрация вынесена в единый реестр `registerSunmarComponents`
- `src/index.ts` вызывает регистрацию автоматически (удобно для `<script src="...">`)
- `src/index.ts` также один раз инжектит `:root` CSS variables дизайн-токенов
- при необходимости можно вызывать регистрацию вручную через экспорт `registerSunmarComponents`
- для bundler-сценария без авто-регистрации используем subpath `sunmarino-web-components/manual`

## Подключение пакета

### Bundler (auto register)

```ts
import 'sunmarino-web-components';
```

- автоматически регистрирует компоненты
- автоматически подключает runtime токены (`:root` CSS custom properties)

### Bundler (manual register)

```ts
import 'sunmarino-web-components/styles.css';
import { registerSunmarComponents } from 'sunmarino-web-components/manual';

registerSunmarComponents();
```

- не выполняет авто-регистрацию при импорте `manual`
- runtime токены подключаем отдельно через `sunmarino-web-components/styles.css`

### Script tag (IIFE)

```html
<link rel="stylesheet" href="/path/to/dist/index.css" />
<script src="/path/to/dist/sunmarino.iife.js"></script>
```

- после загрузки скрипта компоненты зарегистрированы автоматически

## Компоненты

- `sunmar-button`
- `sunmar-button-group`
- `sunmar-accordion`
- `sunmar-accordion-item`
- `sunmar-image`
- `sunmar-lid`
- `sunmar-kv`
- `sunmar-link`
- `sunmar-modal`
- `sunmar-shell`
- `sunmar-sticky-nav`
- `sunmar-tabs`
- `sunmar-tabs-nav`
- `sunmar-tab-trigger`
- `sunmar-tab-panel`

## Button API

- strict API: legacy-атрибуты (`variant`, `state`) и legacy alias-и не поддерживаются
- `sunmar-button` attributes: `type="primary|secondary|neutral"`, `disabled`, `native-type="button|submit|reset"`, `full-width`
- `sunmar-button` slots: `default`, `prefix`, `suffix`
- `sunmar-button` parts: `control`, `content`, `label`, `prefix`, `suffix`
- состояния `hover/active` управляются только нативными псевдоклассами `:hover/:active` (без state-атрибутов)
- кастомные JS-действия вешаем на хост: `document.querySelector('sunmar-button')?.addEventListener('click', ...)`
- `sunmar-button-group` attributes: нет (layout управляется стилями; по умолчанию `flex-wrap: wrap`)
- `sunmar-button-group` parts: `group`

## Link API

- strict API: используем только атрибуты из документации (legacy alias-и не поддерживаются)
- `sunmar-link` attributes: `type="primary|secondary|neutral"`, `href`, `target`, `rel`, `download`, `disabled`, `full-width`
- `sunmar-link` slots: `default`, `prefix`, `suffix`
- `sunmar-link` parts: `control`, `content`, `label`, `prefix`, `suffix`
- состояния `hover/active` управляются нативными псевдоклассами `:hover/:active`
- `disabled` реализуется через `aria-disabled`, `tabindex="-1"` и блокировку `click`
- при `target="_blank"` автоматически добавляется безопасный `rel` (`noopener noreferrer`), если `rel` не задан
- обработчики JS также вешаем на хост: `document.querySelector('sunmar-link')?.addEventListener('click', ...)`

## Image API

- `sunmar-image` attributes: `src`, `srcset` (optional), `media` (optional, default `'(min-width: 768px)'`), `alt`
- `sunmar-image` внутри рендерит `picture` (`source` + fallback `img`) и упрощает использование в `sunmar-kv`
- `sunmar-image` parts: `picture`, `img`

## Lid API

- `sunmar-lid` attributes: нет
- `sunmar-lid` slots: `title`, `text`
- `sunmar-lid` внутри рендерит семантические `h2` и `p` (текст передаем через слоты)
- `sunmar-lid` parts: `root`, `title`, `text`

Пример:

```html
<sunmar-lid>
  <span slot="title">Заголовок блока</span>
  <span slot="text">Описание блока с обычным текстом.</span>
</sunmar-lid>
```

## Sticky Nav API

- `sunmar-sticky-nav` attributes: `top-offset` (number, пиксели для `top`), `scrollbar="custom|native"` (по умолчанию `custom`)
- `sunmar-sticky-nav` slots: `nav-link` (например, ссылки/кнопки/`sunmar-link`)
- `sunmar-sticky-nav` parts: `root`, `items`
- компонент реализован через `position: sticky`
- есть минимальная JS-логика:
  - если компонент находится внутри `.row-outer-container`, он пытается переместиться сразу после ближайшего такого контейнера
  - для кастомного горизонтального скроллбара использует `SimpleBar` через util `src/utils/scroll/custom-scrollbar.ts`
  - при `scrollbar="native"` использует native horizontal scroll + scroll-snap без `SimpleBar`
- CSS custom properties:
  - `--sunmar-sticky-nav-z-index`
  - `--sunmar-sticky-nav-bg`
  - `--sunmar-sticky-nav-border`

Пример:

```html
<sunmar-sticky-nav top-offset="12">
  <a slot="nav-link" href="#about">О проекте</a>
  <a slot="nav-link" href="#details">Детали</a>
  <a slot="nav-link" href="#faq">FAQ</a>
</sunmar-sticky-nav>
```

Native fallback без `SimpleBar`:

```html
<sunmar-sticky-nav top-offset="12" scrollbar="native">
  <a slot="nav-link" href="#about">О проекте</a>
  <a slot="nav-link" href="#details">Детали</a>
</sunmar-sticky-nav>
```

Стилизация кастомного скроллбара через CSS variables на хосте:

```css
sunmar-sticky-nav {
  --sunmar-sticky-nav-scrollbar-size: 10px;
  --sunmar-sticky-nav-scrollbar-thumb: #d8242a;
  --sunmar-sticky-nav-scrollbar-track: rgba(0, 0, 0, 0.06);
}
```

Ограничения `position: sticky`:

- поведение зависит от scroll-контейнера и может ломаться, если у предков `overflow: hidden/auto/scroll`
- ожидаемое поведение также может меняться при сложных layout-контекстах (`transform`, `filter`, `contain`)
- визуальные стили и sticky-позиционирование находятся на `:host`, `nav` внутри используется как семантическая обертка

## KV API

- `sunmar-kv` attributes: `vimeo-id` (fallback, optional), `vimeo-id-desktop` (optional), `vimeo-id-mobile` (optional)
- выбор видео-ID:
  - `< 768px`: `vimeo-id-mobile` -> `vimeo-id` -> `vimeo-id-desktop`
  - `>= 768px`: `vimeo-id-desktop` -> `vimeo-id` -> `vimeo-id-mobile`
- `sunmar-kv` behavior: если активный Vimeo playback начался, fallback-картинка плавно скрывается (`opacity: 0`)
- `sunmar-kv` использует общий util `vimeoAutoPlay(...)` (Vimeo Player API, immediate autoplay без `IntersectionObserver`)
- `sunmar-kv` media slots:
  - `image` (ожидается `sunmar-image`, внутри которого реализован `picture`)
- `sunmar-kv` content slots:
  - `eyebrow` (контент, лучше `span`)
  - `title` (контент, лучше `span`; семантический `h1` рендерится внутри компонента)
  - `text` (контент, лучше `span`; семантический `p` рендерится внутри компонента)
  - `actions`
- `sunmar-kv` min-height: `520px`
- `sunmar-kv` parts: `root`, `media`, `picture`, `video`, `video-frame`, `scrim`, `content`, `content-inner`, `eyebrow`, `title`, `text`, `actions`
- Vimeo iframe создается SDK динамически; `sunmar-kv` через `MutationObserver` ставит на него `part="iframe"` (desktop) или `part="iframe-mob"` (mobile)

## Accordion API

- `sunmar-accordion` attributes: `mode="single|multiple"` (по умолчанию `multiple`)
- `sunmar-accordion` slots: `default` (ожидаются `sunmar-accordion-item`)
- `sunmar-accordion` parts: `root`
- внешний API у accordion минимальный: управляем только `mode`, без отдельного reactive value

- `sunmar-accordion-item` attributes: `open`, `disabled`
- `sunmar-accordion-item` slots: `header`, `default`
- `sunmar-accordion-item` parts: `root`, `trigger`, `trigger-content`, `icon`, `panel`, `content`
- состояние `open` используется компонентом для логики и стилизации; в `mode="single"` контейнер сам закрывает остальные пункты

## Tabs API

- `sunmar-tabs` attributes/properties: `value` (reactive текущее значение вкладки)
- `sunmar-tabs` slots:
  - `nav` (обычно `sunmar-tabs-nav`, но можно передать и `sunmar-tab-trigger` напрямую)
  - `default` (ожидаются `sunmar-tab-panel`)
- `sunmar-tabs` parts: `root`, `nav`, `panels`
- `sunmar-tabs` dispatches `sunmar-tabs-change` только при пользовательском переключении:
  - `detail: { value, previousValue }`
- это позволяет:
  - синхронизировать 2 экземпляра табов через внешний JS
  - отправлять данные в метрику без циклов от programmatic updates

- `sunmar-tabs-nav` attributes: нет
- `sunmar-tabs-nav` slots: `default` (ожидаются `sunmar-tab-trigger`)
- `sunmar-tabs-nav` parts: `root`

- `sunmar-tab-trigger` attributes: `value`, `selected`, `disabled`
- `sunmar-tab-trigger` slots: `default`
- `sunmar-tab-trigger` parts: `root`, `control`, `content`, `label`
- поддерживаются любые `data-*` атрибуты на хосте (например `data-personaj="Заяц"`) для внешней аналитики/метрик
- `value` — стабильный технический идентификатор вкладки (не завязываемся на текст)

- `sunmar-tab-panel` attributes: `value`, `active`
- `sunmar-tab-panel` slots: `default`
- `sunmar-tab-panel` parts: `root`, `panel`, `content`

Пример tabs с `data-*` на trigger:

```html
<sunmar-tabs value="hare">
  <sunmar-tabs-nav slot="nav">
    <sunmar-tab-trigger value="hare" data-personaj="Заяц">Заяц</sunmar-tab-trigger>
    <sunmar-tab-trigger value="wolf" data-personaj="Волк">Волк</sunmar-tab-trigger>
  </sunmar-tabs-nav>

  <sunmar-tab-panel value="hare">Контент зайца</sunmar-tab-panel>
  <sunmar-tab-panel value="wolf">Контент волка</sunmar-tab-panel>
</sunmar-tabs>
```

Пример синхронизации двух экземпляров через внешний JS:

```js
const tabsA = document.querySelector('#tabs-sync-a');
const tabsB = document.querySelector('#tabs-sync-b');

tabsA?.addEventListener('sunmar-tabs-change', (event) => {
  tabsB.value = event.detail.value;
});

tabsB?.addEventListener('sunmar-tabs-change', (event) => {
  tabsA.value = event.detail.value;
});
```

## Правила для сторонних библиотек

- `dayjs` подключаем только через центральный util: `src/utils/date/dayjs.ts`
- для `dayjs` загружаем только нужные locale/plugin (не импортируем весь набор)
- `@fluejs/noscroll` подключаем только через `src/utils/scroll/no-scroll.ts`
- для модалок используем ref-count lock/unlock, чтобы не ломать вложенные сценарии
- `simplebar` (кастомный скроллбар) подключаем только через `src/utils/scroll/custom-scrollbar.ts`
- при критичном ограничении размера можно собирать в режиме external:
  `npm run build:external` (потребуется отдельно загрузить `dayjs` и `@fluejs/noscroll` на странице)
- в `vite.config.ts` включен алиас `dayjs -> dayjs/esm` для лучшего treeshaking
