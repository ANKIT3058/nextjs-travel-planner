"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button, Input, Listbox, ListboxItem } from "@heroui/react";
import { FaCalendar, FaCalendarAlt, FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Search = () => {
  const router = useRouter();
  const [searchLocation, setSearchLocation] = useState("");
  const [dates, setDates] = useState(() => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [cities, setCities] = useState([]);

  const handleSearch = () => {
    if (searchLocation && dates) {
      router.push(`/trips?city=${searchLocation}&dates=${dates}`);
    }
  };

  const searchCities = async (searchQuery: string) => {
    const response = await fetch(
      `https://secure.geonames.org/searchJSON?q=${searchQuery}&maxRows=5&username=kishan&style=SHORT`
    );
    const parsed = await response.json();
    setCities(
      parsed?.geonames.map((city: { name: string }) => city.name) ?? []
    );
  };
  const activities = [
    { name: "Sea & Sailing", icon: "/home/ship.svg" },
    { name: "Trekking Tours", icon: "/home/hiking.svg" },
    { name: "City Tours", icon: "/home/trolley-bag.svg" },
    { name: "Motor Sports", icon: "/home/motor-boat.svg" },
    { name: "Jungle Safari", icon: "/home/cedar.svg" },
  ];

  return (
    <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="/home/home-bg.png"
        alt="Search"
        fill
        className="object-cover z-0"
        priority
      />

      {/* Content */}
      <div className="relative z-10 h-[50vh] w-[60vw] flex flex-col gap-5">
        <div className="text-white text-center flex flex-col gap-5">
          <h3 className="text-xl font-bold">
            Best Tours made for you in mind!
          </h3>
          <h2 className="text-6xl font-extrabold">Explore the exotic world.</h2>
        </div>
        <div className="grid grid-cols-3 gap-5 p-5 rounded-xl">
          <Input
            color="danger"
            variant="bordered"
            className="text-white relative"
            startContent={<FaSearch />}
            placeholder="Search Location"
            onChange={(e) => {
              setSearchLocation(e.target.value);
              searchCities(e.target.value);
            }}
            classNames={{
              input: "text-white placeholder:text-white",
            }}
          />
          {cities.length > 0 && (
            <div className="w-full min-h-[200px] max-w-[315px] border-small rounded-small border-default-200 mt-5 absolute top-48 z-20">
              <div
                className="relative min-h-[20vh] px-5 py-5 bg-cover bg-center bg-no-repeat rounded-small overflow-hidden"
                style={{
                  backgroundImage: 'url("/home/home-bg.png")',
                }}
              >
                {/* Gradient Blur Layer */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent backdrop-blur-sm z-0 rounded-small" />

                {/* Listbox goes here */}
                <div className="relative z-10">
                  <Listbox
                    aria-label="City Options"
                    onAction={(key) => {
                      setSearchLocation(key as string);
                      setCities([]);
                    }}
                    className="rounded-small"
                  >
                    {cities.map((city) => (
                      <ListboxItem
                        key={city}
                        color="danger"
                        className="text-white"
                      >
                        {city}
                      </ListboxItem>
                    ))}
                  </Listbox>
                </div>
              </div>
            </div>
          )}

          <Input
            type="date"
            color="danger"
            variant="bordered"
            className="text-white accent-danger-500"
            startContent={<FaCalendarAlt />}
            placeholder="Dates"
            onChange={(e) => setDates(e.target.value)}
          />
          <Button
            size="lg"
            className="h-full cursor-pointer"
            color="danger"
            variant="shadow"
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>
        <div>
          <ul className="text-white grid grid-cols-5 mt-5">
            {activities.map((activity) => (
              <li
                className="flex items-center justify-center gap-5 flex-col cursor-pointer"
                key={activity.name}
              >
                <div className="p-5 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-300 shadow-md">
                  <div className="relative h-12 w-12">
                    <Image
                      src={activity.icon}
                      fill
                      alt="Activity"
                      className="object-contain"
                    />
                  </div>
                </div>
                <span className="text-lg font-medium">{activity.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Search;
