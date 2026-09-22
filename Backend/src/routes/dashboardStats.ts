import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboardStats.controller";

export const dashboardStatsRouter = Router();

dashboardStatsRouter.get("/dashboard-stats", getDashboardStats);
