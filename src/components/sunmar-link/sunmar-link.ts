import { LitElement, css, html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-link.scss?inline';

export type SunmarLinkType = 'primary' | 'secondary' | 'neutral';

export const SUNMAR_LINK_TAG_NAME = 'sunmar-link';

export class SunmarLink extends LitElement {
  static styles = [componentBaseStyles, css`
    ${unsafeCSS(styles)}
  `];

  @property({ type: String, reflect: true })
  type: SunmarLinkType = 'primary';

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String, reflect: true })
  href = '';

  @property({ type: String, reflect: true })
  target = '';

  @property({ type: String, reflect: true })
  rel = '';

  @property({ type: String, reflect: true })
  download?: string;

  @property({ type: Boolean, reflect: true, attribute: 'full-width' })
  fullWidth = false;

  protected render() {
    const target = this.target.trim() || undefined;
    const href = this.disabled ? undefined : this.href.trim() || undefined;
    const rel = this.getComputedRel(target);
    const download = typeof this.download === 'string' ? this.download : undefined;

    return html`
      <a
        class="control"
        part="control"
        href=${ifDefined(href)}
        target=${ifDefined(target || undefined)}
        rel=${ifDefined(rel)}
        download=${ifDefined(download)}
        aria-disabled=${ifDefined(this.disabled ? 'true' : undefined)}
        tabindex=${ifDefined(this.disabled ? '-1' : undefined)}
        @click=${this.handleClick}
      >
        <span class="content" part="content">
          <slot class="prefix-slot" name="prefix" part="prefix"></slot>
          <span class="label" part="label">
            <slot>Перейти</slot>
          </span>
          <slot class="suffix-slot" name="suffix" part="suffix"></slot>
        </span>
      </a>
    `;
  }

  private getComputedRel(target: string | undefined): string | undefined {
    const inputRel = this.rel.trim();
    if (target !== '_blank') {
      return inputRel || undefined;
    }

    const relTokens = new Set(
      inputRel
        .split(/\s+/)
        .map((token) => token.trim())
        .filter(Boolean)
    );
    relTokens.add('noopener');
    relTokens.add('noreferrer');

    return Array.from(relTokens).join(' ');
  }

  private handleClick = (event: MouseEvent): void => {
    if (!this.disabled) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  };
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_LINK_TAG_NAME]: SunmarLink;
  }
}
