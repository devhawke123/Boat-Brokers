import type { AvailabilitySlot, Booking, Buyer } from "@prisma/client";
import { toMediaUrl } from "../lib/media";

type BoatSummary = { id: number; name: string; imageUrl: string | null };

type BookingWithRelations = Booking & {
  slot: AvailabilitySlot;
  boat: BoatSummary;
  buyer: Buyer;
};

// Admin-only view — includes buyer PII. Never expose this on a public route.
export function serializeBooking(booking: BookingWithRelations) {
  return {
    id: booking.id,
    status: booking.status,
    notes: booking.notes,
    createdAt: booking.createdAt,
    slot: { id: booking.slot.id, startsAt: booking.slot.startsAt, endsAt: booking.slot.endsAt },
    boat: { ...booking.boat, imageUrl: toMediaUrl(booking.boat.imageUrl) },
    buyer: {
      id: booking.buyer.id,
      buyerId: booking.buyer.buyerId,
      firstName: booking.buyer.firstName,
      surname: booking.buyer.surname,
      email: booking.buyer.email,
      phone: booking.buyer.phone,
      status: booking.buyer.status,
    },
  };
}
