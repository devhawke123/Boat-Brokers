import { z } from "zod";

// Half-hour steps from 30 minutes up to 14 hours (covers 10:00–24:00).
const HALF_HOUR = 0.5;
const MIN_HOURS = 0.5;
const MAX_HOURS = 14;

function isHalfHourDuration(value: number) {
  return value >= MIN_HOURS && value <= MAX_HOURS && Number.isInteger(value * 2);
}

export const createAvailabilitySlotSchema = z.object({
  // ISO datetime for the start of the first day's window; endsAt is derived
  // server-side from durationHours. Optional endDate (YYYY-MM-DD, UK calendar)
  // repeats the same wall-clock window through that day inclusive.
  startsAt: z.string().datetime(),
  durationHours: z
    .number()
    .refine(isHalfHourDuration, {
      message: `durationHours must be a multiple of ${HALF_HOUR} between ${MIN_HOURS} and ${MAX_HOURS}`,
    })
    .default(2),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "endDate must be YYYY-MM-DD")
    .optional(),
  // Omit / null / [] = all boats. Otherwise at least one published boat id.
  boatIds: z.array(z.number().int().positive()).nullable().optional(),
});

export type CreateAvailabilitySlotInput = z.infer<typeof createAvailabilitySlotSchema>;
