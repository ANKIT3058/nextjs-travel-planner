import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "../../../../lib/prisma";
import { jobsQueue } from "../../../../lib/queue";

// Helper function to format dates to DD/MM/YYYY
const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// A simple map to get the state from a city/location.
// You can expand this list as needed.
const locationToStateMap: { [key: string]: string } = {
  Shimla: "Himachal Pradesh",
  Goa: "Goa",
  Delhi: "Delhi",
  Mumbai: "Maharashtra",
  Bangalore: "Karnataka",
  Varanasi: "Uttar Pradesh",
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");
    const dateStr = searchParams.get("date");

    console.log("Received Location:", location);
    console.log("Received Date:", dateStr);

    // --- 1. Validate input ---
    if (!location || !dateStr) {
      return NextResponse.json(
        { message: "Missing location or date parameter" },
        { status: 400 }
      );
    }

    // --- 2. Process dates ---
    const checkinDateObj = new Date(dateStr);
    const checkoutDateObj = new Date(checkinDateObj);
    checkoutDateObj.setDate(checkinDateObj.getDate() + 1); // Set checkout to the next day

    const checkinDate = formatDate(checkinDateObj);
    const checkoutDate = formatDate(checkoutDateObj);

    console.log("Formatted Checkin date:", checkinDate);
    console.log("Formatted Checkout date:", checkoutDate);

    // --- 3. Determine location details ---
    // Default to the location name if not found in the map
    const stateName = locationToStateMap[location] || location;
    console.log("Resolved State Name:", stateName);

    // --- 4. Construct the dynamic URL using URLSearchParams for safety ---
    // This automatically handles encoding special characters like spaces in "Himachal Pradesh"
    const searchUrl = new URL(
      "https://hotel.yatra.com/nextui/hotel-search/dom/search"
    );
    searchUrl.searchParams.set("checkoutDate", checkoutDate);
    searchUrl.searchParams.set("checkinDate", checkinDate);
    searchUrl.searchParams.set("source", "BOOKING_ENGINE");
    searchUrl.searchParams.set("pg", "1");
    searchUrl.searchParams.set("tenant", "B2C");
    searchUrl.searchParams.set("isPersnldSrp", "1");
    searchUrl.searchParams.set("city.name", location);
    searchUrl.searchParams.set("city.code", location);
    searchUrl.searchParams.set("state.name", stateName);
    searchUrl.searchParams.set("state.code", stateName);
    searchUrl.searchParams.set("country.name", "IND");
    searchUrl.searchParams.set("country.code", "IND");
    searchUrl.searchParams.set("roomRequests[0].id", "1");
    searchUrl.searchParams.set("roomRequests[0].noOfAdults", "2");
    searchUrl.searchParams.set("roomRequests[0].noOfChildren", "0"); // Fixed typo

    const dynamicUrl = searchUrl.toString();
    console.log("Generated URL:", dynamicUrl);

    // --- 5. Create job and add to queue ---
    const response = await prisma.jobs.create({
      data: {
        url: dynamicUrl,
        jobType: { type: "hotels", location, date: dateStr },
      },
    });

    await jobsQueue.add("new location", {
      url: dynamicUrl,
      jobType: { type: "hotels" },
      id: response.id,
      location,
    });

    return NextResponse.json(
      { msg: "Job Running", id: response.id, generatedUrl: dynamicUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in hotel scrape GET request:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json({ message: error.message }, { status: 400 });
      }
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
