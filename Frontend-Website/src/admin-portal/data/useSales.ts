import { useEffect, useState } from 'react'
import { fetchSales, type ApiSale } from '../lib/api'

type SalesState = {
  sales: ApiSale[]
  loading: boolean
  error: string | null
}

let cache: ApiSale[] | null = null
let inflight: Promise<ApiSale[]> | null = null

function loadSales(): Promise<ApiSale[]> {
  if (cache) return Promise.resolve(cache)
  if (!inflight) {
    inflight = fetchSales()
      .then((sales) => {
        cache = sales
        return cache
      })
      .finally(() => {
        inflight = null
      })
  }
  return inflight
}

export function invalidateSalesCache() {
  cache = null
}

export function useSales(): SalesState & { refetch: () => void } {
  const [state, setState] = useState<SalesState>({ sales: cache ?? [], loading: !cache, error: null })

  useEffect(() => {
    if (cache) {
      setState({ sales: cache, loading: false, error: null })
      return
    }
    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: null }))
    loadSales()
      .then((sales) => {
        if (!cancelled) setState({ sales, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({ sales: [], loading: false, error: err instanceof Error ? err.message : 'Failed to load sales' })
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return {
    ...state,
    refetch: () => {
      invalidateSalesCache()
      setState((s) => ({ ...s, loading: true }))
      loadSales()
        .then((sales) => setState({ sales, loading: false, error: null }))
        .catch((err: unknown) =>
          setState({ sales: [], loading: false, error: err instanceof Error ? err.message : 'Failed to load sales' }),
        )
    },
  }
}

export function useSaleById(id: number) {
  const { sales, loading, error } = useSales()
  const sale = sales.find((s) => s.id === id) ?? null
  return { sale, loading, error }
}
