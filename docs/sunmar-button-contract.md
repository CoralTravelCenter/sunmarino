# Кнопка

Оформляет нативную кнопку действия или ссылку.

## Слоты

| Слот | Что передавать |
| --- | --- |
| По умолчанию | Один непосредственный `<button type="button">` или `<a href="…">` с текстом и необязательной иконкой |

## Атрибуты

| Атрибут | Варианты | Назначение |
| --- | --- | --- |
| `type` | `primary` (по умолчанию), `secondary`, `neutral` | Визуальный вариант |
| `size` | `small`, `medium` (по умолчанию), `large` | Размер по API; сейчас все варианты выглядят одинаково |

Без явных `type` и `size` кнопка наследует настройки непосредственной `sunmar-button-group`. Своя настройка кнопки имеет приоритет.

`disabled` задавайте вложенному `<button>`, а `href`, `target`, `rel` — вложенной ссылке. `type` оболочки задаёт оформление, `type` нативной кнопки — её поведение.

## Внешнее JS-управление

```js
const control = document.querySelector('sunmar-button');
control.type = 'secondary';
control.removeAttribute('type'); // Вернуть наследование от группы.
const button = control.querySelector('button');
button.disabled = true;
button.addEventListener('click', () => console.log('Нажатие'));
```
