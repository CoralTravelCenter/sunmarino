import { LitElement, css, html, unsafeCSS } from 'lit';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-button.scss?inline';

import { normalizeButtonType, normalizeButtonSize, type SunmarButtonType, type SunmarButtonSize } from './button-settings';
export type { SunmarButtonType, SunmarButtonSize } from './button-settings';

export const SUNMAR_BUTTON_TAG_NAME = 'sunmar-button';

export class SunmarButton extends LitElement {
  static styles = [componentBaseStyles, css`
    ${unsafeCSS(styles)}
  `];

  static properties = {
    type: { attribute: false, noAccessor: true },
    size: { attribute: false, noAccessor: true }
  };

  static get observedAttributes(): string[] {
    return [...super.observedAttributes, 'type', 'size'];
  }

  // Explicit settings live in attributes; resolved values never overwrite them.
  get type(): SunmarButtonType {
    return normalizeButtonType(this.getAttribute('type') ?? this.group?.getAttribute('type'));
  }

  set type(value: SunmarButtonType) {
    this.setAttribute('type', normalizeButtonType(value));
  }

  get size(): SunmarButtonSize {
    return normalizeButtonSize(this.getAttribute('size') ?? this.group?.getAttribute('size'));
  }

  set size(value: SunmarButtonSize) {
    this.setAttribute('size', normalizeButtonSize(value));
  }

  private get group(): HTMLElement | null {
    return this.parentElement?.localName === 'sunmar-button-group' ? this.parentElement : null;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.requestUpdate();
  }

  attributeChangedCallback(name: string, oldValue: string | null, value: string | null): void {
    super.attributeChangedCallback(name, oldValue, value);
    if (name !== 'type' && name !== 'size') return;
    if (value !== null) {
      const normalized = name === 'type' ? normalizeButtonType(value) : normalizeButtonSize(value);
      if (value !== normalized) this.setAttribute(name, normalized);
    }
    this.requestUpdate();
  }

  protected updated(): void {
    this.setAttribute('data-resolved-type', this.type);
    this.setAttribute('data-resolved-size', this.size);
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
