import { useCallback, useEffect, useState } from 'react'
import AdminShell from '../../components/AdminShell/AdminShell'
import { confirmDialog } from '../../components/AdminDialog/AdminDialog'
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
  const [tab, setTab] = useState<'All' | 'Approved'>('All')

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
    if (bookings.find((b) => b.id === bookingId)?.status === 'APPROVED') {
      const confirmed = await confirmDialog('Cancel this viewing? The buyer will be emailed.', { title: 'Cancel viewing' })
      if (!confirmed) return
    }
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
    const confirmed = await confirmDialog('Delete this slot?', { title: 'Delete slot' })
    if (!confirmed) return
    setActionError(null)
    try {
      await deleteAvailabilitySlot(slotId)
      load()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to delete slot.')
    }
  }

  if (!checkedSession) return null

  // Today and later only (local midnight cutoff, so today's earlier slots still show).
  const startOfToday = new Date().setHours(0, 0, 0, 0)
  const upcomingSlots = slots
    .filter((slot) => new Date(slot.startsAt).getTime() >= startOfToday)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
  const visibleSlots =
    tab === 'All'
      ? upcomingSlots
      : upcomingSlots.filter((slot) => bookings.some((b) => b.slot.id === slot.id && b.status === 'APPROVED'))

  return (
    <AdminShell mainClassName="bg-frost">
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-bold text-[#0f172a]">Availability</h1>
          <p className="text-sm text-[#64748b]">Open viewing slots and manage buyer requests against them.</p>
        </div>

        <CreateSlotForm existingSlots={slots} onCreated={load} />

        {actionError && (
          <p className="rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-2 text-sm font-medium text-[#dc2626]">
            {actionError}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-bold text-[#0f172a]">Slots &amp; Requests</h2>
            <div className="flex items-center gap-1 rounded-lg border border-[#e5e7eb] bg-white p-1">
              {(['All', 'Approved'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={
                    tab === t
                      ? 'rounded-md bg-[#eff6ff] px-3 py-1.5 text-xs font-bold text-[#2563eb]'
                      : 'rounded-md px-3 py-1.5 text-xs font-semibold text-[#6b7280] transition-colors duration-300 hover:text-[#2563eb]'
                  }
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {error ? (
            <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#fca5a5] bg-[#fef2f2] py-16 text-center text-[#b91c1c]">
              <p>Couldn&rsquo;t load availability from the server: {error}</p>
            </div>
          ) : loading ? (
            <div className="h-64 w-full animate-pulse rounded-2xl border border-[#e2e8f0] bg-[#f8fafc]" />
          ) : (
            <SlotsList
              slots={visibleSlots}
              bookings={bookings}
              onApprove={handleApprove}
              onReject={handleReject}
              onDelete={handleDelete}
              busyBookingId={busyBookingId}
            />
          )}
        </div>
      </div>
    </AdminShell>
  )
}
