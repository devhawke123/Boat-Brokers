import type { Request, Response } from "express";
import { createSale, deleteSale, findAllSales, findSaleById, updateSale } from "../models/sale.model";
import { createSaleSchema, updateSaleSchema, updateSaleStatusSchema } from "../schemas/sale.schema";
import { serializeSale } from "../views/sale.view";

export async function listSales(_req: Request, res: Response) {
  const sales = await findAllSales();
  res.json(sales.map(serializeSale));
}

export async function getSale(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid sale id" });

  const sale = await findSaleById(id);
  if (!sale) return res.status(404).json({ error: "Sale not found" });
  res.json(serializeSale(sale));
}

export async function createSaleHandler(req: Request, res: Response) {
  const parsed = createSaleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const sale = await createSale(parsed.data);
  res.status(201).json(serializeSale(sale));
}

export async function updateSaleHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid sale id" });

  const parsed = updateSaleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const existing = await findSaleById(id);
  if (!existing) return res.status(404).json({ error: "Sale not found" });

  const sale = await updateSale(id, parsed.data);
  res.json(serializeSale(sale));
}

export async function updateSaleStatusHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid sale id" });

  const parsed = updateSaleStatusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const existing = await findSaleById(id);
  if (!existing) return res.status(404).json({ error: "Sale not found" });

  const sale = await updateSale(id, { status: parsed.data.status });
  res.json(serializeSale(sale));
}

export async function deleteSaleHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid sale id" });

  const existing = await findSaleById(id);
  if (!existing) return res.status(404).json({ error: "Sale not found" });

  await deleteSale(id);
  res.status(204).send();
}
