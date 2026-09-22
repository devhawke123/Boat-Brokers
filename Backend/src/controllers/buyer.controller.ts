import type { Request, Response } from "express";
import {
  createBuyer,
  deleteBuyer,
  findAllBuyers,
  findBuyerByEmail,
  findBuyerById,
  updateBuyer,
  updateBuyerStatus,
} from "../models/buyer.model";
import { createBuyerSchema, updateBuyerSchema, updateBuyerStatusSchema } from "../schemas/buyer.schema";
import { serializeBuyer } from "../views/buyer.view";

export async function listBuyers(_req: Request, res: Response) {
  const buyers = await findAllBuyers();
  res.json(buyers.map(serializeBuyer));
}

export async function getBuyer(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid buyer id" });

  const buyer = await findBuyerById(id);
  if (!buyer) return res.status(404).json({ error: "Buyer not found" });
  res.json(serializeBuyer(buyer));
}

export async function createBuyerHandler(req: Request, res: Response) {
  const parsed = createBuyerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const existing = await findBuyerByEmail(parsed.data.email);
  if (existing) return res.status(409).json({ error: "A buyer with that email already exists" });

  const buyer = await createBuyer({ ...parsed.data, source: "Manual" });
  const withBookings = await findBuyerById(buyer.id);
  res.status(201).json(serializeBuyer(withBookings!));
}

export async function updateBuyerHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid buyer id" });

  const parsed = updateBuyerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const existing = await findBuyerById(id);
  if (!existing) return res.status(404).json({ error: "Buyer not found" });

  await updateBuyer(id, parsed.data);
  const withBookings = await findBuyerById(id);
  res.json(serializeBuyer(withBookings!));
}

export async function updateBuyerStatusHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid buyer id" });

  const parsed = updateBuyerStatusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const existing = await findBuyerById(id);
  if (!existing) return res.status(404).json({ error: "Buyer not found" });

  await updateBuyerStatus(id, parsed.data.status);
  const withBookings = await findBuyerById(id);
  res.json(serializeBuyer(withBookings!));
}

export async function deleteBuyerHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid buyer id" });

  const existing = await findBuyerById(id);
  if (!existing) return res.status(404).json({ error: "Buyer not found" });

  await deleteBuyer(id);
  res.status(204).send();
}
