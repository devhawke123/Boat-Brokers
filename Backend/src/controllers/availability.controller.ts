import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import {
  expandSlotWindows,
  findAllSlots,
  findOverlappingSlot,
  findSlotById,
  ukDateKey,
  ukDateTimeToUtc,
} from "../models/availability.model";
import { toBoatIdsColumn } from "../lib/slotBoats";
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
  const startDate = ukDateKey(startsAt);
  const endDate = parsed.data.endDate ?? startDate;
  if (endDate < startDate) {
    return res.status(400).json({ error: "endDate must be on or after the start date." });
  }

  const boatIds = parsed.data.boatIds?.length ? [...new Set(parsed.data.boatIds)] : [];
  // Expand to one concrete day window each — capacity stays per day, not per series.
  const repeatsUntil = endDate > startDate ? ukDateTimeToUtc(endDate, "12:00") : null;
  const windows = expandSlotWindows(startsAt, endsAt, repeatsUntil);

  const overlap = await findOverlappingSlot(windows);
  if (overlap) {
    return res.status(409).json({ error: "This overlaps an existing slot." });
  }

  try {
    const created = await prisma.$transaction(
      windows.map((window) =>
        prisma.availabilitySlot.create({
          data: {
            startsAt: window.startsAt,
            endsAt: window.endsAt,
            boatIds: toBoatIdsColumn(boatIds),
            repeatsUntil: null,
          },
        }),
      ),
    );
    // Return the first day; admin UI reloads the full list afterward.
    res.status(201).json(serializeSlot({ ...created[0], bookings: [] }));
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return res.status(409).json({ error: "A slot already exists at that date and time." });
    }
    throw err;
  }
}

export async function deleteSlotHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid slot id" });

  const existing = await findSlotById(id);
  if (!existing) return res.status(404).json({ error: "Slot not found" });
  if (existing.bookings.length > 0) {
    return res.status(400).json({ error: "Can't delete a slot with an active booking request." });
  }

  await prisma.availabilitySlot.delete({ where: { id } });
  res.status(204).send();
}
