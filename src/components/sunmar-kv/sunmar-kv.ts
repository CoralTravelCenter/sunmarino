import { LitElement, css, html, nothing, unsafeCSS } from 'lit';
import { vimeoAutoPlay } from '../../utils/video/vimeo-auto-play';
import styles from './sunmar-kv.scss?inline';

export const SUNMAR_KV_TAG_NAME = 'sunmar-kv';

export class SunmarKv extends LitElement {
  static properties = {
    vimeoId: { type: String, reflect: true, attribute: 'vimeo-id' },
    vimeoIdDesktop: { type: String, reflect: true, attribute: 'vimeo-id-desktop' },
    vimeoIdMobile: { type: String, reflect: true, attribute: 'vimeo-id-mobile' },
    isMobileViewport: { type: Boolean, state: true },
    videoReady: { type: Boolean, state: true }
  };

  static styles = css`
    ${unsafeCSS(styles)}
  `;

  vimeoId = '';
  vimeoIdDesktop = '';
  vimeoIdMobile = '';
  private isMobileViewport = false;
  private videoReady = false;
  private stopVimeoAutoPlay: (() => void) | null = null;
  private vimeoIframePartObserver: MutationObserver | null = null;
  private vimeoSetupToken = 0;
  private mobileViewportQuery: MediaQueryList | null = null;
  private readonly onViewportQueryChange = (event: MediaQueryListEvent): void => {
    this.isMobileViewport = event.matches;
  };

  connectedCallback(): void {
    super.connectedCallback();
    this.videoReady = false;

    if (typeof window !== 'undefined' && 'matchMedia' in window) {
      this.mobileViewportQuery = window.matchMedia('(max-width: 767px)');
      this.isMobileViewport = this.mobileViewportQuery.matches;
      this.mobileViewportQuery.addEventListener('change', this.onViewportQueryChange);
    }
  }

  disconnectedCallback(): void {
    this.teardownVimeoAutoPlay();
    this.mobileViewportQuery?.removeEventListener('change', this.onViewportQueryChange);
    this.mobileViewportQuery = null;
    super.disconnectedCallback();
  }

  updated(changedProperties: Map<string, unknown>): void {
    if (
      !changedProperties.has('vimeoId') &&
      !changedProperties.has('vimeoIdDesktop') &&
      !changedProperties.has('vimeoIdMobile') &&
      !changedProperties.has('isMobileViewport')
    ) {
      return;
    }

    this.videoReady = false;
    void this.setupVimeoAutoPlay();
  }

  protected render() {
    const activeVimeoId = this.activeVimeoId;
    const hasVideo = activeVimeoId.length > 0;
    const pictureClass = `picture${hasVideo && this.videoReady ? ' picture--hidden' : ''}`;

    return html`
      <div class="root" part="root">
        <div class="media" part="media" aria-hidden="true">
          <div class=${pictureClass} part="picture">
            <slot name="image"></slot>
          </div>
          ${hasVideo
            ? html`
                <div class="video vimeo-video-box" part="video">
                  <div
                    class="video-frame"
                    part="video-frame"
                    data-vimeo-vid=${activeVimeoId}
                  ></div>
                </div>
              `
            : nothing}
        </div>

        <div class="content" part="content">
          <div class="content-inner" part="content-inner">
            <div class="eyebrow" part="eyebrow">
              <slot class="eyebrow-slot" name="eyebrow"></slot>
            </div>
            <h1 class="title" part="title">
              <slot name="title"></slot>
            </h1>
            <slot class="text" name="text"></slot>
            <div class="actions" part="actions">
              <slot class="actions-slot" name="actions"></slot>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private get hasVideo(): boolean {
    return this.activeVimeoId.length > 0;
  }

  private get activeVimeoId(): string {
    const fallbackId = this.vimeoId.trim();
    const desktopId = this.vimeoIdDesktop.trim();
    const mobileId = this.vimeoIdMobile.trim();

    if (this.isMobileViewport) {
      return mobileId || fallbackId || desktopId;
    }

    return desktopId || fallbackId || mobileId;
  }

  private async setupVimeoAutoPlay(): Promise<void> {
    this.teardownVimeoAutoPlay();

    if (!this.isConnected || !this.hasVideo) {
      return;
    }

    this.setupVimeoIframePartObserver();

    const setupToken = ++this.vimeoSetupToken;

    try {
      const cleanup = await vimeoAutoPlay({
        root: this.renderRoot,
        selector: '.vimeo-video-box [data-vimeo-vid]',
        onPlaybackStart: () => {
          this.syncVimeoIframePart();
          this.videoReady = true;
        }
      });

      if (setupToken !== this.vimeoSetupToken) {
        cleanup();
        return;
      }

      this.stopVimeoAutoPlay = cleanup;
    } catch {
      // Keep image visible as a stable fallback when Vimeo script/player fails.
      this.videoReady = false;
    }
  }

  private teardownVimeoAutoPlay(): void {
    this.vimeoSetupToken += 1;
    this.stopVimeoAutoPlay?.();
    this.stopVimeoAutoPlay = null;
    this.vimeoIframePartObserver?.disconnect();
    this.vimeoIframePartObserver = null;
  }

  private setupVimeoIframePartObserver(): void {
    this.vimeoIframePartObserver?.disconnect();
    this.vimeoIframePartObserver = null;

    const videoFrame = this.renderRoot.querySelector<HTMLElement>('.video-frame');
    if (!videoFrame) {
      return;
    }

    this.syncVimeoIframePart();

    const observer = new MutationObserver(() => {
      this.syncVimeoIframePart();
    });

    observer.observe(videoFrame, { childList: true, subtree: true });
    this.vimeoIframePartObserver = observer;
  }

  private syncVimeoIframePart(): void {
    const iframe = this.renderRoot.querySelector<HTMLIFrameElement>('.video-frame iframe');
    if (!iframe) {
      return;
    }

    iframe.setAttribute('part', this.isMobileViewport ? 'iframe-mob' : 'iframe');
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_KV_TAG_NAME]: SunmarKv;
  }
}
