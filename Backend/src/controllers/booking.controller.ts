import type { Request, Response } from "express";
import { Resend } from "resend";
import { createBooking, findAllBookings, findBookingById, updateBookingStatus, SlotUnavailableError } from "../models/booking.model";
import { updateBuyerStatus } from "../models/buyer.model";
import { createBookingSchema, updateBookingStatusSchema } from "../schemas/booking.schema";
import { serializeBooking } from "../views/booking.view";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    try {
      const fromEmail = process.env.FROM_EMAIL || "no-reply@theboatbrokers.co.uk";
      const when = new Date(booking.slot.startsAt).toLocaleString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "numeric",
        minute: "2-digit",
      });
      const response = await resend.emails.send({
        from: `Boat Brokers <${fromEmail}>`,
        to: booking.buyer.email,
        subject: `Your viewing for ${booking.boat.name} is confirmed`,
        text: `Hi ${booking.buyer.firstName},

Your viewing for "${booking.boat.name}" has been confirmed for ${when}.

We look forward to seeing you!

The Boat Brokers Team`,
      });
      if (response.error) {
        console.error("Resend API Error object:", response.error);
      }
    } catch (err) {
      console.error("Exception sending booking confirmation email:", err);
    }
  }

  res.json(serializeBooking(booking));
}
