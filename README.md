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
- `npm run build` - production build JS (`sunmarino-<version>.iife.js`) и `.d.ts` в `dist/`
- `npm run build:js` - только JS-бандл `sunmarino-<version>.iife.js`
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

- Рекомендуемый подход: токены в компонентах использовать напрямую через `var(--sunmarino-...)`
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

## Общие стили и служебные классы

Пользовательские теги называются `sunmar-*`. Публичные CSS-классы называются
`sunmarino-*`, CSS-переменные — `--sunmarino-*`; корневой класс секции — `.sunmarino`.
Внутренние классы Shadow DOM изолированы от страницы. События и имена тегов не меняются.
Старые CSS-имена не поддерживаются: внешнюю разметку и переопределения переменных
нужно перевести на новый префикс. Старые номера шагов отступов нужно заменить пикселями:
`sunmar-mt-5` → `sunmarino-mt-24`, а не `sunmarino-mt-5`.

| Назначение | Классы |
| --- | --- |
| Заголовки | `sunmarino-h1` … `sunmarino-h5` |
| Текст | `sunmarino-text`, `sunmarino-text-sm`, `sunmarino-text-lg` |
| Выравнивание | `sunmarino-text-start`, `sunmarino-text-center`, `sunmarino-text-end` |
| Цвет | `sunmarino-text-muted`, `sunmarino-text-light` |
| Перенос заголовков | `sunmarino-text-balance` |
| Группировка | `sunmarino-section-header`, `sunmarino-stack`, `sunmarino-cluster` |
| Размеры | `sunmarino-w-full`, `sunmarino-min-w-0` |
| Центрирование блока | `sunmarino-mx-auto` |
| Текстовый контент | `sunmarino-prose`, `sunmarino-link`, `sunmarino-list`, `sunmarino-list-reset` |
| Вспомогательный текст для скринридеров | `sunmarino-visually-hidden` |

Классы заголовков задают оформление независимо от семантического уровня HTML-тега.
Они наследуют цвет и шрифт, чтобы работать и на светлом, и на тёмном фоне.
Секция `.sunmarino` задаёт базовый шрифт и цвет. Файлы шрифта подключает сайт.

| Заголовок | До 768px, размер / строка | От 768px, размер / строка |
| --- | --- | --- |
| h1 | 32 / 36px | 48 / 52px |
| h2 | 28 / 32px | 40 / 44px |
| h3 | 24 / 28px | 32 / 36px |
| h4 | 20 / 24px | 28 / 32px |
| h5 | 20 / 24px | 24 / 28px |

Мобильные размеры настраиваются токенами `--sunmarino-heading-hN-mobile-font-size`
и `--sunmarino-heading-hN-mobile-line-height`. Компоненты сохраняют собственное оформление слотов.
`sunmarino-prose` ограничивает длину строки до `65ch`; переопределение — `--sunmarino-prose-max-width`.

### Отступы в пикселях

Формат: `sunmarino-{свойство}-{пиксели}`. Например, `sunmarino-mt-24` — это
ровно `margin-top: 24px`, независимо от значений дизайн-токенов.

- `m`, `p` — все стороны; `mt/mb/ml/mr`, `pt/pb/pl/pr` — отдельные стороны.
- `mx/my`, `px/py` — логические оси inline/block.
- `gap`, `gap-x`, `gap-y` — интервалы между элементами.
- Доступные значения: `0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 52, 64, 80, 96, 120`.
- Для нового значения добавьте число в `$sunmarino-spacing-pixels` в `src/styles/_spacing-utilities.scss`
  и пересоберите библиотеку. Произвольные числа автоматически из HTML не генерируются.
- Утилиты отступов подключаются после базовых правил и переопределяют интервалы секций и сетки.
  Не используйте несколько противоречащих классов для одного свойства.

## Регистрация компонентов

- регистрация вынесена в единый реестр `registerSunmarComponents`
- `src/index.ts` вызывает регистрацию автоматически (удобно для `<script src="...">`)
- `src/index.ts` также один раз инжектит `:root` CSS variables дизайн-токенов
- при необходимости можно вызывать регистрацию вручную через экспорт `registerSunmarComponents`

## Подключение пакета

### Script tag (IIFE)

```html
<script src="/path/to/dist/sunmarino-0.1.3.iife.js"></script>
```

- после загрузки скрипта компоненты зарегистрированы автоматически, а runtime-токены и utility-стили добавлены в документ

## Глобальный layout

- `.sunmarino` — вертикальная секция: отступы сверху/снизу 20px, от 768px — 40px;
  боковые 16px, от 993px — 0; интервал между блоками 24px.
