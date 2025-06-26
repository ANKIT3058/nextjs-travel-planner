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
  return await page.evaluate((): Flight[] => {
    const flights: Flight[] = [];

    const flightSelectors = document.querySelectorAll(".flightItem");

    flightSelectors.forEach((flightElement) => {
      // Airline logo is a background image based on class e.g., i-b logo <i class="free-flow air-logo domAirLogo size-35 x6E">
      const logoElement = flightElement.querySelector(".airline-holder .logo i");
      const airlineLogoClass = logoElement?.className || "";
      const airlineCodeMatch = airlineLogoClass.match(/x([A-Z0-9]+)/);
      const airlineCode = airlineCodeMatch ? airlineCodeMatch[1] : "";
      const airlineLogo = airlineCode ? `https://img.yatra.com/airlines/${airlineCode}.png` : "";

      // Airline name
      const airlineName = (
        flightElement.querySelector(".airline-holder .airline-name span")?.textContent || ""
      ).trim();

      // Departure and Arrival time
      const departureTime = (
        flightElement.querySelector(".depart-details .mob-time")?.textContent || ""
      ).trim();

      const arrivalTime = (
        flightElement.querySelector(".arrival-details .mob-time")?.textContent || ""
      ).trim();

      // Flight duration
      const flightDuration = (
        flightElement.querySelector(".stops-details .mob-duration")?.textContent || ""
      ).trim();

      // Price extraction: Find selected fare block price
      const priceText = (
        flightElement.querySelector(".br-fare-block.selected .fare-price")?.textContent || ""
      ).replace(/[^\d]/g, ""); // Remove non-numeric characters

      const price = parseInt(priceText, 10) || 0;

      flights.push({
        airlineLogo,
        departureTime,
        arrivalTime,
        flightDuration,
        airlineName,
        price,
      });
    });

    return flights;
  });
};
