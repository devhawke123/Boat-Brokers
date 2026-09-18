import { Router } from "express";
import {
  addListingCommentHandler,
  createListingHandler,
  deleteListingHandler,
  getListing,
  listListings,
  updateListingStatusHandler,
  updateListingPreferencesHandler,
} from "../controllers/boatListing.controller";

export const boatListingsRouter = Router();

boatListingsRouter.get("/", listListings);
boatListingsRouter.get("/:id", getListing);
boatListingsRouter.post("/", createListingHandler);
boatListingsRouter.delete("/:id", deleteListingHandler);
boatListingsRouter.patch("/:id/status", updateListingStatusHandler);
boatListingsRouter.patch("/:id/preferences", updateListingPreferencesHandler);
boatListingsRouter.post("/:id/comments", addListingCommentHandler);
