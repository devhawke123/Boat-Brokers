import type { Request, Response } from "express";
import { verifyPassword } from "../lib/password";
import { findAdminByEmail } from "../models/admin.model";
import { adminLoginSchema } from "../schemas/admin.schema";
import { serializeAdmin } from "../views/admin.view";

export async function adminLoginHandler(req: Request, res: Response) {
  const parsed = adminLoginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const admin = await findAdminByEmail(parsed.data.email);
  if (!admin || !admin.password || !verifyPassword(parsed.data.password, admin.password)) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  res.json(serializeAdmin(admin));
}
