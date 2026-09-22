import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import {
  createBlogPostHandler,
  deleteBlogPostHandler,
  getBlogPostAdminHandler,
  listBlogPostsAdminHandler,
  updateBlogPostHandler,
} from "../controllers/blogPost.controller";
import { uploadBlogImage } from "../lib/upload";

export const blogAdminRouter = Router();

function withImageUpload(handler: (req: Request, res: Response) => Promise<unknown>) {
  return (req: Request, res: Response, next: NextFunction) => {
    uploadBlogImage(req, res, (err: unknown) => {
      if (err) return res.status(400).json({ error: err instanceof Error ? err.message : "Upload failed" });
      handler(req, res).catch(next);
    });
  };
}

blogAdminRouter.get("/", listBlogPostsAdminHandler);
blogAdminRouter.get("/:id", getBlogPostAdminHandler);
blogAdminRouter.post("/", withImageUpload(createBlogPostHandler));
blogAdminRouter.put("/:id", withImageUpload(updateBlogPostHandler));
blogAdminRouter.delete("/:id", deleteBlogPostHandler);
