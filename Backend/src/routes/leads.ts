import { Router } from "express";
import {
  createLeadHandler,
  deleteLeadHandler,
  getLead,
  listLeads,
  updateLeadHandler,
  updateLeadStatusHandler,
} from "../controllers/lead.controller";

export const leadsRouter = Router();

leadsRouter.get("/", listLeads);
leadsRouter.get("/:id", getLead);
leadsRouter.post("/", createLeadHandler);
leadsRouter.put("/:id", updateLeadHandler);
leadsRouter.delete("/:id", deleteLeadHandler);
leadsRouter.patch("/:id/status", updateLeadStatusHandler);
