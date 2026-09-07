# Аудит стилей компонентов — 7 сентября 2026

Проверены 14 SCSS-файлов компонентов, общие стили `component-base`, `action-control`, подключаемые миксины и визуальные значения в TypeScript-шаблонах. Stories, тестовые фикстуры и демонстрационная разметка не входят в область замены.

## Спринт 1 — сопоставление

Сравнение выполнено с текущими файлами `src/styles/tokens`. Совпадение числа в другой категории не считается подходящим токеном: например, размер шрифта 14px не задаёт высоту SVG, а радиус 2px не задаёт толщину рамки. Нули, заполнение 100%, flex/grid-пропорции, центрирование и геометрия SVG не требуют замены токенами оформления.

## Спринт 2 — выполненные замены

- Отступы: `--sunmar-padding-*`, `--sunmar-margin-*`; промежутки: `--sunmar-space-*`.
- Размеры текста: существующие `--sunmar-type-*` и `--sunmar-heading-*`.
- Радиус аккордеона 12px: `--sunmar-radius-s`; резервный радиус карточки 16px: `--sunmar-radius-base`.
- Межстрочный интервал 1.5 у текста карточки и аккордеона: отношение `--sunmar-type-n-line-height / --sunmar-type-n-font-size`. Это сохраняет безразмерный множитель и его наследование, в отличие от прямой замены на 24px.
- Резервный фон карточки #f5f5f8: `--sunmar-color-btn-bg-light-hover`. Такой же токен уже используется как фон sticky-nav. Это точное совпадение цвета, но имя токена привязано к кнопке; отдельного нейтрального токена этого цвета нет. `--sunmar-color-base-light-gray` имеет другой цвет — #f8f8f8.
- Цвет SVG аккордеона #0E2855: `--sunmar-color-base-icon`.
- Условия 1024px в карточке и вкладках: существующие Sass-миксины с `bp-1024`. CSS `var()` нельзя использовать как значение условия media/container query.

Внешние переменные `--Base-color_*`, `--radius-*`, `--padding-*`, `--Gradient-*` сохранены для совместимости. Там, где применимо, их резервные значения теперь используют Sunmar-токены. Новые токены не добавлены. Изменения, уже находившиеся в рабочей папке до аудита, сохранены.

Измененные файлы:

- [src/components/sunmar-accordion-item/sunmar-accordion-item.scss:1](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-accordion-item/sunmar-accordion-item.scss:1)
- [src/components/sunmar-accordion-item/sunmar-accordion-item.ts:1](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-accordion-item/sunmar-accordion-item.ts:1)
- [src/components/sunmar-card/sunmar-card.scss:1](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-card/sunmar-card.scss:1)
- [src/components/sunmar-kv/sunmar-kv.scss:1](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-kv/sunmar-kv.scss:1)
- [src/components/sunmar-sticky-nav/sunmar-sticky-nav.scss:1](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-sticky-nav/sunmar-sticky-nav.scss:1)
- [src/components/sunmar-tabs/sunmar-tab.scss:1](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-tabs/sunmar-tab.scss:1)
- [src/components/sunmar-tabs/sunmar-tabs.scss:1](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-tabs/sunmar-tabs.scss:1)

## Значения для ручного разбора

Приоритет означает порядок просмотра, а не обязательность изменения.

