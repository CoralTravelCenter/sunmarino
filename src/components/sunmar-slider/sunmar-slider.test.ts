import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadEmbla, type EmblaApi, type EmblaOptions } from './embla-loader';
import { registerSunmarComponents } from '../../registry/register-components';
import type { SunmarSlider } from './sunmar-slider';

vi.mock('./embla-loader', () => ({ loadEmbla: vi.fn() }));
registerSunmarComponents();

function createCarousel() {
  const listeners = new Map<string, (api: EmblaApi) => void>();
  const api: EmblaApi = {
    canScrollPrev: vi.fn(() => false), canScrollNext: vi.fn(() => true),
    selectedScrollSnap: vi.fn(() => 0), scrollSnapList: vi.fn(() => [0, 0.5, 1]),
    scrollNext: vi.fn(), scrollPrev: vi.fn(), scrollTo: vi.fn(), destroy: vi.fn(),
    on: vi.fn((event, callback) => { listeners.set(event, callback); return api; }),
    off: vi.fn((event) => { listeners.delete(event); return api; }),
    reInit: vi.fn(() => listeners.get('reInit')?.(api))
  };
  return { api, emit: (event: 'select' | 'reInit') => listeners.get(event)?.(api) };
}

async function settle(slider: SunmarSlider) {
  await slider.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 0));
  await slider.updateComplete;
}

async function mount(attributes = '') {
  document.body.innerHTML = `<sunmar-slider aria-label="Предложения" ${attributes}>
    <sunmar-slide><a href="#one">Первый</a></sunmar-slide>
    <sunmar-slide>Второй</sunmar-slide><sunmar-slide>Третий</sunmar-slide>
  </sunmar-slider>`;
  const slider = document.querySelector('sunmar-slider')!;
  await settle(slider);
  return slider;
}

const buttons = (slider: SunmarSlider) => Array.from(
  slider.shadowRoot!.querySelectorAll<HTMLButtonElement>('.navigation button')
);

