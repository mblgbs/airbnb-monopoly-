import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { BookingForm } from "@/components/BookingForm";

type Props = { params: Promise<{ id: string }> };

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" } },
      owner: { select: { name: true, id: true } },
    },
  });

  if (!listing) notFound();

  const session = await getSession();
  const isOwner = session?.userId === listing.owner.id;

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <p className="text-slate-500 text-sm">{listing.city}</p>
          <h1 className="text-3xl font-bold text-slate-900 mt-1">{listing.title}</h1>
          <p className="text-slate-600 mt-4 whitespace-pre-wrap">{listing.description}</p>
          <p className="mt-4 text-lg">
            <span className="font-semibold">{listing.pricePerNight} €</span>
            <span className="text-slate-600"> / nuit · Hôte : {listing.owner.name}</span>
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {listing.images.map((img) => (
            <div
              key={img.id}
              className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {isOwner ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            <p>Ceci est votre annonce.</p>
            <Link
              href={`/host/listings/${listing.id}/edit`}
              className="inline-block mt-3 text-red-500 hover:underline"
            >
              Modifier l’annonce
            </Link>
          </div>
        ) : session ? (
          <BookingForm listingId={listing.id} />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-slate-700 mb-4">Connectez-vous pour réserver ce logement.</p>
            <Link
              href={`/login?next=/listings/${listing.id}`}
              className="inline-flex justify-center w-full rounded-lg bg-red-500 text-white py-3 text-sm font-medium hover:bg-red-600"
            >
              Connexion
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
