import type { AvailabilitySlot, Booking } from "@prisma/client";

type SlotWithActiveBookings = AvailabilitySlot & { bookings: Booking[] };

// Public-safe: no buyer/boat detail, just whether the slot can still be
// requested. The buyer already knows which boat they're booking for (they
// booked from that boat's own page) — this endpoint never needs to say.
export function serializeSlot(slot: SlotWithActiveBookings) {
  return {
    id: slot.id,
    startsAt: slot.startsAt,
    endsAt: slot.endsAt,
    available: slot.bookings.length === 0,
  };
}
