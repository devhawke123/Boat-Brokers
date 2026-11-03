import { Router } from "express";
import {
  changeSellerPasswordHandler,
  createSellerHandler,
  deleteSellerHandler,
  forgotSellerPasswordHandler,
  getSeller,
  listSellers,
  resetSellerPasswordHandler,
  sellerLoginHandler,
  updateSellerHandler,
  updateSellerStatusHandler,
  uploadSellerAvatarHandler,
} from "../controllers/seller.controller";
import { uploadSellerAvatar } from "../lib/upload";

export const sellersRouter = Router();

sellersRouter.get("/", listSellers);
sellersRouter.post("/login", sellerLoginHandler);
sellersRouter.post("/forgot-password", forgotSellerPasswordHandler);
sellersRouter.post("/reset-password", resetSellerPasswordHandler);
sellersRouter.get("/:id", getSeller);
sellersRouter.post("/", createSellerHandler);
sellersRouter.put("/:id", updateSellerHandler);
sellersRouter.delete("/:id", deleteSellerHandler);
sellersRouter.put("/:id/password", changeSellerPasswordHandler);
sellersRouter.patch("/:id/status", updateSellerStatusHandler);

sellersRouter.post("/:id/avatar", (req, res, next) => {
  uploadSellerAvatar(req, res, (err: unknown) => {
    if (err) return res.status(400).json({ error: err instanceof Error ? err.message : "Upload failed" });
    uploadSellerAvatarHandler(req, res).catch(next);
  });
});
