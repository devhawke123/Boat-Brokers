import { Router } from "express";
import {
  createSaleHandler,
  deleteSaleHandler,
  getSale,
  listSales,
  updateSaleHandler,
  updateSaleStatusHandler,
} from "../controllers/sale.controller";

export const salesRouter = Router();

salesRouter.get("/", listSales);
salesRouter.get("/:id", getSale);
salesRouter.post("/", createSaleHandler);
salesRouter.put("/:id", updateSaleHandler);
salesRouter.delete("/:id", deleteSaleHandler);
salesRouter.patch("/:id/status", updateSaleStatusHandler);
