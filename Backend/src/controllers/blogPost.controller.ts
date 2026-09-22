import type { Request, Response } from "express";
import {
  createBlogPost,
  deleteBlogPost,
  findAllBlogPosts,
  findAllBlogPostsAdmin,
  findBlogPostById,
  findBlogPostBySlug,
  updateBlogPost,
} from "../models/blogPost.model";
import { createBlogPostSchema, updateBlogPostSchema } from "../schemas/blogPost.schema";
import { serializeBlogPostAdmin, serializeBlogPostDetail, serializeBlogPostSummary } from "../views/blogPost.view";

export async function listBlogPosts(_req: Request, res: Response) {
  const posts = await findAllBlogPosts();
  res.json(posts.map(serializeBlogPostSummary));
}

export async function getBlogPostBySlug(req: Request, res: Response) {
  const post = await findBlogPostBySlug(String(req.params.slug));
  if (!post) return res.status(404).json({ error: "Blog post not found" });
  res.json(serializeBlogPostDetail(post));
}

// Admin — every post (see findAllBlogPostsAdmin), full fields, no excerpt truncation.

export async function listBlogPostsAdminHandler(_req: Request, res: Response) {
  const posts = await findAllBlogPostsAdmin();
  res.json(posts.map(serializeBlogPostAdmin));
}

export async function getBlogPostAdminHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid blog post id" });

  const post = await findBlogPostById(id);
  if (!post) return res.status(404).json({ error: "Blog post not found" });
  res.json(serializeBlogPostAdmin(post));
}

export async function createBlogPostHandler(req: Request, res: Response) {
  const parsed = createBlogPostSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const file = req.file;
  const post = await createBlogPost({
    ...parsed.data,
    imageUrl: file ? `/uploads/blogs/${file.filename}` : undefined,
  });
  res.status(201).json(serializeBlogPostAdmin(post));
}

export async function updateBlogPostHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid blog post id" });

  const parsed = updateBlogPostSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const existing = await findBlogPostById(id);
  if (!existing) return res.status(404).json({ error: "Blog post not found" });

  const file = req.file;
  const post = await updateBlogPost(id, {
    ...parsed.data,
    ...(file ? { imageUrl: `/uploads/blogs/${file.filename}` } : {}),
  });
  res.json(serializeBlogPostAdmin(post));
}

export async function deleteBlogPostHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid blog post id" });

  const existing = await findBlogPostById(id);
  if (!existing) return res.status(404).json({ error: "Blog post not found" });

  await deleteBlogPost(id);
  res.status(204).send();
}
