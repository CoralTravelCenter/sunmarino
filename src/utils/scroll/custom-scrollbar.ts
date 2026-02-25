import type { SimpleBarOptions } from 'simplebar-core';

type SimpleBarModule = typeof import('simplebar');
type SimpleBarInstance = InstanceType<SimpleBarModule['default']>;

export type CustomScrollbarHandle = {
  destroy: () => void;
  recalculate: () => void;
};

const mountedSimpleBars = new WeakMap<HTMLElement, CustomScrollbarHandle>();
const pendingSimpleBars = new WeakMap<HTMLElement, Promise<CustomScrollbarHandle>>();

export async function attachCustomScrollbar(
  target: HTMLElement,
  options: SimpleBarOptions = {}
): Promise<CustomScrollbarHandle> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return createNoopCustomScrollbarHandle();
  }

  const mounted = mountedSimpleBars.get(target);
  if (mounted) {
    return mounted;
  }

  const pending = pendingSimpleBars.get(target);
  if (pending) {
    return pending;
  }

  const setupPromise = (async () => {
    const mountedAfterAwait = mountedSimpleBars.get(target);
    if (mountedAfterAwait) {
      return mountedAfterAwait;
    }

    const simplebarModule = await import('simplebar');
    const mountedAfterImport = mountedSimpleBars.get(target);
    if (mountedAfterImport) {
      return mountedAfterImport;
    }

    const SimpleBar = simplebarModule.default;
    const instance = new SimpleBar(target, {
      autoHide: false,
      forceVisible: 'x',
      ...options,
    });

    const handle = createCustomScrollbarHandle(target, instance);
    mountedSimpleBars.set(target, handle);
    return handle;
  })();

  pendingSimpleBars.set(target, setupPromise);

  try {
    return await setupPromise;
  } finally {
    pendingSimpleBars.delete(target);
  }
}

function createCustomScrollbarHandle(
  target: HTMLElement,
  instance: SimpleBarInstance
): CustomScrollbarHandle {
  let isDestroyed = false;
  let handle: CustomScrollbarHandle;

  handle = {
    destroy: (): void => {
      if (isDestroyed) {
        return;
      }

      isDestroyed = true;
      if (mountedSimpleBars.get(target) === handle) {
        mountedSimpleBars.delete(target);
      }
      instance.unMount();
    },
    recalculate: (): void => {
      if (isDestroyed) {
        return;
      }

      instance.recalculate();
    }
  };

  return handle;
}

function createNoopCustomScrollbarHandle(): CustomScrollbarHandle {
  return {
    destroy: (): void => {},
    recalculate: (): void => {}
  };
}
