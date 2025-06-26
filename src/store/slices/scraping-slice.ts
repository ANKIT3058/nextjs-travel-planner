import { UserType } from "@/types/user";
import { StateCreator } from "zustand";

export interface ScrapingSlice {
  isScraping: boolean;
  setScraping: (isScraping: boolean) => void;
  scrapingType: "hotel" | "flight" | undefined;
  setScrapingType: (scrapingType: "hotel" | "flight" | undefined) => void;
  scrapedFlights: any;
  setScrapedFlights: (scrapedFlights: any) => void;
  scrapedHotels: any;
  setScrapedHotels: (scrapedHotels: any) => void;
}

export const createScrapingSlice: StateCreator<ScrapingSlice> = (set) => ({
  isScraping: false,
  setScraping: (isScraping) => set({ isScraping }),
  scrapingType: undefined,
  setScrapingType: (scrapingType) => set({ scrapingType }),
  scrapedFlights: [],
  setScrapedFlights: (scrapedFlights) => set({ scrapedFlights }),
  scrapedHotels: [],
  setScrapedHotels: (scrapedHotels) => set({ scrapedHotels }),
});