| Приоритет | Компонент | Что осталось и почему |
| --- | --- | --- |
| 1 | Accordion item | Вертикальный padding 43px; вес 400; opacity 0.56; рамка 1px и фокус 2px. Подходящих токенов нет. |
| 1 | Card | Line-height заголовка 1.2 (28.8px при 24px), точного токена нет. Фон теперь использует совпадающий по цвету, но кнопочный токен — см. выше. |
| 1 | KV | Ограничения 520px/1530px, padding 80px, вес 400; line-height 1.1. При 40px это 44px, но при 56px — 61.6px, а токен KV задаёт 60px. Безразмерного токена 1.1 нет. Все пять aspect-ratio заданы отдельно от токенов. |
| 1 | Sticky nav | Top 81px/65px, max-width 1370px, radius 100px. Не заменены на близкие значения (например, 1368px). Padding вычисляется как 16−1=15px и 32−2=30px: таких шагов нет. |
| 1 | Tabs / Tab | Padding 15px/30px, radius 100px, opacity 0.5; фокус 2px. |
| 1 | Slider | Собственная тень rgba(149,157,165,.2) 0 8px 24px не совпадает с shadow-main/darker. SVG 20×14px; opacity .4; фокус 2px с offset 3px. Радиус навигации 6px и точки 10px вычисляются из других токенов, прямых токенов нет. |
| 2 | Modal | Ширина 620px, max-height min(90vh,760px), overlay 60%, z-index 2147483000; gap 10px через сумму токенов. |
| 2 | Button | Градиент 245deg со стопами 15.84%/84.16% отличается от --sunmar-gradient-primary (135deg, 0%/100%). Opacity .54, анимация 160ms/120ms ease, рамки/фокус без токенов. |
| 2 | Общие стили | В action-control: вес 700, рамка 1px, анимации 160ms/120ms ease; padding-inline 34px вычислен суммой существующих токенов. |

Ниже перечислены точные строки оставшихся числовых значений оформления и вычислений. В таблицу включены частично токенизированные выражения; это не означает, что нужно обязательно создавать для каждого отдельный токен.

