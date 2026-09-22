import { Router } from "express";
import { adminLoginHandler } from "../controllers/admin.controller";

export const adminRouter = Router();

adminRouter.post("/login", adminLoginHandler);
