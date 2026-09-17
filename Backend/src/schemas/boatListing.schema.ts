import { z } from "zod";

export const createBoatListingSchema = z.object({
  boatId: z.number().int().positive(),
  sellerId: z.number().int().positive(),
  sellTimeline: z.string().min(1).optional(),
  contactTime: z.string().min(1).optional(),
  listerType: z.string().min(1).optional(),
  additionalNotes: z.string().min(1).optional(),
  agreedToContact: z.boolean().optional(),
});

export const createListingCommentSchema = z.object({
  content: z.string().min(1),
  author: z.string().min(1).optional(),
  // Present when this is a reply to an existing top-level comment on the same listing.
  parentId: z.number().int().positive().optional(),
  fromSeller: z.boolean().optional(),
});

export const updateListingStatusSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

export type CreateBoatListingInput = z.infer<typeof createBoatListingSchema>;
export type CreateListingCommentInput = z.infer<typeof createListingCommentSchema>;
export type UpdateListingStatusInput = z.infer<typeof updateListingStatusSchema>;
