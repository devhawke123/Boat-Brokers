import { useEffect, useState } from 'react'
import { fetchSellers, type ApiSeller } from '../lib/api'

type SellersState = {
  sellers: ApiSeller[]
  loading: boolean
  error: string | null
}

let cache: ApiSeller[] | null = null
let inflight: Promise<ApiSeller[]> | null = null

function loadSellers(): Promise<ApiSeller[]> {
  if (cache) return Promise.resolve(cache)
  if (!inflight) {
    inflight = fetchSellers()
      .then((sellers) => {
        cache = sellers
        return cache
      })
      .finally(() => {
        inflight = null
      })
  }
  return inflight
}

export function invalidateSellersCache() {
  cache = null
}

export function useSellers(): SellersState & { refetch: () => void } {
  const [state, setState] = useState<SellersState>({ sellers: cache ?? [], loading: !cache, error: null })

  useEffect(() => {
    if (cache) {
      setState({ sellers: cache, loading: false, error: null })
      return
    }
    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: null }))
    loadSellers()
      .then((sellers) => {
        if (!cancelled) setState({ sellers, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({ sellers: [], loading: false, error: err instanceof Error ? err.message : 'Failed to load sellers' })
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return {
    ...state,
    refetch: () => {
      invalidateSellersCache()
      setState((s) => ({ ...s, loading: true }))
      loadSellers()
        .then((sellers) => setState({ sellers, loading: false, error: null }))
        .catch((err: unknown) =>
          setState({ sellers: [], loading: false, error: err instanceof Error ? err.message : 'Failed to load sellers' }),
        )
    },
  }
}

export function useSellerById(id: number) {
  const { sellers, loading, error } = useSellers()
  const seller = sellers.find((s) => s.id === id) ?? null
  return { seller, loading, error }
}
