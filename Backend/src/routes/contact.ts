import { Router } from "express";
import { createContactMessageHandler } from "../controllers/contact.controller";

export const contactRouter = Router();

contactRouter.post("/", createContactMessageHandler);