| Место | Текущее объявление |
| --- | --- |
| [src/components/sunmar-accordion-item/sunmar-accordion-item.scss:11](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-accordion-item/sunmar-accordion-item.scss:11) | `border: 1px solid var(--sunmar-color-btn-stroke-light);` |
| [src/components/sunmar-accordion-item/sunmar-accordion-item.scss:20](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-accordion-item/sunmar-accordion-item.scss:20) | `padding: 43px var(--sunmar-padding-m);` |
| [src/components/sunmar-accordion-item/sunmar-accordion-item.scss:67](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-accordion-item/sunmar-accordion-item.scss:67) | `font-weight: 400;` |
| [src/components/sunmar-accordion-item/sunmar-accordion-item.scss:89](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-accordion-item/sunmar-accordion-item.scss:89) | `opacity: 0.56;` |
| [src/components/sunmar-accordion-item/sunmar-accordion-item.scss:97](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-accordion-item/sunmar-accordion-item.scss:97) | `outline: 2px solid var(--sunmar-color-brand-blue);` |
| [src/components/sunmar-button/sunmar-button.scss:15](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-button/sunmar-button.scss:15) | `background-color 160ms ease,` |
| [src/components/sunmar-button/sunmar-button.scss:16](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-button/sunmar-button.scss:16) | `background-image 160ms ease,` |
| [src/components/sunmar-button/sunmar-button.scss:17](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-button/sunmar-button.scss:17) | `color 160ms ease,` |
| [src/components/sunmar-button/sunmar-button.scss:18](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-button/sunmar-button.scss:18) | `border-color 160ms ease,` |
| [src/components/sunmar-button/sunmar-button.scss:19](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-button/sunmar-button.scss:19) | `transform 120ms ease !important;` |
| [src/components/sunmar-button/sunmar-button.scss:26](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-button/sunmar-button.scss:26) | `245deg,` |
| [src/components/sunmar-button/sunmar-button.scss:27](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-button/sunmar-button.scss:27) | `var(--Gradient-color_Gradinet_Primary_Second, var(--sunmar-color-gradient-primary-second)) 15.84%,` |
| [src/components/sunmar-button/sunmar-button.scss:28](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-button/sunmar-button.scss:28) | `var(--Gradient-color_Gradient_Primary_First, var(--sunmar-color-gradient-primary-first)) 84.16%` |
| [src/components/sunmar-button/sunmar-button.scss:64](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-button/sunmar-button.scss:64) | `opacity: 0.54;` |
| [src/components/sunmar-button/sunmar-button.scss:70](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-button/sunmar-button.scss:70) | `outline: 2px solid var(--sunmar-color-brand-blue) !important;` |
| [src/components/sunmar-button/sunmar-button.scss:71](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-button/sunmar-button.scss:71) | `outline-offset: 2px !important;` |
| [src/components/sunmar-button/sunmar-button.scss:80](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-button/sunmar-button.scss:80) | `245deg,` |
| [src/components/sunmar-button/sunmar-button.scss:81](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-button/sunmar-button.scss:81) | `var(--Gradient-color_Gradient_Primary_First, var(--sunmar-color-gradient-primary-first)) 15.84%,` |
| [src/components/sunmar-button/sunmar-button.scss:82](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-button/sunmar-button.scss:82) | `var(--Gradient-color_Gradinet_Primary_Second, var(--sunmar-color-gradient-primary-second)) 84.16%` |
| [src/components/sunmar-card/sunmar-card.scss:34](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-card/sunmar-card.scss:34) | `line-height: 1.2;` |
| [src/components/sunmar-kv/sunmar-kv.scss:15](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-kv/sunmar-kv.scss:15) | `max-height: 520px;` |
| [src/components/sunmar-kv/sunmar-kv.scss:20](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-kv/sunmar-kv.scss:20) | `max-width: 1530px;` |
| [src/components/sunmar-kv/sunmar-kv.scss:30](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-kv/sunmar-kv.scss:30) | `aspect-ratio: 87 / 113;` |
| [src/components/sunmar-kv/sunmar-kv.scss:43](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-kv/sunmar-kv.scss:43) | `z-index: 1;` |
| [src/components/sunmar-kv/sunmar-kv.scss:48](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-kv/sunmar-kv.scss:48) | `z-index: 3;` |
| [src/components/sunmar-kv/sunmar-kv.scss:89](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-kv/sunmar-kv.scss:89) | `font-weight: 400;` |
| [src/components/sunmar-kv/sunmar-kv.scss:90](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-kv/sunmar-kv.scss:90) | `line-height: 1.1;` |
| [src/components/sunmar-kv/sunmar-kv.scss:108](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-kv/sunmar-kv.scss:108) | `aspect-ratio: 608 / 320;` |
| [src/components/sunmar-kv/sunmar-kv.scss:121](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-kv/sunmar-kv.scss:121) | `aspect-ratio: 872 / 360;` |
| [src/components/sunmar-kv/sunmar-kv.scss:131](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-kv/sunmar-kv.scss:131) | `aspect-ratio: 1120 / 400;` |
| [src/components/sunmar-kv/sunmar-kv.scss:135](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-kv/sunmar-kv.scss:135) | `padding: var(--sunmar-padding-3xl) 80px;` |
| [src/components/sunmar-kv/sunmar-kv.scss:141](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-kv/sunmar-kv.scss:141) | `aspect-ratio: 1360 / 500;` |
| [src/components/sunmar-kv/sunmar-kv.scss:146](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-kv/sunmar-kv.scss:146) | `line-height: 1.1;` |
| [src/components/sunmar-modal/sunmar-modal.scss:4](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-modal/sunmar-modal.scss:4) | `--sunmar-modal-z-index: 2147483000;` |
| [src/components/sunmar-modal/sunmar-modal.scss:5](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-modal/sunmar-modal.scss:5) | `--sunmar-modal-overlay: color-mix(in srgb, var(--sunmar-color-base-icon) 60%, transparent);` |
| [src/components/sunmar-modal/sunmar-modal.scss:34](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-modal/sunmar-modal.scss:34) | `width: min(620px, 100%);` |
| [src/components/sunmar-modal/sunmar-modal.scss:35](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-modal/sunmar-modal.scss:35) | `max-height: min(90vh, 760px);` |
| [src/components/sunmar-modal/sunmar-modal.scss:37](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-modal/sunmar-modal.scss:37) | `border: 1px solid var(--sunmar-modal-border);` |
| [src/components/sunmar-modal/sunmar-modal.scss:51](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-modal/sunmar-modal.scss:51) | `border-bottom: 1px solid var(--sunmar-modal-border);` |
| [src/components/sunmar-modal/sunmar-modal.scss:65](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-modal/sunmar-modal.scss:65) | `border: 1px solid var(--sunmar-modal-border);` |
| [src/components/sunmar-modal/sunmar-modal.scss:88](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-modal/sunmar-modal.scss:88) | `border-top: 1px solid var(--sunmar-modal-border);` |
| [src/components/sunmar-modal/sunmar-modal.scss:106](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-modal/sunmar-modal.scss:106) | `outline: 2px solid var(--sunmar-color-brand-blue);` |
| [src/components/sunmar-modal/sunmar-modal.scss:107](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-modal/sunmar-modal.scss:107) | `outline-offset: 2px;` |
| [src/components/sunmar-slider/sunmar-slider.scss:75](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-slider/sunmar-slider.scss:75) | `border-radius: var(--sunmar-slider-navigation-radius, calc((var(--sunmar-radius-xxs) + var(--sunmar-radius-xs)) / 2));` |
| [src/components/sunmar-slider/sunmar-slider.scss:80](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-slider/sunmar-slider.scss:80) | `box-shadow: rgba(149, 157, 165, 0.2) 0 8px 24px;` |
| [src/components/sunmar-slider/sunmar-slider.scss:94](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-slider/sunmar-slider.scss:94) | `width: 20px;` |
| [src/components/sunmar-slider/sunmar-slider.scss:95](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-slider/sunmar-slider.scss:95) | `height: 14px;` |
| [src/components/sunmar-slider/sunmar-slider.scss:100](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-slider/sunmar-slider.scss:100) | `transition: stroke 160ms ease;` |
| [src/components/sunmar-slider/sunmar-slider.scss:119](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-slider/sunmar-slider.scss:119) | `opacity: .4;` |
| [src/components/sunmar-slider/sunmar-slider.scss:124](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-slider/sunmar-slider.scss:124) | `width: calc((var(--sunmar-space-xs) + var(--sunmar-space-s)) / 2);` |
| [src/components/sunmar-slider/sunmar-slider.scss:125](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-slider/sunmar-slider.scss:125) | `height: calc((var(--sunmar-space-xs) + var(--sunmar-space-s)) / 2);` |
| [src/components/sunmar-slider/sunmar-slider.scss:128](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-slider/sunmar-slider.scss:128) | `border-radius: 50%;` |
| [src/components/sunmar-slider/sunmar-slider.scss:142](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-slider/sunmar-slider.scss:142) | `border: 2px solid currentColor;` |
| [src/components/sunmar-slider/sunmar-slider.scss:143](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-slider/sunmar-slider.scss:143) | `border-radius: 50%;` |
| [src/components/sunmar-slider/sunmar-slider.scss:151](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-slider/sunmar-slider.scss:151) | `outline: 2px solid currentColor;` |
| [src/components/sunmar-slider/sunmar-slider.scss:152](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-slider/sunmar-slider.scss:152) | `outline-offset: 3px;` |
| [src/components/sunmar-slider/sunmar-slider.scss:167](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-slider/sunmar-slider.scss:167) | `width: 1px;` |
| [src/components/sunmar-slider/sunmar-slider.scss:168](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-slider/sunmar-slider.scss:168) | `height: 1px;` |
| [src/components/sunmar-sticky-nav/sunmar-sticky-nav.scss:4](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-sticky-nav/sunmar-sticky-nav.scss:4) | `--sunmar-sticky-nav-z-index: 10;` |
| [src/components/sunmar-sticky-nav/sunmar-sticky-nav.scss:8](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-sticky-nav/sunmar-sticky-nav.scss:8) | `--sunmar-sticky-nav-top-offset: 81px;` |
| [src/components/sunmar-sticky-nav/sunmar-sticky-nav.scss:19](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-sticky-nav/sunmar-sticky-nav.scss:19) | `max-width: 1370px;` |
| [src/components/sunmar-sticky-nav/sunmar-sticky-nav.scss:35](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-sticky-nav/sunmar-sticky-nav.scss:35) | `padding: var(--sunmar-padding-xs) calc(var(--sunmar-padding-n) - 1px);` |
| [src/components/sunmar-sticky-nav/sunmar-sticky-nav.scss:36](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-sticky-nav/sunmar-sticky-nav.scss:36) | `border: 1px solid var(--sunmar-color-btn-stroke-light);` |
| [src/components/sunmar-sticky-nav/sunmar-sticky-nav.scss:37](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-sticky-nav/sunmar-sticky-nav.scss:37) | `border-radius: 100px;` |
| [src/components/sunmar-sticky-nav/sunmar-sticky-nav.scss:44](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-sticky-nav/sunmar-sticky-nav.scss:44) | `background-color 160ms ease,` |
| [src/components/sunmar-sticky-nav/sunmar-sticky-nav.scss:45](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-sticky-nav/sunmar-sticky-nav.scss:45) | `color 160ms ease,` |
| [src/components/sunmar-sticky-nav/sunmar-sticky-nav.scss:46](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-sticky-nav/sunmar-sticky-nav.scss:46) | `border-color 160ms ease !important;` |
| [src/components/sunmar-sticky-nav/sunmar-sticky-nav.scss:54](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-sticky-nav/sunmar-sticky-nav.scss:54) | `outline: 2px solid var(--sunmar-color-brand-blue) !important;` |
| [src/components/sunmar-sticky-nav/sunmar-sticky-nav.scss:55](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-sticky-nav/sunmar-sticky-nav.scss:55) | `outline-offset: 2px !important;` |
| [src/components/sunmar-sticky-nav/sunmar-sticky-nav.scss:82](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-sticky-nav/sunmar-sticky-nav.scss:82) | `--sunmar-sticky-nav-top-offset: 65px;` |
| [src/components/sunmar-sticky-nav/sunmar-sticky-nav.scss:99](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-sticky-nav/sunmar-sticky-nav.scss:99) | `padding: var(--sunmar-padding-n) calc(var(--sunmar-padding-xl) - 2px);` |
| [src/components/sunmar-tabs/sunmar-tab.scss:10](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-tabs/sunmar-tab.scss:10) | `padding: var(--sunmar-padding-xs) 15px;` |
| [src/components/sunmar-tabs/sunmar-tab.scss:17](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-tabs/sunmar-tab.scss:17) | `border-radius: 100px;` |
| [src/components/sunmar-tabs/sunmar-tab.scss:26](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-tabs/sunmar-tab.scss:26) | `::slotted(button:focus-visible) { outline: 2px solid currentColor; outline-offset: 2px; }` |
| [src/components/sunmar-tabs/sunmar-tab.scss:27](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-tabs/sunmar-tab.scss:27) | `::slotted(button:disabled) { cursor: not-allowed; opacity: .5; }` |
| [src/components/sunmar-tabs/sunmar-tab.scss:38](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-tabs/sunmar-tab.scss:38) | `::slotted(button) { border: none; padding: var(--sunmar-padding-n) 30px; font-size: var(--sunmar-type-btn-l-font-size); }` |
| [src/styles/_action-control.scss:15](/Users/mike/Documents/GitHub/sunmarino/src/styles/_action-control.scss:15) | `font-weight: 700;` |
| [src/styles/_action-control.scss:23](/Users/mike/Documents/GitHub/sunmarino/src/styles/_action-control.scss:23) | `border: 1px solid transparent;` |
| [src/styles/_action-control.scss:29](/Users/mike/Documents/GitHub/sunmarino/src/styles/_action-control.scss:29) | `background-color 160ms ease,` |
| [src/styles/_action-control.scss:30](/Users/mike/Documents/GitHub/sunmarino/src/styles/_action-control.scss:30) | `background-image 160ms ease,` |
| [src/styles/_action-control.scss:31](/Users/mike/Documents/GitHub/sunmarino/src/styles/_action-control.scss:31) | `color 160ms ease,` |
| [src/styles/_action-control.scss:32](/Users/mike/Documents/GitHub/sunmarino/src/styles/_action-control.scss:32) | `border-color 160ms ease,` |
| [src/styles/_action-control.scss:33](/Users/mike/Documents/GitHub/sunmarino/src/styles/_action-control.scss:33) | `transform 120ms ease;` |

