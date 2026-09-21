import type { Prisma } from "@prisma/client";
import type { Request, Response } from "express";
import { createBoatWithListing, findAllBoats, findBoatById, updateBoat } from "../models/boat.model";
import { createBoatSchema, updateBoatSchema } from "../schemas/boat.schema";
import { serializeBoat } from "../views/boat.view";
import { serializeListing } from "../views/boatListing.view";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
      cost: price ? `$${price}` : "",
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
    const fromEmail = process.env.FROM_EMAIL || 'no-reply@theboatbrokers.co.uk';
    const toEmail = process.env.CONTACT_EMAIL;
    
    console.log("Email Config:");
    console.log("FROM_EMAIL:", fromEmail);
    console.log("CONTACT_EMAIL:", toEmail);
    console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);

    if (toEmail) {
      const response = await resend.emails.send({
        from: `Boat Brokers <${fromEmail}>`,
        to: toEmail,
        replyTo: boat.seller.email,
        subject: `New Boat Published: ${boat.name}`,
        text: `A new boat "${boat.name}" has been published by ${boat.seller.name}.
Listing ID: ${listing.id}`,
      });
      
      console.log("Resend API Response:", JSON.stringify(response, null, 2));
      
      if (response.error) {
        console.error("Resend API Error object:", response.error);
      }
    } else {
      console.warn("Skipping publish email: CONTACT_EMAIL is not set in environment variables.");
    }
  } catch (err) {
    console.error("Exception during publish email send:", err);
  }

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

  // If price is provided, also update cost string
  if (mappedFields.price !== undefined) {
    mappedFields.cost = `$${mappedFields.price}`;
  }

  // Keep name and boatName in sync
  if (mappedFields.name) mappedFields.boatName = mappedFields.name;

  const boat = await updateBoat(
    id,
    mappedFields as Prisma.BoatUncheckedUpdateInput,
    newImagePaths,
    newBrochureUrl,
    customFields,
  );

  res.json(serializeBoat(boat));
}