- Переопределения: `--sunmarino-section-padding-block`, `--sunmarino-section-padding-inline`,
  `--sunmarino-section-gap`.
- `.sunmarino-container` — ширина 100%, максимум 1368px, центрирование;
  переменные `--sunmarino-container-max-width`, `--sunmarino-container-padding-inline`.
- `.sunmarino-section-header` группирует заголовок и описание с интервалом 12px.
- `.sunmarino-stack` — вертикальная группа; `.sunmarino-cluster` — горизонтальная с переносом.
  Стандартный интервал 12px, меняется через `sunmarino-gap-{пиксели}`.
- `.sunmarino.sunmarino-kv` сохраняет особые отступы первого экрана. Границы внешней
  сетки 992/993px сохранены отдельно от брейкпоинтов компонентов.
- Адаптер `.row-container.layout-container-limit.center` относится к существующему
  сайту и действует только при наличии `sunmar-kv[full-width]` внутри `.sunmarino`.

```html
<section class="sunmarino sunmarino-container">
  <header class="sunmarino-section-header">
    <h2 class="sunmarino-h2 sunmarino-text-balance">Направления отдыха</h2>
    <p class="sunmarino-text">Выберите подходящее путешествие.</p>
  </header>
  <div class="sunmarino-grid sunmarino-cols-1 sunmarino-bp-768-cols-2 sunmarino-gap-16">
    <sunmar-card>…</sunmar-card>
    <sunmar-card>…</sunmar-card>
  </div>
</section>
```

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
- `sunmar-tab`
- `sunmar-tab-content`

## Button API

Подробный контракт, ограничения и план проверок: [sunmar-button](docs/sunmar-button-contract.md).

- strict API: legacy-атрибуты (`variant`, `state`) и legacy alias-и не поддерживаются
- `sunmar-button` — только стилевая оболочка; через default slot передается один нативный `<button>` или `<a>`
- `sunmar-button` attributes: `type="primary|secondary|neutral"` (по умолчанию `primary`; отсутствующее или некорректное значение нормализуется в `primary`)
- `sunmar-button` attributes: `size="small|medium|large"`; по умолчанию `medium`, SCSS размеров пока не заполнен
- Для `type` и `size`: явное значение кнопки → настройка непосредственной группы → значение по умолчанию. Отсутствующий атрибут не создаётся; JS-свойство возвращает итоговое значение. Удаление атрибута возвращает наследование.
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
- `sunmar-button-group` attributes/properties: `type="primary|secondary|neutral"`, `size="small|medium|large"`; задают значения кнопкам без собственных настроек
- направление задаётся CSS-переменной `--sunmarino-button-group-direction: row | column` (по умолчанию `row`); перенос включён через `flex-wrap: wrap`
- контракт группы: [sunmar-button-group](docs/sunmar-button-group-contract.md)
- `sunmar-button-group` parts: нет
- расстояние между элементами настраивается через `--sunmarino-button-group-gap` (по умолчанию `--sunmarino-space-s`)

## Card API

Подробный контракт и статус проверок: [sunmar-card](docs/sunmar-card-contract.md).

- `sunmar-card` attributes:
  - `reversed` — меняет местами media и content в горизонтальной раскладке
- раскладка зависит от ширины самой карточки: вертикальная до `1024px`, горизонтальная от `1024px`
- `reversed` — только CSS-атрибут присутствия, JS-свойства нет
- обязательные slots: `media`, `title`, `text`
- необязательный slot: `actions`; пустой actions-контейнер не занимает место
- parts: `root`, `media`, `content`, `title`, `text`, `actions`
- фон content настраивается через `--sunmarino-card-background`
- компонент рендерит `article`, а семантический уровень заголовка задаёт потребитель в light DOM

## CSS-сетка

Класс `sunmarino-grid` доступен в общих стилях библиотеки и используется в playground. Без классов колонок сетка автоматически подбирает их число по ширине контейнера; минимальная ширина элемента — `240px`.

```html
<div class="sunmarino-grid sunmarino-cols-1 sunmarino-bp-768-cols-2 sunmarino-bp-1024-cols-3 sunmarino-bp-1280-cols-4 sunmarino-bp-1440-cols-6">
  <section>Первый блок</section>
  <section>Второй блок</section>
</div>
```

