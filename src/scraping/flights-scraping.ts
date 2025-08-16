/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { Page } from "puppeteer";

interface Flight {
  airlineLogo: string;
  departureTime: string;
  arrivalTime: string;
  flightDuration: string;
  airlineName: string;
  price: number;
}

export const startFlightScraping = async (page: Page): Promise<Flight[]> => {
  console.log("🛫 [startFlightScraping] Yatra scraping started...");

  const maxRetries = 3; // Reduced retries as timeouts are longer

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`🔁 Attempt ${attempt}/${maxRetries}...`);

    try {
      // Wait for any initial anti-bot challenge page to resolve
      await page.waitForFunction(
        () => !document.title.toLowerCase().includes("challenge validation"),
        { timeout: 20000 }
      );
      
      // --- IMPROVEMENT 1: INCREASED TIMEOUT ---
      // Wait longer for the first flight item to appear, accommodating the site's timer.
      console.log("Waiting for flight results to start loading...");
      await page.waitForSelector(".flightItem", { timeout: 45000 });
      console.log("Flight results detected. Waiting for full load...");

      // --- IMPROVEMENT 2: WAIT FOR STABILITY ---
      // Wait for the loading spinner/overlay to disappear.
      // ⚠️ YOU MUST REPLACE '.loader-selector' with the actual selector from the website!
      await page.waitForSelector(".flight-loader", {
        hidden: true, // Wait until this element is no longer visible
        timeout: 40000,
      });
      console.log("Page is fully loaded. Starting scrape.");


      const flights = await page.evaluate((): Flight[] => {
        const flightCards = document.querySelectorAll(".flightItem");
        const flights: Flight[] = [];

        flightCards.forEach((card, index) => {
          try {
            const airlineName =
              card.querySelector(".airline-name span")?.textContent?.trim() || "";
            const departureTime =
              card.querySelector(".depart-details .mob-time")?.textContent?.trim() || "";
            const arrivalTime =
              card.querySelector(".arrival-details .mob-time")?.textContent?.trim() || "";
            const flightDuration =
              card.querySelector(".stops-details .mob-duration")?.textContent?.trim() || "";
            const logoImg = card.querySelector(".airline-holder img") as HTMLImageElement;
            const airlineLogo = logoImg?.src || "";

            const priceElements = card.querySelectorAll(".fare-price");
            let price = 0;
            priceElements.forEach((el) => {
              const raw = el.textContent?.replace(/[^\d]/g, "") || "0";
              const parsed = parseInt(raw, 10) || 0;
              if (price === 0 || parsed < price) price = parsed;
            });

            // --- IMPROVEMENT 3: DATA VALIDATION ---
            // Only add the flight to our list if it has a valid name and price.
            if (price > 0 && airlineName) {
              flights.push({
                airlineLogo,
                departureTime,
                arrivalTime,
                flightDuration,
                airlineName,
                price,
              });
            }
          } catch (err) {
            console.error(`❌ Failed to parse flight #${index + 1}:`, err);
          }
        });

        return flights;
      });

      if (flights.length > 0) {
        console.log(`✅ Scraped ${flights.length} flights on attempt ${attempt}`);
        return flights;
      }

      console.warn(`⚠️ No valid flights found on attempt ${attempt}. Retrying...`);
      await new Promise((res) => setTimeout(res, 5000)); // Wait before retrying
    } catch (err) {
      console.warn(`⚠️ Error on attempt ${attempt}:`, err.message);
      if (attempt < maxRetries) {
        await new Promise((res) => setTimeout(res, 5000)); // Wait before retrying
      }
    }
  }

  console.error("❌ All retries exhausted. No flights scraped.");
  return [];
};