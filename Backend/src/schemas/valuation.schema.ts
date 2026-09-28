import { z } from "zod";

export const createValuationRequestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1).optional(),
  boatName: z.string().min(1),
  message: z.string().min(1),
});

export type CreateValuationRequestInput = z.infer<typeof createValuationRequestSchema>;
