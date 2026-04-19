import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { SearchBar } from "@/components/SearchBar";
import { ListingGrid } from "@/components/ListingGrid";
import { parseUtcDay } from "@/lib/dates";

type Props = {
  searchParams: Promise<{ city?: string; checkIn?: string; checkOut?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const sp = await searchParams;
  const city = sp.city?.trim();
  const checkIn = sp.checkIn;
  const checkOut = sp.checkOut;

  const where: Prisma.ListingWhereInput = {};

  if (city) {
    where.city = { contains: city, mode: "insensitive" };
  }

  if (checkIn && checkOut) {
    const ci = parseUtcDay(checkIn);
    const co = parseUtcDay(checkOut);
    if (co > ci) {
      where.NOT = {
        reservations: {
          some: {
            AND: [{ checkIn: { lt: co } }, { checkOut: { gt: ci } }],
          },
        },
      };
    }
  }

  const listings = await prisma.listing.findMany({
    where,
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      owner: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Trouvez votre prochain séjour</h1>
      <p className="text-slate-600 mb-8">Recherche par ville et disponibilités.</p>
      <SearchBar
        initialCity={city}
        initialCheckIn={checkIn}
        initialCheckOut={checkOut}
      />
      <ListingGrid listings={listings} />
    </div>
  );
}
