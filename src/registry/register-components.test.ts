import { describe, expect, it, vi } from 'vitest';
import { registerSunmarComponents } from './register-components';

describe('registerSunmarComponents', () => {
  it('registers the public component set', () => {
    const definitions = new Map<string, CustomElementConstructor>();
    const registry = {
      define: vi.fn((name: string, constructor: CustomElementConstructor) => {
        definitions.set(name, constructor);
      }),
      get: vi.fn((name: string) => definitions.get(name))
    } as unknown as CustomElementRegistry;

    registerSunmarComponents(registry);

    expect(registry.get('sunmar-modal')).toBeDefined();
    expect(registry.get('sunmar-tabs')).toBeDefined();
    expect(registry.get('sunmar-slider')).toBeDefined();
    expect(registry.get('sunmar-sticky-nav')).toBeDefined();
    expect(registry.get('sunmar-lead')).toBeDefined();
    expect(registry.get('sunmar-table')).toBeDefined();
    expect(registry.get('sunmar-climate-grid')).toBeDefined();
    expect(registry.get('sunmar-promo-terms')).toBeDefined();
  });

  it('is safe to call repeatedly', () => {
    const definitions = new Map<string, CustomElementConstructor>();
    const registry = {
      define: vi.fn((name: string, constructor: CustomElementConstructor) => {
        definitions.set(name, constructor);
      }),
      get: vi.fn((name: string) => definitions.get(name))
    } as unknown as CustomElementRegistry;

    expect(() => {
      registerSunmarComponents(registry);
      registerSunmarComponents(registry);
    }).not.toThrow();
    expect(registry.define).toHaveBeenCalledTimes(18);
  });
});
