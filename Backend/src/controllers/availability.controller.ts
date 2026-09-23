import type { Request, Response } from "express";
import { createSlot, deleteSlot, findAllSlots, findSlotById } from "../models/availability.model";
import { createAvailabilitySlotSchema } from "../schemas/availability.schema";
import { serializeSlot } from "../views/availability.view";

export async function listSlots(_req: Request, res: Response) {
  const slots = await findAllSlots();
  res.json(slots.map(serializeSlot));
}

export async function createSlotHandler(req: Request, res: Response) {
  const parsed = createAvailabilitySlotSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const startsAt = new Date(parsed.data.startsAt);
  const endsAt = new Date(startsAt.getTime() + parsed.data.durationHours * 60 * 60 * 1000);
  const slot = await createSlot(startsAt, endsAt);
  res.status(201).json(serializeSlot({ ...slot, bookings: [] }));
}

export async function deleteSlotHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid slot id" });

  const existing = await findSlotById(id);
  if (!existing) return res.status(404).json({ error: "Slot not found" });
  if (existing.bookings.length > 0) {
    return res.status(400).json({ error: "Can't delete a slot with an active booking request." });
  }

  await deleteSlot(id);
  res.status(204).send();
}
