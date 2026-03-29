# Sunmarino Web Components

Стартовый каркас библиотеки компонентов:

- `Lit + TypeScript`
- `SCSS` стили импортируются в компоненты (`*.scss?inline`)
- `vite-plugin-monkey` используется только в `dev`
- production build собирается как библиотека в формате `iife` для подключения через `<script src="...">`
- единый префикс для компонентов: `sunmar-*`
- модалка `sunmar-modal` блокирует скролл через `@fluejs/noscroll`

## Скрипты

- `npm run dev` - локальный dev сервер
- `npm run build` - production build JS (`sunmarino.iife.js`) и `.d.ts` в `dist/`
- `npm run build:js` - только JS-бандл `sunmarino.iife.js`
- `npm run build:types` - только TypeScript declaration files в `dist/types/`
- `npm run build:external` - сборка с external vendor deps (`@fluejs/noscroll`) для уменьшения размера бандла
- `npm run preview` - просмотр production сборки
- `npm run typecheck` - проверка TypeScript

## Точки входа

- Библиотека (auto register + runtime tokens): `src/index.ts`
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

## Подключение пакета

### Script tag (IIFE)

```html
<link rel="stylesheet" href="/path/to/dist/index.css" />
<script src="/path/to/dist/sunmarino.iife.js"></script>
```

- после загрузки скрипта компоненты зарегистрированы автоматически

## Глобальный layout

- для light DOM-разметки используем namespaced контейнер `.sunmarino-container`, а не generic `.container`
- `sunmarino-container` держит глобальные внешние отступы:
  - `padding-block: 32px`
  - `>= 768px`: `padding-block: 40px`
  - mobile `padding-inline: 16px`

## Компоненты

- `sunmar-button`
- `sunmar-button-group`
- `sunmar-accordion`
- `sunmar-accordion-item`
- `sunmar-image`
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
- `sunmar-button` attributes: `type="primary|secondary|neutral"`, `disabled`, `native-type="button|submit|reset"`
- `sunmar-button` slots: `default`, `prefix`, `suffix`
- `sunmar-button` parts: `control`, `content`, `label`, `prefix`, `suffix`
- состояния `hover/active` управляются только нативными псевдоклассами `:hover/:active` (без state-атрибутов)
- кастомные JS-действия вешаем на хост: `document.querySelector('sunmar-button')?.addEventListener('click', ...)`
- `sunmar-button-group` attributes: нет (layout управляется стилями; по умолчанию `flex-wrap: wrap`)
- `sunmar-button-group` parts: `group`

## Link API

- strict API: используем только атрибуты из документации (legacy alias-и не поддерживаются)
- `sunmar-link` attributes: `type="primary|secondary|neutral"`, `href`, `target`, `rel`, `download`, `disabled`
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
- CSS custom properties:
  - `--sunmar-image-object-fit` (default `cover`)
  - `--sunmar-image-object-position` (default `center center`)

## Sticky Nav API

- `sunmar-sticky-nav` attributes:
  - `top-offset` (number, optional override для отступа sticky-блока от верхней границы viewport)
  - `disable-relocate` (boolean, отключает автоматический перенос компонента в DOM)
- `sunmar-sticky-nav` slots:
  - `nav-link` (рекомендуемый consumer contract: `<a href="#section-id">...</a>`)
- `sunmar-sticky-nav` parts: `root`
- компонент реализован через нативный `position: sticky`
- есть минимальная JS-логика:
  - в `connectedCallback()` компонент переносится сразу за ближайший `.row-outer-container`, если он найден
  - `disable-relocate` отключает этот DOM-side effect
  - если `top-offset` не задан, верхний offset вычисляется реактивно через `matchMedia`: mobile `81px`, tablet `65px`, desktop `16px`
  - active-state ссылок синхронизируется по `IntersectionObserver` на основе `href="#section-id"` и реальных `section[id]`
  - если `href` пустой/битый или целевая секция не найдена, компонент безопасно игнорирует такую ссылку и не ломает скрипты
- CSS custom properties:
  - `--sunmar-sticky-nav-z-index`
  - `--sunmar-sticky-nav-bg`
  - `--sunmar-sticky-nav-border`
  - `--sunmar-sticky-nav-gap`

Пример:

