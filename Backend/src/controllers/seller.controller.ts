import { createHash, randomBytes } from "crypto";
import type { Request, Response } from "express";
import { hashPassword, verifyPassword } from "../lib/password";
import {
  createSeller,
  deleteSeller,
  findAllSellers,
  findSellerByEmail,
  findSellerById,
  findSellerByPasswordResetToken,
  updateSeller,
} from "../models/seller.model";
import {
  changeSellerPasswordSchema,
  createSellerSchema,
  forgotSellerPasswordSchema,
  resetSellerPasswordSchema,
  sellerLoginSchema,
  updateSellerSchema,
  updateSellerStatusSchema,
} from "../schemas/seller.schema";
import { serializeSeller } from "../views/seller.view";
import {
  sendSellerPasswordChangedEmail,
  sendSellerPasswordResetEmail,
  sendSellerWelcomeEmail,
} from "../lib/email";
import { publicSiteOrigin } from "../lib/publicOrigin";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function listSellers(_req: Request, res: Response) {
  const sellers = await findAllSellers();
  res.json(sellers.map(serializeSeller));
}

export async function getSeller(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid seller id" });

  const seller = await findSellerById(id);
  if (!seller) return res.status(404).json({ error: "Seller not found" });
  res.json(serializeSeller(seller));
}

export async function createSellerHandler(req: Request, res: Response) {
  const parsed = createSellerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const existing = await findSellerByEmail(parsed.data.email);
  if (existing) return res.status(409).json({ error: "Email already in use" });

  const seller = await createSeller({
    ...parsed.data,
    password: hashPassword(parsed.data.password),
  });
  await sendSellerWelcomeEmail({ to: seller.email, sellerName: seller.name });
  res.status(201).json(serializeSeller(seller));
}

export async function updateSellerHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid seller id" });

  const parsed = updateSellerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const existing = await findSellerById(id);
  if (!existing) return res.status(404).json({ error: "Seller not found" });

  const { password, ...rest } = parsed.data;
  const seller = await updateSeller(id, {
    ...rest,
    ...(password ? { password: hashPassword(password) } : {}),
  });
  if (password) {
    await sendSellerPasswordChangedEmail({
      to: seller.email,
      sellerName: seller.name,
      changedBy: "an administrator",
    });
  }
  res.json(serializeSeller(seller));
}

export async function deleteSellerHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid seller id" });

  const existing = await findSellerById(id);
  if (!existing) return res.status(404).json({ error: "Seller not found" });

  await deleteSeller(id);
  res.status(204).send();
}

export async function changeSellerPasswordHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid seller id" });

  const parsed = changeSellerPasswordSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const existing = await findSellerById(id);
  if (!existing) return res.status(404).json({ error: "Seller not found" });

  if (!existing.password || !verifyPassword(parsed.data.currentPassword, existing.password)) {
    return res.status(401).json({ error: "Current password is incorrect" });
  }

  await updateSeller(id, { password: hashPassword(parsed.data.newPassword) });
  await sendSellerPasswordChangedEmail({
    to: existing.email,
    sellerName: existing.name,
    changedBy: "you",
  });
  res.status(204).send();
}

export async function uploadSellerAvatarHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid seller id" });

  const existing = await findSellerById(id);
  if (!existing) return res.status(404).json({ error: "Seller not found" });

  const file = req.file;
  if (!file) return res.status(400).json({ error: "No avatar file was uploaded" });

  const seller = await updateSeller(id, { avatarUrl: `/uploads/sellers/${file.filename}` });
  res.json(serializeSeller(seller));
}

export async function updateSellerStatusHandler(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid seller id" });

  const parsed = updateSellerStatusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const existing = await findSellerById(id);
  if (!existing) return res.status(404).json({ error: "Seller not found" });

  const seller = await updateSeller(id, { status: parsed.data.status });
  res.json(serializeSeller(seller));
}

export async function sellerLoginHandler(req: Request, res: Response) {
  const parsed = sellerLoginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const seller = await findSellerByEmail(parsed.data.email);
  if (!seller || !seller.password || !verifyPassword(parsed.data.password, seller.password)) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  res.json(serializeSeller(seller));
}

// Always 204 — don't reveal whether the email exists.
export async function forgotSellerPasswordHandler(req: Request, res: Response) {
  const parsed = forgotSellerPasswordSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const seller = await findSellerByEmail(parsed.data.email.trim());

  if (seller) {
    const rawToken = randomBytes(32).toString("hex");
    await updateSeller(seller.id, {
      passwordResetToken: hashResetToken(rawToken),
      passwordResetExpires: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    });
    const resetUrl = `${publicSiteOrigin()}/seller-portal/reset-password?token=${encodeURIComponent(rawToken)}`;
    await sendSellerPasswordResetEmail({
      to: seller.email,
      sellerName: seller.name,
      resetUrl,
    });
  }

  res.status(204).send();
}

export async function resetSellerPasswordHandler(req: Request, res: Response) {
  const parsed = resetSellerPasswordSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const tokenHash = hashResetToken(parsed.data.token);
  const seller = await findSellerByPasswordResetToken(tokenHash);
  if (!seller || !seller.passwordResetExpires || seller.passwordResetExpires.getTime() < Date.now()) {
    return res.status(400).json({ error: "This reset link is invalid or has expired. Please request a new one." });
  }

  await updateSeller(seller.id, {
    password: hashPassword(parsed.data.password),
    passwordResetToken: null,
    passwordResetExpires: null,
  });
  await sendSellerPasswordChangedEmail({
    to: seller.email,
    sellerName: seller.name,
    changedBy: "you",
  });
  res.status(204).send();
}
