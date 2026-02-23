import { LitElement, css, html, unsafeCSS } from 'lit';
import styles from './sunmar-tabs-nav.scss?inline';

export const SUNMAR_TABS_NAV_TAG_NAME = 'sunmar-tabs-nav';

export class SunmarTabsNav extends LitElement {
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  protected render() {
    return html`
      <div class="root" part="root">
        <div class="list" part="list" role="tablist">
          <slot class="items-slot"></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_TABS_NAV_TAG_NAME]: SunmarTabsNav;
  }
}
