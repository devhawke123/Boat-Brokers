import type { Request, Response } from "express";
import { sendAdminEmail } from "../lib/email";
import { createContactMessageSchema } from "../schemas/contact.schema";

export async function createContactMessageHandler(req: Request, res: Response) {
  const parsed = createContactMessageSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { name, email, phone, message } = parsed.data;

  const toEmail = process.env.CONTACT_EMAIL;
  if (!toEmail) {
    console.error("Cannot send contact message: CONTACT_EMAIL is not set in environment variables.");
    return res.status(500).json({ error: "Contact form is not configured. Please try again later." });
  }

  try {
    const response = await sendAdminEmail({
      subject: `New contact form message from ${name}`,
      eyebrow: "Contact Form",
      heading: `New message from ${name}`,
      details: [
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
      return res.status(502).json({ error: "Failed to send your message. Please try again later." });
    }
  } catch (err) {
    console.error("Exception sending contact message email:", err);
    return res.status(502).json({ error: "Failed to send your message. Please try again later." });
  }

  res.status(201).json({ sent: true });
}
