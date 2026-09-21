export function waitForHotelID(timeoutMs = 10000) {
    return new Promise((resolve, reject) => {
        let checkedItems = 0;
        let intervalId = null;
        let timeoutId = null;
        let settled = false;

        const clearTimers = () => {
            if (intervalId !== null) {
                clearInterval(intervalId);
            }

            if (timeoutId !== null) {
                clearTimeout(timeoutId);
            }
        };

        const finish = (hotelId) => {
            if (settled) return;

            settled = true;
            clearTimers();
            resolve(hotelId);
        };

        const fail = (error) => {
            if (settled) return;

            settled = true;
            clearTimers();
            reject(error);
        };

        const checkDataLayer = () => {
            try {
                const dataLayer = window.dataLayer || [];

                if (!Array.isArray(dataLayer)) {
                    return;
                }

                for(;checkedItems < dataLayer.length; checkedItems += 1) {
                    const item = dataLayer[checkedItems];
                    if (item?.event !== "view_item") {
                        continue;
                    }

                    const hotelId = item?.ecommerce?.items?.[0]?.item_id?.toString();

                    if (hotelId) {
                        finish(hotelId);
                        return;
                    }
                }
            } catch (error) {
                fail(error);
            }
        };

        intervalId = setInterval(checkDataLayer, 300);

        timeoutId = setTimeout(() => {
            finish(null);
        }, timeoutMs);

        checkDataLayer();
    });
}
