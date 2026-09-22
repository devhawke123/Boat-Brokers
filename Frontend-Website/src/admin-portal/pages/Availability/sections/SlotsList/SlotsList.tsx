import type { ApiAvailabilitySlot } from '../../../../../lib/api'
import type { ApiAdminBooking } from '../../../../lib/api'
import { formatDateTime } from '../../../../../seller-portal/lib/formatDate'

type SlotsListProps = {
  slots: ApiAvailabilitySlot[]
  bookings: ApiAdminBooking[]
  onApprove: (bookingId: number) => void
  onReject: (bookingId: number) => void
  onDelete: (slotId: number) => void
  busyBookingId: number | null
}

export default function SlotsList({ slots, bookings, onApprove, onReject, onDelete, busyBookingId }: SlotsListProps) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[48rem] border-collapse">
          <thead>
            <tr className="bg-[#f8fafc]">
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Slot
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Request
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => {
              // A slot's PENDING/APPROVED booking, if any — the backend
              // never returns more than one active booking per slot.
              const booking = bookings.find(
                (b) => b.slot.id === slot.id && (b.status === 'PENDING' || b.status === 'APPROVED'),
              )

              return (
                <tr key={slot.id} className="border-t border-[#f3f4f6]">
                  <td className="px-5 py-2.5 text-sm text-[#0f172a]">
                    {formatDateTime(slot.startsAt)} – {formatDateTime(slot.endsAt)}
                  </td>
                  <td className="px-5 py-2.5 text-sm">
                    {!booking ? (
                      <span className="inline-flex items-center rounded-full bg-[#f1f5f9] px-2 py-[3px] text-[9.5px] font-bold text-[#64748b]">
                        Open
                      </span>
                    ) : (
                      <div className="flex flex-col gap-0.5">
                        <span
                          className={`inline-flex w-fit items-center rounded-full px-2 py-[3px] text-[9.5px] font-bold ${
                            booking.status === 'APPROVED'
                              ? 'bg-[#dcfce7] text-[#15803d]'
                              : 'bg-[#fef9c3] text-[#a16207]'
                          }`}
                        >
                          {booking.status === 'APPROVED' ? 'Booked' : 'Pending'}
                        </span>
                        <span className="text-xs text-[#334155]">
                          {booking.buyer.firstName} {booking.buyer.surname} — {booking.boat.name}
                        </span>
                        <span className="text-xs text-[#94a3b8]">{booking.buyer.email}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-2.5 text-right">
                    {!booking && (
                      <button
                        type="button"
                        onClick={() => onDelete(slot.id)}
                        className="inline-flex items-center justify-center rounded-md border border-[#fecaca] px-3 py-1 text-[9.5px] font-bold text-[#dc2626] transition-colors duration-300 hover:bg-[#fef2f2]"
                      >
                        Delete
                      </button>
                    )}
                    {booking && booking.status === 'PENDING' && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          disabled={busyBookingId === booking.id}
                          onClick={() => onApprove(booking.id)}
                          className="inline-flex items-center justify-center rounded-md border border-[#86efac] bg-[#f0fdf4] px-3 py-1 text-[9.5px] font-bold text-[#15803d] transition-colors duration-300 hover:bg-[#dcfce7] disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          disabled={busyBookingId === booking.id}
                          onClick={() => onReject(booking.id)}
                          className="inline-flex items-center justify-center rounded-md border border-[#fca5a5] bg-[#fef2f2] px-3 py-1 text-[9.5px] font-bold text-[#dc2626] transition-colors duration-300 hover:bg-[#ffeae9] disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}

            {slots.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-sm text-[#64748b]">
                  No availability slots yet — add one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
