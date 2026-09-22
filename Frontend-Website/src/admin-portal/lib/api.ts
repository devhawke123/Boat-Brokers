import type { ApiSeller, VendorStatus } from '../../seller-portal/lib/api'

export type ApiAdmin = {
  id: number
  adminId: string
  name: string
  email: string
  phone: string | null
  avatarUrl: string | null
  joiningDate: string
}

export type DashboardStats = {
  peopleMetrics: {
    totalVendors: number
    totalBuyers: number
  }
  salesOverview: {
    listings: number
    underOffer: number
    totalSales: number
    completedSales: number
  }
}

const API_BASE = '/api'

const DEFAULT_TIMEOUT_MS = 30_000
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

async function readResponse<T>(res: Response, path: string): Promise<T> {
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

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetchWithTimeout(`${API_BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
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

// Bypasses the JSON Content-Type header so the browser can set its own
// multipart boundary for file uploads (e.g. a blog post image).
async function apiFormData<T>(path: string, method: 'POST' | 'PUT', formData: FormData): Promise<T> {
  const res = await fetchWithTimeout(`${API_BASE}${path}`, { method, body: formData }, UPLOAD_TIMEOUT_MS)
  return readResponse<T>(res, path)
}

// Admin

export function loginAdmin(email: string, password: string): Promise<ApiAdmin> {
  return apiPost<ApiAdmin>('/admin/login', { email, password })
}

export function fetchDashboardStats(): Promise<DashboardStats> {
  return apiGet<DashboardStats>('/admin/dashboard-stats')
}

// Vendors (Seller CRUD/session logic is reused directly from seller-portal's
// lib/api.ts and data/useSellers.ts — it's portal-agnostic resource data, not
// duplicated here. This file only adds the one admin-only mutation.)

export function updateSellerStatus(id: number, status: VendorStatus): Promise<ApiSeller> {
  return apiPatch<ApiSeller>(`/sellers/${id}/status`, { status })
}

// Availability & Bookings (the slot list itself — id/startsAt/endsAt/available
// — is portal-agnostic and reused directly from the public site's lib/api.ts;
// this file only adds the admin-only mutations and the PII-carrying booking
// view, which the public endpoint deliberately never returns.)

export function createAvailabilitySlot(startsAt: string): Promise<{ id: number; startsAt: string; endsAt: string; available: boolean }> {
  return apiPost('/availability-slots', { startsAt })
}

export function deleteAvailabilitySlot(id: number): Promise<void> {
  return apiDelete(`/availability-slots/${id}`)
}

export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export type ApiAdminBooking = {
  id: number
  status: BookingStatus
  notes: string | null
  createdAt: string
  slot: { id: number; startsAt: string; endsAt: string }
  boat: { id: number; name: string; imageUrl: string | null }
  buyer: {
    id: number
    buyerId: string
    firstName: string
    surname: string
    email: string
    phone: string | null
    status: string
  }
}

export function fetchBookings(): Promise<ApiAdminBooking[]> {
  return apiGet<ApiAdminBooking[]>('/bookings')
}

export function updateBookingStatus(id: number, status: 'APPROVED' | 'REJECTED'): Promise<ApiAdminBooking> {
  return apiPatch<ApiAdminBooking>(`/bookings/${id}/status`, { status })
}

// Buyers

export type BuyerStatus = 'NEW' | 'CONTACTED' | 'VIEWING_BOOKED' | 'WON' | 'LOST'

export type ApiBuyerBooking = {
  id: number
  status: BookingStatus
  createdAt: string
  slot: { id: number; startsAt: string; endsAt: string }
  boat: { id: number; name: string; imageUrl: string | null }
}

export type ApiBuyer = {
  id: number
  buyerId: string
  firstName: string
  surname: string
  email: string
  phone: string | null
  source: string
  status: BuyerStatus
  createdAt: string
  bookings: ApiBuyerBooking[]
}

export function fetchBuyers(): Promise<ApiBuyer[]> {
  return apiGet<ApiBuyer[]>('/buyers')
}

export function fetchBuyer(id: number): Promise<ApiBuyer> {
  return apiGet<ApiBuyer>(`/buyers/${id}`)
}

export type CreateBuyerPayload = {
  firstName: string
  surname: string
  email: string
  phone?: string
}

export function createBuyer(payload: CreateBuyerPayload): Promise<ApiBuyer> {
  return apiPost<ApiBuyer>('/buyers', payload)
}

export type UpdateBuyerPayload = Partial<CreateBuyerPayload>

export function updateBuyer(id: number, payload: UpdateBuyerPayload): Promise<ApiBuyer> {
  return apiPut<ApiBuyer>(`/buyers/${id}`, payload)
}

export function deleteBuyer(id: number): Promise<void> {
  return apiDelete(`/buyers/${id}`)
}

export function updateBuyerStatus(id: number, status: BuyerStatus): Promise<ApiBuyer> {
  return apiPatch<ApiBuyer>(`/buyers/${id}/status`, { status })
}

// Leads — vendor-side inquiry pipeline, fully manual/admin-driven.

export type LeadStatus = 'NEW' | 'CONTACTED' | 'LISTED' | 'LOST'

export type ApiLead = {
  id: number
  leadId: string
  firstName: string
  surname: string
  email: string
  phone: string | null
  address: string | null
  source: string | null
  status: LeadStatus
  notes: string | null
  createdAt: string
}

export function fetchLeads(): Promise<ApiLead[]> {
  return apiGet<ApiLead[]>('/leads')
}

export function fetchLead(id: number): Promise<ApiLead> {
  return apiGet<ApiLead>(`/leads/${id}`)
}

export type CreateLeadPayload = {
  firstName: string
  surname: string
  email: string
  phone?: string
  address?: string
  source?: string
  notes?: string
}

export function createLead(payload: CreateLeadPayload): Promise<ApiLead> {
  return apiPost<ApiLead>('/leads', payload)
}

export type UpdateLeadPayload = Partial<CreateLeadPayload>

export function updateLead(id: number, payload: UpdateLeadPayload): Promise<ApiLead> {
  return apiPut<ApiLead>(`/leads/${id}`, payload)
}

export function deleteLead(id: number): Promise<void> {
  return apiDelete(`/leads/${id}`)
}

export function updateLeadStatus(id: number, status: LeadStatus): Promise<ApiLead> {
  return apiPatch<ApiLead>(`/leads/${id}/status`, { status })
}

// Sales — manual deal log. Admin picks vendor/buyer/boat from dropdowns
// (reusing fetchSellers/fetchBuyers/fetchBoats — no dedicated lookup
// endpoints needed) and enters the figures by hand.

export type SaleStatus = 'CURRENT' | 'COMPLETED' | 'CANCELLED'

export type ApiSale = {
  id: number
  saleId: string
  status: SaleStatus
  soldPrice: number
  deposit: number
  balance: number
  commission: number
  createdAt: string
  boat: { id: number; name: string; imageUrl: string | null }
  seller: { id: number; name: string; email: string }
  buyer: { id: number; firstName: string; surname: string; email: string }
}

export function fetchSales(): Promise<ApiSale[]> {
  return apiGet<ApiSale[]>('/sales')
}

export function fetchSale(id: number): Promise<ApiSale> {
  return apiGet<ApiSale>(`/sales/${id}`)
}

export type CreateSalePayload = {
  boatId: number
  sellerId: number
  buyerId: number
  soldPrice: number
  deposit?: number
  commission?: number
}

export function createSale(payload: CreateSalePayload): Promise<ApiSale> {
  return apiPost<ApiSale>('/sales', payload)
}

export type UpdateSalePayload = Partial<CreateSalePayload>

export function updateSale(id: number, payload: UpdateSalePayload): Promise<ApiSale> {
  return apiPut<ApiSale>(`/sales/${id}`, payload)
}

export function deleteSale(id: number): Promise<void> {
  return apiDelete(`/sales/${id}`)
}

export function updateSaleStatus(id: number, status: SaleStatus): Promise<ApiSale> {
  return apiPatch<ApiSale>(`/sales/${id}/status`, { status })
}

// Blogs — admin CRUD over the existing BlogPost table (the public site's
// fetchBlogPosts/fetchBlogPost in ../../lib/api.ts only ever read; this file
// adds the admin-only write side under /api/admin/blogs, which lists every
// post, not just the public-facing first five).

export type ApiBlogPostAdmin = {
  id: number
  slug: string
  title: string
  content: string
  author: string
  date: string
  readTime: string
  imageUrl: string | null
  createdAt: string
  updatedAt: string
}

export function fetchBlogPostsAdmin(): Promise<ApiBlogPostAdmin[]> {
  return apiGet<ApiBlogPostAdmin[]>('/admin/blogs')
}

export function fetchBlogPostAdmin(id: number): Promise<ApiBlogPostAdmin> {
  return apiGet<ApiBlogPostAdmin>(`/admin/blogs/${id}`)
}

export function createBlogPost(formData: FormData): Promise<ApiBlogPostAdmin> {
  return apiFormData<ApiBlogPostAdmin>('/admin/blogs', 'POST', formData)
}

export function updateBlogPost(id: number, formData: FormData): Promise<ApiBlogPostAdmin> {
  return apiFormData<ApiBlogPostAdmin>(`/admin/blogs/${id}`, 'PUT', formData)
}

export function deleteBlogPost(id: number): Promise<void> {
  return apiDelete(`/admin/blogs/${id}`)
}
