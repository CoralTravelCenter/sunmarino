import { LitElement, css, html, nothing, unsafeCSS } from 'lit';
import { componentBaseStyles } from '../../styles/component-base';
import { type EmblaApi, type EmblaOptions, loadEmbla } from './embla-loader';
import styles from './sunmar-slider.scss?inline';

export const SUNMAR_SLIDER_TAG_NAME = 'sunmar-slider';

const SUPPORTED_DISABLED_BREAKPOINTS = [768, 1024, 1280, 1440] as const;
const SUPPORTED_ALIGNMENTS = ['start', 'center', 'end'] as const;

export class SunmarSlider extends LitElement {
  static properties = {
    slidesPerView: { type: Number, attribute: 'slides-per-view' },
    slidesPerView768: { type: Number, attribute: 'slides-per-view-768' },
    slidesPerView1024: { type: Number, attribute: 'slides-per-view-1024' },
    slidesPerView1280: { type: Number, attribute: 'slides-per-view-1280' },
    slidesPerView1440: { type: Number, attribute: 'slides-per-view-1440' },
    slidesToScroll: { type: String, attribute: 'slides-to-scroll' },
    disabledFrom: { type: Number, attribute: 'disabled-from' },
    align: { type: String },
    dragFree: { type: Boolean, attribute: 'drag-free' },
    loop: { type: Boolean },
    gap: { type: Number },
    activeIndex: { state: true },
    snapCount: { state: true }
  };

  static styles = [componentBaseStyles, css`${unsafeCSS(styles)}`];

  slidesPerView = 1;
  slidesPerView768?: number;
  slidesPerView1024?: number;
  slidesPerView1280?: number;
  slidesPerView1440?: number;
  slidesToScroll = '1';
  disabledFrom?: number;
  align: 'start' | 'center' | 'end' = 'start';
  dragFree = false;
  loop = false;
  gap = 16;

  private activeIndex = 0;
  private snapCount = 0;
  private embla?: EmblaApi;
  private generatedSlideLabels = new WeakMap<HTMLElement, string>();
  private labeledSlides = new Set<HTMLElement>();

  connectedCallback(): void {
    super.connectedCallback();
    if (this.hasUpdated) {
      this.syncSlideLabels();
      void this.initEmbla();
    }
  }

  protected firstUpdated(): void {
    if (!this.hasAttribute('role')) this.setAttribute('role', 'region');
    if (!this.hasAttribute('aria-roledescription')) {
      this.setAttribute('aria-roledescription', 'carousel');
    }

    void this.initEmbla();
  }

  protected updated(changed: Map<PropertyKey, unknown>): void {
    if (!this.embla || changed.has('activeIndex') || changed.has('snapCount')) return;
    this.embla.reInit(this.getEmblaOptions());
  }

  disconnectedCallback(): void {
    this.embla?.destroy();
    this.embla = undefined;
    this.clearGeneratedSlideLabels();
    this.removeAttribute('embla-ready');
    super.disconnectedCallback();
  }

  private get slides(): HTMLElement[] {
    return this.renderRoot.querySelector<HTMLSlotElement>('.container')?.assignedElements({ flatten: true })
      .filter((element): element is HTMLElement => element instanceof HTMLElement) ?? [];
  }

  private getEmblaOptions(): EmblaOptions {
    const container = this.renderRoot.querySelector<HTMLSlotElement>('.container');
    const disabledFrom = SUPPORTED_DISABLED_BREAKPOINTS.find(
      (breakpoint) => breakpoint === this.disabledFrom
    );
    const align = SUPPORTED_ALIGNMENTS.includes(this.align) ? this.align : 'start';
    const slidesToScroll = this.slidesToScroll === 'auto'
      ? 'auto'
      : this.getValidNumber(Number(this.slidesToScroll), 1, 1);

    return {
      align,
      breakpoints: disabledFrom
        ? { [`(min-width: ${disabledFrom}px)`]: { active: false } }
        : undefined,
      container: container ?? undefined,
      dragFree: this.dragFree,
      loop: this.loop,
      slides: this.slides,
      slidesToScroll
    };
  }

  private getValidNumber(value: number, fallback: number, minimum: number): number {
    return Number.isFinite(value) && value >= minimum ? value : fallback;
  }

