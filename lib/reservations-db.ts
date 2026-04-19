import { prisma } from "@/lib/prisma";
import { reservationRangesOverlap } from "@/lib/reservation-overlap";

export async function hasOverlappingReservation(
  listingId: string,
  checkIn: Date,
  checkOut: Date,
  excludeReservationId?: string
): Promise<boolean> {
  const reservations = await prisma.reservation.findMany({
    where: {
      listingId,
      ...(excludeReservationId ? { id: { not: excludeReservationId } } : {}),
    },
    select: { checkIn: true, checkOut: true },
  });

  return reservations.some((r) =>
    reservationRangesOverlap(checkIn, checkOut, r.checkIn, r.checkOut)
  );
}
