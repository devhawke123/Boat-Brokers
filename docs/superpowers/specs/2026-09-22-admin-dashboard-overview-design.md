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
  REJECTED), `ListingComment`. No `Admin`, `Lead`, `Buyer`, `Sale`, `MarketingEntry`,
  `AvailabilitySlot`, or `Booking` models exist yet.
- Seller portal (`Frontend-Website/src/seller-portal`) already has: Add Boat, My
  Boats, Listing Review, Comment Thread / Comments, Profile, Help & Support, Login.
  The listing approval workflow (`boatListing.controller.ts`) already supports status
  updates and threaded comments (`fromSeller` flag) end-to-end on the backend — it
  just has no admin-facing UI yet.
- Public site's "Book a Viewing" page currently embeds a third-party **Cal.com**
  widget — a generic consultation calendar, not tied to a specific boat, and not
  connected to our backend/database. This will be **removed and replaced** with a
  custom-built, boat-specific availability/booking component (see Module 4).

## Reference screenshots vs. final scope

The reference admin dashboard screenshots included Dashboard, Leads, Boat Vendors,
Boat Buyers, Sales, Marketing, Groups, Reports, and Buyer Email. After discussion:

- **Groups, Reports, Buyer Email are out of scope** — not needed in the new system.
- **Sales and Marketing are simple manual logs** — admin manually enters rows
  (no automated linkage to Leads/Bookings/Sales — e.g. creating a Sale does **not**
  automatically flip a Buyer's status; admin sets everything by hand).
- New asks added on top: **Add Boat (admin)**, **Blog management**, **Availability &
  Bookings**, **Roles/Permissions** (explicitly last).

## Core concepts & data model shape

- **Admin** — new model, its own auth (separate from `Seller` login).
- **Boat Vendors = existing `Seller` accounts.** Real portal accounts. Gets a new
  `status` field (New / Contacted / Listed / Lost) so admin can track vendor pipeline
  state directly on the account. This page is also home to: that vendor's boats,
  pending `BoatListing` approvals, and the `ListingComment` thread per listing.
- **Leads** — vendor-side inquiry pipeline, tracked **separately** from `Seller`
  accounts (no automatic conversion/linking — admin manages both independently).
  Status vocabulary: New / Contacted / Listed / Lost.
- **Boat Buyers** — new `Buyer` model. Created only two ways: (1) immediately when
  someone submits a viewing-booking request on the public site (before admin
  approves the booking itself), or (2) admin manually creating one. Status
  vocabulary: New / Contacted / Viewing Booked / Won (purchased a boat) / Lost.
  "Won" is admin-set by hand, same as everything else — not automated off Sales.
- **Sale** — new model, manual entry only. Admin picks vendor + buyer + boat from
  dropdowns, enters price/deposit/balance/commission. No automated side effects on
  Buyer/Lead status.
- **MarketingEntry** — new model, manual log: vendor, type, date, name, cost.
- **AvailabilitySlot / Booking** — new models. Admin availability is **global and
  single-track**: a 2-hour slot (e.g. 12–2pm) can only ever be attached to one boat
  at a time — booking it for Boat X makes it unavailable for Boat Y too, because it's
  the same admin's time. Flow: buyer picks an open slot + a boat on the public site →
  creates a `Booking` (pending) + a `Buyer` record immediately → admin is notified →
  admin approves/rejects → on approval: slot is marked taken, buyer gets an email,
  booking shows on the admin dashboard/calendar.
- **BlogPost** — already exists, just needs an admin CRUD UI. No schema change.
- **Add Boat (admin)** — reuses the seller's Add Boat form/shape. Vendor is optional
  (dropdown of existing Sellers, or none). Goes live immediately — no `PENDING`
  review step, since admin is the source of truth here (unlike seller-submitted
  listings, which still go through approval).

## Module build order

Each module below gets its own brainstorm → spec → plan → implementation cycle when
we reach it. This order was chosen as: foundation first, then roughly the order
they'll be used day-to-day.

1. **Admin Auth + Dashboard shell** — login, layout/nav, the metrics dashboard
   (People Metrics, Sales Overview, date-range filter). Foundation for everything
   else.
2. **Boat Vendors** — Seller account list/detail, their boats, listing
   approve/reject, comment threads, editable vendor status.
3. **Add Boat (admin)** — admin version of the add-boat form; optional vendor;
   instant-live.
4. **Availability & Bookings** — admin slot calendar, public booking flow (replacing
   the Cal.com embed with a custom component), approve/reject, email notification,
   dashboard visibility.
5. **Boat Buyers** — buyer list (fed by bookings + manual add), editable
   status/details.
6. **Leads** — vendor-side inquiry pipeline (New/Contacted/Listed/Lost).
7. **Sales** — manual deal log.
8. **Marketing** — manual campaign log.
9. **Blogs** — admin CRUD over existing `BlogPost`.
10. **Roles/Permissions** — last, as agreed.

## Out of scope

- Groups, Reports, Buyer Email (dropped from the reference system).
- Any automation linking Leads → Buyers/Vendors, Bookings → Buyer status, or
  Sales → Buyer status. Everything is admin-driven, by hand.
