import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { EditListingForm } from "@/components/EditListingForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditListingPage({ params }: Props) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!listing) notFound();
  if (listing.ownerId !== session.userId) {
    redirect("/host/listings");
  }

  return (
    <EditListingForm
      listingId={listing.id}
      initial={{
        title: listing.title,
        description: listing.description,
        city: listing.city,
        pricePerNight: listing.pricePerNight,
        imageUrls: listing.images.map((i) => i.url),
      }}
    />
  );
}
