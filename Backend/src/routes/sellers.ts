import { Router } from "express";
import {
  createSellerHandler,
  deleteSellerHandler,
  getSeller,
  listSellers,
  sellerLoginHandler,
  updateSellerHandler,
} from "../controllers/seller.controller";

export const sellersRouter = Router();

sellersRouter.get("/", listSellers);
sellersRouter.post("/login", sellerLoginHandler);
sellersRouter.get("/:id", getSeller);
sellersRouter.post("/", createSellerHandler);
sellersRouter.put("/:id", updateSellerHandler);
sellersRouter.delete("/:id", deleteSellerHandler);
