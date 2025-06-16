import { Prisma } from "@prisma/client";
import { decodeJwt, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_KEY as string);
    const token = request.cookies.get("access_token");
    if (token) {
      if (!jwtVerify(token.value, secret)) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      const { userId, isAdmin } = decodeJwt(token.value);
      if (!isAdmin) {
        const user = await prisma.user.findUnique({
          where: { id: parseInt(userId as string) },
        });
        if (user) {
          return NextResponse.json({
            userInfo: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
            },
          });
        }
      } else {
        return NextResponse.json({});
      }
    } else {
      return NextResponse.json({});
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json({ message: error.message }, { status: 400 });
      }
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
}
