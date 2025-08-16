/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { Page } from "puppeteer";

/**
 * Scrapes hotel data from a given Yatra search results URL.
 *
 * @param {Page} page - The Puppeteer page instance.
 * @param {string} url - The direct URL to the Yatra hotel search results page.
 * @returns {Promise<Array<{title: string, price: number, photo: string}>>} A promise that resolves to an array of hotel objects.
 */
export const startHotelScraping = async (page: Page, url: string) => {
    // 1. Navigate to the page and wait for it to be ready
    console.log(`Navigating to URL: ${url}`);
    // We use 'networkidle0' to wait until there are no more network connections for at least 500 ms.
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    console.log("Results page loaded.");

    // 2. Wait for the hotel cards to be rendered on the page
    // The selector is specific to the hotel card wrapper class on Yatra.
    await page.waitForSelector('.HotelListCard_hotelCardWrapper__krJC3', { timeout: 20000 });
    console.log("Hotel cards are visible.");
    
    // A small extra delay can help ensure all lazy-loaded content (like images) is present.
    await new Promise(res => setTimeout(res, 3000));

    // 3. Scrape the hotel data from the results page
    console.log("Evaluating page to extract hotel data...");
    const hotels = await page.evaluate(() => {
        const hotelData = [];
        // This selector targets each hotel listing card.
        const hotelElements = document.querySelectorAll('.HotelListCard_hotelCardWrapper__krJC3');

        hotelElements.forEach((el) => {
            // Selector for the hotel name
            const title = el.querySelector('h2.HotelListCard_hotelName__rf4k2')?.innerText?.trim();
            
            // Selector for the price
            const priceText = el.querySelector('h2.HotelListCard_totalPrice__uISQ_')?.innerText?.trim();
            const price = priceText ? parseInt(priceText.replace(/[^\d]/g, ""), 10) : null;
            
            // Selector for the photo URL from the img tag.
            const photo = el.querySelector('img.HotelListCard_hotelImage__Zt6Ca')?.src;

            // Only add the hotel if we have all the essential information.
            if (title && price && photo) {
                hotelData.push({ title, price, photo });
            }
        });

        console.log(`Extracted ${hotelData.length} hotels.`);
        return hotelData;
    });

    return hotels;
};
