# Legacy admin pages (unused by V2 router)

`AdminPortalApp` no longer mounts these route-level pages. They remain in the
tree for reference until a follow-up QA pass confirms nothing still imports
them, then they can be deleted safely.

Unused page folders under `src/admin-portal/pages/`:

- `Availability/`
- `BlogPostForm/`
- `Blogs/`
- `BoatEditForm/`
- `Boats/`
- `BuyerDetail/`
- `BuyerForm/`
- `Buyers/`
- `Dashboard/`
- `LeadDetail/`
- `LeadForm/`
- `Leads/`
- `ListingComments/`
- `Listings/`
- `NotFound/`
- `SaleDetail/`
- `SaleForm/`
- `Sales/`
- `SellerDetail/`
- `SellerForm/`
- `Sellers/`

Live V2 surfaces live in `AdminWorkspace` + `admin-portal/components/*`, with
login at `Login/` and boat create/edit at `AdminBoatWizard.tsx` (`/boats/new/:step`).
