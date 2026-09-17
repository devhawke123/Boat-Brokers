import type { Request, Response } from "express";
import {
  addListingComment,
  createListing,
  deleteListing,
  findAllListings,
  findListingById,
  updateListingStatus,
} from "../models/boatListing.model";
import {
  createBoatListingSchema,
  createListingCommentSchema,
  updateListingStatusSchema,
} from "../schemas/boatListing.schema";
import { serializeListing } from "../views/boatListing.view";

export async function listListings(_req: Request, res: Response) {
  const listings = await findAllListings();
  res.json(listings.map(serializeListing));
}

export async function getListing(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid listing id" });

  const listing = await findListingById(id);
  if (!listing) return res.status(404).json({ error: "Listing not found" });
  res.json(serializeListing(listing));
}

export async function createListingHandler(req: Request, res: Response) {
  const parsed = createBoatListingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { boatId, sellerId, ...preferences } = parsed.data;
  const listing = await createListing(boatId, sellerId, preferences);
  res.status(201).json(serializeListing(listing));
}

export async function deleteListingHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid listing id" });

  const existing = await findListingById(id);
  if (!existing) return res.status(404).json({ error: "Listing not found" });

  await deleteListing(id);
  res.status(204).send();
}

export async function updateListingStatusHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid listing id" });

  const parsed = updateListingStatusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const existing = await findListingById(id);
  if (!existing) return res.status(404).json({ error: "Listing not found" });

  const listing = await updateListingStatus(id, parsed.data.status);
  res.json(serializeListing(listing));
}

export async function addListingCommentHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid listing id" });

  const parsed = createListingCommentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const listing = await findListingById(id);
  if (!listing) return res.status(404).json({ error: "Listing not found" });

  const { content, author, parentId, fromSeller } = parsed.data;
  if (parentId !== undefined && !listing.comments.some((comment) => comment.id === parentId)) {
    return res.status(400).json({ error: "Comment being replied to was not found on this listing" });
  }

  const comment = await addListingComment(id, content, author, { parentId, fromSeller });
  res.status(201).json(comment);
}
