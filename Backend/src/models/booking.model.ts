import { prisma } from "../lib/prisma";
import { findOrCreateBuyer } from "./buyer.model";

const bookingInclude = {
  slot: true,
  boat: { select: { id: true, name: true, imageUrl: true } },
  buyer: true,
} as const;

export function findAllBookings() {
  return prisma.booking.findMany({ orderBy: { createdAt: "desc" }, include: bookingInclude });
}

export function findBookingById(id: number) {
  return prisma.booking.findUnique({ where: { id }, include: bookingInclude });
}

export type CreateBookingData = {
  boatId: number;
  slotId: number;
  firstName: string;
  surname: string;
  email: string;
  phone?: string;
  notes?: string;
};

// Thrown when the requested slot already has an active (PENDING/APPROVED)
// booking — surfaced by the controller as a 409.
export class SlotUnavailableError extends Error {
  constructor() {
    super("This slot is no longer available. Please pick another.");
  }
}

export async function createBooking(data: CreateBookingData) {
  return prisma.$transaction(async (tx) => {
    const slot = await tx.availabilitySlot.findUnique({
      where: { id: data.slotId },
      include: { bookings: { where: { status: { in: ["PENDING", "APPROVED"] } } } },
    });
    if (!slot) throw new SlotUnavailableError();
    if (slot.bookings.length > 0) throw new SlotUnavailableError();

    const buyer = await findOrCreateBuyer(
      {
        firstName: data.firstName,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
      },
      tx,
    );

    const booking = await tx.booking.create({
      data: {
        slotId: data.slotId,
        boatId: data.boatId,
        buyerId: buyer.id,
        notes: data.notes,
      },
      include: bookingInclude,
    });
    return booking;
  });
}

export function updateBookingStatus(id: number, status: "APPROVED" | "REJECTED") {
  return prisma.booking.update({ where: { id }, data: { status }, include: bookingInclude });
}