## Дополнительные места вне SCSS

- [src/components/sunmar-slider/sunmar-slider.ts:47](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-slider/sunmar-slider.ts:47): Числовой публичный параметр gap по умолчанию 16 и его fallback 16 в render задают inline CSS. Значение совпадает с --sunmar-space-n, но TypeScript number нельзя механически заменить CSS var(). Требуется отдельное решение о поведении API: явный gap должен оставаться числом, а значение по умолчанию может наследовать токен.
- [src/components/sunmar-image/sunmar-image.ts:10](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-image/sunmar-image.ts:10): 768px совпадает с брейкпоинтом, но это HTML media-условие, не SCSS. Для устранения дублирования нужен общий источник для TS/Sass; CSS var() здесь не работает.
- [src/components/sunmar-slider/sunmar-slider.ts:8](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-slider/sunmar-slider.ts:8): Список 768/1024/1280/1440 совпадает со шкалой, но является числовым API компонентов.
- [src/components/sunmar-accordion-item/sunmar-accordion-item.ts:51](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-accordion-item/sunmar-accordion-item.ts:51): SVG 12×7, viewBox и stroke-width 1.5: геометрия иконки; соответствующих токенов нет.
- [src/components/sunmar-slider/sunmar-slider.ts:249](/Users/mike/Documents/GitHub/sunmarino/src/components/sunmar-slider/sunmar-slider.ts:249): SVG 20×14 и stroke-width 1.5 в обеих стрелках: соответствующих токенов размеров и обводки нет.

