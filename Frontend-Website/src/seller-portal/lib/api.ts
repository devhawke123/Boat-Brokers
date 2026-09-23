export type VendorStatus = 'NEW' | 'CONTACTED' | 'LISTED' | 'LOST'

export type ApiSeller = {
  id: number
  sellerId: string
  name: string
  email: string
  phone: string | null
  location: string | null
  avatarUrl: string | null
  joiningDate: string
  status: VendorStatus
}

export type ApiListingComment = {
  id: number
  listingId: number
  content: string
  author: string | null
  fromSeller: boolean
  parentId: number | null
  createdAt: string
  // Only ever populated one level deep — a reply's own `replies` is omitted by the API.
  replies: ApiListingComment[]
}

export type ListingStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export type ApiBoatImage = {
  id: number
  path: string | null
  position: number
}

// The Boat model carries dozens of optional spec fields (history,
// dimensions, engine, heating, electrical, gas, interior, other) — rather
// than duplicating every column name here, callers that need one narrow it
// with a cast; this type only pins down the fields the UI relies on.
export type ApiBoat = {
  id: number
  boatId: string
  name: string
  boatName: string | null
  imageUrl: string | null
  price: number | null
  seller: ApiSeller
  images: ApiBoatImage[]
  [field: string]: unknown
}

export type ApiBoatListing = {
  id: number
  status: ListingStatus
  createdAt: string
  sellTimeline: string | null
  contactTime: string | null
  listerType: string | null
  additionalNotes: string | null
  agreedToContact: boolean
  boat: {
    id: number
    boatId: string
    name: string
    imageUrl: string | null
    price: number | null
    // Full spec + media fields — populated on all listing endpoints now
    brochureUrl: string | null
    videoUrl: string | null
    virtualTourUrl: string | null
    overview: string | null
    images: ApiBoatImage[]
    customFields: { id: number; label: string; value: string; position: number }[]
    [field: string]: unknown
  }
  seller: ApiSeller
  comments: ApiListingComment[]
}

const API_BASE = '/api'

const DEFAULT_TIMEOUT_MS = 30_000
// Photo/brochure uploads can carry up to 20 files, so give them more room
// before treating the request as hung.
const UPLOAD_TIMEOUT_MS = 60_000

async function fetchWithTimeout(input: string, init: RequestInit, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<Response> {
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
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetchWithTimeout(`${API_BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  return readResponse<T>(res, path)
}

// Bypasses the JSON Content-Type header so the browser can set its own
// multipart boundary for file uploads (e.g. boat photos).
async function apiPostFormData<T>(path: string, formData: FormData): Promise<T> {
  const res = await fetchWithTimeout(`${API_BASE}${path}`, { method: 'POST', body: formData }, UPLOAD_TIMEOUT_MS)
  return readResponse<T>(res, path)
}

function apiGet<T>(path: string): Promise<T> {
  return apiRequest<T>(path)
}

function apiPost<T>(path: string, body: unknown): Promise<T> {
  return apiRequest<T>(path, { method: 'POST', body: JSON.stringify(body) })
}

function apiPut<T>(path: string, body: unknown): Promise<T> {
  return apiRequest<T>(path, { method: 'PUT', body: JSON.stringify(body) })
}

function apiPatch<T>(path: string, body: unknown): Promise<T> {
  return apiRequest<T>(path, { method: 'PATCH', body: JSON.stringify(body) })
}

function apiDelete(path: string): Promise<void> {
  return apiRequest<void>(path, { method: 'DELETE' })
}

// Sellers

export function fetchSellers(): Promise<ApiSeller[]> {
  return apiGet<ApiSeller[]>('/sellers')
}

export function fetchSeller(id: number): Promise<ApiSeller> {
  return apiGet<ApiSeller>(`/sellers/${id}`)
}

export type CreateSellerPayload = {
  name: string
  email: string
  password: string
  phone?: string
  location?: string
}

export function createSeller(payload: CreateSellerPayload): Promise<ApiSeller> {
  return apiPost<ApiSeller>('/sellers', payload)
}

export type UpdateSellerPayload = Partial<CreateSellerPayload>

export function updateSeller(id: number, payload: UpdateSellerPayload): Promise<ApiSeller> {
  return apiPut<ApiSeller>(`/sellers/${id}`, payload)
}

export function deleteSeller(id: number): Promise<void> {
  return apiDelete(`/sellers/${id}`)
}

export function loginSeller(email: string, password: string): Promise<ApiSeller> {
  return apiPost<ApiSeller>('/sellers/login', { email, password })
}

export function changeSellerPassword(id: number, currentPassword: string, newPassword: string): Promise<void> {
  return apiPut<void>(`/sellers/${id}/password`, { currentPassword, newPassword })
}

export function uploadSellerAvatar(id: number, file: File): Promise<ApiSeller> {
  const formData = new FormData()
  formData.set('avatar', file, file.name)
  return apiPostFormData<ApiSeller>(`/sellers/${id}/avatar`, formData)
}

// Boats

export type CreateBoatResponse = {
  boat: ApiBoat
  listing: ApiBoatListing
}

// Expects a FormData with `sellerId`, `name`, the Boat spec fields as plain
// string values, and any number of `photos` file entries.
export function createBoat(formData: FormData): Promise<CreateBoatResponse> {
  return apiPostFormData<CreateBoatResponse>('/boats', formData)
}

// Partially updates an existing boat. Same FormData shape as createBoat but
// all fields are optional. New photos are appended; existing ones are kept.
export function updateBoat(boatId: number, formData: FormData): Promise<ApiBoat> {
  const res = fetchWithTimeout(`${API_BASE}/boats/${boatId}`, { method: 'PATCH', body: formData }, UPLOAD_TIMEOUT_MS)
  return res.then((r) => readResponse<ApiBoat>(r, `/boats/${boatId}`))
}

export type UpdateListingPreferences = {
  sellTimeline?: string
  contactTime?: string
  listerType?: string
  additionalNotes?: string
  agreedToContact?: boolean
}

export function updateListingPreferences(
  listingId: number,
  preferences: UpdateListingPreferences,
): Promise<ApiBoatListing> {
  return apiPatch<ApiBoatListing>(`/listings/${listingId}/preferences`, preferences)
}


// Listings

export function fetchListings(): Promise<ApiBoatListing[]> {
  return apiGet<ApiBoatListing[]>('/listings')
}

export function fetchListing(id: number): Promise<ApiBoatListing> {
  return apiGet<ApiBoatListing>(`/listings/${id}`)
}

export function createListing(boatId: number, sellerId: number): Promise<ApiBoatListing> {
  return apiPost<ApiBoatListing>('/listings', { boatId, sellerId })
}

export function deleteListing(id: number): Promise<void> {
  return apiDelete(`/listings/${id}`)
}

export function updateListingStatus(id: number, status: ListingStatus): Promise<ApiBoatListing> {
  return apiPatch<ApiBoatListing>(`/listings/${id}/status`, { status })
}

export type AddListingCommentOptions = {
  parentId?: number
  fromSeller?: boolean
}

export function addListingComment(
  listingId: number,
  content: string,
  author?: string,
  options: AddListingCommentOptions = {},
): Promise<ApiListingComment> {
  return apiPost<ApiListingComment>(`/listings/${listingId}/comments`, { content, author, ...options })
}
