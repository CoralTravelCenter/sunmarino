import {waitForElement} from "@utils";
import {MARKUP} from "../utils/keys.ts";
import {injectTippy} from "../utils/tippy/injectTippy.ts";

export async function initWidget() {
    const selector = '[class*="PhotoGalleryMainCarousel_mainSwiperContainer__"]';
    try {
        const devContainer = await waitForElement(selector);
        if (devContainer && !devContainer.dataset.CoralShildRakInject) {
            devContainer.insertAdjacentHTML("afterbegin", MARKUP);
            injectTippy();
            devContainer.dataset.CoralShildRakInject = "true";
        }
    }
    catch {}
}