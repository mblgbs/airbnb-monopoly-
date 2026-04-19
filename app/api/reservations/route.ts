import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { reservationCreateSchema } from "@/lib/validation";
import { parseUtcDay } from "@/lib/dates";
import { hasOverlappingReservation } from "@/lib/reservations-db";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const json: unknown = await request.json();
    const data = reservationCreateSchema.parse(json);

    const checkIn = parseUtcDay(data.checkIn);
    const checkOut = parseUtcDay(data.checkOut);

    if (checkOut <= checkIn) {
      return NextResponse.json(
        { error: "La date de départ doit être après la date d'arrivée." },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.findUnique({
      where: { id: data.listingId },
    });

    if (!listing) {
      return NextResponse.json({ error: "Annonce introuvable." }, { status: 404 });
    }

    if (listing.ownerId === session.userId) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas réserver votre propre logement." },
        { status: 400 }
      );
    }

    const overlap = await hasOverlappingReservation(
      data.listingId,
      checkIn,
      checkOut
    );
    if (overlap) {
      return NextResponse.json(
        { error: "Ces dates ne sont pas disponibles pour ce logement." },
        { status: 409 }
      );
    }

    const reservation = await prisma.reservation.create({
      data: {
        listingId: data.listingId,
        guestId: session.userId,
        checkIn,
        checkOut,
      },
      include: {
        listing: { include: { images: { orderBy: { order: "asc" }, take: 1 } } },
      },
    });

    return NextResponse.json({ reservation }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
