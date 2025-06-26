import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { jobsQueue } from "@/lib/queue";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

const source = searchParams.get("source");           // e.g., 'DEL'
const destination = searchParams.get("destination"); // e.g., 'BOM'
const date = searchParams.get("date");               // e.g., '2025-07-26'

// Helper: Convert 'YYYY-MM-DD' to 'DD/MM/YYYY'
function formatDate(date: any) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

// Build Yatra URL
const url = `https://flight.yatra.com/air-search-ui/dom2/trigger?flex=0&viewName=normal&source=fresco-flights&type=O&class=Economy&ADT=1&CHD=0&INF=0&noOfSegments=1&origin=${source}&originCountry=IN&destination=${destination}&destinationCountry=IN&flight_depart_date=${encodeURIComponent(formatDate(date))}&arrivalDate=`;

    console.log(url);

    const response = await prisma.jobs.create({
      data: { url, jobType: { type: "flight", source, destination, date } },
    });
    await jobsQueue.add("new location", {
      url,
      jobType: { type: "flight", source, destination, date },
      id: response.id,
    });
    console.log(response);

    return NextResponse.json(
      { msg: "Job Running", id: response.id },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json({ message: error.message }, { status: 400 });
      }
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
  return NextResponse.json(
    { message: "An unexpected error occurred." },
    { status: 500 }
  );
}