  private syncSlideLabels(): void {
    const slides = this.slides;
    const currentSlides = new Set(slides);

    for (const slide of this.labeledSlides) {
      if (currentSlides.has(slide)) continue;

      const generatedLabel = this.generatedSlideLabels.get(slide);
      if (slide.getAttribute('aria-label') === generatedLabel) {
        slide.removeAttribute('aria-label');
      }
      this.generatedSlideLabels.delete(slide);
      this.labeledSlides.delete(slide);
    }

    slides.forEach((slide, index) => {
      const currentLabel = slide.getAttribute('aria-label');
      const generatedLabel = this.generatedSlideLabels.get(slide);

      if (currentLabel && currentLabel !== generatedLabel) {
        this.generatedSlideLabels.delete(slide);
        this.labeledSlides.delete(slide);
        return;
      }

      const nextLabel = `Слайд ${index + 1} из ${slides.length}`;
      slide.setAttribute('aria-label', nextLabel);
      this.generatedSlideLabels.set(slide, nextLabel);
      this.labeledSlides.add(slide);
    });
  }

  private clearGeneratedSlideLabels(): void {
    for (const slide of this.labeledSlides) {
      const generatedLabel = this.generatedSlideLabels.get(slide);
      if (slide.getAttribute('aria-label') === generatedLabel) {
        slide.removeAttribute('aria-label');
      }
    }
    this.labeledSlides.clear();
  }

  private async initEmbla(): Promise<void> {
    const viewport = this.renderRoot.querySelector<HTMLElement>('.viewport');
    if (!viewport || !this.isConnected) return;

    try {
      const EmblaCarousel = await loadEmbla();
      if (!this.isConnected || this.embla) return;

      this.embla = EmblaCarousel(viewport, this.getEmblaOptions());
      this.embla.on('select', this.syncState).on('reInit', this.syncState);
      this.toggleAttribute('embla-ready', true);
      this.syncState(this.embla);
    } catch (error) {
      console.error('[sunmar-slider] Embla failed to load.', error);
    }
  }

  private syncState = (api: EmblaApi): void => {
    this.activeIndex = api.selectedScrollSnap();
    this.snapCount = api.scrollSnapList().length;
  };

  private handleSlotChange(): void {
    this.syncSlideLabels();
    this.embla?.reInit(this.getEmblaOptions());
  }

  protected render() {
    const slideStyles = [
      `--sunmar-slider-gap:${this.getValidNumber(this.gap, 16, 0)}px`,
      `--sunmar-slider-slides:${this.getValidNumber(this.slidesPerView, 1, 1)}`,
      `--sunmar-slider-slides-768:${this.getValidNumber(this.slidesPerView768 ?? this.slidesPerView, 1, 1)}`,
      `--sunmar-slider-slides-1024:${this.getValidNumber(this.slidesPerView1024 ?? this.slidesPerView768 ?? this.slidesPerView, 1, 1)}`,
      `--sunmar-slider-slides-1280:${this.getValidNumber(this.slidesPerView1280 ?? this.slidesPerView1024 ?? this.slidesPerView768 ?? this.slidesPerView, 1, 1)}`,
      `--sunmar-slider-slides-1440:${this.getValidNumber(this.slidesPerView1440 ?? this.slidesPerView1280 ?? this.slidesPerView1024 ?? this.slidesPerView768 ?? this.slidesPerView, 1, 1)}`
    ].join(';');

    return html`
      <div class="stage">
        <div class="viewport" part="viewport">
          <slot
            class="container"
            part="container"
            style=${slideStyles}
            @slotchange=${this.handleSlotChange}
          ></slot>
        </div>

        <div class="navigation" part="navigation">
          <button
            class="button"
            part="prev-button"
            type="button"
            aria-label="Предыдущий слайд"
            ?disabled=${!this.loop && !this.embla?.canScrollPrev()}
            @click=${() => this.embla?.scrollPrev()}
          >
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <path d="M27 16H5M13 8l-8 8 8 8" />
            </svg>
          </button>
          <button
            class="button"
            part="next-button"
            type="button"
            aria-label="Следующий слайд"
            ?disabled=${!this.loop && !this.embla?.canScrollNext()}
            @click=${() => this.embla?.scrollNext()}
          >
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <path d="M5 16h22M19 8l8 8-8 8" />
            </svg>
          </button>
        </div>
      </div>

      <div class="controls" part="controls">
        <div class="pagination" part="pagination" role="group" aria-label="Выбор слайда">
          ${Array.from({ length: this.snapCount }, (_, index) => html`
            <button
              class="dot"
              part="dot"
              type="button"
              aria-label=${`Перейти к слайду ${index + 1}`}
              aria-current=${index === this.activeIndex ? 'true' : nothing}
              @click=${() => this.embla?.scrollTo(index)}
            ></button>
          `)}
        </div>
      </div>

      <span class="status" part="status" aria-live="polite">
        ${this.snapCount ? `Слайд ${this.activeIndex + 1} из ${this.snapCount}` : nothing}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_SLIDER_TAG_NAME]: SunmarSlider;
  }
}
