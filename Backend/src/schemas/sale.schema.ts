import { z } from "zod";

export const createSaleSchema = z.object({
  boatId: z.number().int().positive(),
  sellerId: z.number().int().positive(),
  buyerId: z.number().int().positive(),
  soldPrice: z.number().int().nonnegative(),
  deposit: z.number().int().nonnegative().optional(),
  commission: z.number().int().nonnegative().optional(),
});

export const updateSaleSchema = z.object({
  boatId: z.number().int().positive().optional(),
  sellerId: z.number().int().positive().optional(),
  buyerId: z.number().int().positive().optional(),
  soldPrice: z.number().int().nonnegative().optional(),
  deposit: z.number().int().nonnegative().optional(),
  commission: z.number().int().nonnegative().optional(),
});

export const updateSaleStatusSchema = z.object({
  status: z.enum(["CURRENT", "COMPLETED", "CANCELLED"]),
});

export type CreateSaleInput = z.infer<typeof createSaleSchema>;
export type UpdateSaleInput = z.infer<typeof updateSaleSchema>;
export type UpdateSaleStatusInput = z.infer<typeof updateSaleStatusSchema>;
