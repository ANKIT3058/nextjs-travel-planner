import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_KEY || "");

export async function POST(request: Request) {
  try {
    const { bookingId, bookingType, userId, taxes, date } =
      await request.json();
    let bookingDetails;
    switch (bookingType) {
      case "trips":
        bookingDetails = await prisma.trips.findUnique({
          where: { id: bookingId },
        });
    }
    
  } catch (error) {
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
