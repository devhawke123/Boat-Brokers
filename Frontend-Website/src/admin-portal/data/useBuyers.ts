import { useEffect, useState } from 'react'
import { fetchBuyers, type ApiBuyer } from '../lib/api'

type BuyersState = {
  buyers: ApiBuyer[]
  loading: boolean
  error: string | null
}

let cache: ApiBuyer[] | null = null
let inflight: Promise<ApiBuyer[]> | null = null

function loadBuyers(): Promise<ApiBuyer[]> {
  if (cache) return Promise.resolve(cache)
  if (!inflight) {
    inflight = fetchBuyers()
      .then((buyers) => {
        cache = buyers
        return cache
      })
      .finally(() => {
        inflight = null
      })
  }
  return inflight
}

export function invalidateBuyersCache() {
  cache = null
}

export function useBuyers(): BuyersState & { refetch: () => void } {
  const [state, setState] = useState<BuyersState>({ buyers: cache ?? [], loading: !cache, error: null })

  useEffect(() => {
    if (cache) {
      setState({ buyers: cache, loading: false, error: null })
      return
    }
    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: null }))
    loadBuyers()
      .then((buyers) => {
        if (!cancelled) setState({ buyers, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({ buyers: [], loading: false, error: err instanceof Error ? err.message : 'Failed to load buyers' })
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return {
    ...state,
    refetch: () => {
      invalidateBuyersCache()
      setState((s) => ({ ...s, loading: true }))
      loadBuyers()
        .then((buyers) => setState({ buyers, loading: false, error: null }))
        .catch((err: unknown) =>
          setState({ buyers: [], loading: false, error: err instanceof Error ? err.message : 'Failed to load buyers' }),
        )
    },
  }
}

export function useBuyerById(id: number) {
  const { buyers, loading, error } = useBuyers()
  const buyer = buyers.find((b) => b.id === id) ?? null
  return { buyer, loading, error }
}
