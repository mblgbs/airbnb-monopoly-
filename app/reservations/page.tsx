import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export default async function ReservationsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login?next=/reservations");
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

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Mes réservations</h1>
      <p className="text-slate-600 mb-8">Voyages à venir et passés.</p>

      {reservations.length === 0 ? (
        <p className="text-slate-600">
          Aucune réservation.{" "}
          <Link href="/" className="text-red-500 hover:underline">
            Parcourir les logements
          </Link>
        </p>
      ) : (
        <ul className="space-y-4">
          {reservations.map((r) => {
            const img = r.listing.images[0]?.url;
            const checkIn = r.checkIn.toISOString().slice(0, 10);
            const checkOut = r.checkOut.toISOString().slice(0, 10);
            return (
              <li
                key={r.id}
                className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="relative h-24 w-32 shrink-0 rounded-lg overflow-hidden bg-slate-200">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div>
                  <Link
                    href={`/listings/${r.listing.id}`}
                    className="font-semibold text-slate-900 hover:text-red-500"
                  >
                    {r.listing.title}
                  </Link>
                  <p className="text-sm text-slate-600">
                    {r.listing.city} · {checkIn} → {checkOut}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
