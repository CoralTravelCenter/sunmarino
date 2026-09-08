# Модальное окно

Открывает диалог поверх страницы и блокирует взаимодействие с фоном.

## Слоты

| Слот | Что передавать |
| --- | --- |
| `title` | Текст или `<span>` с заголовком; компонент сам создаёт `h2` |
| По умолчанию | Основное содержимое: текст, поля, кнопки |
| `actions` | Кнопки действий; необязательный, пустая область скрывается |

## Атрибуты

| Атрибут | Варианты / по умолчанию | Назначение |
| --- | --- | --- |
| `open` | Присутствует / отсутствует | Открыть окно; по умолчанию закрыто |
| `disable-close-on-backdrop` | Присутствует / отсутствует | Запретить закрытие по фону; по умолчанию фон закрывает окно |
| `disable-close-on-esc` | Присутствует / отсутствует | Запретить закрытие по Escape; по умолчанию Escape закрывает окно |
| `aria-label` | Текст / не задан | Явное доступное имя окна |
| `aria-labelledby` | ID внешнего заголовка / не задан | Взять доступное имя из указанного элемента |

Без явного имени используется заголовок из `title`. Логические атрибуты работают по присутствию: `open="false"` тоже открывает окно.

## Внешнее JS-управление

```html
<button id="open-modal" type="button">Открыть окно</button>
<sunmar-modal id="booking-modal">
  <span slot="title">Бронирование</span>
  <p>Проверьте параметры поездки.</p>
  <button id="close-modal" slot="actions" type="button">Готово</button>
</sunmar-modal>
```

```js
await customElements.whenDefined('sunmar-modal');
const modal = document.querySelector('#booking-modal');
document.querySelector('#open-modal').addEventListener('click', () => modal.show());
document.querySelector('#close-modal').addEventListener('click', () => modal.hide());
// modal.toggle() переключает состояние; modal.open возвращает true или false.
modal.addEventListener('sunmar-modal-open', () => console.log('Открыто'));
modal.addEventListener('sunmar-modal-close', () => console.log('Закрыто'));
```
