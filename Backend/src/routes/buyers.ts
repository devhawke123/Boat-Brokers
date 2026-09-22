import { Router } from "express";
import {
  createBuyerHandler,
  deleteBuyerHandler,
  getBuyer,
  listBuyers,
  updateBuyerHandler,
  updateBuyerStatusHandler,
} from "../controllers/buyer.controller";

export const buyersRouter = Router();

buyersRouter.get("/", listBuyers);
buyersRouter.get("/:id", getBuyer);
buyersRouter.post("/", createBuyerHandler);
buyersRouter.put("/:id", updateBuyerHandler);
buyersRouter.delete("/:id", deleteBuyerHandler);
buyersRouter.patch("/:id/status", updateBuyerStatusHandler);
