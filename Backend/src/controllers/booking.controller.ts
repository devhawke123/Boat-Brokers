import type { Request, Response } from "express";
import { createBooking, findAllBookings, findBookingById, updateBookingStatus, SlotUnavailableError } from "../models/booking.model";
import { updateBuyerStatus } from "../models/buyer.model";
import { createBookingSchema, updateBookingStatusSchema } from "../schemas/booking.schema";
import { serializeBooking } from "../views/booking.view";
import { sendAdminEmail, sendBookingConfirmedEmail, sendBookingRejectedEmail } from "../lib/email";

function formatSlot(startsAt: Date | string) {
  return new Date(startsAt).toLocaleString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
  });
}

// Admin-only — includes buyer PII (see views/booking.view.ts).
export async function listBookings(_req: Request, res: Response) {
  const bookings = await findAllBookings();
  res.json(bookings.map(serializeBooking));
}

export async function createBookingHandler(req: Request, res: Response) {
  const parsed = createBookingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  try {
    const booking = await createBooking(parsed.data);
    // Admin heads-up; a delivery failure must not fail the buyer's request.
    try {
      const { buyer, boat, slot } = booking;
      const emailRes = await sendAdminEmail({
        subject: `New viewing request for ${boat.name}`,
        eyebrow: "Viewing Request",
        heading: `New viewing request from ${buyer.firstName} ${buyer.surname}`,
        details: [
          { label: "Boat", value: boat.name },
          { label: "Slot", value: formatSlot(slot.startsAt) },
          { label: "Name", value: `${buyer.firstName} ${buyer.surname}` },
          { label: "Email", value: buyer.email, href: `mailto:${buyer.email}` },
          { label: "Phone", value: buyer.phone ?? "Not provided", href: buyer.phone ? `tel:${buyer.phone}` : undefined },
        ],
        message: booking.notes ?? undefined,
        replyTo: buyer.email,
        replyLabel: `Reply to ${buyer.firstName}`,
      });
      if (emailRes.error) console.error("Resend API Error sending viewing-request email:", emailRes.error);
    } catch (err) {
      console.error("Exception sending viewing-request email:", err);
    }
    res.status(201).json(serializeBooking(booking));
  } catch (err) {
    if (err instanceof SlotUnavailableError) {
      return res.status(409).json({ error: err.message });
    }
    throw err;
  }
}

export async function updateBookingStatusHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid booking id" });

  const parsed = updateBookingStatusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const existing = await findBookingById(id);
  if (!existing) return res.status(404).json({ error: "Booking not found" });

  let booking = await updateBookingStatus(id, parsed.data.status);

  if (parsed.data.status === "APPROVED") {
    await updateBuyerStatus(booking.buyer.id, "VIEWING_BOOKED");
    // Re-fetch so the response reflects the buyer status change above,
    // rather than the stale snapshot from before it.
    booking = (await findBookingById(id)) ?? booking;

    const when = formatSlot(booking.slot.startsAt);
    await sendBookingConfirmedEmail({
      to: booking.buyer.email,
      buyerFirstName: booking.buyer.firstName,
      boatName: booking.boat.name,
      boatId: booking.boat.id,
      when,
    });
  }

  if (parsed.data.status === "REJECTED" && existing.status !== "REJECTED") {
    await sendBookingRejectedEmail({
      to: booking.buyer.email,
      buyerFirstName: booking.buyer.firstName,
      boatName: booking.boat.name,
      boatId: booking.boat.id,
      when: formatSlot(booking.slot.startsAt),
    });
  }

  res.json(serializeBooking(booking));
}
