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
- Script util для ленивой загрузки внешних скриптов: `src/utils/dom/preload-script.ts`
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
- `sunmar-modal`
- `sunmar-sticky-nav`
- `sunmar-tabs`
- `sunmar-tabs-nav`
- `sunmar-tab-trigger`
- `sunmar-tab-panel`

## Button API

- strict API: legacy-атрибуты (`variant`, `state`) и legacy alias-и не поддерживаются
- `sunmar-button` — только стилевая оболочка; через default slot передается один нативный `<button>` или `<a>`
- `sunmar-button` attributes: `type="primary|secondary|neutral"` (по умолчанию `primary`; отсутствующее или некорректное значение нормализуется в `primary`)
- `sunmar-button` slots: `default`
- `sunmar-button` parts: нет
- состояния `hover/active` управляются только нативными псевдоклассами `:hover/:active` (без state-атрибутов)
- для `<button>` атрибуты `type`, `disabled`, `form`, `name`, `value` задаются на самом нативном элементе
- для `<a>` атрибуты `href`, `target`, `rel` задаются на самой нативной ссылке
- submit/reset/validation, навигация, disabled и события остаются полностью нативными и не эмулируются компонентом
- обработчики действий рекомендуется вешать непосредственно на slotted `button` или `a`

```html
<sunmar-button type="primary">
  <button type="submit" form="booking-form" name="action" value="search">
    Найти тур
  </button>
</sunmar-button>

<sunmar-button type="secondary">
  <a href="/offers" target="_blank" rel="noopener noreferrer">Предложения</a>
</sunmar-button>
```
- `sunmar-button-group` attributes: нет (layout управляется стилями; по умолчанию `flex-wrap: wrap`)
- `sunmar-button-group` parts: нет
- расстояние между элементами настраивается через `--sunmar-button-group-gap` (по умолчанию `--sunmar-space-s`)

## Card API

- `sunmar-card` attributes:
  - `vertical` — сохраняет вертикальную раскладку на всех ширинах
  - `reversed` — меняет местами media и content в горизонтальной раскладке от `1024px`
- при одновременном использовании `vertical` и `reversed` приоритет имеет `vertical`
- обязательные slots: `media`, `title`, `text`
- необязательный slot: `actions`; пустой actions-контейнер не занимает место
- parts: `root`, `media`, `content`, `title`, `text`, `actions`
- фон content настраивается через `--sunmar-card-background`
- компонент рендерит `article`, а семантический уровень заголовка задаёт потребитель в light DOM

## Modal API

- `sunmar-modal` attributes: `open`, `close-on-backdrop`, `close-on-esc`, `aria-label`, `aria-labelledby`
- `sunmar-modal` methods: `show()`, `hide()`, `toggle()`
- `sunmar-modal` events: `sunmar-open`, `sunmar-close`
- `aria-label` задаёт явное доступное имя; без него dialog использует `aria-labelledby` или внутренний заголовок
- при открытии фокус переходит внутрь modal и удерживается там по Tab/Shift+Tab
- Escape закрывает окно, если `close-on-esc` включён
- после закрытия фокус возвращается на ранее активный элемент
- фон временно получает `inert`; исходное состояние всех затронутых элементов восстанавливается
- начальный `open=false` не вызывает `sunmar-close`

```html
<button id="open-booking-modal" type="button">Открыть</button>
<sunmar-modal aria-label="Подтверждение бронирования">
  <span slot="title">Подтверждение бронирования</span>
  <button autofocus type="button">Изменить параметры</button>
</sunmar-modal>
```

## Image API

- `sunmar-image` attributes:
  - `src` — обязательный fallback-источник для внутреннего `img`
  - `srcset` — необязательный набор источников для `source` внутри `picture`
  - `media` — условие для `source` (по умолчанию `'(min-width: 768px)'`)
  - `sizes` — необязательная подсказка размеров для `source`
  - `alt` — осмысленное описание либо пустая строка для декоративного изображения
  - `width`, `height` — положительные размеры внутреннего `img`; некорректные значения не передаются
  - `loading="eager|lazy"` — необязательный нативный режим загрузки; неизвестное значение не передаётся
- `sunmar-image` внутри рендерит `picture` (`source` + fallback `img`) и упрощает art direction в `sunmar-kv`
- когда размеры изображения известны, указывайте `width` и `height`, чтобы браузер заранее резервировал место и уменьшал layout shift
- `sunmar-image` parts: `picture`, `img`
- CSS custom properties:
  - `--sunmar-image-object-fit` (default `cover`)
  - `--sunmar-image-object-position` (default `center center`)

## Sticky Nav API

- `sunmar-sticky-nav` attributes:
  - `top-offset` (number, optional override для отступа sticky-блока от верхней границы viewport)
  - `teleport` (CSS-селектор целевого DOM-узла; по умолчанию `.row-outer-container`)
  - `disable-relocate` (boolean, отключает автоматический перенос компонента в DOM)
