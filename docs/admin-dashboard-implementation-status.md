# Admin Dashboard — Implementation Status

Date: 2026-09-23
Companion doc: `docs/superpowers/specs/2026-09-22-admin-dashboard-overview-design.md`
(the original scoping/design spec — this doc is the "what actually got built and
verified" record, module by module)

## Where it lives

- **Backend**: `Backend/` — Express + Prisma + MySQL, all new resources follow
  the existing schema → model → controller → view → route pattern, mounted
  flat under `/api/<resource>` in `Backend/src/index.ts`.
- **Frontend**: `Frontend-Website/src/admin-portal/` — a new portal inside the
  existing site (not the empty, orphaned `Frontend/` folder), mirroring
  `seller-portal/`'s structure and reusing its components/hooks/API wrappers
  wherever they're portal-agnostic (Seller, Boat, Listing, Comment data,
  `Button`, `FormField`).
- **Login**: `admin@example.com` / `admin` (seeded via `Backend/prisma/seed-admin.js`).
  Auth is a stateless credential check against `Admin` (scrypt-hashed password,
  no JWT/session) — same pattern the existing Seller login already used. This
  is **not real security**; it's a deliberate consistency choice since the
  rest of the app has no auth middleware anywhere either.

## Modules built (1–7 of 8)

### 1. Admin Auth + Dashboard shell
- New `Admin` Prisma model, `POST /api/admin/login`.
- Admin portal shell: sidebar nav, login page, session handling via
  `localStorage` (mirrors the seller portal exactly).
- Dashboard (`/admin-portal/dashboard`): People Metrics (Total Vendors, Total
  Buyers) and Sales Overview (Listings, Under Offer, Total Sales, Completed
  Sales) stat tiles, backed by `GET /api/admin/dashboard-stats`.
- Dropped after initial review: the "Vendors Won"/"Buyers Won" tiles and the
  dashboard date-range filter (both were either meaningless before later
  modules existed, or never asked to be wired up).

### 2. Boat Vendors
- `Seller` gets a new `status` field (`VendorStatus`: New/Contacted/Listed/Lost)
  — an admin-managed pipeline stage independent of anything seller-facing.
- Full vendor CRUD (create/edit/delete), status editing.
- Vendor detail page also surfaces: that vendor's boats/listings, listing
  approve/reject (reusing the seller portal's existing `BoatListing` status
  workflow), and the comment thread per listing (reused seller portal's
  `CommentThreadCard`, generalized with a `fromSeller` prop so both portals
  can post correctly-attributed replies through the same component).

### 3. Availability & Bookings
- New `AvailabilitySlot`, `Buyer`, `Booking` models.
- Admin creates fixed 2-hour slots (`/admin-portal/availability`). A slot is
  **global**, not per-boat — it can only ever back one active
  (PENDING/APPROVED) booking at a time, since it's the same admin's time
  regardless of which boat. Rejecting a booking frees the slot back up.
- **Booking always starts from the boat's own public page** (a new "Book a
  Viewing" section on `BoatDetail`), never a generic form — per explicit
  instruction, so the boat context is never ambiguous. `POST /api/bookings`
  finds-or-creates a `Buyer` by email inside a DB transaction and creates a
  PENDING booking.
- Approving a booking (admin side) flips the buyer's status to
  `VIEWING_BOOKED` and sends a confirmation email via Resend (same pattern as
  the existing boat-publish notification email).
- The public slot-list endpoint (`GET /api/availability-slots`) deliberately
  returns **no buyer/boat PII** — just id/time/available — since it's
  reachable from any boat's page. Full booking detail (with buyer contact
  info) only ever comes from the admin-only `GET /api/bookings`.
- The old **Cal.com embed** on the standalone `/book-a-viewing` page (a
  generic, non-boat-specific widget not connected to our backend at all) was
  removed, along with the unused `@calcom/embed-react` dependency. That page
  now just points visitors to a boat's page.
- A real bug was caught and fixed during manual testing: the buyer
  find-or-create inside `createBooking`'s transaction was using the global
  Prisma client instead of the transaction handle, so a just-created buyer
  wasn't visible yet to the booking insert. `buyer.model.ts` functions now
  accept an optional DB handle so transactional callers stay on one connection.

### 4. Boat Buyers
- Full `Buyer` CRUD (the model was added in Module 3, this module built its
  admin UI): list (search/filter/paginate), detail, create/edit, delete,
  status editing.
- Manual creation sets `source: "Manual"` (vs `"Booking"` from a viewing
  request) and 409s on a duplicate email rather than creating a second row
  for the same person.
- Buyer detail page shows their full viewing-request history (pulled from
  `Booking`).

