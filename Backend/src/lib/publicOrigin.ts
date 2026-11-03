/**
 * Origin used in emails / deep links (reset password, dashboard CTAs, boat URLs).
 *
 * `CLIENT_ORIGIN` may be a comma-separated CORS allowlist
 * (apex + www + admin). Never concatenate that list into a URL — pick one
 * public host. Prefer `PUBLIC_SITE_URL` when set; otherwise the first
 * non-admin origin in `CLIENT_ORIGIN`.
 */
export function publicSiteOrigin(): string {
  const explicit = process.env.PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const origins = (process.env.CLIENT_ORIGIN || "https://theboatbrokers.co.uk")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const publicOrigin =
    origins.find((origin) => !/\/\/admin\./i.test(origin)) ??
    origins[0] ??
    "https://theboatbrokers.co.uk";

  return publicOrigin.replace(/\/$/, "");
}
