import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const reservations = await prisma.reservation.findMany({
    where: { guestId: session.userId },
    include: {
      listing: {
        include: {
          images: { orderBy: { order: "asc" }, take: 1 },
        },
      },
    },
    orderBy: { checkIn: "desc" },
  });

  return NextResponse.json({ reservations });
}
