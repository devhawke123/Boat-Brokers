import { prisma } from "../lib/prisma";

// A slot is "active"-booked (unavailable) while it has a PENDING or APPROVED
// booking. A REJECTED booking doesn't block the slot — it frees back up.
const ACTIVE_BOOKING_STATUSES = ["PENDING", "APPROVED"] as const;

export function findAllSlots() {
  return prisma.availabilitySlot.findMany({
    orderBy: { startsAt: "asc" },
    include: { bookings: { where: { status: { in: [...ACTIVE_BOOKING_STATUSES] } } } },
  });
}

export function findSlotById(id: number) {
  return prisma.availabilitySlot.findUnique({
    where: { id },
    include: { bookings: { where: { status: { in: [...ACTIVE_BOOKING_STATUSES] } } } },
  });
}

export function createSlot(startsAt: Date, endsAt: Date) {
  return prisma.availabilitySlot.create({ data: { startsAt, endsAt } });
}

// Two ranges overlap when one starts before the other ends, both ways —
// this also catches the exact-duplicate case the DB's unique index covers,
// but that only matches an identical startsAt, not a merely overlapping one
// (e.g. 11:00–13:00 and 12:00–14:00).
export function findOverlappingSlot(startsAt: Date, endsAt: Date) {
  return prisma.availabilitySlot.findFirst({
    where: { startsAt: { lt: endsAt }, endsAt: { gt: startsAt } },
  });
}

export function deleteSlot(id: number) {
  return prisma.availabilitySlot.delete({ where: { id } });
}
