# Admin Dashboard — Overview Design

Status: approved (overview level — each module gets its own detailed spec before build)
Date: 2026-09-22

## Purpose

Boat Brokers has a public site and a seller portal, but no admin system at all today.
This doc scopes the full admin dashboard: what modules it needs, how they relate to
each other and to existing data, and the order we'll build them in. It intentionally
stops short of field-by-field detail for each module — that gets brainstormed and
spec'd module by module, immediately before that module is built.

## Current state (verified in codebase, 2026-09-22)

- `Frontend/` — empty scaffold (just `node_modules` + `package-lock.json`). The admin
  dashboard shown in the reference screenshots is not part of this repo; it's being
  rebuilt from scratch here.
- `Backend/prisma/schema.prisma` has: `Boat`, `BoatImage`, `BoatCustomField`,
  `BlogPost`, `Seller`, `BoatListing` (+ `ListingStatus` enum: PENDING/APPROVED/
  REJECTED), `ListingComment`, `Admin` (Module 1), `AvailabilitySlot` / `Buyer` /
  `Booking` (Module 3), and `Lead` / `Sale` (Modules 5–6).
- Seller portal (`Frontend-Website/src/seller-portal`) already has: Add Boat, My
  Boats, Listing Review, Comment Thread / Comments, Profile, Help & Support, Login.
  The listing approval workflow (`boatListing.controller.ts`) already supports status
  updates and threaded comments (`fromSeller` flag) end-to-end on the backend — it
  just has no admin-facing UI yet.
- Public site's "Book a Viewing" page used to embed a third-party **Cal.com**
  widget — a generic consultation calendar, not tied to a specific boat, and not
  connected to our backend/database. It's been **removed and replaced** (Module 3)
  with a custom-built, boat-specific availability/booking component on each boat's
  own page; the `/book-a-viewing` page now just points people to a boat's page.

## Reference screenshots vs. final scope

The reference admin dashboard screenshots included Dashboard, Leads, Boat Vendors,
Boat Buyers, Sales, Marketing, Groups, Reports, and Buyer Email. After discussion:

- **Groups, Reports, Buyer Email are out of scope** — not needed in the new system.
- **Marketing was dropped from scope entirely** — not building it.
- **Sales is a simple manual log** — admin manually enters rows (no automated
  linkage to Leads/Bookings — e.g. creating a Sale does **not** automatically flip
  a Buyer's status; admin sets everything by hand).
- New asks added on top: **Blog management**, **Availability & Bookings**,
  **Roles/Permissions** (explicitly last).
- **Add Boat (admin) was dropped from scope entirely** — admin will not get a
  parallel boat-add flow; boat creation stays seller-submitted only, reviewed via
  the Boat Vendors module.

## Core concepts & data model shape

- **Admin** — new model, its own auth (separate from `Seller` login).
- **Boat Vendors = existing `Seller` accounts.** Real portal accounts. Gets a new
  `status` field (New / Contacted / Listed / Lost) so admin can track vendor pipeline
  state directly on the account. This page is also home to: that vendor's boats,
  pending `BoatListing` approvals, and the `ListingComment` thread per listing.
- **Leads** ✅ — vendor-side inquiry pipeline, tracked **separately** from `Seller`
  accounts (no automatic conversion/linking — admin manages both independently).
  Fully manual entry: firstName/surname/email/phone/address/source/notes. Status
  vocabulary: New / Contacted / Listed / Lost. Built.
- **Boat Buyers** ✅ — `Buyer` model (added in Module 3). Created only two ways:
  (1) immediately when someone submits a viewing-booking request on the public
  site, via find-or-create by email (before admin approves the booking itself),
  or (2) admin manually adding one (`source: "Manual"` vs `"Booking"`, 409 on
  duplicate email). Full CRUD (create/edit/delete) plus status editing, and each
  buyer's detail page shows their viewing-request history. Status vocabulary:
  New / Contacted / Viewing Booked / Won (purchased a boat) / Lost. "Won" is
  admin-set by hand, same as everything else — not automated off Sales. Built.
- **Sale** ✅ — manual entry only. Admin picks vendor + buyer + boat from dropdowns,
  enters soldPrice/deposit/commission; `balance` is derived (soldPrice − deposit),
  never stored. Status: Current / Completed / Cancelled. No automated side effects
  on Buyer/Lead status. The dashboard's Total Sales / Completed Sales tiles (stubbed
  since Module 1) now read from `Sale` instead of the `Boat.isSold` heuristic. Built.
- **AvailabilitySlot / Booking** ✅ — new models. Admin availability is **global and
  single-track**: a 2-hour slot (e.g. 12–2pm) can only ever be attached to one boat
  at a time — booking it for Boat X makes it unavailable for Boat Y too, because it's
  the same admin's time. Booking is always initiated from the boat's own public page
  (never a generic form) so the boat context is never ambiguous. Flow: buyer picks an
  open slot on that boat's page → creates a `Booking` (PENDING) + finds-or-creates a
  `Buyer` by email → admin sees it on the Availability page → admin approves/rejects
  → on approval: buyer's status flips to `VIEWING_BOOKED`, a confirmation email is
  sent (Resend), and the slot is no longer offered to anyone else. Rejecting frees the
  slot back up. The public slot-list endpoint deliberately returns no buyer/boat PII
  (just id/time/available) since it's reachable from any boat page; the full booking
  record (with buyer contact info) is only ever returned from the admin-only
  `GET /api/bookings`.
- **BlogPost** — already exists, just needs an admin CRUD UI. No schema change.

## Module build order

Each module below gets its own brainstorm → spec → plan → implementation cycle when
we reach it. This order was chosen as: foundation first, then roughly the order
they'll be used day-to-day.

1. **Admin Auth + Dashboard shell** ✅ — login, layout/nav, the metrics dashboard
   (People Metrics: Total Vendors/Total Buyers; Sales Overview: Listings/Under
   Offer/Total Sales/Completed Sales). Foundation for everything else. Built.
2. **Boat Vendors** ✅ — Seller account list/detail, their boats, listing
   approve/reject, comment threads, editable vendor status, full account
   CRUD (create/edit/delete). Built.
3. **Availability & Bookings** ✅ — admin slot calendar (`/admin-portal/availability`),
   a "Book a Viewing" section on each boat's public detail page (replacing the
   Cal.com embed, which has been removed along with its npm dependency),
   approve/reject, Resend email notification on approval. Built.
4. **Boat Buyers** ✅ — buyer list/detail (fed by bookings + manual add), full
   CRUD, editable status, per-buyer viewing-request history. Built.
5. **Leads** ✅ — vendor-side inquiry pipeline (New/Contacted/Listed/Lost), full
   CRUD, manual entry only. Built.
6. **Sales** ✅ — manual deal log (Current/Completed/Cancelled), full CRUD,
   derived balance, wired into the dashboard's Sales Overview tiles. Built.
7. **Blogs** — admin CRUD over existing `BlogPost`.
8. **Roles/Permissions** — last, as agreed.

## Out of scope

- Groups, Reports, Buyer Email (dropped from the reference system).
- Marketing (dropped; no manual campaign log module).
- Add Boat (admin) — dropped; boat creation stays seller-submitted only.
- Any automation linking Leads → Buyers/Vendors, Bookings → Buyer status, or
  Sales → Buyer status. Everything is admin-driven, by hand.
- "Vendors Won" / "Buyers Won" dashboard tiles and the dashboard date-range
  filter — dropped from Module 1 after review; not planned elsewhere either.
