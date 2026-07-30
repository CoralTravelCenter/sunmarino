const EMBLA_CDN_URL = 'https://cdn.jsdelivr.net/npm/embla-carousel@8.6.0/+esm';

export interface EmblaApi {
  canScrollNext(): boolean;
  canScrollPrev(): boolean;
  destroy(): void;
  off(event: 'select' | 'reInit', callback: (api: EmblaApi) => void): EmblaApi;
  on(event: 'select' | 'reInit', callback: (api: EmblaApi) => void): EmblaApi;
  reInit(options?: EmblaOptions): void;
  scrollNext(): void;
  scrollPrev(): void;
  scrollSnapList(): number[];
  scrollTo(index: number): void;
  selectedScrollSnap(): number;
}

export interface EmblaOptions {
  active?: boolean;
  align?: 'start' | 'center' | 'end';
  breakpoints?: Record<string, EmblaOptions>;
  container?: HTMLElement;
  dragFree?: boolean;
  loop?: boolean;
  slides?: HTMLElement[];
  slidesToScroll?: number | 'auto';
}

type EmblaFactory = (viewport: HTMLElement, options: EmblaOptions) => EmblaApi;

let emblaPromise: Promise<EmblaFactory> | undefined;

export function loadEmbla(): Promise<EmblaFactory> {
  emblaPromise ??= import(/* @vite-ignore */ EMBLA_CDN_URL)
    .then((module) => module.default as EmblaFactory)
    .catch((error: unknown) => {
      emblaPromise = undefined;
      throw error;
    });

  return emblaPromise;
}
