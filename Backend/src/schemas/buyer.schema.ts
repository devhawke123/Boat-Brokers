import { z } from "zod";

export const createBuyerSchema = z.object({
  firstName: z.string().min(1),
  surname: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1).optional(),
});

export const updateBuyerSchema = createBuyerSchema.partial();

export const updateBuyerStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "VIEWING_BOOKED", "WON", "LOST"]),
});

export type CreateBuyerInput = z.infer<typeof createBuyerSchema>;
export type UpdateBuyerInput = z.infer<typeof updateBuyerSchema>;
export type UpdateBuyerStatusInput = z.infer<typeof updateBuyerStatusSchema>;
