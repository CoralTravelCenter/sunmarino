import { LitElement, css, html, nothing, unsafeCSS } from 'lit';
import { property, query, queryAssignedElements, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { componentBaseStyles } from '../../styles/component-base';
import { type EmblaApi, type EmblaOptions, loadEmbla } from './embla-loader';
import styles from './sunmar-slider.scss?inline';

export const SUNMAR_SLIDER_TAG_NAME = 'sunmar-slider';

const SUPPORTED_DISABLED_BREAKPOINTS = [768, 1024, 1280, 1440] as const;
const OPTION_PROPERTIES = new Set([
  'slidesPerView', 'slidesPerView768', 'slidesPerView1024', 'slidesPerView1280',
  'slidesPerView1440', 'slidesToScroll', 'disabledFrom', 'align', 'dragFree', 'loop', 'gap'
]);

const SUPPORTED_ALIGNMENTS = ['start', 'center', 'end'] as const;

export class SunmarSlider extends LitElement {
  static styles = [componentBaseStyles, css`${unsafeCSS(styles)}`];

  @property({ type: Number, attribute: 'slides-per-view' })
  slidesPerView = 1;

  @property({ type: Number, attribute: 'slides-per-view-768' })
  slidesPerView768?: number;

  @property({ type: Number, attribute: 'slides-per-view-1024' })
  slidesPerView1024?: number;

  @property({ type: Number, attribute: 'slides-per-view-1280' })
  slidesPerView1280?: number;

  @property({ type: Number, attribute: 'slides-per-view-1440' })
  slidesPerView1440?: number;

  @property({ type: String, attribute: 'slides-to-scroll' })
  slidesToScroll = '1';

  @property({ type: Number, attribute: 'disabled-from', reflect: true })
  disabledFrom?: number;

  @property({ type: String })
  align: 'start' | 'center' | 'end' = 'start';

  @property({ type: Boolean, attribute: 'drag-free' })
  dragFree = false;

  @property({ type: Boolean })
  loop = false;

  @property({ type: Number })
  gap = 16;

  @state()
  private activeIndex = 0;

  @state()
  private snapCount = 0;

  @state()
  private canScrollPrev = false;

  @state()
  private canScrollNext = false;
  private initializationId = 0;
  private embla?: EmblaApi;
  private generatedSlideLabels = new WeakMap<HTMLElement, string>();
  private labeledSlides = new Set<HTMLElement>();

  @query('.viewport')
  private viewport!: HTMLElement | null;

  @query('.container')
  private container!: HTMLSlotElement | null;

  @queryAssignedElements({ flatten: true })
  private assignedSlides!: Element[];

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
    if (!this.embla || !Array.from(changed.keys()).some((key) => OPTION_PROPERTIES.has(String(key)))) return;
    this.embla.reInit(this.getEmblaOptions());
  }

  disconnectedCallback(): void {
    this.initializationId++;
    this.destroyEmbla();
    this.clearGeneratedSlideLabels();
    this.removeAttribute('embla-ready');
    super.disconnectedCallback();
  }

  private destroyEmbla(): void {
    this.embla?.off('select', this.syncState).off('reInit', this.syncState);
    this.embla?.destroy();
    this.embla = undefined;
    this.activeIndex = 0;
    this.snapCount = 0;
    this.canScrollPrev = false;
    this.canScrollNext = false;
    this.removeAttribute('embla-ready');
  }

  private get slides(): HTMLElement[] {
    return this.assignedSlides.filter((element): element is HTMLElement => element instanceof HTMLElement);
  }

  private getEmblaOptions(): EmblaOptions {
    const disabledFrom = SUPPORTED_DISABLED_BREAKPOINTS.find(
      (breakpoint) => breakpoint === this.disabledFrom
    );
    const align = SUPPORTED_ALIGNMENTS.includes(this.align) ? this.align : 'start';
    const slidesToScroll = this.slidesToScroll === 'auto'
      ? 'auto'
      : Math.floor(this.getValidNumber(Number(this.slidesToScroll), 1, 1));

    return {
      align,
      // reInit merges options: explicitly reset every owned breakpoint.
      breakpoints: Object.fromEntries(SUPPORTED_DISABLED_BREAKPOINTS.map((breakpoint) => [
        `(min-width: ${breakpoint}px)`,
        { active: disabledFrom === undefined || breakpoint < disabledFrom }
      ])),
      container: this.container ?? undefined,
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

      if (slide.hasAttribute('aria-labelledby') || (currentLabel && currentLabel !== generatedLabel)) {
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
    this.generatedSlideLabels = new WeakMap();
  }

  private async initEmbla(): Promise<void> {
    const viewport = this.viewport;
    if (!viewport || !this.isConnected || this.embla) return;
    const initializationId = ++this.initializationId;

    try {
      const EmblaCarousel = await loadEmbla();
      if (!this.isConnected || initializationId !== this.initializationId || this.embla) return;

      // Embla must measure the flex layout, not the loading grid.
      this.toggleAttribute('embla-ready', true);
      this.embla = EmblaCarousel(viewport, this.getEmblaOptions());
      this.embla.on('select', this.syncState).on('reInit', this.syncState);
      this.syncState(this.embla);
    } catch {
      if (!this.isConnected || initializationId !== this.initializationId) return;
      this.destroyEmbla();
      console.error('[sunmar-slider] Embla initialization failed; displaying a static grid.');
    }
  }

  private syncState = (api: EmblaApi): void => {
    if (api !== this.embla) return;
    this.canScrollPrev = api.canScrollPrev();
    this.canScrollNext = api.canScrollNext();
    this.activeIndex = api.selectedScrollSnap();
    this.snapCount = api.scrollSnapList().length;
  };

  private handleSlotChange(): void {
    if (!this.isConnected) return;
    this.syncSlideLabels();
    this.embla?.reInit(this.getEmblaOptions());
  }

  protected render() {
    const counts = [this.slidesPerView, this.slidesPerView768, this.slidesPerView1024,
      this.slidesPerView1280, this.slidesPerView1440];
    const suffixes = ['', '-768', '-1024', '-1280', '-1440'];
    let previous = 1;
    const slideStyles: Record<string, string | number> = {
      '--sunmarino-slider-gap': `${this.getValidNumber(this.gap, 16, 0)}px`
    };
    counts.forEach((count, index) => {
      previous = count === undefined ? previous : this.getValidNumber(count, 1, 1);
      slideStyles[`--sunmarino-slider-slides${suffixes[index]}`] = previous;
      slideStyles[`--sunmarino-slider-grid-columns${suffixes[index]}`] = Math.floor(previous);
    });

    return html`
      <div class="stage">
        <div class="viewport" part="viewport">
          <slot
            class="container"
            part="container"
            style=${styleMap(slideStyles)}
            @slotchange=${this.handleSlotChange}
          ></slot>
        </div>

        <div class="navigation" part="navigation" ?hidden=${this.snapCount < 2}>
          <button
            class="button button-prev"
            part="prev-button"
            type="button"
            aria-label="Предыдущий слайд"
            ?disabled=${!this.canScrollPrev}
            @click=${() => this.embla?.scrollPrev()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="14"
              viewBox="0 0 20 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7.33334 12.7031L2 7.45314L7.33334 2.20314M2 7.45314L18 7.45313"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <button
            class="button button-next"
            part="next-button"
            type="button"
            aria-label="Следующий слайд"
            ?disabled=${!this.canScrollNext}
            @click=${() => this.embla?.scrollNext()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="14"
              viewBox="0 0 20 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7.33334 12.7031L2 7.45314L7.33334 2.20314M2 7.45314L18 7.45313"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div class="controls" part="controls" ?hidden=${this.snapCount < 2}>
        <div class="pagination" part="pagination" role="group" aria-label="Выбор позиции карусели">
          ${Array.from({ length: this.snapCount }, (_, index) => html`
            <button
              class="dot"
              part="dot"
              type="button"
              aria-label=${`Перейти к позиции ${index + 1}`}
              aria-current=${index === this.activeIndex ? 'true' : nothing}
              @click=${() => this.embla?.scrollTo(index)}
            ></button>
          `)}
        </div>
      </div>

      <span class="status" part="status" aria-live="polite">
        ${this.snapCount > 1 ? `Позиция ${this.activeIndex + 1} из ${this.snapCount}` : nothing}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [SUNMAR_SLIDER_TAG_NAME]: SunmarSlider;
  }
}
