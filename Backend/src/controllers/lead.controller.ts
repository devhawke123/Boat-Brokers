import type { Request, Response } from "express";
import { createLead, deleteLead, findAllLeads, findLeadById, updateLead } from "../models/lead.model";
import { createLeadSchema, updateLeadSchema, updateLeadStatusSchema } from "../schemas/lead.schema";

export async function listLeads(_req: Request, res: Response) {
  const leads = await findAllLeads();
  res.json(leads);
}

export async function getLead(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid lead id" });

  const lead = await findLeadById(id);
  if (!lead) return res.status(404).json({ error: "Lead not found" });
  res.json(lead);
}

export async function createLeadHandler(req: Request, res: Response) {
  const parsed = createLeadSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const lead = await createLead(parsed.data);
  res.status(201).json(lead);
}

export async function updateLeadHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid lead id" });

  const parsed = updateLeadSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const existing = await findLeadById(id);
  if (!existing) return res.status(404).json({ error: "Lead not found" });

  const lead = await updateLead(id, parsed.data);
  res.json(lead);
}

export async function updateLeadStatusHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid lead id" });

  const parsed = updateLeadStatusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const existing = await findLeadById(id);
  if (!existing) return res.status(404).json({ error: "Lead not found" });

  const lead = await updateLead(id, { status: parsed.data.status });
  res.json(lead);
}

export async function deleteLeadHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid lead id" });

  const existing = await findLeadById(id);
  if (!existing) return res.status(404).json({ error: "Lead not found" });

  await deleteLead(id);
  res.status(204).send();
}
