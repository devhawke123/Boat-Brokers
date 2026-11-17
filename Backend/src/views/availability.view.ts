import type { AvailabilitySlot, Booking } from "@prisma/client";
import { parseSlotBoatIds } from "../lib/slotBoats";
import { ukDateKey } from "../models/availability.model";

type SlotWithActiveBookings = AvailabilitySlot & { bookings: Booking[] };

// Public-safe: no buyer detail. boatIds (null = all boats) lets each boat page
// filter which slots to offer; capacity is still one active booking per slot.
export function serializeSlot(slot: SlotWithActiveBookings) {
  const boatIds = parseSlotBoatIds(slot.boatIds);
  return {
    id: slot.id,
    startsAt: slot.startsAt,
    endsAt: slot.endsAt,
    repeatsUntil: slot.repeatsUntil ? ukDateKey(slot.repeatsUntil) : null,
    boatIds: boatIds.length ? boatIds : null,
    available: slot.bookings.length === 0,
  };
}
