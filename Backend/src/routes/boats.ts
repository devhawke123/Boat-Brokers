import { Router } from "express";
import { createBoatHandler, getBoat, listBoats } from "../controllers/boat.controller";
import { uploadBoatMedia } from "../lib/upload";

export const boatsRouter = Router();

boatsRouter.get("/", listBoats);
boatsRouter.get("/:id", getBoat);

boatsRouter.post("/", (req, res, next) => {
  uploadBoatMedia(req, res, (err: unknown) => {
    if (err) return res.status(400).json({ error: err instanceof Error ? err.message : "Upload failed" });
    createBoatHandler(req, res).catch(next);
  });
});
