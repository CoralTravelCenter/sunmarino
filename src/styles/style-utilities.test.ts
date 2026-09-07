import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { compile } from 'sass';
import { resolve } from 'node:path';

const css = compile(resolve('src/styles/sunmar-tokens-runtime.scss')).css;

beforeEach(() => {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);
});

afterEach(() => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
});

function render(className: string): HTMLElement {
  const element = document.createElement('section');
  element.className = className;
  document.body.append(element);
  return element;
}

describe('public style utilities', () => {
  it('uses only the sunmarino namespace for public classes and variables', () => {
    expect(css).not.toMatch(/--sunmar-/);
    expect(css).not.toMatch(/\.sunmar-/);
    expect(css).not.toMatch(/\.(?:cols-|bp-\d+-cols-)/);
    expect(css).toContain('.sunmarino-bp-768-cols-2');
  });

  it('keeps pixel spacing literal when design tokens change', () => {
    const element = render('sunmarino-mt-24 sunmarino-p-16');
    element.style.setProperty('--sunmarino-space-l', '100px');
    element.style.setProperty('--sunmarino-space-n', '80px');
    expect(getComputedStyle(element).marginTop).toBe('24px');
    expect(getComputedStyle(element).paddingLeft).toBe('16px');
  });

  it('lets spacing utilities override section and grid defaults', () => {
    const section = render('sunmarino sunmarino-container sunmarino-py-0 sunmarino-gap-16');
    section.style.setProperty('--sunmarino-section-padding-inline', '18px');
    expect(getComputedStyle(section).getPropertyValue('padding-block')).toBe('0px');
    expect(getComputedStyle(section).getPropertyValue('padding-inline')).toBe('18px');
    expect(getComputedStyle(section).gap).toBe('16px');
    const grid = render('sunmarino-grid sunmarino-cols-2 sunmarino-gap-8');
    expect(getComputedStyle(grid).gap).toBe('8px');
    expect(getComputedStyle(grid).gridTemplateColumns).toBe('repeat(2, minmax(0, 1fr))');
  });

  it('does not apply utilities to legacy host-site classes', () => {
    const element = render('sunmar-text sunmar-mt-5 sunmar-grid');
    expect(getComputedStyle(element).display).not.toBe('grid');
    expect(getComputedStyle(element).marginTop).not.toBe('24px');
  });
});
