"use client";
import { TripType } from "@/types/trips";
import { USER_API_ROUTES } from "@/utils/api-routes";
import { Button, Chip } from "@heroui/react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import Image from "next/image";

const Trips = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchCity = searchParams.get("city");
  const [trips, setTrips] = useState<TripType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.get(
        `${USER_API_ROUTES.GET_CITY_TRIPS}?city=${searchCity}`
      );
      if (data.data.trips) setTrips(data.data.trips);
      console.log({ data });
    };
    if (searchCity) {
      fetchData();
    }
  }, [searchCity]);
  return (
    <div className="m-10 px-[5vw] min-h-[80vh]">
      <Button
        className="my-5 cursor-pointer"
        variant="shadow"
        color="primary"
        size="lg"
        onClick={() => router.push("/")}
      >
        <FaChevronLeft /> Go Back
      </Button>
      <div className="grid grid-cols-2 gap-5">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="grid grid-cols-9 rounded-2xl gap-5 border border-neutral-300 cursor-pointer"
            onClick={() => router.push(`/trips/${trip.id}`)}
          >
            <div className="relative w-full h-48 col-span-3">
              <Image
                src={trip.images[0]}
                alt="trip"
                fill
                className="rounded-2xl"
              />
            </div>
            <div className="col-span-6 pt-5 pr-5 flex flex-col gap-1">
              <h2 className="text-lg font-medium capitalize">
                <span className="line-clamp-1 ">{trip.name}</span>
              </h2>
              <div>
                <ul className="flex gap-5 w-full overflow-hidden">
                  {trip.destinationDetails.map((detail, index) => (
                    <li key={detail.name}>
                      <Chip color={index % 2 === 0 ? "secondary" : "danger"}>
                        {detail.name}
                      </Chip>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="line-clamp-1">{trip.description}</p>
              </div>
              <div className="flex gap-4">
                <div>{trip.days} days </div>
                <div>{trip.nights} nights </div>
              </div>
              <div className="flex justify-between">
                <span>{trip.id}</span>
                <span><strong>₹{trip.price} / person</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
const TripsPage = () => {
  return (
    <Suspense fallback={<div>Loading trips...</div>}>
      <Trips />
    </Suspense>
  );
};

export default TripsPage;
