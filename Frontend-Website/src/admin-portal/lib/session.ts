import type { ApiAdmin } from './api'

// The admin-login endpoint is a stateless credential check (no cookie/token
// issued by the backend), so the logged-in admin is persisted here instead.
const STORAGE_KEY = 'admin-portal:admin'

export function getStoredAdmin(): ApiAdmin | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ApiAdmin) : null
  } catch {
    return null
  }
}

export function setStoredAdmin(admin: ApiAdmin) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(admin))
  } catch {
    // Storage unavailable (private browsing, quota) — login still succeeds,
    // just won't persist across a reload.
  }
}

export function clearStoredAdmin() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore — nothing to clear if storage isn't available.
  }
}
