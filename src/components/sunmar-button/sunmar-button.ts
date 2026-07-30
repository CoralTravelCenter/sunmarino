import { LitElement, css, html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-button.scss?inline';

export type SunmarButtonType = 'primary' | 'secondary' | 'neutral';

const BUTTON_TYPES = new Set<SunmarButtonType>(['primary', 'secondary', 'neutral']);
const normalizeButtonType = (value: unknown): SunmarButtonType =>
  typeof value === 'string' && BUTTON_TYPES.has(value as SunmarButtonType)
    ? value as SunmarButtonType
    : 'primary';

export const SUNMAR_BUTTON_TAG_NAME = 'sunmar-button';

export class SunmarButton extends LitElement {
  static styles = [componentBaseStyles, css`
    ${unsafeCSS(styles)}
  `];

  @property({
    reflect: true,
    converter: {
      fromAttribute: normalizeButtonType,
      toAttribute: normalizeButtonType
    }
  })
  type: SunmarButtonType = 'primary';

  protected updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has('type')) {
      const normalizedType = normalizeButtonType(this.type);
      if (this.type !== normalizedType) {
        this.type = normalizedType;
      }
    }
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_BUTTON_TAG_NAME]: SunmarButton;
  }
}
