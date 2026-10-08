export type ApiBoatImage = {
  id: number
  path: string | null
  position: number
}

// Seller-defined extra spec rows — see the Additional Fields tab of the seller
// portal's Add Boat form.
export type ApiBoatCustomField = {
  id: number
  label: string
  value: string
  position: number
}

export type ApiSeller = {
  id: number
  name: string
  email: string
  phone: string | null
}

// Mirrors the Prisma `Boat` model (server/prisma/schema.prisma). Every field
// beyond the core ones is a free-text catalogue detail and may be null.
export type ApiBoat = {
  id: number
  name: string
  cost: string
  price: number | null
  isSold: boolean
  isUnderOffer: boolean
  isFeatured: boolean
  isDeleted: boolean
  imageUrl: string | null
  sellerId: number
  seller: ApiSeller
  images: ApiBoatImage[]
  // Optional: boats created before this relation existed have no such rows.
  customFields?: ApiBoatCustomField[]

  cinNumber: string | null
  crtNumber: string | null
  licenseNumber: string | null
  previousOwners: string | null
  engineServiceHistory: string | null
  boilerServiceHistory: string | null
  survey: string | null
  blacking: string | null
  anodes: string | null
  documentationAvailable: string | null

  draft: string | null
  internalHeadroom: string | null
  saloonLength: string | null
  galleyLength: string | null
  bathroomLength: string | null
  bedroomLength: string | null
  // Not stored by older backends — optional until the columns exist everywhere.
  boatLength?: string | null
  dimensionsOther?: string | null

  engine: string | null
  hours: string | null
  gearbox: string | null
  bowthruster: string | null
  weedhatch: string | null
  dieselTankCapacity: string | null
  engineExtraNotes: string | null

  centralHeating: string | null
  solidFuelStove: string | null
  sourceOfHotWater: string | null
  waterTank: string | null
  waterTankCapacity: string | null
  heatingExtraNotes: string | null

  alternator: string | null
  batteries: string | null
  lighting: string | null
  inverterCharger: string | null
  landlineSocket: string | null
  galvanicIsolator: string | null
  // Not stored by the backend yet — optional until a column is added.
  solarPanels?: string | null
  electricalExtraNotes: string | null

  gasBottles: string | null
  appliances: string | null
  gasExtraNotes: string | null

  insulation: string | null
  ballast: string | null
  ceiling: string | null
  cabinSides: string | null
  hullSides: string | null
  flooring: string | null
  sideDoors: string | null
  windows: string | null
  interiorExtraNotes: string | null

  saloonSeating: string | null
  saloonDinette: string | null

  galleyCooker: string | null
  galleyFridgeFreezer: string | null
  galleyMicrowave: string | null
  galleyWashingMachine: string | null
  galleyExtraNotes: string | null

  bathroomToilet: string | null
  bathroomWasteTankCapacity: string | null
  bathroomBathShower: string | null
  bathroomVanityBasin: string | null
  bathroomExtraNotes: string | null

  bedroomBed: string | null
  bedroomDinette: string | null
  // Not stored by older backends — optional until the column exists everywhere.
  bedroomWardrobeStorage?: string | null
  bedroomExtraNotes: string | null

  tv: string | null
  hullBuilder: string | null
  fitOut: string | null
  year: string | null
  steelSpec: string | null
  lastService: string | null
  boatSafety: string | null
  recentSurvey: string | null

  boatName: string | null
  location: string | null
  lengthBeam: string | null
  noOfBerths: string | null
  sternType: string | null
  yearBuilt: string | null
  builder: string | null
  boatType: string | null
  overview: string | null

  brochureUrl: string | null
  videoUrl: string | null
  virtualTourUrl: string | null

  createdAt: string
  updatedAt: string
}

const API_BASE = '/api'
const REQUEST_TIMEOUT_MS = 30_000

async function fetchWithTimeout(input: string, init?: RequestInit, timeoutMs = REQUEST_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(input, { ...init, signal: controller.signal })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.')
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}

// Controllers respond with { error: string } (plain message) or
// { error: { fieldErrors, formErrors } } (zod .flatten()) — extract a
// human-readable message from either shape so callers can show it directly
// instead of falling back to an opaque "Request failed with 400".
function extractErrorMessage(body: unknown): string | null {
  if (!body || typeof body !== 'object' || !('error' in body)) return null
  const err = (body as { error: unknown }).error
  if (typeof err === 'string') return err
  if (err && typeof err === 'object') {
    const flat = err as { fieldErrors?: Record<string, string[] | undefined>; formErrors?: string[] }
    const firstFieldMessage = Object.values(flat.fieldErrors ?? {}).find((msgs) => msgs && msgs.length > 0)?.[0]
    return firstFieldMessage ?? flat.formErrors?.[0] ?? null
  }
  return null
}

