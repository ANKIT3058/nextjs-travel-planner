import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_ID,
  });
  try {
    const { bookingId, bookingType, userId, taxes, date } =
      await request.json();

    console.log("Incoming request:", {
      bookingId,
      bookingType,
      userId,
      taxes,
      date,
    });

    let bookingDetails = null;
    switch (bookingType) {
      case "trips":
        bookingDetails = await prisma.trips.findUnique({
          where: { id: bookingId },
        });
        break;
      case "hotels":
        bookingDetails = await prisma.hotels.findUnique({
          where: { id: parseInt(bookingId) },
        });
        break;
      case "flights":
        bookingDetails = await prisma.flights.findUnique({
          where: { id: parseInt(bookingId) },
        });
        break;
    }

    if (!bookingDetails) {
      console.error("No booking details found for:", bookingType, bookingId);
      return NextResponse.json(
        { message: "Invalid booking details" },
        { status: 400 }
      );
    }

    let order;

    if (bookingDetails) {
      order = await razorpay.orders.create({
        amount: 500,
        currency: "INR",
        receipt: `receipt_${bookingDetails.id}`,
        payment_capture: true, // <-- this ensures Razorpay auto-captures the payment
      });
    }
    console.log(order);

    const booking = await prisma.bookings.create({
      data: {
        bookingType,
        bookingTypeId: bookingId.toString(),
        user: { connect: { id: userId } },
        paymentIntent: order!.id,
        totalAmount: bookingDetails?.price + taxes,
        date,
      },
    });

    console.log("DATABASE_URL:", process.env.DATABASE_URL);

    console.log("Booking saved to DB:", booking);

    return NextResponse.json(
      {
        orderId: order!.id, // 🔑  what the frontend really needs
        amount: order!.amount, // optional, handy for display
        currency: order!.currency, // optional
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // public Key ID for Checkout
      },
      { status: 201 }
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

export async function PATCH(request: Request) {
  try {
    const { paymentIntent } = await request.json();

    if (paymentIntent) {
      await prisma.bookings.update({
        where: { paymentIntent },
        data: {
          isComplete: true,
        },
      });
      return NextResponse.json(
        {
          status: "Payment Successfull.",
        },
        { status: 200 }
      );
    }
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

export async function GET() {
  try {
    const bookings = await prisma.bookings.findMany({});
    // Iterate over each booking to fetch additional details based on bookingType
    for (const booking of bookings) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete booking.paymentIntent;
      switch (booking.bookingType) {
        case "hotels":
          const hotel = await prisma.hotels.findUnique({
            where: { id: parseInt(booking.bookingTypeId) },
          });
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          booking.name = hotel ? hotel.name : null;
          break;
        case "trips":
          const trip = await prisma.trips.findUnique({
            where: { id: booking.bookingTypeId },
          });
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          booking.name = trip ? trip.name : null;
          break;
        case "flights":
          const flight = await prisma.flights.findUnique({
            where: { id: parseInt(booking.bookingTypeId) },
          });
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          booking.name = flight ? flight.name : null;
          break;
        default:
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          booking.name = null;
      }
    }

    return NextResponse.json(
      {
        bookings,
      },
      { status: 201 }
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
