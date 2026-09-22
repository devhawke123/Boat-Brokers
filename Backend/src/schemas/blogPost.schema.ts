import { z } from "zod";

export const createBlogPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  readTime: z.string().min(1),
  author: z.string().min(1),
  date: z.string().min(1),
  // Optional — auto-generated from the title when omitted (see blogPost.model.ts).
  slug: z.string().min(1).optional(),
});

export const updateBlogPostSchema = createBlogPostSchema.partial();

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
