import { LitElement, css, html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-button-group.scss?inline';

import { BUTTON_GROUP_SETTINGS_CHANGE_EVENT, normalizeButtonType, normalizeButtonSize, type SunmarButtonType, type SunmarButtonSize } from '../sunmar-button/button-settings';

export const SUNMAR_BUTTON_GROUP_TAG_NAME = 'sunmar-button-group';

export class SunmarButtonGroup extends LitElement {
  static styles = [componentBaseStyles, css`
    ${unsafeCSS(styles)}
  `];

  @property({ attribute: 'type' })
  private explicitType: string | null = null;

  @property({ attribute: 'size' })
  private explicitSize: string | null = null;

  @property({ attribute: false })
  get type(): SunmarButtonType {
    return normalizeButtonType(this.explicitType);
  }

  set type(value: SunmarButtonType) {
    this.setAttribute('type', normalizeButtonType(value));
  }

  @property({ attribute: false })
  get size(): SunmarButtonSize {
    return normalizeButtonSize(this.explicitSize);
  }

  set size(value: SunmarButtonSize) {
    this.setAttribute('size', normalizeButtonSize(value));
  }

  attributeChangedCallback(name: string, oldValue: string | null, value: string | null): void {
    super.attributeChangedCallback(name, oldValue, value);
    // Preserve synchronous normalization of explicit HTML settings.
    if (name !== 'type' && name !== 'size') return;
    if (value !== null) {
      const normalized = name === 'type' ? normalizeButtonType(value) : normalizeButtonSize(value);
      if (value !== normalized) this.setAttribute(name, normalized);
    }
  }

  protected updated(changed: Map<PropertyKey, unknown>): void {
    if (changed.has('explicitType') || changed.has('explicitSize')) {
      this.dispatchEvent(new Event(BUTTON_GROUP_SETTINGS_CHANGE_EVENT));
    }
  }

  protected render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_BUTTON_GROUP_TAG_NAME]: SunmarButtonGroup;
  }
}