```html
<sunmar-sticky-nav disable-relocate top-offset="12">
  <a slot="nav-link" href="#about">О проекте</a>
  <a slot="nav-link" href="#details">Детали</a>
  <a slot="nav-link" href="#faq">FAQ</a>
</sunmar-sticky-nav>

<section id="about">...</section>
<section id="details">...</section>
<section id="faq">...</section>
```

Ограничения sticky-поведения:

- sticky-логика опирается на нативный `position: sticky`, поэтому зависит от layout родителей
- `top-offset` задает явный override; без него используется реактивный offset от `matchMedia`
- визуальные стили находятся на `:host`, `nav` внутри используется как семантическая обертка

## KV API

- `sunmar-kv` video API:
  - видео опционально
  - источник видео задается не атрибутами, а отдельными slotted config-узлами
  - если `slot="video-desktop"` и `slot="video-mobile"` отсутствуют, компонент работает только с изображением
  - ожидаемый контракт config-узла: любой элемент с `slot="video-desktop"` или `slot="video-mobile"` и `data-vimeo-id="..."`
- выбор видео-источника:
  - `< 768px`: сначала `video-mobile`, затем fallback на `video-desktop`
  - `>= 768px`: сначала `video-desktop`, затем fallback на `video-mobile`
- `sunmar-kv` behavior: если активный Vimeo playback начался, видео плавно проявляется поверх fallback-картинки
- `sunmar-kv` использует общий util `vimeoAutoPlay(...)` (Vimeo Player API, immediate autoplay без `IntersectionObserver`)
- `sunmar-kv` media slots:
  - `image` (обычно `sunmar-image`; допустим любой media-узел, который сам умеет корректно заполнять область визуала)
  - `video-desktop` (config-узел с `data-vimeo-id`, активен от `768px`)
  - `video-mobile` (config-узел с `data-vimeo-id`, активен до `767px`)
- `sunmar-kv` content slots:
  - `eyebrow` (контент, лучше `span` или `p`)
  - `title` (ожидается семантический заголовок `h1|h2|h3` в light DOM)
  - `text` (ожидается `p` в light DOM)
  - `actions`
- размеры `KV`:
  - base: `556px`
  - `>= 768px`: `320px`
  - `>= 1024px`: `360px`
  - `>= 1280px`: `400px`
  - `>= 1440px`: `500px`
- content padding:
  - base: `48px 32px`
  - `>= 768px`: `48px 40px`
  - `>= 1024px`: `48px`
  - `>= 1280px`: `48px 80px`
- `title` font-size:
  - base: `40px`
  - `>= 1440px`: `56px`
- `text` font-size: `16px`
- `sunmar-kv` parts: `root`, `media`, `picture`, `video`, `video-frame`, `content`, `content-inner`, `eyebrow`, `title`, `text`, `actions`
- Vimeo iframe создается SDK динамически; `sunmar-kv` через `MutationObserver` ставит на него `part="iframe"` (desktop) или `part="iframe-mob"` (mobile)
- CSS custom properties для Vimeo iframe:
  - `--sunmar-kv-video-width` (default `100%`)
  - `--sunmar-kv-video-height` (default `100%`)
- для редких точечных кейсов размеры и позиционирование Vimeo iframe также можно переопределять через `::part(iframe)` и `::part(iframe-mob)`
- SEO-friendly контракт:
  - значимый контент (`title`, `text`, `actions`) должен приходить уже семантическим в light DOM
  - компонент отвечает за layout и styling, а не за генерацию `h1/p` из `span`
- fallback-модель media:
  - изображение всегда остается baseline
  - видео показываем только после успешной загрузки и старта playback
  - при ошибке Vimeo или медленной сети ничего не делаем — остается изображение
- для точечного визуального переопределения используем `::part(...)`, если базового контракта недостаточно

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
- `sunmar-tabs-nav` parts: `root`, `list`

- `sunmar-tab-trigger` attributes: `value`, `selected`, `disabled`
- `sunmar-tab-trigger` slots: `default`
- `sunmar-tab-trigger` parts: `root`, `control`, `content`, `label`
- поддерживаются любые `data-*` атрибуты на хосте (например `data-personaj="Заяц"`) для внешней аналитики/метрик
- `value` — стабильный технический идентификатор вкладки (не завязываемся на текст)
- клавиатурная навигация: `ArrowLeft/ArrowRight`, `ArrowUp/ArrowDown`, `Home`, `End`
- при активном `sunmar-tabs` компонент сам синхронизирует `aria-controls` и `aria-labelledby` между trigger и panel

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
