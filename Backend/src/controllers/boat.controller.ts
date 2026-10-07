import type { Prisma } from "@prisma/client";
import type { Request, Response } from "express";
import {
  MAX_FEATURED_BOATS,
  countFeaturedBoats,
  createBoatWithListing,
  findAllBoats,
  findBoatById,
  restoreBoat,
  softDeleteBoat,
  updateBoat,
} from "../models/boat.model";
import { createBoatSchema, updateBoatSchema } from "../schemas/boat.schema";
import { serializeBoat } from "../views/boat.view";
import { serializeListing } from "../views/boatListing.view";
import { sendAdminEmail, sendBoatSoldEmail, sendListingSubmittedEmail } from "../lib/email";

export async function listBoats(req: Request, res: Response) {
  const includeDeleted = req.query.includeDeleted === "true";
  const boats = await findAllBoats({ includeDeleted });
  res.json(boats.map(serializeBoat));
}

export async function getBoat(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid boat id" });

  const includeDeleted = req.query.includeDeleted === "true";
  const boat = await findBoatById(id, { includeDeleted });
  if (!boat) return res.status(404).json({ error: "Boat not found" });
  res.json(serializeBoat(boat));
}

export async function deleteBoatHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid boat id" });

  const existing = await findBoatById(id, { includeDeleted: true });
  if (!existing) return res.status(404).json({ error: "Boat not found" });

  const boat = await softDeleteBoat(id);
  res.json(serializeBoat(boat));
}

export async function restoreBoatHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid boat id" });

  const existing = await findBoatById(id, { includeDeleted: true });
  if (!existing) return res.status(404).json({ error: "Boat not found" });

  const boat = await restoreBoat(id);
  res.json(serializeBoat(boat));
}

export async function createBoatHandler(req: Request, res: Response) {
  const parsed = createBoatSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  // `customFields` must be destructured out: `...specs` is spread straight into
  // prisma.boat.create, and it's a relation rather than a column on Boat.
  const {
    sellerId,
    name,
    price,
    sellTimeline,
    contactTime,
    listerType,
    additionalNotes,
    agreedToContact,
    customFields,
    ...specs
  } = parsed.data;

  const files = (req.files as { photos?: Express.Multer.File[]; brochure?: Express.Multer.File[] } | undefined) ?? {};
  const imagePaths = (files.photos ?? []).map((file) => `/uploads/boats/${file.filename}`);
  const brochureFile = files.brochure?.[0];
  const brochureUrl = brochureFile ? `/uploads/brochures/${brochureFile.filename}` : undefined;

  const { boat, listing } = await createBoatWithListing(
    sellerId,
    {
      name,
      boatName: name,
      cost: price ? `£${Number(price).toLocaleString("en-GB")}` : "",
      price: price ?? null,
      imageUrl: imagePaths[0] ?? null,
      brochureUrl: brochureUrl ?? null,
      ...specs,
    },
    imagePaths,
    { sellTimeline, contactTime, listerType, additionalNotes, agreedToContact },
    customFields ?? [],
  );

  try {
    if (process.env.CONTACT_EMAIL) {
      const response = await sendAdminEmail({
        subject: `New Boat Published: ${boat.name}`,
        eyebrow: "New Listing",
        heading: `New boat submitted: ${boat.name}`,
        details: [
          { label: "Boat", value: boat.name },
          { label: "Seller", value: boat.seller.name },
          { label: "Email", value: boat.seller.email, href: `mailto:${boat.seller.email}` },
          { label: "Listing ID", value: String(listing.id) },
        ],
        replyTo: boat.seller.email,
        replyLabel: `Reply to ${boat.seller.name}`,
      });

      if (response.error) {
        console.error("Resend API Error object:", response.error);
      }
    } else {
      console.warn("Skipping publish email: CONTACT_EMAIL is not set in environment variables.");
    }
  } catch (err) {
    console.error("Exception during publish email send:", err);
  }

  await sendListingSubmittedEmail({
    to: boat.seller.email,
    sellerName: boat.seller.name,
    boatName: boat.name,
    status: listing.status,
  });

  res.status(201).json({ boat: serializeBoat(boat), listing: serializeListing(listing) });
}

export async function updateBoatHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid boat id" });

  const existing = await findBoatById(id);
  if (!existing) return res.status(404).json({ error: "Boat not found" });

  const parsed = updateBoatSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const {
    customFields,
    mainImageId,
    mainNewPhotoIndex,
    sellTimeline: _sellTimeline,
    contactTime: _contactTime,
    listerType: _listerType,
    additionalNotes: _additionalNotes,
    agreedToContact: _agreedToContact,
    ...boatFields
  } = parsed.data;

  const files = (req.files as { photos?: Express.Multer.File[]; brochure?: Express.Multer.File[] } | undefined) ?? {};
  const newImagePaths = (files.photos ?? []).map((file) => `/uploads/boats/${file.filename}`);
  const brochureFile = files.brochure?.[0];
  const newBrochureUrl = brochureFile ? `/uploads/brochures/${brochureFile.filename}` : undefined;

  // Map frontend field names to DB column names (same as createBoatHandler)
  const FIELD_MAP: Record<string, string> = {
    length: "lengthBeam",
    berths: "noOfBerths",
    stern: "sternType",
    steel: "steelSpec",
  };
  const mappedFields: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(boatFields)) {
    if (value === undefined) continue;
    mappedFields[FIELD_MAP[key] ?? key] = value;
  }

  // Featured boats: sold / under-offer boats can't be featured, and at most
  // MAX_FEATURED_BOATS boats may be featured at once.
  if (mappedFields.isFeatured === true) {
    const isSold = (mappedFields.isSold as boolean | undefined) ?? existing.isSold;
    const isUnderOffer = (mappedFields.isUnderOffer as boolean | undefined) ?? existing.isUnderOffer;
    if (isSold || isUnderOffer) {
      return res.status(400).json({ error: "Boats that are under offer or sold cannot be featured." });
    }
    if (!existing.isFeatured && (await countFeaturedBoats(id)) >= MAX_FEATURED_BOATS) {
      return res.status(400).json({ error: `You can only have ${MAX_FEATURED_BOATS} featured boats at a time.` });
    }
  }

  // If price is provided, also update cost string
  if (mappedFields.price !== undefined) {
    mappedFields.cost = `£${Number(mappedFields.price).toLocaleString("en-GB")}`;
  }

  // Keep name and boatName in sync
  if (mappedFields.name) mappedFields.boatName = mappedFields.name;

  const boat = await updateBoat(
    id,
    mappedFields as Prisma.BoatUncheckedUpdateInput,
    newImagePaths,
    newBrochureUrl,
    customFields,
    mainImageId,
    mainNewPhotoIndex !== undefined ? newImagePaths[mainNewPhotoIndex] : undefined,
  );

  // Email only on the false -> true transition, not on every subsequent edit
  // of an already-sold boat.
  if (mappedFields.isSold === true && !existing.isSold) {
    await sendBoatSoldEmail({
      to: boat.seller.email,
      sellerName: boat.seller.name,
      boatName: boat.name,
    });
  }

  res.json(serializeBoat(boat));
}
