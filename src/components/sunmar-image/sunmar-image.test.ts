import { afterEach, describe, expect, it } from 'vitest';
import { registerSunmarComponents } from '../../registry/register-components';
import type { SunmarImage } from './sunmar-image';

registerSunmarComponents();

function mount(): SunmarImage {
  const image = document.createElement('sunmar-image');
  document.body.append(image);
  return image;
}

function img(image: SunmarImage): HTMLImageElement {
  return image.shadowRoot!.querySelector('img')!;
}

function source(image: SunmarImage): HTMLSourceElement | null {
  return image.shadowRoot!.querySelector('source');
}

describe('SunmarImage contract', () => {
  afterEach(() => document.body.replaceChildren());

  it('renders only img inside picture when srcset is absent or empty', async () => {
    const image = mount();
    image.src = ' /mobile.jpg ';
    for (const srcset of [null, '', '   ']) {
      if (srcset === null) image.removeAttribute('srcset');
      else image.setAttribute('srcset', srcset);
      await image.updateComplete;
      expect(source(image)).toBeNull();
      expect(image.shadowRoot?.querySelector('picture')?.children.length).toBe(1);
      expect(img(image).getAttribute('src')).toBe('/mobile.jpg');
      expect(img(image).getAttribute('alt')).toBe('');
    }
  });

  it('adds source before img, updates it and removes it without replacing img', async () => {
    const image = mount();
    image.src = '/mobile.jpg';
    await image.updateComplete;
    const original = img(image);
    image.setAttribute('srcset', ' /desktop.jpg 1200w, /large.jpg 2400w ');
    image.setAttribute('sizes', ' 80vw ');
    await image.updateComplete;
    expect(source(image)?.getAttribute('srcset')).toBe('/desktop.jpg 1200w, /large.jpg 2400w');
    expect(source(image)?.getAttribute('sizes')).toBe('80vw');
    expect(source(image)?.getAttribute('media')).toBe('(min-width: 768px)');
    expect(source(image)?.nextElementSibling).toBe(original);
    expect(original.hasAttribute('srcset')).toBe(false);
    image.srcset = '/updated.jpg';
    image.src = '/updated-mobile.jpg';
    await image.updateComplete;
    expect(source(image)?.getAttribute('srcset')).toBe('/updated.jpg');
    expect(img(image).getAttribute('src')).toBe('/updated-mobile.jpg');
    image.removeAttribute('srcset');
    await image.updateComplete;
    expect(source(image)).toBeNull();
    expect(img(image)).toBe(original);
  });

  it('distinguishes an empty media condition from a removed condition', async () => {
    const image = mount();
    image.srcset = '/desktop.jpg';
    image.setAttribute('media', '(min-width: 1024px)');
    await image.updateComplete;
    expect(source(image)?.getAttribute('media')).toBe('(min-width: 1024px)');
    image.setAttribute('media', ' ');
    await image.updateComplete;
    expect(source(image)?.hasAttribute('media')).toBe(false);
    image.removeAttribute('media');
    await image.updateComplete;
    expect(source(image)?.getAttribute('media')).toBe('(min-width: 768px)');
  });

  it('safely removes src, sizes and alt while retaining the picture structure', async () => {
    const image = mount();
    image.setAttribute('src', '/mobile.jpg');
    image.srcset = '/desktop.jpg';
    image.setAttribute('sizes', '100vw');
    image.setAttribute('alt', '  Берег моря  ');
    await image.updateComplete;
    expect(img(image).getAttribute('alt')).toBe('  Берег моря  ');
    for (const name of ['src', 'sizes', 'alt']) image.removeAttribute(name);
    await image.updateComplete;
    expect(img(image).hasAttribute('src')).toBe(false);
    expect(img(image).getAttribute('alt')).toBe('');
    expect(source(image)?.hasAttribute('sizes')).toBe(false);
  });

  it.each([null, undefined, 42])('handles untyped string-property input %j', async (value) => {
    const image = mount();
    for (const key of ['src', 'srcset', 'sizes', 'media', 'alt'] as const) {
      image[key] = value as unknown as string;
    }
    await image.updateComplete;
    expect(source(image)).toBeNull();
    expect(img(image).hasAttribute('src')).toBe(false);
    expect(img(image).getAttribute('alt')).toBe('');
    image.srcset = '/desktop.jpg';
    await image.updateComplete;
    expect(source(image)?.getAttribute('media')).toBe('(min-width: 768px)');
    expect(source(image)?.hasAttribute('sizes')).toBe(false);
  });

  it.each(['width', 'height'] as const)('normalizes %s through HTML and JS and supports removal', async (dimension) => {
    const image = mount();
    for (const [input, expected] of [['720', '720'], ['1', '1'], ['12.9', '12'], ['0.5', null], ['0', null], ['-1', null], ['', null], ['invalid', null], ['Infinity', null]]) {
      image.setAttribute(dimension, input!);
      await image.updateComplete;
      expect(img(image).getAttribute(dimension)).toBe(expected);
    }
    for (const [input, expected] of [[480.8, '480'], [0.5, null], [NaN, null], [Infinity, null], [-1, null]] as const) {
      image[dimension] = input;
      await image.updateComplete;
      expect(img(image).getAttribute(dimension)).toBe(expected);
    }
    image.setAttribute(dimension, '200');
    await image.updateComplete;
    image.removeAttribute(dimension);
    await image.updateComplete;
    expect(img(image).hasAttribute(dimension)).toBe(false);
  });

  it('forwards only supported loading values and removes the native setting on removal', async () => {
    const image = mount();
    for (const value of ['lazy', 'eager', 'unknown', '', 'LAZY']) {
      image.setAttribute('loading', value);
      await image.updateComplete;
      expect(img(image).getAttribute('loading')).toBe(['lazy', 'eager'].includes(value) ? value : null);
    }
    image.loading = 'lazy';
    await image.updateComplete;
    expect(img(image).getAttribute('loading')).toBe('lazy');
    image.removeAttribute('loading');
    await image.updateComplete;
    expect(img(image).hasAttribute('loading')).toBe(false);
  });

  it('preserves current sources and the native image after reconnection', async () => {
    const image = mount();
    image.src = '/mobile.jpg';
    image.srcset = '/desktop.jpg';
    await image.updateComplete;
    const original = img(image);
    image.remove();
    document.body.append(image);
    await image.updateComplete;
    expect(img(image)).toBe(original);
    expect(img(image).getAttribute('src')).toBe('/mobile.jpg');
    expect(source(image)?.getAttribute('srcset')).toBe('/desktop.jpg');
  });
});
