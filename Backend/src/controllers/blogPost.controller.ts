import type { Request, Response } from "express";
import { findAllBlogPosts, findBlogPostBySlug } from "../models/blogPost.model";
import { serializeBlogPostDetail, serializeBlogPostSummary } from "../views/blogPost.view";

export async function listBlogPosts(_req: Request, res: Response) {
  const posts = await findAllBlogPosts();
  res.json(posts.map(serializeBlogPostSummary));
}

export async function getBlogPostBySlug(req: Request, res: Response) {
  const post = await findBlogPostBySlug(String(req.params.slug));
  if (!post) return res.status(404).json({ error: "Blog post not found" });
  res.json(serializeBlogPostDetail(post));
}