## Общие миксины и существующие особенности системы

- `src/styles/_mixins.scss`, `scroll-snap-container`: 6px, rgba(0,0,0,.24), radius 999px, brightness .92 — прямых токенов нет. В текущих компонентах этот миксин не вызывается.
- Там же `grid`: fallback минимальной ширины 240px без токена; gap уже использует токены с резервными значениями 24px/32px. Резервные значения самих токенов не являются обходом токенов.
- Sass-карта брейкпоинтов дублирует CSS-токены намеренно, что описано в комментарии файла.
- Шкалы space/padding/margin имеют одинаковые значения, но разные назначения. Они не объединялись.
- В типографике есть имена `--sunmar--text-*` с двойным дефисом: использованы в существующем виде.
- Нули, 100%, 1fr, flex-факторы, центрирование 50% и поворот 180deg сохранены как геометрия. `.status` слайдера использует 1px/−1px для скрытого доступного текста; это технический прием, а не размер UI.
- Процент покрытия не вычислялся: подсчет всех чисел смешивал бы токены оформления, геометрию и параметры поведения. Объем проверки и конкретные оставшиеся места перечислены выше.

## Спринт 3 — проверка

Окончательные проверки: `npm run build:js` — успешно; `npm run test:run` — 122 теста в 11 файлах успешно; `npm run typecheck` — успешно. `git diff --check` сообщает о ранее существовавшей пустой строке в конце `src/components/sunmar-accordion/sunmar-accordion.scss:6`; этот файл аудит не менял. В изменениях аудита ошибок пробелов не обнаружено. Визуальное сравнение в браузере не выполнялось; при переопределенных токенах оформление теперь закономерно следует их значениям.