### 5. Leads
- New `Lead` model — vendor-side inquiry pipeline, tracked **separately**
  from real `Seller` accounts (no automatic conversion/linking between them).
- Fully manual entry: first/last name, email, phone, address, source (dropdown:
  Referral/Website/Apollo Duck/Other), notes.
- Status: New/Contacted/Listed/Lost. Full CRUD + status endpoint.

### 6. Sales
- New `Sale` model — a manual deal log. Admin picks vendor + buyer + boat
  from dropdowns and enters `soldPrice`/`deposit`/`commission` by hand;
  `balance` is **derived** (`soldPrice − deposit`), never stored.
- Status: Current/Completed/Cancelled. Full CRUD + status endpoint.
- No automated side effects on Buyer/Lead status anywhere — everything in
  this module is admin-driven, by design.
- Wired the dashboard's Total Sales / Completed Sales tiles (stubbed since
  Module 1, using a `Boat.isSold` heuristic as a stand-in) to the real `Sale`
  model now that it exists.

### 7. Blogs
- No schema change — `BlogPost` already existed. Added a full admin CRUD
  surface under `/api/admin/blogs`, kept **separate** from the public
  `/api/blogs` (which deliberately still caps its listing at 5 posts — a
  pre-existing constraint left untouched; the admin endpoint lists every post).
- Slug auto-generates from the title on create, de-duplicated with a
  `-2`/`-3`/... suffix on collision, and **stays stable across title edits**
  so existing links never break. An admin can still set it explicitly.
- Optional post image upload reuses the existing multer pattern
  (`uploadBoatMedia`/`uploadSellerAvatar`) into a new `uploads/blogs/` dir.
- Fixed a real bug found while wiring this up: `toBlogMediaUrl()` was
  missing the "already a servable URL, pass through" guard that
  `toMediaUrl()` has, so an admin-uploaded image path (`/uploads/blogs/...`)
  would have been double-prefixed into a broken URL. Fixed.
- **Confirmed compatible with the existing public blog pages** — checked
  `src/data/blogPosts.ts` and `src/data/blogPostDetail.ts` (the hooks behind
  `/blog` and `/blog/:slug`): every field they consume (`slug`, `title`,
  `excerpt`/`content`, `author`, `date`, `readTime`, `imageUrl`) is exactly
  what the admin form collects and the API returns — no gaps, no extra
  fields the public site silently needs that admin can't set. `category` is
  hardcoded client-side to `"Blog"` (a pre-existing simplification, not
  something admin needs to manage), and post `content` is rendered as raw
  HTML via `dangerouslySetInnerHTML`, matching the plain-HTML textarea the
  admin form uses.

## Cross-cutting things done along the way

- Reused portal-agnostic data (Seller/Boat/Listing/Comment CRUD, hooks,
  `Button`, `FormField`) directly from `seller-portal/` and the public site's
  `src/lib/api.ts` instead of duplicating them — only genuinely portal-specific
  concerns (login, session storage key, redirects) are duplicated per portal.
- Every module was verified against a **live backend + real browser session**
  (Playwright), not just type-checked — actual create/edit/delete/status-change
  flows were exercised and cross-checked against the database, not just the
  UI.
- Both `Backend` and `Frontend-Website` build clean (`tsc`, `vite build`,
  `oxlint`) after every module.

## What is NOT completed

- **Module 8: Roles/Permissions** — explicitly scoped last, not started.
  Nothing in the app currently restricts what a logged-in admin can do;
  there's also no real distinction between "an admin" and "the admin" (no
  role field on `Admin` yet).
- **Real authentication** — flagged repeatedly through the build: admin (and
  seller) login is a bare credential check with no token/session, and
  `localStorage` can be forged in devtools to fake a logged-in session. This
  was a deliberate consistency choice with the existing codebase (which has
  zero auth middleware anywhere), not something Module 8 is scoped to fix on
  its own — worth deciding explicitly if it needs addressing before any real
  admin uses this in production.
- **Blog seed data** — the dev database has zero blog posts (the existing
  `Backend/prisma/seed-blogs.js` script, which reads the 62 folders under
  `bb-blogs/`, was never run against this DB). Not something this work
  touched or was asked to fix; flagging so it's not mistaken for a bug in
  the new admin Blogs module.
- **`RESEND_API_KEY`** — a placeholder value was added to the local
  `Backend/.env` (gitignored, not committed) just so the dev server would
  boot during testing. A real key is needed for booking-confirmation and
  boat-publish emails to actually send in any real environment.
- **Orphaned `Frontend/` folder** — confirmed early on to be a stray,
  untracked Vite scaffold unrelated to the real app (`Frontend-Website/`).
  Left untouched; worth deleting at some point to avoid confusion, but that
  wasn't asked for.
