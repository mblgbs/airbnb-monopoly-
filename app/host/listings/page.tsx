import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { CreateListingForm } from "@/components/CreateListingForm";
import { HostListingActions } from "@/components/HostListingActions";
import Link from "next/link";

export default async function HostListingsPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/host/listings");

  const listings = await prisma.listing.findMany({
    where: { ownerId: session.userId },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Mes annonces</h1>
        <p className="text-slate-600 mt-2">
          Gérez vos logements ou{" "}
          <Link href="/" className="text-red-500 hover:underline">
            retournez au catalogue
          </Link>
          .
        </p>
      </div>

      <CreateListingForm />

      <section>
        <h2 className="font-semibold text-lg mb-4">Annonces publiées ({listings.length})</h2>
        {listings.length === 0 ? (
          <p className="text-slate-600 text-sm">Aucune annonce pour le moment.</p>
        ) : (
          <ul className="space-y-4">
            {listings.map((l) => (
              <li
                key={l.id}
                className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div>
                  <Link
                    href={`/listings/${l.id}`}
                    className="font-medium text-slate-900 hover:text-red-500"
                  >
                    {l.title}
                  </Link>
                  <p className="text-sm text-slate-500">
                    {l.city} · {l.pricePerNight} € / nuit
                  </p>
                </div>
                <HostListingActions listingId={l.id} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
