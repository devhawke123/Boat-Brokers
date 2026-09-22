import { useEffect, useState } from 'react'
import { fetchDashboardStats, type DashboardStats } from '../lib/api'

type DashboardStatsState = {
  data: DashboardStats | null
  loading: boolean
  error: string | null
}

export function useDashboardStats() {
  const [state, setState] = useState<DashboardStatsState>({ data: null, loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    fetchDashboardStats()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({ data: null, loading: false, error: err instanceof Error ? err.message : 'Failed to load dashboard stats' })
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
