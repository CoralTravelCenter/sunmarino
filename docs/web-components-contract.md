# Sunmar Web Components Contract v1

Статус: обязательный контракт библиотеки до выпуска `1.0.0`.

До `1.0.0` разрешены breaking changes, необходимые для приведения компонентов к этому контракту. После `1.0.0` изменения публичного API должны соблюдать обратную совместимость либо выпускаться в новой major-версии.

## 1. Общие принципы

Каждый компонент:

- использует Lit и TypeScript в strict-режиме;
- имеет тег с префиксом `sunmar-`;
- использует Shadow DOM;
- сохраняет нативную HTML-семантику;
- не регистрирует себя при импорте собственного файла;
- экспортирует класс и константу имени тега;
- регистрируется только через общий реестр;
- работает при повторном подключении и перемещении в DOM;
- корректно очищает listeners, observers, timers и глобальное состояние;
- не зависит от порядка загрузки соседних компонентов;
- поддерживает динамическое изменение разрешённого контрактом light DOM.

Базовая форма:

```ts
export const SUNMAR_COMPONENT_TAG_NAME = 'sunmar-component';

export class SunmarComponent extends LitElement {}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_COMPONENT_TAG_NAME]: SunmarComponent;
  }
}
```

## 2. Регистрация и публикация

Формат публикации — только IIFE:

```html
<script src="/path/to/sunmarino-<version>.iife.js"></script>
```

IIFE-бандл:

- автоматически регистрирует все публичные компоненты;
- автоматически добавляет runtime-токены и utility-стили;
- создаёт глобальный объект `window.SunmarinoComponents`;
- допускает повторный вызов регистрации без `NotSupportedError`;
- получает версию в имени файла из `package.json`;
- не требует npm- или ESM-import в production;
- не обращается к DOM на уровне модуля без проверки окружения;
- проходит отдельный smoke-тест собранного артефакта.

## 3. Attributes и properties

| Область | Контракт |
| --- | --- |
| HTML-имена | `kebab-case` |
| JS-properties | `camelCase` |
| Boolean | Нативная presence-семантика HTML |
| Enum | Нормализация в документированное допустимое значение |
| Number | Проверка `finite`, диапазона и единиц |
| String | Обрезка только там, где пробелы не являются значимыми |
| Reflection | Только для публичного DOM-состояния |
| Invalid value | Безопасный документированный fallback |
| Runtime changes | Синхронизация после подключения компонента |

Boolean-атрибут задаётся присутствием:

```html
<sunmar-component disabled></sunmar-component>
```

Значения вида `disabled="false"` запрещены: по правилам HTML это присутствующий boolean-атрибут. Для включённых по умолчанию возможностей используются отрицательные флаги:

```html
<sunmar-modal disable-close-on-esc></sunmar-modal>
```

## 4. Events

Публичные события именуются по шаблону:

```text
sunmar-<component>-<event>
```

Примеры:

```text
sunmar-modal-open
sunmar-modal-close
sunmar-tabs-change
sunmar-accordion-change
```

Публичное событие:

```ts
new CustomEvent('sunmar-tabs-change', {
  detail: { value, previousValue },
  bubbles: true,
  composed: true
});
```

Правила:

- `bubbles` и `composed` всегда равны `true`;
- `detail` имеет экспортируемый TypeScript-тип;
- событие сообщает об уже произошедшем изменении;
- различие программных и пользовательских изменений вводится только при продуктовой необходимости;
- внутренние события не документируются как публичный API;
- компонент не эмулирует нативные `click`, `input` и `submit`;
- имя публичного события объявляется экспортируемой константой.

## 5. Slots и light DOM

- Default slot используется для основного содержимого.
- Named slots имеют предметные имена: `title`, `media`, `actions`, `tab`, `panel`.
- Обязательные slots документируются.
- Пустой необязательный slot не оставляет визуальный контейнер.
- Компонент не уничтожает и не клонирует пользовательский light DOM.
- Для slot-контента используется `::slotted()`.
- Динамическое добавление и удаление содержимого синхронизируется.
- Изменённые компонентом `slot`, ARIA и служебные атрибуты имеют явные правила владения.
- Пользовательские `id`, `aria-label` и семантика не перезаписываются без необходимости.

## 6. CSS и дизайн-токены

Иерархия токенов:

```text
Global tokens
    -> Semantic tokens
        -> Component tokens
```

Пример:

```scss
:root {
  --sunmar-color-surface-primary: #ffffff;
}

:host {
  --sunmar-modal-surface: var(--sunmar-color-surface-primary);
}

.dialog {
  background: var(--sunmar-modal-surface);
}
```

