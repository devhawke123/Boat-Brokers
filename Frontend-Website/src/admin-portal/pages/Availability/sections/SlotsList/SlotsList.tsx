import type { ApiAvailabilitySlot } from '../../../../../lib/api'
import type { ApiAdminBooking } from '../../../../lib/api'
import { formatDateTime } from '../../../../../seller-portal/lib/formatDate'
import StatusBadge from '../../../../components/StatusBadge/StatusBadge'
import ActionButton from '../../../../components/ActionButton/ActionButton'
import { CheckIcon, CrossIcon, TrashIcon } from '../../../../components/ActionButton/icons'

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
                      <StatusBadge label="Open" tone="neutral" />
                    ) : (
                      <div className="flex flex-col gap-1">
                        <StatusBadge
                          label={booking.status === 'APPROVED' ? 'Booked' : 'Pending'}
                          tone={booking.status === 'APPROVED' ? 'success' : 'progress'}
                        />
                        <span className="text-xs text-[#334155]">
                          {booking.buyer.firstName} {booking.buyer.surname} — {booking.boat.name}
                        </span>
                        <span className="text-xs text-[#94a3b8]">{booking.buyer.email}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-2.5 text-right">
                    {!booking && (
                      <ActionButton label="Delete" variant="delete" icon={TrashIcon} onClick={() => onDelete(slot.id)} />
                    )}
                    {booking && booking.status === 'PENDING' && (
                      <div className="flex items-center justify-end gap-2">
                        <ActionButton
                          label="Approve"
                          variant="approve"
                          icon={CheckIcon}
                          disabled={busyBookingId === booking.id}
                          onClick={() => onApprove(booking.id)}
                        />
                        <ActionButton
                          label="Reject"
                          variant="reject"
                          icon={CrossIcon}
                          disabled={busyBookingId === booking.id}
                          onClick={() => onReject(booking.id)}
                        />
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
