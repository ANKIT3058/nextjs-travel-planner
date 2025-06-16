import { DetailedItineraryType } from "@/types/trips";
import { Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";

const Itinerary = ({ data }: { data: DetailedItineraryType[] }) => {
  return (
    <div className="py-12 px-4 sm:px-8 md:px-16 bg-gray-50">
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute top-0 bottom-0 left-1/2 w-[3px] bg-blue-200 z-0 transform -translate-x-1/2" />

        <div className="flex flex-col gap-16 relative z-10">
          {data.map((dt, index) => (
            <div
              key={dt.title}
              className="grid grid-cols-1 md:grid-cols-3 items-center gap-6"
            >
              {/* Circle with Day */}
              <div className="flex justify-center md:justify-end">
                <div className="h-28 w-28 md:h-36 md:w-36 bg-white flex items-center justify-center rounded-full border-4 border-blue-500 shadow-md">
                  <div className="h-20 w-20 md:h-28 md:w-28 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-semibold">
                    Day {index + 1}
                  </div>
                </div>
              </div>

              {/* Content Card */}
              <div className="md:col-span-2">
                <Card className="bg-white text-[#243757] shadow-lg rounded-xl border border-blue-100 p-6">
                  <CardHeader className="text-xl font-bold mb-2">
                    {dt.title}
                  </CardHeader>
                  <CardBody className="space-y-3 text-base leading-relaxed text-gray-700 whitespace-pre-line">
                    {dt.value}
                  </CardBody>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Itinerary;