- `sunmarino-cols-N` задаёт базовое число колонок (1–12).
- `sunmarino-bp-768-cols-N`, `sunmarino-bp-1024-cols-N`, `sunmarino-bp-1280-cols-N`, `sunmarino-bp-1440-cols-N` задают число колонок от указанной ширины **экрана**.
- Пропущенный брейкпоинт сохраняет предыдущую настройку; без `sunmarino-cols-N` до первого брейкпоинта действует автоматическая сетка.
- Порядок классов в HTML не влияет на результат.
- `--sunmarino-grid-min-item-width` настраивает минимальную ширину в автоматическом режиме.
- Отступы: `--sunmarino-grid-gap` (по умолчанию 24px) и `--sunmarino-grid-gap-1280` (по умолчанию 32px от 1280px).
- Каждый непосредственный дочерний элемент занимает одну ячейку; семантический тег контейнера выбирает потребитель.

Стили класса генерирует миксин `grid` из `src/styles/_mixins.scss`. Его можно применить к своему селектору (путь `@use` задаётся относительно вашего SCSS-файла):

```scss
@use './mixins';

.catalog-grid {
  @include mixins.grid;
}
```

Тогда вместо `sunmarino-grid` используется `catalog-grid`; классы `sunmarino-cols-1`, `sunmarino-bp-768-cols-2` и CSS-переменные работают так же.

## Modal API

Подробный контракт и миграция: [sunmar-modal](docs/sunmar-modal-contract.md).

- `sunmar-modal` attributes:
  - `open`
  - `disable-close-on-backdrop` — присутствие отключает закрытие по фону
  - `disable-close-on-esc` — присутствие отключает закрытие по Escape
  - `aria-label`, `aria-labelledby`
- `sunmar-modal` methods: `show()`, `hide()`, `toggle()`
- `sunmar-modal` events: `sunmar-modal-open`, `sunmar-modal-close`
- slots: `title`, default, `actions` (необязательный; пустой footer не занимает место)
- parts: `overlay`, `dialog`, `header`, `title`, `close`, `body`, `actions`
- CSS custom properties: `--sunmarino-modal-z-index`, `--sunmarino-modal-overlay`, `--sunmarino-modal-surface`, `--sunmarino-modal-border`, `--sunmarino-modal-title`, `--sunmarino-modal-text`
- `aria-label` задаёт явное доступное имя; без него dialog использует `aria-labelledby` или внутренний заголовок
- при открытии фокус переходит внутрь modal и удерживается там по Tab/Shift+Tab
- Escape закрывает окно, если `disable-close-on-esc` отсутствует
- после закрытия фокус возвращается на ранее активный элемент
- фон временно получает `inert`; исходное состояние всех затронутых элементов восстанавливается
- начальный `open=false` не вызывает `sunmar-modal-close`

```html
<button id="open-booking-modal" type="button">Открыть</button>
<sunmar-modal aria-label="Подтверждение бронирования">
  <span slot="title">Подтверждение бронирования</span>
  <button autofocus type="button">Изменить параметры</button>
</sunmar-modal>
```

## Image API

Подробный контракт: [sunmar-image](docs/sunmar-image-contract.md).

- `sunmar-image` attributes:
  - `src` — обязательный fallback-источник для внутреннего `img`
  - `srcset` — необязательный набор источников для `source` внутри `picture`
  - `media` — условие для `source` (по умолчанию `'(min-width: 768px)'`)
  - `sizes` — необязательная подсказка размеров для `source`
  - `alt` — осмысленное описание либо пустая строка для декоративного изображения
  - `width`, `height` — конечные числа от `1` для внутреннего `img`; дробная часть отбрасывается, некорректные значения не передаются
  - `loading="eager|lazy"` — необязательный нативный режим загрузки; неизвестное значение не передаётся
- `sunmar-image` рендерит `picture` с одним `img`; `source` добавляется только при непустом `srcset`
- удаление `src`, `srcset`, `sizes` безопасно убирает соответствующие внутренние атрибуты или `source`; удаление `media` возвращает условие по умолчанию, пустой `media` снимает ограничение
- когда размеры изображения известны, указывайте `width` и `height`, чтобы браузер заранее резервировал место и уменьшал layout shift
- `sunmar-image` parts: `picture`, `img`
- CSS custom properties:
  - `--sunmarino-image-height` (default `auto`)
  - `--sunmarino-image-object-fit` (default `cover`)
  - `--sunmarino-image-object-position` (default `center center`)

## Slide API

- `sunmar-slide` — структурный элемент `sunmar-slider`; собственной логики переключения не содержит
- использовать компонент следует непосредственным дочерним элементом `sunmar-slider`, чтобы он получил ширину и отступы из CSS-контракта родителя
- attributes: стандартные глобальные HTML-атрибуты; для доступного имени можно передать `aria-label`
- slots: default (ожидается один корневой элемент содержимого)
- parts: `slide`
- ширина определяется родительской переменной `--sunmarino-slider-slides-per-view`
- внутренний отступ определяется родительской переменной `--sunmarino-slider-slide-padding`
- компонент по умолчанию получает `role="group"` и `aria-roledescription="slide"`, если потребитель не передал собственные значения
- все слайды растягиваются до общей высоты, а единственный корневой slotted-элемент заполняет высоту слайда