Правила:

- все публичные токены имеют namespace `--sunmar-*`;
- legacy-токены вроде `--Base-color_*` запрещены;
- двойные разделители вроде `--sunmar--text-*` запрещены;
- цвета, типографика, интервалы, radius и shadows берутся из токенов;
- hardcoded-значения допустимы для технической геометрии, например `1px` border, visually-hidden и координат SVG;
- component tokens получают fallback из системных токенов;
- `!important` допускается только при документированной борьбе со стилями light DOM;
- стили не протекают наружу, кроме явно глобальных utilities;
- `part` является публичным API и не используется для внутренней стилизации;
- внутренние элементы стилизуются классами;
- responsive breakpoints берутся из единой SCSS-карты.

## 7. Accessibility

Для каждого компонента обязательны:

- нативная семантика либо обоснованный ARIA-role;
- доступное имя интерактивной области;
- клавиатурное управление согласно ARIA Authoring Practices;
- видимый `focus-visible`;
- поддержка disabled-состояния;
- сохранение пользовательских ARIA-атрибутов;
- отсутствие keyboard trap, кроме корректного modal focus trap;
- восстановление фокуса после закрытия overlay-компонента;
- синхронизация ARIA при runtime-изменениях;
- отсутствие избыточных объявлений через `aria-live`;
- отсутствие critical и serious нарушений в Storybook a11y-проверке.

## 8. Lifecycle и ресурсы

Любой создаваемый ресурс имеет симметричную очистку:

| Создание | Очистка |
| --- | --- |
| `addEventListener` | `removeEventListener` |
| `MutationObserver` | `disconnect()` |
| `IntersectionObserver` | `disconnect()` |
| `setTimeout` | `clearTimeout()` |
| Scroll lock | Release lock |
| Ожидание DOM relocation | Отмена ожидания |
| Внешний instance | `destroy()` |

Дополнительно:

- асинхронная операция после `await` повторно проверяет `isConnected`;
- повторный `connectedCallback` не дублирует ресурсы;
- `disconnectedCallback` допускает последующее подключение;
- обработчики не удерживают удалённые DOM-узлы;
- изменение attributes не создаёт бесконечный цикл updates.

## 9. Ошибки и внешние данные

- Некорректный пользовательский input не ломает компонент.
- CSS-селекторы, URL, URI fragments и числовые параметры валидируются.
- Ошибка внешнего CDN переводит компонент в рабочий fallback.
- Компонент не вставляет непроверенный HTML через `innerHTML`.
- Ошибка не скрывается, если компонент полностью потерял функциональность.
- Диагностическое сообщение содержит имя компонента.
- Ошибка не выводит пользовательские секреты или полный внешний payload.

## 10. Состояния

Для каждого компонента описываются:

- initial;
- ready;
- empty;
- disabled;
- invalid input;
- loading при наличии async;
- error или fallback;
- disconnected;
- reconnected;
- динамическое изменение children и attributes;
- hover, focus и active для интерактивных компонентов.

Не все состояния обязаны иметь отдельный UI, но поведение каждого должно быть определено.

## 11. Тестовый контракт

Для каждого компонента проверяются применимые сценарии:

1. Регистрация.
2. Начальный render.
3. Публичные attributes и properties.
4. Invalid input.
5. Runtime-изменение API.
6. Slots и динамический light DOM.
7. Публичные events.
8. Keyboard interaction.
9. ARIA-связи.
10. Cleanup после удаления.
11. Повторное подключение.
12. Основной fallback.

Общие gates библиотеки:

```text
npm run typecheck
npm run test:run
npm run verify:package
npm run build-storybook
git diff --check
```

## 12. Документация компонента

После рефакторинга компонент документирует:

- назначение;
- когда использовать и не использовать;
- anatomy;
- attributes и properties;
- methods;
- events;
- slots;
- parts;
- CSS custom properties;
- states;
- keyboard behavior;
- accessibility;
- edge cases;
- рабочие Storybook-примеры.

## 13. Контракт работы агентов

Каждый компонент рефакторит отдельный агент. Агент получает:

- этот общий контракт;
- конкретный компонент и связанные SCSS, stories и tests;
- запрет изменять другие компоненты без отдельного согласования;
- обязанность сначала провести аудит компонента;
- обязанность описать предлагаемые breaking changes;
- разрешение реализовывать только согласованный план;
- обязанность завершить работу тестами и отчётом о соответствии контракту.

Изменение общей инфраструктуры, shared styles, registry или публичного IIFE-контракта выносится в отдельный инфраструктурный этап и не выполняется агентом отдельного компонента без согласования.
