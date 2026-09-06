import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { registerSunmarComponents } from '../../registry/register-components';
import type { SunmarStickyNav } from './sunmar-sticky-nav';
registerSunmarComponents();
const observers: Array<{ callback: IntersectionObserverCallback; observe: ReturnType<typeof vi.fn>; disconnect: ReturnType<typeof vi.fn> }> = [];
beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', class {
    observe = vi.fn(); disconnect = vi.fn(); unobserve = vi.fn();
    constructor(public callback: IntersectionObserverCallback) { observers.push(this); }
  });
});
afterEach(() => { document.body.replaceChildren(); vi.unstubAllGlobals(); vi.useRealTimers(); observers.length = 0; });
async function settle(nav: SunmarStickyNav) {
  await nav.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 0));
  await nav.updateComplete;
}
async function mount(href = '#one') {
  document.body.innerHTML = '<section id="one"></section><section id="two"></section>';
  const nav = document.createElement('sunmar-sticky-nav'); nav.disableRelocate = true;
  const link = document.createElement('a'); link.slot = 'nav-link'; link.href = href; link.textContent = 'Раздел';
  nav.append(link); document.body.append(nav); await settle(nav); return { nav, link };
}
function emit(section: Element, ratio = 0.5, observer = observers[observers.length - 1]) {
  observer.callback([{ target: section, intersectionRatio: ratio, isIntersecting: ratio > 0 } as IntersectionObserverEntry], observer as unknown as IntersectionObserver);
}
describe('SunmarStickyNav', () => {
  it('ignores malformed hashes and links to another page', async () => {
    const { nav, link } = await mount('#%ZZ');
    expect(observers).toHaveLength(0);
    link.href = 'https://elsewhere.example/#one'; await settle(nav);
    expect(observers).toHaveLength(0);
    link.href = '#one'; await settle(nav); expect(observers).toHaveLength(1);
  });
  it('updates targets after href changes and ignores stale callbacks', async () => {
    const { nav, link } = await mount(); const old = observers[0];
    emit(document.getElementById('one')!); expect(link.getAttribute('aria-current')).toBe('true');
    link.href = '#two'; await settle(nav);
    expect(old.disconnect).toHaveBeenCalled(); expect(link.hasAttribute('aria-current')).toBe(false);
    emit(document.getElementById('one')!, 0.5, old); expect(link.hasAttribute('aria-current')).toBe(false);
    emit(document.getElementById('two')!); expect(link.classList.contains('active')).toBe(true);
  });
  it('tracks added, renamed and removed sections', async () => {
    const { nav, link } = await mount('#later'); expect(observers).toHaveLength(0);
    const section = document.createElement('section'); section.id = 'later'; document.body.append(section); await settle(nav);
    emit(section); expect(link.classList.contains('active')).toBe(true);
    section.id = 'changed'; await settle(nav); expect(link.classList.contains('active')).toBe(false);
    link.href = '#changed'; await settle(nav); emit(section); expect(link.classList.contains('active')).toBe(true);
    section.remove(); await settle(nav); expect(link.hasAttribute('aria-current')).toBe(false);
  });
  it('restores owned state when links are removed and preserves consumer changes', async () => {
    const { nav, link } = await mount(); emit(document.getElementById('one')!);
    link.classList.add('consumer'); link.setAttribute('aria-current', 'page'); link.remove(); await settle(nav);
    expect(link.classList.contains('active')).toBe(false); expect(link.classList.contains('consumer')).toBe(true);
    expect(link.getAttribute('aria-current')).toBe('page');
  });
  it('restores initial state on disconnect and observes again on reconnect', async () => {
    const { nav, link } = await mount(); emit(document.getElementById('one')!);
    nav.remove(); expect(link.hasAttribute('aria-current')).toBe(false); expect(link.classList.contains('active')).toBe(false);
    document.body.append(nav); await settle(nav); emit(document.getElementById('one')!);
    expect(link.classList.contains('active')).toBe(true);
  });
  it('does not recreate observers for unrelated DOM changes', async () => {
    const { nav } = await mount(); const count = observers.length;
    document.body.append(document.createElement('p')); await settle(nav);
    expect(observers).toHaveLength(count);
  });
  it('supports changed slots and keeps native links without IntersectionObserver', async () => {
    const { nav, link } = await mount(); emit(document.getElementById('one')!);
    link.slot = 'other'; await settle(nav); expect(link.hasAttribute('aria-current')).toBe(false);
    vi.stubGlobal('IntersectionObserver', undefined); link.slot = 'nav-link'; await settle(nav);
    expect(link.getAttribute('href')).toBe('#one'); expect(link.classList.contains('active')).toBe(false);
  });
  it('restores pre-existing active state after disconnect', async () => {
    const nav = document.createElement('sunmar-sticky-nav'); nav.disableRelocate = true;
    nav.innerHTML = '<a slot="nav-link" class="active custom" aria-current="page" href="#missing">Ссылка</a>';
    document.body.append(nav); await settle(nav); const link = nav.querySelector('a')!;
    expect(link.hasAttribute('aria-current')).toBe(false);
    nav.remove(); expect(link.getAttribute('aria-current')).toBe('page');
    expect(link.className).toBe('custom active');
  });
  it('stops waiting for a relocation target after five seconds', async () => {
    vi.useFakeTimers();
    const nav = document.createElement('sunmar-sticky-nav'); nav.teleport = '#late';
    document.body.append(nav); await nav.updateComplete;
    await vi.advanceTimersByTimeAsync(5001);
    const target = document.createElement('section'); target.id = 'late'; document.body.append(target);
    await vi.advanceTimersByTimeAsync(1);
    expect(target.nextElementSibling).not.toBe(nav);
  });
  it('normalizes offsets', async () => {
    const { nav } = await mount(); nav.topOffset = -5; await settle(nav);
    expect(nav.style.getPropertyValue('--sunmar-sticky-nav-top-offset')).toBe('0px');
    nav.topOffset = NaN; await settle(nav); expect(nav.style.getPropertyValue('--sunmar-sticky-nav-top-offset')).toBe('');
  });
  it('relocates after a late target and follows a changed selector', async () => {
    const nav = document.createElement('sunmar-sticky-nav'); nav.teleport = '#target'; document.body.append(nav); await settle(nav);
    const target = document.createElement('section'); target.id = 'target'; document.body.append(target); await settle(nav);
    expect(target.nextElementSibling).toBe(nav);
    const next = document.createElement('section'); next.id = 'next'; document.body.prepend(next);
    nav.teleport = '#next'; await settle(nav); expect(next.nextElementSibling).toBe(nav);
  });
  it('cancels relocation when disabled or disconnected and ignores invalid selectors', async () => {
    const nav = document.createElement('sunmar-sticky-nav'); nav.teleport = '#target'; document.body.append(nav); await settle(nav);
    nav.disableRelocate = true; await settle(nav);
    const target = document.createElement('section'); target.id = 'target'; document.body.append(target); await settle(nav);
    expect(target.nextElementSibling).not.toBe(nav);
    nav.teleport = '['; nav.disableRelocate = false; await settle(nav);
    expect(nav.isConnected).toBe(true);
    nav.teleport = '#later'; await settle(nav); nav.remove();
    target.id = 'later'; await settle(nav); expect(nav.isConnected).toBe(false);
  });
});
