import type { Request, Response } from "express";
import { createBoatWithListing, findAllBoats, findBoatById } from "../models/boat.model";
import { createBoatSchema } from "../schemas/boat.schema";
import { serializeBoat } from "../views/boat.view";
import { serializeListing } from "../views/boatListing.view";

export async function listBoats(_req: Request, res: Response) {
  const boats = await findAllBoats();
  res.json(boats.map(serializeBoat));
}

export async function getBoat(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid boat id" });

  const boat = await findBoatById(id);
  if (!boat) return res.status(404).json({ error: "Boat not found" });
  res.json(serializeBoat(boat));
}

export async function createBoatHandler(req: Request, res: Response) {
  const parsed = createBoatSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { sellerId, name, price, sellTimeline, contactTime, listerType, additionalNotes, agreedToContact, ...specs } =
    parsed.data;

  const files = (req.files as { photos?: Express.Multer.File[]; brochure?: Express.Multer.File[] } | undefined) ?? {};
  const imagePaths = (files.photos ?? []).map((file) => `/uploads/boats/${file.filename}`);
  const brochureFile = files.brochure?.[0];
  const brochureUrl = brochureFile ? `/uploads/brochures/${brochureFile.filename}` : undefined;

  const { boat, listing } = await createBoatWithListing(
    sellerId,
    {
      name,
      boatName: name,
      cost: price ? `$${price}` : "",
      price: price ?? null,
      imageUrl: imagePaths[0] ?? null,
      brochureUrl: brochureUrl ?? null,
      ...specs,
    },
    imagePaths,
    { sellTimeline, contactTime, listerType, additionalNotes, agreedToContact },
  );

  res.status(201).json({ boat: serializeBoat(boat), listing: serializeListing(listing) });
}
