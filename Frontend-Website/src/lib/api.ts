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
  bedroomExtraNotes: string | null

  tv: string | null
  covers: string | null
  navigationEquipment: string | null
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

async function readResponse<T>(res: Response, path: string): Promise<T> {
  if (!res.ok) {
    // Controllers respond with { error: string } (plain message) or
    // { error: { fieldErrors, formErrors } } (zod .flatten()) — surface the
    // plain-message case so callers can show it directly.
    const body: unknown = await res.json().catch(() => null)
    const message =
      body && typeof body === 'object' && 'error' in body && typeof body.error === 'string' ? body.error : null
    throw new Error(message ?? `Request to ${path} failed with ${res.status}`)
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

export function fetchBoats(): Promise<ApiBoat[]> {
  return apiGet<ApiBoat[]>('/boats')
}

export function fetchBoat(id: number): Promise<ApiBoat> {
  return apiGet<ApiBoat>(`/boats/${id}`)
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