## Slider API

- `sunmar-slider` — карусель для непосредственных дочерних элементов `sunmar-slide`
- для доступного имени карусели потребитель должен передать `aria-label` или `aria-labelledby`
- attributes:
  - `slides-per-view`, `slides-per-view-768`, `slides-per-view-1024`, `slides-per-view-1280`, `slides-per-view-1440` — количество видимых слайдов; некорректные значения заменяются безопасным fallback
  - `slides-to-scroll="auto|number"` — количество слайдов за одно переключение; по умолчанию `1`
  - `disabled-from="768|1024|1280|1440"` — отключает карусель и переводит содержимое в grid с указанного брейкпоинта; другие значения игнорируются
  - `align="start|center|end"` — выравнивание Embla; некорректное значение заменяется на `start`
  - `drag-free`, `loop` — boolean-настройки Embla
  - `gap` — неотрицательный отступ между слайдами; по умолчанию `16`
- slots: default
- parts: `viewport`, `container`, `controls`, `navigation`, `prev-button`, `next-button`, `pagination`, `dot`, `status`
- CSS custom properties: `--sunmarino-slider-control-color`, `--sunmarino-slider-navigation-background`, `--sunmarino-slider-navigation-outset`, `--sunmarino-slider-navigation-radius`, `--sunmarino-slider-dot-color`
- после получения слайдов компонент добавляет им позиционные доступные имена вида «Слайд 1 из 6», не перезаписывая `aria-label`, заданный потребителем
- во время загрузки и при ошибке Embla все слайды отображаются статической сеткой, управление скрыто; повторное подключение запускает новую попытку загрузки
- прокрутка и snap-позиционирование выполняются только Embla; нативный scroll-snap fallback не используется
- Embla загружается лениво по URL, определённому в `embla-loader.ts`
- полный контракт: [sunmar-slider](docs/sunmar-slider-contract.md)

## Sticky Nav API

Подробный контракт: [sunmar-sticky-nav](docs/sunmar-sticky-nav-contract.md).

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
  - если `top-offset` не задан, верхний offset задаётся CSS-медиазапросами: меньше `768px` — `81px`, от `768px` — `65px`, от `1024px` — `16px`
  - active-state синхронизируется по IntersectionObserver; учитываются ссылки только на текущую страницу с существующим ID
  - изменения href, slot и ID разделов, добавление и удаление разделов обновляют связи
  - удалённые ссылки и отключение компонента восстанавливают принадлежащие компоненту class=active и aria-current
  - если `href` пустой/битый или целевая секция не найдена, компонент безопасно игнорирует такую ссылку и не ломает скрипты
- переходы, прокрутка и обновление URL выполняются нативным поведением `<a href="#section-id">`; компонент не перехватывает клики
- CSS custom properties:
  - `--sunmarino-sticky-nav-z-index`
  - `--sunmarino-sticky-nav-bg`
  - `--sunmarino-sticky-nav-border`
  - `--sunmarino-sticky-nav-gap`

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
- `teleport` позволяет перенести host после подходящего DOM-узла и вывести его из контейнера, который мешает sticky-позиционированию
- `top-offset` задает явный override; без него offset адаптивно определяется через CSS-медиазапросы
- визуальные стили находятся на `:host`, `nav` внутри используется как семантическая обертка

## KV API

Подробный контракт: [sunmar-kv](docs/sunmar-kv-contract.md).

- boolean attribute/property `full-width` / `fullWidth` помечает KV как полноширинный, сбрасывает border radius и включает полноширинные стили внешнего контейнера; атрибут и свойство отражаются друг в друга
- обязательные slots:
  - `image` (обычно `sunmar-image`; допустим любой media-узел, который сам умеет корректно заполнять область визуала)
  - `title` (ожидается семантический заголовок `h1|h2|h3` в light DOM)
- необязательные slots:
  - `eyebrow` (контент, лучше `span` или `p`)
  - `text` (ожидается `p` в light DOM)
  - `actions`
