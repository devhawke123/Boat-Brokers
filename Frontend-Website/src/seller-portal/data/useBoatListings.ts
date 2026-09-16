import { useEffect, useState } from 'react'
import { fetchListings, type ApiBoatListing } from '../lib/api'

type ListingsState = {
  listings: ApiBoatListing[]
  loading: boolean
  error: string | null
}

let cache: ApiBoatListing[] | null = null
let inflight: Promise<ApiBoatListing[]> | null = null

function loadListings(): Promise<ApiBoatListing[]> {
  if (cache) return Promise.resolve(cache)
  if (!inflight) {
    inflight = fetchListings()
      .then((listings) => {
        cache = listings
        return cache
      })
      .finally(() => {
        inflight = null
      })
  }
  return inflight
}

export function invalidateListingsCache() {
  cache = null
}

export function useBoatListings(): ListingsState & { refetch: () => void } {
  const [state, setState] = useState<ListingsState>({ listings: cache ?? [], loading: !cache, error: null })

  useEffect(() => {
    if (cache) {
      setState({ listings: cache, loading: false, error: null })
      return
    }
    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: null }))
    loadListings()
      .then((listings) => {
        if (!cancelled) setState({ listings, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({ listings: [], loading: false, error: err instanceof Error ? err.message : 'Failed to load listings' })
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return {
    ...state,
    refetch: () => {
      invalidateListingsCache()
      setState((s) => ({ ...s, loading: true }))
      loadListings()
        .then((listings) => setState({ listings, loading: false, error: null }))
        .catch((err: unknown) =>
          setState({ listings: [], loading: false, error: err instanceof Error ? err.message : 'Failed to load listings' }),
        )
    },
  }
}

export function useListingById(id: number) {
  const { listings, loading, error } = useBoatListings()
  const listing = listings.find((l) => l.id === id) ?? null
  return { listing, loading, error }
}
