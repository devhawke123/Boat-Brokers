import { createContext, useContext } from 'react'
import type { ApiSeller } from '../lib/api'

export type SessionContextValue = {
  seller: ApiSeller | null
  // Persists to localStorage (lib/session.ts); null signs out.
  setSeller: (seller: ApiSeller | null) => void
}

export const SessionContext = createContext<SessionContextValue | null>(null)

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) throw new Error('useSession must be used within SellerPortalApp')
  return context
}
