import { z } from "zod";

// Viewing slots are always 2 hours — no admin-facing control for it.
export const SLOT_DURATION_HOURS = [2] as const;

export const createAvailabilitySlotSchema = z.object({
  // ISO datetime for the start of the block; endsAt is derived server-side
  // from durationHours.
  startsAt: z.string().datetime(),
  durationHours: z
    .number()
    .refine((value): value is (typeof SLOT_DURATION_HOURS)[number] => SLOT_DURATION_HOURS.includes(value as never), {
      message: `durationHours must be one of ${SLOT_DURATION_HOURS.join(", ")}`,
    })
    .default(2),
});

export type CreateAvailabilitySlotInput = z.infer<typeof createAvailabilitySlotSchema>;