- `KV` адаптируется к ширине viewport через media queries; `aspect-ratio` задаёт предпочтительную пропорцию, а длинный контент может увеличить высоту:
  - base: `87 / 113`
  - `>= 768px`: `608 / 320`
  - `>= 1024px`: `872 / 360`
  - `>= 1280px`: `1120 / 400`
  - `>= 1440px`: `1360 / 500`
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
  - `--sunmarino-kv-content-color`
  - `--sunmarino-kv-content-max-width`
  - `--sunmarino-kv-eyebrow-color`
  - `--sunmarino-kv-title-color`
  - `--sunmarino-kv-text-color`
- SEO-friendly контракт:
  - значимый контент (`title`, `text`, `actions`) должен приходить уже семантическим в light DOM
  - компонент отвечает за layout и styling, а не за генерацию `h1/p` из `span`
- для точечного визуального переопределения используем `::part(...)`, если базового контракта недостаточно

## Accordion API

Подробный контракт: [sunmar-accordion](docs/sunmar-accordion-contract.md).

- `sunmar-accordion` attributes:
  - `mode="single|multiple"` (по умолчанию `multiple`; отсутствующее или некорректное значение нормализуется в `multiple`)
  - `faq` — добавляет рядом с компонентом JSON-LD-разметку `FAQPage`
- `sunmar-accordion` slots: `default` (ожидаются `sunmar-accordion-item`)
- `sunmar-accordion` parts: нет
- внешний API у accordion минимальный: управляем только `mode`, без отдельного reactive value
- при `faq` текст непосредственных элементов `slot="header"` становится `Question`, текст и элементы default slot становятся `acceptedAnswer`; пустые пары исключаются, изменения текста и slot-атрибутов синхронизируются

- `sunmar-accordion-item` attributes: `open`, `disabled`
- `sunmar-accordion-item` slots: `header`, `default`
- `sunmar-accordion-item` parts: `root`, `trigger`, `icon`, `panel`, `content`
- `sunmar-accordion-item` внутри использует нативные `details/summary`, а контейнер сверху координирует group behavior для `mode="single"`
- состояние `open` используется компонентом для логики и стилизации; в `mode="single"` контейнер сам закрывает остальные пункты

## Tabs API

Подробный контракт: [sunmar-tabs](docs/sunmar-tabs-contract.md).

- `sunmar-tabs` attributes/properties:
  - `value` — текущее значение вкладки; программная установка не создаёт пользовательское событие
  - `aria-label` — доступное имя внутреннего `tablist`
- непосредственные дочерние элементы:
  - `sunmar-tab` с непустым `value` и прямым нативным `<button type="button">`
  - `sunmar-tab-content` с таким же непустым `value`
- служебные slots `tab` и `panel` назначаются контейнером автоматически, включая динамически добавленные пары
- изменения value вкладок и панелей, disabled кнопок и замена кнопок синхронизируются; при удалении восстанавливаются принадлежащие контейнеру атрибуты
- `sunmar-tabs` parts: `root`, `nav`, `panels`
- `sunmar-tabs` dispatches `sunmar-tabs-change` только при пользовательском переключении:
  - `detail: { value, previousValue }`
- это позволяет:
  - синхронизировать 2 экземпляра табов через внешний JS
  - отправлять данные в метрику без циклов от programmatic updates
- `sunmar-tab` attributes: `value`, `forced`; `selected` устанавливается контейнером как служебное состояние
- `sunmar-tab` slots: default (ожидается прямая нативная кнопка)
- `sunmar-tab` parts: нет
- disabled задаётся только нативной кнопке: `<button type="button" disabled>`
- `forced` задаёт только начальную активную вкладку и не блокирует последующее переключение
- `value` — стабильный технический идентификатор вкладки (не завязываемся на текст)
- клавиатурная навигация: `ArrowLeft/ArrowRight`, `ArrowUp/ArrowDown`, `Home`, `End`
- контейнер синхронизирует `role`, `aria-controls`, `aria-labelledby`, `aria-selected`, `aria-disabled` и roving `tabindex`
- при повторяющихся `value` используется только первая структурно корректная пара; остальные дубликаты недоступны и скрыты
- `sunmar-tab-content` attributes: `value`; `active` устанавливается контейнером как служебное состояние
- `sunmar-tab-content` slots: default
- `sunmar-tab-content` parts: `content`

Пример:

```html
<sunmar-tabs value="hare" aria-label="Персонажи">
  <sunmar-tab value="hare" forced>
    <button type="button">Заяц</button>
  </sunmar-tab>
  <sunmar-tab value="wolf">
    <button type="button">Волк</button>
  </sunmar-tab>

  <sunmar-tab-content value="hare">Контент зайца</sunmar-tab-content>
  <sunmar-tab-content value="wolf">Контент волка</sunmar-tab-content>
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
