import { Router } from "express";
import {
  createBoatHandler,
  deleteBoatHandler,
  getBoat,
  listBoats,
  restoreBoatHandler,
  updateBoatHandler,
} from "../controllers/boat.controller";
import { uploadBoatMedia } from "../lib/upload";

export const boatsRouter = Router();

boatsRouter.get("/", listBoats);
boatsRouter.get("/:id", getBoat);
boatsRouter.delete("/:id", deleteBoatHandler);
boatsRouter.patch("/:id/restore", restoreBoatHandler);

boatsRouter.post("/", (req, res, next) => {
  uploadBoatMedia(req, res, (err: unknown) => {
    if (err) return res.status(400).json({ error: err instanceof Error ? err.message : "Upload failed" });
    createBoatHandler(req, res).catch(next);
  });
});

boatsRouter.patch("/:id", (req, res, next) => {
  uploadBoatMedia(req, res, (err: unknown) => {
    if (err) return res.status(400).json({ error: err instanceof Error ? err.message : "Upload failed" });
    updateBoatHandler(req, res).catch(next);
  });
});

