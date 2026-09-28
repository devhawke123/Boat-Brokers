import type { Request, Response } from "express";
import { Resend } from "resend";
import { createValuationRequestSchema } from "../schemas/valuation.schema";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function createValuationRequestHandler(req: Request, res: Response) {
  const parsed = createValuationRequestSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { name, email, phone, boatName, message } = parsed.data;

  const toEmail = process.env.CONTACT_EMAIL;
  if (!toEmail) {
    console.error("Cannot send valuation request: CONTACT_EMAIL is not set in environment variables.");
    return res.status(500).json({ error: "Valuation form is not configured. Please try again later." });
  }
  const fromEmail = process.env.FROM_EMAIL || "no-reply@theboatbrokers.co.uk";

  try {
    const response = await resend.emails.send({
      from: `Boat Brokers Website <${fromEmail}>`,
      to: toEmail,
      replyTo: email,
      subject: `New valuation request for "${boatName}" from ${name}`,
      text: `Name: ${name}
Email: ${email}
Phone: ${phone ?? "Not provided"}
Boat Name: ${boatName}

Message:
${message}`,
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
