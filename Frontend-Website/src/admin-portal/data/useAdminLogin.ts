import { useState } from 'react'
import { loginAdmin, type ApiAdmin } from '../lib/api'
import { setStoredAdmin } from '../lib/session'

type AdminLoginState = {
  loading: boolean
  error: string | null
}

export function useAdminLogin() {
  const [state, setState] = useState<AdminLoginState>({ loading: false, error: null })

  async function login(email: string, password: string): Promise<ApiAdmin | null> {
    setState({ loading: true, error: null })
    try {
      const admin = await loginAdmin(email, password)
      setStoredAdmin(admin)
      setState({ loading: false, error: null })
      return admin
    } catch (err: unknown) {
      setState({ loading: false, error: err instanceof Error ? err.message : 'Failed to log in' })
      return null
    }
  }

  return { ...state, login }
}
