import { LitElement, css, html, unsafeCSS } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './sunmar-link.scss?inline';

export type SunmarLinkType = 'primary' | 'secondary' | 'neutral';

export const SUNMAR_LINK_TAG_NAME = 'sunmar-link';

export class SunmarLink extends LitElement {
  static properties = {
    type: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    href: { type: String, reflect: true },
    target: { type: String, reflect: true },
    rel: { type: String, reflect: true },
    download: { type: String, reflect: true }
  };

  static styles = css`
    ${unsafeCSS(styles)}
  `;

  type: SunmarLinkType = 'primary';
  disabled = false;
  href = '';
  target = '';
  rel = '';
  download?: string;

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
