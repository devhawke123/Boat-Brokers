import type { Request, Response } from "express";
import { sendAdminEmail } from "../lib/email";
import { createValuationRequestSchema } from "../schemas/valuation.schema";

export async function createValuationRequestHandler(req: Request, res: Response) {
  const parsed = createValuationRequestSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { name, email, phone, boatName, message } = parsed.data;

  const toEmail = process.env.CONTACT_EMAIL;
  if (!toEmail) {
    console.error("Cannot send valuation request: CONTACT_EMAIL is not set in environment variables.");
    return res.status(500).json({ error: "Valuation form is not configured. Please try again later." });
  }

  try {
    const response = await sendAdminEmail({
      subject: `New valuation request for "${boatName}" from ${name}`,
      eyebrow: "Valuation Request",
      heading: `Valuation request for ${boatName}`,
      details: [
        { label: "Boat", value: boatName },
        { label: "Name", value: name },
        { label: "Email", value: email, href: `mailto:${email}` },
        { label: "Phone", value: phone ?? "Not provided", href: phone ? `tel:${phone}` : undefined },
      ],
      message,
      replyTo: email,
      replyLabel: `Reply to ${name}`,
    });

    if (response.error) {
      console.error("Resend API Error object:", response.error);
      return res.status(502).json({ error: "Failed to send your request. Please try again later." });
    }
  } catch (err) {
    console.error("Exception sending valuation request email:", err);
    return res.status(502).json({ error: "Failed to send your request. Please try again later." });
  }

  res.status(201).json({ sent: true });
}
