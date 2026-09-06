import { LitElement, css, html, unsafeCSS } from 'lit';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-button-group.scss?inline';

import { normalizeButtonType, normalizeButtonSize, type SunmarButtonType, type SunmarButtonSize } from '../sunmar-button/button-settings';
import type { SunmarButton } from '../sunmar-button/sunmar-button';

export const SUNMAR_BUTTON_GROUP_TAG_NAME = 'sunmar-button-group';

export class SunmarButtonGroup extends LitElement {
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

  get type(): SunmarButtonType {
    return normalizeButtonType(this.getAttribute('type'));
  }

  set type(value: SunmarButtonType) {
    this.setAttribute('type', normalizeButtonType(value));
  }

  get size(): SunmarButtonSize {
    return normalizeButtonSize(this.getAttribute('size'));
  }

  set size(value: SunmarButtonSize) {
    this.setAttribute('size', normalizeButtonSize(value));
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
    this.updateButtons();
  }

  private updateButtons(): void {
    for (const child of this.children) {
      if (child.localName === 'sunmar-button') {
        (child as SunmarButton).requestUpdate?.();
      }
    }
  }

  protected render() {
    return html`<slot @slotchange=${this.updateButtons}></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_BUTTON_GROUP_TAG_NAME]: SunmarButtonGroup;
  }
}
