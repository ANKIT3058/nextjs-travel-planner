import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    console.log("reaching all trips")
  try {
    const trips = await prisma.trips.findMany({
      orderBy: { scrapedOn: "desc" },
    });
    console.log(trips)
    if (trips) {
      return NextResponse.json({ trips }, { status: 200 });
    } else {
      return NextResponse.json({ msg: "No trips found." }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
