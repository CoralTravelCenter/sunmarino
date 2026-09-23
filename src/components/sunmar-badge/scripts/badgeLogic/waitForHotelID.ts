type DataLayerItem = {
  event?: unknown;
  ecommerce?: {
    items?: Array<{
      item_id?: unknown;
    }>;
  };
};

declare global {
  interface Window {
    dataLayer?: DataLayerItem[];
  }
}

export function waitForHotelID(timeoutMs = 10000): Promise<string | null> {
  return new Promise((resolve, reject) => {
    let checkedItems = 0;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let settled = false;

    const clearTimers = (): void => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }

      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };

    const finish = (hotelId: string | null): void => {
      if (settled) {
        return;
      }

      settled = true;
      clearTimers();
      resolve(hotelId);
    };

    const fail = (error: unknown): void => {
      if (settled) {
        return;
      }

      settled = true;
      clearTimers();
      reject(error);
    };

    const checkDataLayer = (): void => {
      try {
        const dataLayer = window.dataLayer ?? [];

        if (!Array.isArray(dataLayer)) {
          return;
        }

        for (; checkedItems < dataLayer.length; checkedItems += 1) {
          const item = dataLayer[checkedItems];
          if (item?.event !== 'view_item') {
            continue;
          }

          const hotelId = item.ecommerce?.items?.[0]?.item_id;
          if (hotelId !== undefined && hotelId !== null) {
            finish(String(hotelId));
            return;
          }
        }
      } catch (error) {
        fail(error);
      }
    };

    intervalId = setInterval(checkDataLayer, 300);
    timeoutId = setTimeout(() => finish(null), timeoutMs);
    checkDataLayer();
  });
}
