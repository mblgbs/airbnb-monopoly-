import { ListingCard, type ListingCardData } from "@/components/ListingCard";

export function ListingGrid({ listings }: { listings: ListingCardData[] }) {
  if (listings.length === 0) {
    return (
      <p className="text-slate-600 text-center py-16">
        Aucun logement ne correspond à votre recherche.
      </p>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <li key={listing.id}>
          <ListingCard listing={listing} />
        </li>
      ))}
    </ul>
  );
}
