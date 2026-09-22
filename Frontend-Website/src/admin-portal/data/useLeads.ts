import { useEffect, useState } from 'react'
import { fetchLeads, type ApiLead } from '../lib/api'

type LeadsState = {
  leads: ApiLead[]
  loading: boolean
  error: string | null
}

let cache: ApiLead[] | null = null
let inflight: Promise<ApiLead[]> | null = null

function loadLeads(): Promise<ApiLead[]> {
  if (cache) return Promise.resolve(cache)
  if (!inflight) {
    inflight = fetchLeads()
      .then((leads) => {
        cache = leads
        return cache
      })
      .finally(() => {
        inflight = null
      })
  }
  return inflight
}

export function invalidateLeadsCache() {
  cache = null
}

export function useLeads(): LeadsState & { refetch: () => void } {
  const [state, setState] = useState<LeadsState>({ leads: cache ?? [], loading: !cache, error: null })

  useEffect(() => {
    if (cache) {
      setState({ leads: cache, loading: false, error: null })
      return
    }
    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: null }))
    loadLeads()
      .then((leads) => {
        if (!cancelled) setState({ leads, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({ leads: [], loading: false, error: err instanceof Error ? err.message : 'Failed to load leads' })
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return {
    ...state,
    refetch: () => {
      invalidateLeadsCache()
      setState((s) => ({ ...s, loading: true }))
      loadLeads()
        .then((leads) => setState({ leads, loading: false, error: null }))
        .catch((err: unknown) =>
          setState({ leads: [], loading: false, error: err instanceof Error ? err.message : 'Failed to load leads' }),
        )
    },
  }
}

export function useLeadById(id: number) {
  const { leads, loading, error } = useLeads()
  const lead = leads.find((l) => l.id === id) ?? null
  return { lead, loading, error }
}
