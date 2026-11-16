import { useEffect, useState } from 'react'
import { fetchAvailabilitySlots } from '../../lib/api'
import type { ApiAvailabilitySlot } from '../../lib/api'
import { fetchBookings } from '../lib/api'
import type { ApiAdminBooking } from '../lib/api'

type AvailabilityState = {
  slots: ApiAvailabilitySlot[]
  bookings: ApiAdminBooking[]
  loading: boolean
  error: string | null
}

// Slots + bookings, fetched together the same way the Availability page does.
export function useOverviewAvailability(): AvailabilityState {
  const [state, setState] = useState<AvailabilityState>({ slots: [], bookings: [], loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchAvailabilitySlots(), fetchBookings()])
      .then(([slots, bookings]) => {
        if (!cancelled) setState({ slots, bookings, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (!cancelled) setState({ slots: [], bookings: [], loading: false, error: err instanceof Error ? err.message : 'Failed to load availability' })
      })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
