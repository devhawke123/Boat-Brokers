import { z } from "zod";

export const createBookingSchema = z.object({
  boatId: z.number().int().positive(),
  slotId: z.number().int().positive(),
  firstName: z.string().min(1),
  surname: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1).optional(),
  notes: z.string().min(1).optional(),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
