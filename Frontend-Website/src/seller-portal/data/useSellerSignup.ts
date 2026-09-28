import { useState } from 'react'
import { createSeller, type ApiSeller, type CreateSellerPayload } from '../lib/api'
import { setStoredSeller } from '../lib/session'

type SellerSignupState = {
  loading: boolean
  error: string | null
}

export function useSellerSignup() {
  const [state, setState] = useState<SellerSignupState>({ loading: false, error: null })

  async function signup(payload: CreateSellerPayload): Promise<ApiSeller | null> {
    setState({ loading: true, error: null })
    try {
      const seller = await createSeller(payload)
      setStoredSeller(seller)
      setState({ loading: false, error: null })
      return seller
    } catch (err: unknown) {
      setState({ loading: false, error: err instanceof Error ? err.message : 'Failed to create account' })
      return null
    }
  }

  return { ...state, signup }
}
