import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { listingCreateSchema } from "@/lib/validation";
import { parseUtcDay } from "@/lib/dates";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city")?.trim();
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");

    if ((checkIn && !checkOut) || (!checkIn && checkOut)) {
      return NextResponse.json(
        { error: "Fournissez checkIn et checkOut ensemble, ou aucun des deux." },
        { status: 400 }
      );
    }

    const where: Prisma.ListingWhereInput = {};

    if (city) {
      where.city = { contains: city, mode: "insensitive" };
    }

    if (checkIn && checkOut) {
      const ci = parseUtcDay(checkIn);
      const co = parseUtcDay(checkOut);
      if (co <= ci) {
        return NextResponse.json(
          { error: "La date de départ doit être après la date d'arrivée." },
          { status: 400 }
        );
      }
      where.NOT = {
        reservations: {
          some: {
            AND: [{ checkIn: { lt: co } }, { checkOut: { gt: ci } }],
          },
        },
      };
    }

    const listings = await prisma.listing.findMany({
      where,
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        owner: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ listings });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }
    if (session.role !== "HOST") {
      return NextResponse.json(
        { error: "Seuls les comptes hôte peuvent créer une annonce." },
        { status: 403 }
      );
    }

    const json: unknown = await request.json();
    const data = listingCreateSchema.parse(json);

    const listing = await prisma.listing.create({
      data: {
        title: data.title,
        description: data.description,
        city: data.city,
        pricePerNight: data.pricePerNight,
        ownerId: session.userId,
        images: {
          create: data.imageUrls.map((url, i) => ({ url, order: i })),
        },
      },
      include: { images: true },
    });

    return NextResponse.json({ listing }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
