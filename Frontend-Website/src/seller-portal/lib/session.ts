import type { ApiSeller } from './api'

// The seller-login endpoint is a stateless credential check (no cookie/token
// issued by the backend), so the logged-in seller is persisted here instead.
const STORAGE_KEY = 'seller-portal:seller'

export function getStoredSeller(): ApiSeller | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ApiSeller) : null
  } catch {
    return null
  }
}

export function setStoredSeller(seller: ApiSeller) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seller))
  } catch {
    // Storage unavailable (private browsing, quota) — login still succeeds,
    // just won't persist across a reload.
  }
}

export function clearStoredSeller() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore — nothing to clear if storage isn't available.
  }
}