- `sunmar-sticky-nav` slots:
  - `nav-link` (рекомендуемый consumer contract: `<a href="#section-id">...</a>`)
- `sunmar-sticky-nav` parts: `root`
- компонент реализован через нативный `position: sticky`
- есть минимальная JS-логика:
  - компонент переносится сразу после узла, найденного по `teleport`; сначала проверяется ближайший предок, затем весь документ
  - без `teleport` используется `.row-outer-container` для обратной совместимости
  - при изменении `teleport` в runtime компонент отменяет предыдущее ожидание и ищет новую цель
  - некорректный CSS-селектор безопасно игнорируется
  - `disable-relocate` отключает перенос и имеет приоритет над `teleport`
  - ожидание целевого узла отменяется при отключении компонента
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
<sunmar-sticky-nav teleport=".header-actions" top-offset="12">
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

- обязательные slots:
  - `image` (обычно `sunmar-image`; допустим любой media-узел, который сам умеет корректно заполнять область визуала)
  - `title` (ожидается семантический заголовок `h1|h2|h3` в light DOM)
- необязательные slots:
  - `eyebrow` (контент, лучше `span` или `p`)
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
- `sunmar-kv` parts: `root`, `media`, `picture`, `content`, `content-inner`, `eyebrow`, `title`, `text`
- CSS custom properties:
  - `--sunmar-kv-content-color`
  - `--sunmar-kv-content-max-width`
  - `--sunmar-kv-eyebrow-color`
  - `--sunmar-kv-title-color`
  - `--sunmar-kv-text-color`
- SEO-friendly контракт:
  - значимый контент (`title`, `text`, `actions`) должен приходить уже семантическим в light DOM
  - компонент отвечает за layout и styling, а не за генерацию `h1/p` из `span`
- для точечного визуального переопределения используем `::part(...)`, если базового контракта недостаточно

## Accordion API

- `sunmar-accordion` attributes:
  - `mode="single|multiple"` (по умолчанию `multiple`; отсутствующее или некорректное значение нормализуется в `multiple`)
  - `faq` — добавляет рядом с компонентом JSON-LD-разметку `FAQPage`
- `sunmar-accordion` slots: `default` (ожидаются `sunmar-accordion-item`)
- `sunmar-accordion` parts: нет
- внешний API у accordion минимальный: управляем только `mode`, без отдельного reactive value
- при `faq` текст элемента из `slot="header"` становится `Question`, остальной light DOM-контент item становится `acceptedAnswer`; пустые пары в JSON-LD не включаются

- `sunmar-accordion-item` attributes: `open`, `disabled`
- `sunmar-accordion-item` slots: `header`, `default`
- `sunmar-accordion-item` parts: `root`, `trigger`, `icon`, `panel`, `content`
- `sunmar-accordion-item` внутри использует нативные `details/summary`, а контейнер сверху координирует group behavior для `mode="single"`
- состояние `open` используется компонентом для логики и стилизации; в `mode="single"` контейнер сам закрывает остальные пункты

## Tabs API

- `sunmar-tabs` attributes/properties: `value` (reactive текущее значение вкладки)
- `sunmar-tabs` slots:
  - `nav` (ожидается `sunmar-tabs-nav`)
  - `default` (ожидаются `sunmar-tab-panel`)
- `sunmar-tabs` parts: нет
- `sunmar-tabs` dispatches `sunmar-tabs-change` только при пользовательском переключении:
  - `detail: { value, previousValue }`
- это позволяет:
  - синхронизировать 2 экземпляра табов через внешний JS
  - отправлять данные в метрику без циклов от programmatic updates

- `sunmar-tabs-nav` attributes: нет
- `sunmar-tabs-nav` slots: `default` (ожидаются `sunmar-tab-trigger`)
- `sunmar-tabs-nav` parts: `list`

- `sunmar-tab-trigger` attributes: `value`, `selected`, `disabled`
- `sunmar-tab-trigger` slots: `default`
- `sunmar-tab-trigger` parts: `control`
- поддерживаются любые `data-*` атрибуты на хосте (например `data-personaj="Заяц"`) для внешней аналитики/метрик
- `value` — стабильный технический идентификатор вкладки (не завязываемся на текст)
- клавиатурная навигация: `ArrowLeft/ArrowRight`, `ArrowUp/ArrowDown`, `Home`, `End`
- при активном `sunmar-tabs` компонент сам синхронизирует `aria-controls` и `aria-labelledby` между trigger и panel

- `sunmar-tab-panel` attributes: `value`, `active`
- `sunmar-tab-panel` slots: `default`
- `sunmar-tab-panel` parts: `content`

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