describe('SunmarSlider', () => {
  let carousel: ReturnType<typeof createCarousel>;
  let factory: ReturnType<typeof vi.fn<(viewport: HTMLElement, options: EmblaOptions) => EmblaApi>>;

  beforeEach(() => {
    carousel = createCarousel();
    factory = vi.fn(() => carousel.api);
    vi.mocked(loadEmbla).mockResolvedValue(factory);
  });
  afterEach(() => {
    document.body.replaceChildren();
    vi.resetAllMocks();
    vi.restoreAllMocks();
  });

  it('keeps slide content and disables controls while loading, including loop mode', async () => {
    vi.mocked(loadEmbla).mockReturnValue(new Promise(() => {}));
    const slider = await mount('loop');
    expect(slider.getAttribute('role')).toBe('region');
    expect(slider.getAttribute('aria-label')).toBe('Предложения');
    expect(slider.hasAttribute('embla-ready')).toBe(false);
    expect(slider.children).toHaveLength(3);
    expect(slider.querySelector('a')?.textContent).toBe('Первый');
    expect(buttons(slider).every((button) => button.disabled)).toBe(true);
    expect(slider.shadowRoot!.querySelector<HTMLElement>('.controls')!.hidden).toBe(true);
  });

  it('initializes once with the slotted nodes and forwards navigation actions', async () => {
    const slider = await mount();
    expect(factory).toHaveBeenCalledTimes(1);
    expect(factory.mock.calls[0][1].slides).toEqual(Array.from(slider.children));
    expect(slider.hasAttribute('embla-ready')).toBe(true);
    expect(buttons(slider).map((button) => button.disabled)).toEqual([true, false]);
    buttons(slider)[1].click();
    slider.shadowRoot!.querySelectorAll<HTMLButtonElement>('.dot')[2].click();
    expect(carousel.api.scrollNext).toHaveBeenCalledOnce();
    expect(carousel.api.scrollTo).toHaveBeenCalledWith(2);
    vi.mocked(carousel.api.canScrollPrev).mockReturnValue(true);
    vi.mocked(carousel.api.selectedScrollSnap).mockReturnValue(1);
    carousel.emit('select');
    await settle(slider);
    buttons(slider)[0].click();
    expect(carousel.api.scrollPrev).toHaveBeenCalledOnce();
    expect(slider.shadowRoot!.querySelectorAll('.dot')[1].getAttribute('aria-current')).toBe('true');
  });

  it('uses actual scrollability even when loop was requested', async () => {
    vi.mocked(carousel.api.canScrollNext).mockReturnValue(false);
    vi.mocked(carousel.api.scrollSnapList).mockReturnValue([0]);
    const slider = await mount('loop');
    expect(buttons(slider).every((button) => button.disabled)).toBe(true);
    expect(slider.shadowRoot!.querySelector<HTMLElement>('.navigation')!.hidden).toBe(true);
  });

  it('updates buttons when reInit changes scrollability but not the snap index or count', async () => {
    const slider = await mount();
    vi.mocked(carousel.api.canScrollNext).mockReturnValue(false);
    carousel.emit('reInit');
    await settle(slider);
    expect(buttons(slider)[1].disabled).toBe(true);
  });

  it('does not lose option changes batched with a selection update', async () => {
    const slider = await mount();
    vi.mocked(carousel.api.reInit).mockClear();
    vi.mocked(carousel.api.selectedScrollSnap).mockReturnValue(1);
    carousel.emit('select');
    slider.gap = 32;
    slider.align = 'center';
    await settle(slider);
    expect(carousel.api.reInit).toHaveBeenCalledTimes(1);
    expect(carousel.api.reInit).toHaveBeenCalledWith(expect.objectContaining({ align: 'center' }));
    expect(slider.shadowRoot!.querySelector<HTMLElement>('.container')!.style.getPropertyValue('--sunmarino-slider-gap')).toBe('32px');
    vi.mocked(carousel.api.reInit).mockClear();
    vi.mocked(carousel.api.selectedScrollSnap).mockReturnValue(2);
    carousel.emit('select');
    await settle(slider);
    expect(carousel.api.reInit).not.toHaveBeenCalled();
  });

  it('reflects disabledFrom and explicitly clears previous breakpoint options', async () => {
    const slider = await mount('disabled-from="768"');
    slider.disabledFrom = 1280;
    await settle(slider);
    expect(slider.getAttribute('disabled-from')).toBe('1280');
    expect(carousel.api.reInit).toHaveBeenLastCalledWith(expect.objectContaining({ breakpoints: {
      '(min-width: 768px)': { active: true }, '(min-width: 1024px)': { active: true },
      '(min-width: 1280px)': { active: false }, '(min-width: 1440px)': { active: false }
    } }));
    slider.removeAttribute('disabled-from');
    await settle(slider);
    const options = vi.mocked(carousel.api.reInit).mock.lastCall![0]!;
    expect(Object.values(options.breakpoints!).every((option) => option.active)).toBe(true);
  });

  it('normalizes invalid numbers and uses whole grid columns for fractional slide widths', async () => {
    const slider = await mount('gap="-1" slides-per-view="2.5" slides-per-view-768="NaN" slides-to-scroll="2.8" align="invalid"');
    expect(factory.mock.calls[0][1]).toMatchObject({ slidesToScroll: 2, align: 'start' });
    const style = slider.shadowRoot!.querySelector<HTMLElement>('.container')!.style;
    expect(style.getPropertyValue('--sunmarino-slider-gap')).toBe('16px');
    expect(style.getPropertyValue('--sunmarino-slider-slides')).toBe('2.5');
    expect(style.getPropertyValue('--sunmarino-slider-grid-columns')).toBe('2');
    expect(style.getPropertyValue('--sunmarino-slider-slides-1024')).toBe('1');
    slider.slidesToScroll = 'auto';
    await settle(slider);
    expect(carousel.api.reInit).toHaveBeenLastCalledWith(expect.objectContaining({ slidesToScroll: 'auto' }));
  });

  it('updates added, reordered and removed slides without replacing consumer content', async () => {
    const slider = await mount();
    const first = slider.children[0];
    const added = document.createElement('sunmar-slide');
    added.setAttribute('aria-label', 'Авторское имя');
    slider.prepend(added);
    await settle(slider);
    expect(first.getAttribute('aria-label')).toBe('Слайд 2 из 4');
    expect(added.getAttribute('aria-label')).toBe('Авторское имя');
    first.remove();
    await settle(slider);
    expect(first.hasAttribute('aria-label')).toBe(false);
    expect(carousel.api.reInit).toHaveBeenLastCalledWith(expect.objectContaining({ slides: Array.from(slider.children) }));
  });

  it('preserves consumer ARIA and cleans up only generated labels on disconnect', async () => {
    const slider = await mount();
    const [first, second] = Array.from(slider.children);
    second.setAttribute('aria-label', 'Изменено потребителем');
    const labelled = document.createElement('sunmar-slide');
    labelled.setAttribute('aria-labelledby', 'external-title');
    slider.append(labelled);
    await settle(slider);
    expect(labelled.hasAttribute('aria-label')).toBe(false);
    slider.remove();
    expect(first.hasAttribute('aria-label')).toBe(false);
    expect(second.getAttribute('aria-label')).toBe('Изменено потребителем');
    expect(labelled.getAttribute('aria-labelledby')).toBe('external-title');
    expect(carousel.api.off).toHaveBeenCalledTimes(2);
    expect(carousel.api.destroy).toHaveBeenCalledOnce();
  });

  it('destroys and recreates the instance after reconnecting', async () => {
    const slider = await mount();
    slider.remove();
    expect(slider.hasAttribute('embla-ready')).toBe(false);
    carousel = createCarousel();
    document.body.append(slider);
    await settle(slider);
    expect(factory).toHaveBeenCalledTimes(2);
    expect(slider.hasAttribute('embla-ready')).toBe(true);
    expect(slider.children[0].getAttribute('aria-label')).toBe('Слайд 1 из 3');
  });

  it('ignores stale loading results after disconnect and reconnect', async () => {
    let resolveOld!: (value: typeof factory) => void;
    vi.mocked(loadEmbla).mockReturnValueOnce(new Promise((resolve) => { resolveOld = resolve; }));
    const slider = await mount();
    slider.remove();
    document.body.append(slider);
    await settle(slider);
    const oldFactory = vi.fn(() => createCarousel().api);
    resolveOld(oldFactory);
    await settle(slider);
    expect(factory).toHaveBeenCalledTimes(1);
    expect(oldFactory).not.toHaveBeenCalled();
  });

  it('does not initialize after removal while loading', async () => {
    let resolve!: (value: typeof factory) => void;
    vi.mocked(loadEmbla).mockReturnValue(new Promise((done) => { resolve = done; }));
    const slider = await mount();
    slider.remove();
    resolve(factory);
    await settle(slider);
    expect(factory).not.toHaveBeenCalled();
  });

  it('retains fallback after a CDN error and retries on reconnect', async () => {
    const diagnostic = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(loadEmbla).mockRejectedValueOnce(new Error('CDN unavailable'));
    const slider = await mount();
    expect(slider.hasAttribute('embla-ready')).toBe(false);
    expect(slider.children).toHaveLength(3);
    expect(diagnostic).toHaveBeenCalledOnce();
    slider.remove();
    document.body.append(slider);
    await settle(slider);
    expect(slider.hasAttribute('embla-ready')).toBe(true);
  });

  it('restores fallback if the Embla constructor fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    factory.mockImplementationOnce(() => { throw new Error('Initialization failed'); });
    const slider = await mount();
    expect(slider.hasAttribute('embla-ready')).toBe(false);
    expect(buttons(slider).every((button) => button.disabled)).toBe(true);
  });

  it('supports an empty slot without active controls or announcements', async () => {
    vi.mocked(carousel.api.scrollSnapList).mockReturnValue([]);
    vi.mocked(carousel.api.canScrollNext).mockReturnValue(false);
    const slider = await mount();
    slider.replaceChildren();
    await settle(slider);
    expect(slider.shadowRoot!.querySelector('.status')!.textContent!.trim()).toBe('');
    expect(buttons(slider).every((button) => button.disabled)).toBe(true);
  });
});
