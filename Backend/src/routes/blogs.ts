import { Router } from "express";
import { getBlogPostBySlug, listBlogPosts } from "../controllers/blogPost.controller";

export const blogsRouter = Router();

blogsRouter.get("/", listBlogPosts);
blogsRouter.get("/:slug", getBlogPostBySlug);
