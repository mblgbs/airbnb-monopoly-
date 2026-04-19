import Link from "next/link";

export type ListingCardData = {
  id: string;
  title: string;
  city: string;
  pricePerNight: number;
  images: { url: string }[];
  owner: { name: string };
};

export function ListingCard({ listing }: { listing: ListingCardData }) {
  const src =
    listing.images[0]?.url ?? "https://placehold.co/600x400?text=Logement";

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-[4/3] bg-slate-200 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element -- URLs utilisateur (MVP) */}
        <img
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <p className="text-sm text-slate-500">{listing.city}</p>
        <h2 className="font-semibold text-slate-900 line-clamp-2">{listing.title}</h2>
        <p className="mt-2 text-sm text-slate-600">
          <span className="font-semibold text-slate-900">{listing.pricePerNight} €</span>
          {" · "}
          nuit
        </p>
        <p className="text-xs text-slate-400 mt-1">Hôte : {listing.owner.name}</p>
      </div>
    </Link>
  );
}
