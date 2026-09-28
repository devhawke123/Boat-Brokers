import { Router } from "express";
import { createValuationRequestHandler } from "../controllers/valuation.controller";

export const valuationRouter = Router();

valuationRouter.post("/", createValuationRequestHandler);
