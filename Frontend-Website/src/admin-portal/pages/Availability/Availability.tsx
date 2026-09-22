import { useCallback, useEffect, useState } from 'react'
import AdminShell from '../../components/AdminShell/AdminShell'
import { useAdminSession } from '../../data/useAdminSession'
import { fetchAvailabilitySlots, type ApiAvailabilitySlot } from '../../../lib/api'
import { deleteAvailabilitySlot, fetchBookings, updateBookingStatus, type ApiAdminBooking } from '../../lib/api'
import CreateSlotForm from './sections/CreateSlotForm/CreateSlotForm'
import SlotsList from './sections/SlotsList/SlotsList'

export default function Availability() {
  const { checkedSession } = useAdminSession()
  const [slots, setSlots] = useState<ApiAvailabilitySlot[]>([])
  const [bookings, setBookings] = useState<ApiAdminBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyBookingId, setBusyBookingId] = useState<number | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    Promise.all([fetchAvailabilitySlots(), fetchBookings()])
      .then(([slotsData, bookingsData]) => {
        setSlots(slotsData)
        setBookings(bookingsData)
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load availability.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleApprove(bookingId: number) {
    setBusyBookingId(bookingId)
    setActionError(null)
    try {
      await updateBookingStatus(bookingId, 'APPROVED')
      load()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to approve booking.')
    } finally {
      setBusyBookingId(null)
    }
  }

  async function handleReject(bookingId: number) {
    setBusyBookingId(bookingId)
    setActionError(null)
    try {
      await updateBookingStatus(bookingId, 'REJECTED')
      load()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to reject booking.')
    } finally {
      setBusyBookingId(null)
    }
  }

  async function handleDelete(slotId: number) {
    if (!window.confirm('Delete this slot?')) return
    setActionError(null)
    try {
      await deleteAvailabilitySlot(slotId)
      load()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to delete slot.')
    }
  }

  if (!checkedSession) return null

  const upcomingSlots = [...slots].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())

  return (
    <AdminShell mainClassName="bg-frost">
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Availability</h1>

        <CreateSlotForm onCreated={load} />

        {actionError && (
          <p className="rounded-md border border-[#fecaca] bg-[#fef2f2] px-4 py-2 text-sm font-medium text-[#dc2626]">
            {actionError}
          </p>
        )}

        {error ? (
          <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#fca5a5] bg-[#fef2f2] py-16 text-center text-[#b91c1c]">
            <p>Couldn&rsquo;t load availability from the server: {error}</p>
          </div>
        ) : loading ? (
          <div className="h-64 w-full animate-pulse rounded-lg border border-[#e2e8f0] bg-[#f8fafc]" />
        ) : (
          <SlotsList
            slots={upcomingSlots}
            bookings={bookings}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
            busyBookingId={busyBookingId}
          />
        )}
      </div>
    </AdminShell>
  )
}
