import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { listingUpdateSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: "asc" } },
        owner: { select: { id: true, name: true } },
      },
    });

    if (!listing) {
      return NextResponse.json({ error: "Annonce introuvable." }, { status: 404 });
    }

    return NextResponse.json({ listing });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.listing.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Annonce introuvable." }, { status: 404 });
    }
    if (existing.ownerId !== session.userId) {
      return NextResponse.json({ error: "Interdit." }, { status: 403 });
    }

    const json: unknown = await request.json();
    const data = listingUpdateSchema.parse(json);

    const listing = await prisma.listing.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.city !== undefined && { city: data.city }),
        ...(data.pricePerNight !== undefined && { pricePerNight: data.pricePerNight }),
      },
      include: { images: true },
    });

    if (data.imageUrls !== undefined) {
      await prisma.image.deleteMany({ where: { listingId: id } });
      if (data.imageUrls.length > 0) {
        await prisma.image.createMany({
          data: data.imageUrls.map((url, i) => ({
            url,
            order: i,
            listingId: id,
          })),
        });
      }
      const refreshed = await prisma.listing.findUnique({
        where: { id },
        include: { images: { orderBy: { order: "asc" } } },
      });
      return NextResponse.json({ listing: refreshed });
    }

    return NextResponse.json({ listing });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.listing.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Annonce introuvable." }, { status: 404 });
    }
    if (existing.ownerId !== session.userId) {
      return NextResponse.json({ error: "Interdit." }, { status: 403 });
    }

    await prisma.listing.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
