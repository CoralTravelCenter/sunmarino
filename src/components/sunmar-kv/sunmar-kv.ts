import { LitElement, css, html, nothing, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { state } from 'lit/decorators.js';
import { componentBaseStyles } from '../../styles/component-base';
import { observeMinWidth } from '../../utils/dom/observe-media';
import { vimeoAutoPlay } from '../../utils/video/vimeo-auto-play';
import styles from './sunmar-kv.scss?inline';

export const SUNMAR_KV_TAG_NAME = 'sunmar-kv';

const DESKTOP_VIDEO_MIN_WIDTH = 768;

type KvVideoConfigElement = HTMLElement & {
  dataset: DOMStringMap & {
    vimeoId?: string;
  };
};

export class SunmarKv extends LitElement {
  static styles = [componentBaseStyles, css`
    ${unsafeCSS(styles)}
  `];

  @state()
  private isDesktopViewport = false;

  @state()
  private videoReady = false;

  @state()
  private videoSlotsVersion = 0;

  private stopVimeoAutoPlay: (() => void) | null = null;
  private stopDesktopViewportObserver: (() => void) | null = null;
  private vimeoIframePartObserver: MutationObserver | null = null;
  private vimeoSetupToken = 0;

  private get hasVideo(): boolean {
    return this.activeVimeoId.length > 0;
  }

  private get activeVimeoId(): string {
    const desktopId = this.getVideoIdFromSlot('video-desktop');
    const mobileId = this.getVideoIdFromSlot('video-mobile');

    if (this.isDesktopViewport) {
      return desktopId || mobileId;
    }

    return mobileId || desktopId;
  }

  private getAssignedVideoElement(slotName: 'video-desktop' | 'video-mobile'): KvVideoConfigElement | null {
    const slot = this.renderRoot.querySelector<HTMLSlotElement>(`slot[name="${slotName}"]`);
    if (!slot) {
      return null;
    }

    const [element] = slot.assignedElements({ flatten: true });
    if (!(element instanceof HTMLElement)) {
      return null;
    }

    return element as KvVideoConfigElement;
  }

  private getVideoIdFromSlot(slotName: 'video-desktop' | 'video-mobile'): string {
    return this.getAssignedVideoElement(slotName)?.dataset.vimeoId?.trim() ?? '';
  }

  private startViewportObserver(): void {
    if (this.stopDesktopViewportObserver) {
      return;
    }

    this.stopDesktopViewportObserver = observeMinWidth(DESKTOP_VIDEO_MIN_WIDTH, (matches) => {
      this.isDesktopViewport = matches;
    });
  }

  private stopViewportObserver(): void {
    this.stopDesktopViewportObserver?.();
    this.stopDesktopViewportObserver = null;
  }

  private handleVideoSlotChange = (): void => {
    this.videoReady = false;
    this.videoSlotsVersion += 1;
  };

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

    iframe.setAttribute('part', this.isDesktopViewport ? 'iframe' : 'iframe-mob');
  }

  protected render() {
    const pictureClasses = {
      picture: true,
      'picture--hidden': this.hasVideo && this.videoReady
    };

    return html`
      <section class="root" part="root">
        <slot class="video-config-slot" name="video-desktop" @slotchange=${this.handleVideoSlotChange}></slot>
        <slot class="video-config-slot" name="video-mobile" @slotchange=${this.handleVideoSlotChange}></slot>

        <div class="media" part="media">
          <div class=${classMap(pictureClasses)} part="picture">
            <slot name="image"></slot>
          </div>
          ${this.hasVideo
            ? html`
                <div class="video vimeo-video-box" part="video" aria-hidden="true">
                  <div
                    class="video-frame"
                    part="video-frame"
                    data-vimeo-vid=${this.activeVimeoId}
                  ></div>
                </div>
              `
            : nothing}
        </div>

        <div class="content" part="content">
          <div class="content-inner" part="content-inner">
            <div class="eyebrow" part="eyebrow">
              <slot name="eyebrow"></slot>
            </div>
            <div class="title" part="title">
              <slot name="title"></slot>
            </div>
            <div class="text" part="text">
              <slot name="text"></slot>
            </div>
            <div class="actions" part="actions">
              <slot name="actions"></slot>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.videoReady = false;
    this.startViewportObserver();
  }

  firstUpdated(): void {
    this.handleVideoSlotChange();
  }

  updated(changedProperties: Map<string, unknown>): void {
    if (
      !changedProperties.has('isDesktopViewport') &&
      !changedProperties.has('videoSlotsVersion')
    ) {
      return;
    }

    this.videoReady = false;
    void this.setupVimeoAutoPlay();
  }

  disconnectedCallback(): void {
    this.teardownVimeoAutoPlay();
    this.stopViewportObserver();
    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_KV_TAG_NAME]: SunmarKv;
  }
}
