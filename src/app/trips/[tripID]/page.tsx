"use client";
import { useAppStore } from "@/store";
import { TripType } from "@/types/trips";
import { USER_API_ROUTES } from "@/utils/api-routes";
import { Button, Input, Tab, Tabs } from "@heroui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  FaCalendar,
  FaCheck,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { IoPerson, IoPricetag } from "react-icons/io5";
import Itinerary from "./components/itinerary/itinerary";
import { ImageGallery } from "./components/images";
import Script from "next/script";

const Trip = ({ params: { tripID } }: { params: { tripID: string } }) => {
  const router = useRouter();
  const { userInfo } = useAppStore();
  const [tripData, setTripData] = useState<TripType | undefined>(undefined);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchTripData = async () => {
      const data = await axios.get(
        `${USER_API_ROUTES.GET_TRIP_DATA}?id=${tripID}`
      );
      if (data.data.id) {
        setTripData(data.data);
      }
    };

    if (tripID) {
      fetchTripData();
    }
  }, [tripID]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value
      ? new Date(event.target.value)
      : new Date();
    setDate(newDate);
  };

  const [amount, setAmount] = useState<number>(0);

  const bookTrip = async () => {
    const isoDate = date.toISOString();

    const res = await axios.post(USER_API_ROUTES.CREATE_BOOKING, {
      bookingId: tripData?.id,
      bookingType: "trips",
      userId: userInfo?.id,
      taxes: 3300,
      date: isoDate,
    });

    if (!res || !res.data?.orderId) {
      console.error("Failed to create booking or order");
      return;
    }

    const options = {
      key: res.data.keyId, // Use returned keyId
      amount: res.data.amount, // in paise
      currency: res.data.currency,
      name: "Trip Booking",
      description: "Payment for your trip",
      order_id: res.data.orderId, // ✅ Correct here
      handler: async function (response: {
        razorpay_order_id: any;
        razorpay_payment_id: any;
        razorpay_signature: any;
      }) {
        // verify payment
        const verification = await fetch("/api/verifyOrder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          }),
        });

        const data = await verification.json();
        if (data.isOk) {
          await axios.patch(USER_API_ROUTES.CREATE_BOOKING, {paymentIntent: res.data.orderId});
          setTimeout(() => {
            router.push("/my-bookings");
          }, 3000);
          alert("Payment successful!");
          // router.push("/success");
        } else {
          alert("Payment verification failed.");
        }
      },
      prefill: {
        name: userInfo?.firstName,
        email: userInfo?.email,
      },
      theme: {
        color: "#1DBF73",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div>
      <Script
        type="text/javascript"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      {tripData && (
        <>
          <ImageGallery images={tripData.images} />
          <div className="grid grid-cols-3 my-10 gap-10 mx-32">
            <div className="col-span-2">
              <div className="bg-white px-5 py-5 rounded-lg flex flex-col gap-10 text-[#243757]">
                <div className="p-10 bg-[#f5f5fe] rounded-lg border border-gray-200 flex flex-col gap-5">
                  <div className="border-b-2 border-dotted border-gray-400 flex justify-between w-full pb-5">
                    <h1 className="text-3xl">
                      <strong className="font-medium">{tripData?.name}</strong>
                    </h1>
                    <ul className="flex gap-4 text-2xl items-center">
                      <li className="cursor-pointer text-blue-500 bg-blue-100 p-3 rounded-full">
                        <FaFacebook />
                      </li>
                      <li className="cursor-pointer text-blue-500 bg-blue-100 p-3 rounded-full">
                        <FaInstagram />
                      </li>
                      <li className="cursor-pointer text-blue-500 bg-blue-100 p-3 rounded-full">
                        <FaTwitter />
                      </li>
                      <li className="cursor-pointer text-blue-500 bg-blue-100 p-3 rounded-full">
                        <FaWhatsapp />
                      </li>
                    </ul>
                  </div>
                  <div>
                    <ul className="grid grid-cols-2 gap-5">
                      <li>
                        <span>Trip ID: </span>
                        <span className="text-blue-500">{tripData.id}</span>
                      </li>
                      <li>
                        <span>Duration: </span>
                        <span>
                          {tripData.days} Days, {tripData.nights} Nights
                        </span>
                      </li>
                      <li className="flex gap-4">
                        <span>Locations Covered: </span>
                        <ul className="flex flex-col gap-5">
                          {tripData?.destinationItinerary.map((destination) => {
                            return (
                              <li key={destination.place}>
                                <span>{destination.place}</span>
                                <span>
                                  &nbsp;{destination.totalNights} nights
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="px-10 py-10 bg-[#f5f5fe] rounded-lg border border-gray-200 gap-3 flex flex-col">
                  <h3 className="text-2xl">
                    <strong className="font-medium">Overview</strong>
                  </h3>
                  <p>{tripData.description}</p>
                </div>
                <div className="px-10 py-10 bg-[#f5f5fe] rounded-lg border border-gray-200 gap-3 flex flex-col">
                  <h3 className="text-2xl">
                    <strong className="font-medium">Tour Highlights</strong>
                  </h3>
                  <ul className="grid grid-cols-4 gap-5 mt-3">
                    {tripData.themes.map((theme) => (
                      <li key={theme} className="flex gap-2 items-center">
                        <span className="text-sm text-blue-500 bg-blue-200 p-2 rounded-full">
                          <FaCheck />
                        </span>
                        <span>{theme}</span>
                      </li>
                    ))}
                    {tripData.inclusions.map((inclusion) => (
                      <li key={inclusion} className="flex gap-2 items-center">
                        <span className="text-sm text-blue-500 bg-blue-200 p-2 rounded-full">
                          <FaCheck />
                        </span>
                        <span>{inclusion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-10 py-10 bg-[#f5f5fe] rounded-lg border border-gray-200 gap-3 flex flex-col">
                  <h3 className="text-2xl">
                    <strong className="font-medium">Itinerary</strong>
                  </h3>
                  <div>
                    <Itinerary data={tripData.detailedItinerary} />
                  </div>
                </div>
                <div className="px-10 py-10 bg-[#f5f5fe] rounded-lg border border-gray-200 gap-3 flex flex-col">
                  <h3 className="text-2xl">
                    <strong className="font-medium">Location Overview</strong>
                  </h3>
                  <div>
                    <Tabs variant="bordered" color="primary">
                      {tripData.destinationDetails.map((city) => (
                        <Tab
                          key={city.name}
                          title={city.name}
                          className="flex gap-5"
                        >
                          <div className="relative h-[200px] w-[20vw]">
                            <Image src={city.image} fill alt={city.name} />
                          </div>
                          <p className="flex-1">{city.description}</p>
                        </Tab>
                      ))}
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-lg flex flex-col gap-10 h-max text-[#243757]">
              <div className="flex flex-col gap-3">
                <h1 className="font-medium text-2xl">Price</h1>
                <div className="flex gap-2 items-center justify-between">
                  <div className="flex gap-2">
                    <IoPricetag className="text-3xl" />
                    <span className="text-2xl">From</span>
                  </div>
                  <span className="text-4xl font-bold">₹{tripData.price}</span>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <Input
                  endContent={<FaCalendar />}
                  type="date"
                  onChange={handleDateChange}
                />
                <Input
                  endContent={<IoPerson />}
                  placeholder="Guests"
                  type="number"
                />
              </div>
              <ul className="flex flex-col gap-2">
                <li className="flex justify-between">
                  <span>Base Price</span>
                  <span>₹{tripData.price}</span>
                </li>
                <li className="flex justify-between">
                  <span>State Price</span>
                  <span>₹800</span>
                </li>
                <li className="flex justify-between">
                  <span>Night Price</span>
                  <span>₹500</span>
                </li>
                <li className="flex justify-between">
                  <span>Convenience Fee</span>
                  <span>₹2000</span>
                </li>
                <li className="flex justify-between">
                  <span>Total Price</span>
                  <span>₹{tripData.price + 3300}</span>
                </li>
              </ul>
              <Button
                color="primary"
                size="lg"
                className="rounded-full"
                onClick={() => userInfo && bookTrip()}
              >
                {userInfo ? "Book Trip" : "Login to Book Trip"}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Trip;
