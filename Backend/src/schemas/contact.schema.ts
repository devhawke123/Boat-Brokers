import { z } from "zod";

export const createContactMessageSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1).optional(),
  message: z.string().min(1),
});

export type CreateContactMessageInput = z.infer<typeof createContactMessageSchema>;
