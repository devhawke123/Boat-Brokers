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

function apiPatch<T>(path: string, body: unknown): Promise<T> {
  return apiRequest<T>(path, { method: 'PATCH', body: JSON.stringify(body) })
}

function apiDelete(path: string): Promise<void> {
  return apiRequest<void>(path, { method: 'DELETE' })
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
