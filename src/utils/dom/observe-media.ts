export type ObserveMinWidthCallback = (matches: boolean) => void;

export function observeMinWidth(
  width: number,
  callback: ObserveMinWidthCallback
): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {};
  }

  const mediaQueryList = window.matchMedia(`(min-width: ${width}px)`);
  const listener = (event: MediaQueryListEvent): void => {
    callback(event.matches);
  };

  callback(mediaQueryList.matches);
  mediaQueryList.addEventListener('change', listener);

  return () => {
    mediaQueryList.removeEventListener('change', listener);
  };
}
