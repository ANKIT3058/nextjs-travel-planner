"use client";
import axios from "axios";
import { useAppStore } from "@/store";
import { USER_API_ROUTES } from "@/utils/api-routes";
import { cityAirportCode } from "@/utils/city-airport-codes";
import { Button, Input, Listbox, ListboxItem } from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchFlights = () => {
  const router = useRouter();
  const { setScrapingType, setScraping, setScrapedFlights } = useAppStore();
  const [source, setSource] = useState("");
  const [sourceOptions, setSourceOptions] = useState<
    { city: string; code: string }[]
  >([]);
  const [destination, setDestination] = useState("");
  const [destinationOptions, setDestinationOptions] = useState<
    { city: string; code: string }[]
  >([]);
  const [flightDate, setFlightDate] = useState("");

  const [loadingJobId, setLoadingJobId] = useState<number | undefined>(
    undefined
  );

  const startScraping = async () => {
    if (source && destination && flightDate) {
      const data = await axios.get(
        `${USER_API_ROUTES.FLIGHT_SCRAPE}?source=${source}&destination=${destination}&date=${flightDate}`
      );
      if (data.data.id) {
        setLoadingJobId(data.data.id);
        setScraping(true);
        setScrapingType("flight");
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jobIntervalRef = useRef<any>(undefined);

  useEffect(() => {
    if (loadingJobId) {
      const checkIfJobCompleted = async () => {
        try {
          const response = await axios.get(
            `${USER_API_ROUTES.FLIGHT_SCRAPE_STATUS}?jobId=${loadingJobId}`
          );

          if (response.data.status) {
            setScrapedFlights(response.data.flights);
            // setFlightsDate()
            clearInterval(jobIntervalRef.current);
            setScraping(false);
            setScrapingType(undefined);
            router.push(`/flights?date=${flightDate}`);
          }
        } catch (err) {
          console.log({ err });
        }
      };

      const interval = setInterval(() => checkIfJobCompleted(), 3000);
      jobIntervalRef.current = interval;
    }

    return () => {
      if (jobIntervalRef.current) clearInterval(jobIntervalRef.current);
    };
  }, [
    flightDate,
    loadingJobId,
    router,
    setScraping,
    setScrapingType,
    setScrapedFlights,
  ]);

  const handleSourceChange = (query: string) => {
    const lowercaseQuery = query.toLowerCase();

    const matchingCities = Object.entries(cityAirportCode)
      .filter(([, city]) => city.toLowerCase().includes(lowercaseQuery))
      .map(([code, city]) => ({ code, city }))
      .splice(0, 5);

    setSourceOptions(matchingCities);
  };

  const handleDestinationChange = (query: string) => {
    const lowercaseQuery = query.toLowerCase();

    const matchingCities = Object.entries(cityAirportCode)
      .filter(([, city]) => city.toLowerCase().includes(lowercaseQuery))
      .map(([code, city]) => ({ code, city }))
      .splice(0, 5);

    setDestinationOptions(matchingCities);
  };

  return (
    <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="/flight-search.png"
        alt="Search"
        fill
        className="object-cover z-0"
        priority
      />

      <div className="flex flex-col gap-10">
        <div className="text-white text-center flex flex-col gap-5">
          <h3 className="text-xl font-bold">
            Best Flights made for you in mind!
          </h3>
          <h2 className="text-6xl font-extrabold">Explore the exotic world.</h2>
        </div>
        <div className="grid grid-cols-3 items-center justify-center px-10 gap-5">
          <div className="relative">
            <Input
              className="text-white placeholder:text-white relative"
              classNames={{
                input: ["placeholder:text-white"],
              }}
              variant="bordered"
              color="danger"
              placeholder="Source"
              startContent={<FaSearch size={18} />}
              type="search"
              onChange={(e) => {
                setSource(e.target.value);
                handleSourceChange(e.target.value);
              }}
              value={source}
              onClear={() => setSource("")}
            />
            {sourceOptions.length > 0 && (
              <div className="w-full min-h-[200px] max-w-[303px] border-small rounded-small border-default-200 mt-5 absolute top-15 z-30">
                <div
                  className="bg-cover bg-center bg-no-repeat relative min-h-[200px] h-full w-full px-1 py-2 rounded-small"
                  style={{
                    backgroundImage: 'url("/flight-search.png")',
                  }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-md rounded-small"></div>
                  <Listbox
                    aria-label="Actions"
                    onAction={(key) => {
                      setSource(key as string);
                      setSourceOptions([]);
                    }}
                    emptyContent="No results found."
                  >
                    {sourceOptions.map(({ city, code }) => (
                      <ListboxItem
                        key={code}
                        color="danger"
                        className="text-white relative z-10"
                      >
                        {city}
                      </ListboxItem>
                    ))}
                  </Listbox>
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <Input
              className="text-white placeholder:text-white relative"
              classNames={{
                input: ["placeholder:text-white"],
              }}
              variant="bordered"
              color="danger"
              placeholder="Destination"
              startContent={<FaSearch size={18} />}
              type="search"
              onChange={(e) => {
                setDestination(e.target.value);
                handleDestinationChange(e.target.value);
              }}
              value={destination}
              onClear={() => setDestination("")}
            />

            {destinationOptions.length > 0 && (
              <div className="w-full min-h-[200px] max-w-[303px] border-small rounded-small border-default-200 mt-5 absolute top-15 z-30">
                <div
                  className="bg-cover bg-center bg-no-repeat relative min-h-[200px] h-full w-full px-1 py-2 rounded-small"
                  style={{
                    backgroundImage: 'url("/flight-search.png")',
                  }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-md rounded-small"></div>
                  <Listbox
                    aria-label="Actions"
                    onAction={(key) => {
                      setDestination(key as string);
                      setDestinationOptions([]);
                    }}
                    emptyContent="No results found."
                  >
                    {destinationOptions.map(({ city, code }) => (
                      <ListboxItem
                        key={code}
                        color="danger"
                        className="text-white relative z-10"
                      >
                        {city}
                      </ListboxItem>
                    ))}
                  </Listbox>
                </div>
              </div>
            )}
          </div>
          <Input
            className="text-white placeholder:text-white relative"
            classNames={{
              input: ["placeholder:text-white"],
            }}
            variant="bordered"
            color="danger"
            type="date"
            placeholder="Date"
            value={flightDate}
            onChange={(e) => setFlightDate(e.target.value)}
          />
        </div>
        <Button
          size="lg"
          className="cursor-pointer w-full"
          color="danger"
          variant="shadow"
          onClick={startScraping}
        >
          Search Flights
        </Button>
      </div>
    </div>
  );
};

export default SearchFlights;
