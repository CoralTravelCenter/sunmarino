import { LitElement, css, html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-button.scss?inline';

import { BUTTON_GROUP_SETTINGS_CHANGE_EVENT, normalizeButtonType, normalizeButtonSize, type SunmarButtonType, type SunmarButtonSize } from './button-settings';
export type { SunmarButtonType, SunmarButtonSize } from './button-settings';

export const SUNMAR_BUTTON_TAG_NAME = 'sunmar-button';

export class SunmarButton extends LitElement {
  static styles = [componentBaseStyles, css`
    ${unsafeCSS(styles)}
  `];

  @property({ attribute: 'type' })
  private explicitType: string | null = null;

  @property({ attribute: 'size' })
  private explicitSize: string | null = null;

  // Explicit settings live in attributes; resolved values never overwrite them.
  @property({ attribute: false })
  get type(): SunmarButtonType {
    return normalizeButtonType(this.explicitType ?? this.group?.getAttribute('type'));
  }

  set type(value: SunmarButtonType) {
    this.setAttribute('type', normalizeButtonType(value));
  }

  @property({ attribute: false })
  get size(): SunmarButtonSize {
    return normalizeButtonSize(this.explicitSize ?? this.group?.getAttribute('size'));
  }

  set size(value: SunmarButtonSize) {
    this.setAttribute('size', normalizeButtonSize(value));
  }

  private get group(): HTMLElement | null {
    return this.parentElement?.localName === 'sunmar-button-group' ? this.parentElement : null;
  }

  private settingsGroup: HTMLElement | null = null;

  // Group attributes are external to this component's reactive properties.
  private readonly onGroupSettingsChange = (): void => {
    this.requestUpdate();
  };

  connectedCallback(): void {
    super.connectedCallback();
    this.settingsGroup = this.group;
    this.settingsGroup?.addEventListener(BUTTON_GROUP_SETTINGS_CHANGE_EVENT, this.onGroupSettingsChange);
    this.requestUpdate();
  }

  disconnectedCallback(): void {
    this.settingsGroup?.removeEventListener(BUTTON_GROUP_SETTINGS_CHANGE_EVENT, this.onGroupSettingsChange);
    this.settingsGroup = null;
    super.disconnectedCallback();
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
