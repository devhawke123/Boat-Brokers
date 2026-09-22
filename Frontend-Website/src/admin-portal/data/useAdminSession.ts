import { useEffect, useState } from 'react'
import { getStoredAdmin } from '../lib/session'
import type { ApiAdmin } from '../lib/api'

// Guards an admin-portal page: redirects to login when no session exists,
// otherwise exposes the logged-in admin once the check has run.
export function useAdminSession() {
  const [admin, setAdmin] = useState<ApiAdmin | null>(null)
  const [checkedSession, setCheckedSession] = useState(false)

  useEffect(() => {
    const stored = getStoredAdmin()
    if (!stored) {
      window.location.href = '/admin-portal/login'
      return
    }
    setAdmin(stored)
    setCheckedSession(true)
  }, [])

  return { admin, checkedSession }
}
