import { Router } from "express";
import { createSlotHandler, deleteSlotHandler, listSlots } from "../controllers/availability.controller";

export const availabilityRouter = Router();

availabilityRouter.get("/", listSlots);
availabilityRouter.post("/", createSlotHandler);
availabilityRouter.delete("/:id", deleteSlotHandler);
