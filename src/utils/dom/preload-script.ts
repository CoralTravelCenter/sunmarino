const scriptLoadCache = new Map<string, Promise<void>>();

export async function preloadScript(url: string, cb?: () => void): Promise<void> {
  if (scriptLoadCache.has(url)) {
    await scriptLoadCache.get(url);
    if (typeof cb === 'function') {
      cb();
    }
    return;
  }

  const loadPromise = new Promise<void>((resolve, reject) => {
    const scriptEl = document.createElement('script');

    scriptEl.addEventListener('load', () => {
      scriptEl.remove();
      resolve();
    });

    scriptEl.addEventListener('error', () => {
      scriptEl.remove();
      scriptLoadCache.delete(url);
      reject(new Error(`Failed to preload script: ${url}`));
    });

    scriptEl.src = url;
    document.head.append(scriptEl);
  });

  scriptLoadCache.set(url, loadPromise);
  await loadPromise;

  if (typeof cb === 'function') {
    cb();
  }
}
