import { z } from "zod";

export const createAvailabilitySlotSchema = z.object({
  // ISO datetime for the start of the 2-hour block; endsAt is derived server-side.
  startsAt: z.string().datetime(),
});

export type CreateAvailabilitySlotInput = z.infer<typeof createAvailabilitySlotSchema>;
