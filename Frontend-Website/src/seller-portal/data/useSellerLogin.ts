import { useState } from 'react'
import { loginSeller, type ApiSeller } from '../lib/api'
import { setStoredSeller } from '../lib/session'

type SellerLoginState = {
  loading: boolean
  error: string | null
}

export function useSellerLogin() {
  const [state, setState] = useState<SellerLoginState>({ loading: false, error: null })

  async function login(email: string, password: string): Promise<ApiSeller | null> {
    setState({ loading: true, error: null })
    try {
      const seller = await loginSeller(email, password)
      setStoredSeller(seller)
      setState({ loading: false, error: null })
      return seller
    } catch (err: unknown) {
      setState({ loading: false, error: err instanceof Error ? err.message : 'Failed to log in' })
      return null
    }
  }

  return { ...state, login }
}