async function readResponse<T>(res: Response, path: string): Promise<T> {
  if (!res.ok) {
    const body: unknown = await res.json().catch(() => null)
    throw new Error(extractErrorMessage(body) ?? `Request to ${path} failed with ${res.status}`)
  }
  return res.json() as Promise<T>
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetchWithTimeout(`${API_BASE}${path}`)
  return readResponse<T>(res, path)
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetchWithTimeout(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return readResponse<T>(res, path)
}

async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetchWithTimeout(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return readResponse<T>(res, path)
}

async function apiDelete<T>(path: string): Promise<T> {
  const res = await fetchWithTimeout(`${API_BASE}${path}`, { method: 'DELETE' })
  return readResponse<T>(res, path)
}

// `includeDeleted` is only ever passed by the admin Boats page — the public
// storefront calls this with no options and never sees soft-deleted boats.
export function fetchBoats(options: { includeDeleted?: boolean } = {}): Promise<ApiBoat[]> {
  return apiGet<ApiBoat[]>(`/boats${options.includeDeleted ? '?includeDeleted=true' : ''}`)
}

export function fetchBoat(id: number, options: { includeDeleted?: boolean } = {}): Promise<ApiBoat> {
  return apiGet<ApiBoat>(`/boats/${id}${options.includeDeleted ? '?includeDeleted=true' : ''}`)
}

// Soft delete — hides the boat from the storefront but keeps the row (and
// its listing) so admins can still see and restore it. See Backend's
// Boat.isDeleted / softDeleteBoat.
export function deleteBoat(id: number): Promise<ApiBoat> {
  return apiDelete<ApiBoat>(`/boats/${id}`)
}

// Irreversible: removes an already-deleted boat (and its photos/listing) for good.
export function permanentlyDeleteBoat(id: number): Promise<{ id: number }> {
  return apiDelete<{ id: number }>(`/boats/${id}/permanent`)
}

export function restoreBoat(id: number): Promise<ApiBoat> {
  return apiPatch<ApiBoat>(`/boats/${id}/restore`, {})
}

// Admin-only "Sold" / "Under Offer" / "Live" toggle on the Boats page —
// PATCH /api/boats/:id also accepts plain JSON for this (the multer
// middleware in front of it passes non-multipart requests straight through).
export function updateBoatSaleStatus(id: number, status: { isSold: boolean; isUnderOffer: boolean }): Promise<ApiBoat> {
  return apiPatch<ApiBoat>(`/boats/${id}`, status)
}

// Admin-only toggle for the home page's Featured Boats section.
export function updateBoatFeatured(id: number, isFeatured: boolean): Promise<ApiBoat> {
  return apiPatch<ApiBoat>(`/boats/${id}`, { isFeatured })
}

// Mirrors the Blog admin panel: an editor pastes the fields below and the
// post is served back as-is.
export type ApiBlogPostSummary = {
  slug: string
  title: string
  excerpt: string
  author: string
  date: string
  readTime: string
  imageUrl: string | null
}

export type ApiBlogPost = {
  slug: string
  title: string
  author: string
  date: string
  readTime: string
  imageUrl: string | null
  content: string
}

export function fetchBlogPosts(): Promise<ApiBlogPostSummary[]> {
  return apiGet<ApiBlogPostSummary[]>('/blogs')
}

export function fetchBlogPost(slug: string): Promise<ApiBlogPost> {
  return apiGet<ApiBlogPost>(`/blogs/${slug}`)
}

// Availability & Bookings

// No buyer/boat detail — the backend deliberately keeps this endpoint
// PII-free since it's reachable from any boat's public page.
export type ApiAvailabilitySlot = {
  id: number
  startsAt: string
  endsAt: string
  available: boolean
}

export function fetchAvailabilitySlots(): Promise<ApiAvailabilitySlot[]> {
  return apiGet<ApiAvailabilitySlot[]>('/availability-slots')
}

export type CreateBookingPayload = {
  boatId: number
  slotId: number
  firstName: string
  surname: string
  email: string
  phone?: string
  notes?: string
}

export type ApiBooking = {
  id: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  notes: string | null
  createdAt: string
  slot: { id: number; startsAt: string; endsAt: string }
  boat: { id: number; name: string; imageUrl: string | null }
}

export function createBooking(payload: CreateBookingPayload): Promise<ApiBooking> {
  return apiPost<ApiBooking>('/bookings', payload)
}

// Contact

export type SendContactMessagePayload = {
  name: string
  email: string
  phone?: string
  message: string
}

export function sendContactMessage(payload: SendContactMessagePayload): Promise<{ sent: true }> {
  return apiPost<{ sent: true }>('/contact', payload)
}

// Valuation

export type SendValuationRequestPayload = {
  name: string
  email: string
  phone?: string
  boatName: string
  message: string
}

export function sendValuationRequest(payload: SendValuationRequestPayload): Promise<{ sent: true }> {
  return apiPost<{ sent: true }>('/valuation', payload)
}
