import { LitElement, css, html, unsafeCSS } from 'lit';
import styles from './sunmar-shell.scss?inline';

type ShellTone = 'neutral' | 'accent';
export const SUNMAR_SHELL_TAG_NAME = 'sunmar-shell';

export class SunmarShell extends LitElement {
  static properties = {
    tone: { type: String, reflect: true },
    isLoading: { type: Boolean, reflect: true, attribute: 'is-loading' }
  };

  static styles = css`
    ${unsafeCSS(styles)}
  `;

  tone: ShellTone = 'neutral';
  isLoading = false;

  protected render() {
    return html`
      <section class="container" part="container">
        <header class="header" part="header">
          <slot name="title">Sunmar component shell</slot>
        </header>
        <div class="content" part="content">
          <slot></slot>
        </div>
        ${this.isLoading
          ? html`
              <footer class="loading" part="loading">
                <slot name="loading">Loading...</slot>
              </footer>
            `
          : null}
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_SHELL_TAG_NAME]: SunmarShell;
  }
}
