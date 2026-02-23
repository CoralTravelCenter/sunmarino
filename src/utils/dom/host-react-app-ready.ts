export async function hostReactAppReady(
  selector = '#__next > div',
  pollIntervalMs = 300
): Promise<void> {
  return new Promise((resolve) => {
    const waiter = () => {
      const hostEl = document.querySelector<HTMLElement>(selector);
      if (hostEl?.getBoundingClientRect().height) {
        resolve();
        return;
      }

      setTimeout(waiter, pollIntervalMs);
    };

    waiter();
  });
}
