import type { AvailabilitySlot, Booking, Buyer } from "@prisma/client";

type BoatSummary = { id: number; name: string; imageUrl: string | null };

type BuyerWithBookings = Buyer & {
  bookings: (Booking & { slot: AvailabilitySlot; boat: BoatSummary })[];
};

export function serializeBuyer(buyer: BuyerWithBookings) {
  return {
    id: buyer.id,
    buyerId: buyer.buyerId,
    firstName: buyer.firstName,
    surname: buyer.surname,
    email: buyer.email,
    phone: buyer.phone,
    source: buyer.source,
    status: buyer.status,
    createdAt: buyer.createdAt,
    bookings: buyer.bookings.map((booking) => ({
      id: booking.id,
      status: booking.status,
      createdAt: booking.createdAt,
      slot: { id: booking.slot.id, startsAt: booking.slot.startsAt, endsAt: booking.slot.endsAt },
      boat: booking.boat,
    })),
  };
}
