import { Resend } from "resend";
import type { ListingStatus } from "@prisma/client";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || "no-reply@theboatbrokers.co.uk";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "https://theboatbrokers.co.uk";

const STATUS_COPY: Record<ListingStatus, { label: string; badgeBg: string; badgeText: string; message: string }> = {
  PENDING: {
    label: "Pending Review",
    badgeBg: "#fef3c7",
    badgeText: "#92400e",
    message:
      "Our team is reviewing your listing now. We'll let you know as soon as it goes live for buyers to see.",
  },
  APPROVED: {
    label: "Live & Approved",
    badgeBg: "#dcfce7",
    badgeText: "#15803d",
    message: "Your listing has been approved and is now live for buyers to see.",
  },
  REJECTED: {
    label: "Needs Changes",
    badgeBg: "#fee2e2",
    badgeText: "#b91c1c",
    message:
      "Our team has reviewed your listing and it needs a few changes before it can go live. Please check your dashboard for details.",
  },
};

function renderListingSubmittedEmail(params: { sellerName: string; boatName: string; status: ListingStatus }) {
  const { sellerName, boatName, status } = params;
  const statusInfo = STATUS_COPY[status];
  const firstName = sellerName.trim().split(/\s+/)[0] || sellerName;
  const dashboardUrl = `${CLIENT_ORIGIN}/seller-portal/dashboard`;

  const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Listing Submitted</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Georgia, 'Times New Roman', serif;">
    <div style="max-width:560px; margin:0 auto; padding:32px 16px;">
      <div style="border-radius:16px; overflow:hidden; border:1px solid #e5e4e7; background-color:#ffffff;">
        <div style="background-color:#073040; padding:28px 32px; text-align:center;">
          <span style="display:inline-block; color:#ffffff; font-size:12px; letter-spacing:3px; text-transform:uppercase; border-top:1px solid rgba(255,255,255,0.35); border-bottom:1px solid rgba(255,255,255,0.35); padding:4px 0; margin-bottom:6px;">The</span>
          <div style="color:#1cc0ff; font-size:26px; font-weight:bold; letter-spacing:1px; line-height:1.1;">BOAT</div>
          <div style="color:#1cc0ff; font-size:26px; font-weight:bold; letter-spacing:1px; line-height:1.1;">BROKERS</div>
        </div>

        <div style="padding:36px 32px; font-family: Georgia, 'Times New Roman', serif; color:#1a1a1a;">
          <span style="display:inline-block; background-color:#e3f7fe; color:#14b2ef; font-size:11px; font-weight:bold; letter-spacing:1px; text-transform:uppercase; border-radius:999px; padding:6px 14px; margin-bottom:16px; font-family: Arial, sans-serif;">
            Listing Update
          </span>

          <h1 style="font-size:22px; margin:0 0 16px; color:#0a4359;">Thanks for listing your boat, ${escapeHtml(firstName)}!</h1>

          <p style="font-size:15px; line-height:24px; color:#374151; margin:0 0 20px; font-family: Arial, sans-serif;">
            We've received your submission for <strong>${escapeHtml(boatName)}</strong>. Here's where it stands right now:
          </p>

          <div style="text-align:center; margin:0 0 20px;">
            <span style="display:inline-block; background-color:${statusInfo.badgeBg}; color:${statusInfo.badgeText}; font-size:13px; font-weight:bold; letter-spacing:0.5px; text-transform:uppercase; border-radius:999px; padding:8px 20px; font-family: Arial, sans-serif;">
              ${statusInfo.label}
            </span>
          </div>

          <p style="font-size:15px; line-height:24px; color:#374151; margin:0 0 28px; font-family: Arial, sans-serif;">
            ${statusInfo.message}
          </p>

          <div style="text-align:center; margin-bottom:8px;">
            <a href="${dashboardUrl}" style="display:inline-block; background-color:#0a4359; color:#ffffff; text-decoration:none; font-weight:bold; font-size:14px; border-radius:8px; padding:14px 32px; font-family: Arial, sans-serif;">
              View My Dashboard
            </a>
          </div>
        </div>

        <div style="padding:20px 32px; background-color:#f8fafc; border-top:1px solid #e5e4e7; text-align:center;">
          <p style="font-size:12px; color:#94a3b8; margin:0; font-family: Arial, sans-serif;">
            The Boat Brokers &middot; Noel Creary and the team are here if you have any questions.
          </p>
        </div>
      </div>
    </div>
  </body>
</html>
`;

  const text = `Thanks for listing your boat, ${firstName}!

We've received your submission for ${boatName}. Current status: ${statusInfo.label}.

${statusInfo.message}

View your dashboard: ${dashboardUrl}

- The Boat Brokers`;

  return {
    subject: `Your listing "${boatName}" is ${statusInfo.label}`,
    html,
    text,
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendListingSubmittedEmail(params: {
  to: string;
  sellerName: string;
  boatName: string;
  status: ListingStatus;
}) {
  const { to, ...rest } = params;
  const { subject, html, text } = renderListingSubmittedEmail(rest);

  try {
    const response = await resend.emails.send({
      from: `The Boat Brokers <${FROM_EMAIL}>`,
      to,
      subject,
      html,
      text,
    });
    if (response.error) {
      console.error("Resend API Error sending listing-submitted email:", response.error);
    }
  } catch (err) {
    console.error("Exception sending listing-submitted email:", err);
  }
}
