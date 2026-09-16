export type ApiSeller = {
  id: number
  sellerId: string
  name: string
  email: string
  phone: string | null
  location: string | null
  joiningDate: string
}

export type ApiListingComment = {
  id: number
  listingId: number
  content: string
  author: string | null
  createdAt: string
}

export type ListingStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export type ApiBoatListing = {
  id: number
  status: ListingStatus
  createdAt: string
  boat: {
    id: number
    boatId: string
    name: string
    imageUrl: string | null
    price: number | null
  }
  seller: ApiSeller
  comments: ApiListingComment[]
}

const API_BASE = '/api'

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!res.ok) {
    // Controllers respond with { error: string } (plain message) or
    // { error: { fieldErrors, formErrors } } (zod .flatten()) — surface the
    // plain-message case so callers (e.g. login) can show it directly.
    const body: unknown = await res.json().catch(() => null)
    const message =
      body && typeof body === 'object' && 'error' in body && typeof body.error === 'string' ? body.error : null
    throw new Error(message ?? `Request to ${path} failed with ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
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

export function addListingComment(
  listingId: number,
  content: string,
  author?: string,
): Promise<ApiListingComment> {
  return apiPost<ApiListingComment>(`/listings/${listingId}/comments`, { content, author })
}
