import { z } from "zod";

export const createSellerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
});

export const updateSellerSchema = createSellerSchema.partial();

export const sellerLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const changeSellerPasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export const updateSellerStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "LISTED", "LOST"]),
});

export type CreateSellerInput = z.infer<typeof createSellerSchema>;
export type UpdateSellerInput = z.infer<typeof updateSellerSchema>;
export type SellerLoginInput = z.infer<typeof sellerLoginSchema>;
export type ChangeSellerPasswordInput = z.infer<typeof changeSellerPasswordSchema>;
export type UpdateSellerStatusInput = z.infer<typeof updateSellerStatusSchema>;
