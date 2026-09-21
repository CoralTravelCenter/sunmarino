import { TARGET_HOTEL_IDS } from "./getHotelsID.ts";
import { waitForHotelID } from "./waitForHotelID.js";
import {initWidget} from "./initWidget.js";

export async function parseHotelWidget() {
  if (TARGET_HOTEL_IDS.length === 0) return;
  try {
    const currentHotelId = await waitForHotelID();
    if (currentHotelId && TARGET_HOTEL_IDS.includes(currentHotelId)) {
      await initWidget();
    }
  } catch {}
}
