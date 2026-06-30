import { LitElement, css, html, unsafeCSS } from 'lit';
import { property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { componentBaseStyles } from '../../styles/component-base';
import styles from './sunmar-slider.scss?inline';

export const SUNMAR_SLIDER_TAG_NAME = 'sunmar-slider';

export class SunmarSlider extends LitElement {
  static styles = [componentBaseStyles, css`
    ${unsafeCSS(styles)}
  `];

  @state()
  private activeSlideIndex = 0;

  @state()
  private slideCount = 0;

  @state()
  private pageCount = 1;

  @state()
  private hasOverflow = false;

  @property({ type: Number, attribute: 'slides-per-view' })
  slidesPerView = 3;

  private resizeObserver: ResizeObserver | null = null;
  private overflowFrame = 0;

  protected render() {
    return html`
      <div class="root" part="root" style=${styleMap(this.rootStyleMap)}>
        ${this.hasOverflow ? this.renderPrevButton() : ''}
        <div class="viewport" part="viewport">
          <div class="track" part="track" @scroll=${this.handleTrackScroll}>
            <slot @slotchange=${this.handleSlotChange}></slot>
          </div>
        </div>
        ${this.hasOverflow ? this.renderNextButton() : ''}
        ${this.hasOverflow ? this.renderDots() : ''}
      </div>
    `;
  }

  firstUpdated(): void {
    this.startResizeObserver();
    this.scheduleOverflowSync();
  }

  disconnectedCallback(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    cancelAnimationFrame(this.overflowFrame);
    this.overflowFrame = 0;
    super.disconnectedCallback();
  }

  private renderPrevButton() {
    return html`
      <button
        class="arrow arrow-prev"
        part="arrow arrow-prev"
        type="button"
        aria-label="Предыдущий слайд"
        @click=${() => this.scrollByDirection(-1)}
      >
        <span aria-hidden="true">←</span>
      </button>
    `;
  }

  private renderNextButton() {
    return html`
      <button
        class="arrow arrow-next"
        part="arrow arrow-next"
        type="button"
        aria-label="Следующий слайд"
        @click=${() => this.scrollByDirection(1)}
      >
        <span aria-hidden="true">→</span>
      </button>
    `;
  }

  private renderDots() {
    return html`
      <div class="dots" part="dots" aria-label="Навигация по слайдам">
        ${Array.from({ length: this.pageCount }, (_, index) => html`
          <button
            class="dot ${index === this.activeSlideIndex ? 'active' : ''}"
            part="dot"
            type="button"
            aria-label=${`Показать слайд ${index + 1}`}
            aria-current=${index === this.activeSlideIndex ? 'true' : 'false'}
            @click=${() => this.scrollToSlide(index)}
          ></button>
        `)}
      </div>
    `;
  }

  private handleSlotChange = (): void => {
    this.slideCount = this.getSlides().length;
    this.activeSlideIndex = Math.min(this.activeSlideIndex, Math.max(0, this.pageCount - 1));
    this.scheduleOverflowSync();
  };

  private handleTrackScroll = (): void => {
    const track = this.getTrack();
    if (!track) {
      return;
    }

    const nextIndex = this.getClosestPageIndex(track.scrollLeft);
    this.activeSlideIndex = Math.max(0, Math.min(this.pageCount - 1, nextIndex));
    this.scheduleOverflowSync();
  };

  private scrollByDirection(direction: number): void {
    const nextIndex = this.activeSlideIndex + direction;
    this.scrollToSlide(Math.max(0, Math.min(this.pageCount - 1, nextIndex)));
  }

  private scrollToSlide(index: number): void {
    const track = this.getTrack();
    if (!track) {
      return;
    }

    track.scrollTo({
      left: this.getSlideOffset(index),
      behavior: 'smooth'
    });
    this.activeSlideIndex = index;
  }

  private getSlides(): Element[] {
    const slot = this.renderRoot.querySelector<HTMLSlotElement>('slot');
    return slot?.assignedElements({ flatten: true }) ?? [];
  }

  private getSlideOffset(index: number): number {
    const track = this.getTrack();
    const slide = this.getSlides()[index];

    if (!track || !slide) {
      return 0;
    }

    const trackRect = track.getBoundingClientRect();
    const slideRect = slide.getBoundingClientRect();

    return slideRect.left - trackRect.left + track.scrollLeft;
  }

  private getClosestPageIndex(scrollLeft: number): number {
    const maxIndex = Math.max(0, this.pageCount - 1);
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    for (let index = 0; index <= maxIndex; index += 1) {
      const distance = Math.abs(this.getSlideOffset(index) - scrollLeft);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    }

    return closestIndex;
  }

  private getTrack(): HTMLElement | null {
    return this.renderRoot.querySelector<HTMLElement>('.track');
  }

  private get rootStyleMap(): Record<string, string> {
    const slidesPerView = Math.max(1, this.slidesPerView);

    return {
      '--sunmar-slider-slides-per-view': String(slidesPerView),
      '--sunmar-slider-gaps-per-view': String(slidesPerView - 1)
    };
  }

  private startResizeObserver(): void {
    this.resizeObserver?.disconnect();

    const track = this.getTrack();
    if (!track) {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.scheduleOverflowSync();
    });
    this.resizeObserver.observe(this);
    this.resizeObserver.observe(track);
  }

  private scheduleOverflowSync(): void {
    cancelAnimationFrame(this.overflowFrame);
    this.overflowFrame = requestAnimationFrame(() => {
      this.syncOverflow();
    });
  }

  private syncOverflow(): void {
    this.overflowFrame = 0;

    const track = this.getTrack();
    if (!track) {
      this.hasOverflow = false;
      return;
    }

    const overflowTolerance = 1;
    this.hasOverflow = track.scrollWidth - track.clientWidth > overflowTolerance;
    this.pageCount = this.getPageCount(track);

    if (!this.hasOverflow && this.activeSlideIndex) {
      this.activeSlideIndex = 0;
      track.scrollLeft = 0;
    }
  }

  private getPageCount(track: HTMLElement): number {
    const slides = this.getSlides();

    if (!slides.length || track.scrollWidth <= track.clientWidth + 1) {
      return 1;
    }

    const visibleCount = slides.reduce((count, slide) => {
      const slideLeft = this.getSlideOffset(count);
      const slideRight = slideLeft + slide.getBoundingClientRect().width;

      return slideRight <= track.clientWidth + 1 ? count + 1 : count;
    }, 0);

    return Math.max(1, slides.length - Math.max(1, visibleCount) + 1);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_SLIDER_TAG_NAME]: SunmarSlider;
  }
}
