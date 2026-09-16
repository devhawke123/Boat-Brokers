import { useEffect, useState } from 'react'
import { getStoredSeller } from '../lib/session'
import type { ApiSeller } from '../lib/api'

// Guards a seller-portal page: redirects to login when no session exists,
// otherwise exposes the logged-in seller once the check has run.
export function useSellerSession() {
  const [seller, setSeller] = useState<ApiSeller | null>(null)
  const [checkedSession, setCheckedSession] = useState(false)

  useEffect(() => {
    const stored = getStoredSeller()
    if (!stored) {
      window.location.href = '/seller-portal/login'
      return
    }
    setSeller(stored)
    setCheckedSession(true)
  }, [])

  return { seller, checkedSession }
}
