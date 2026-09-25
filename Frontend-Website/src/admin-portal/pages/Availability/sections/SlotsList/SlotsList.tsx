import type { ApiAvailabilitySlot } from '../../../../../lib/api'
import type { ApiAdminBooking } from '../../../../lib/api'
import { formatTime, formatWeekdayDate } from '../../../../../seller-portal/lib/formatDate'
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
  if (slots.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1 rounded-2xl border border-dashed border-[#e2e8f0] bg-white py-16 text-center">
        <p className="text-sm font-semibold text-[#0f172a]">No availability slots yet</p>
        <p className="text-sm text-[#64748b]">Add one above to start taking viewing requests.</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      <ul className="divide-y divide-[#f1f5f9]">
        {slots.map((slot) => {
          // A slot's PENDING/APPROVED booking, if any — the backend never
          // returns more than one active booking per slot.
          const booking = bookings.find(
            (b) => b.slot.id === slot.id && (b.status === 'PENDING' || b.status === 'APPROVED'),
          )

          return (
            <li key={slot.id} className="flex flex-col gap-4 px-6 py-5 transition-colors duration-150 hover:bg-[#f8fafc] sm:flex-row sm:items-center">
              {/* Slot time */}
              <div className="flex shrink-0 flex-col gap-0.5 sm:w-40">
                <span className="text-sm font-bold text-[#0f172a]">{formatWeekdayDate(slot.startsAt)}</span>
                <span className="text-sm text-[#64748b]">
                  {formatTime(slot.startsAt)} – {formatTime(slot.endsAt)}
                </span>
              </div>

              {/* Booking details */}
              <div className="flex flex-1 items-center gap-3">
                {!booking ? (
                  <StatusBadge label="Open" tone="neutral" />
                ) : (
                  <>
                    {booking.boat.imageUrl ? (
                      <img
                        src={booking.boat.imageUrl}
                        alt=""
                        className="size-12 shrink-0 rounded-lg object-cover ring-1 ring-[#e5e7eb]"
                      />
                    ) : (
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#f1f5f9] text-[10px] font-medium text-[#94a3b8]">
                        No photo
                      </span>
                    )}
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge
                          label={booking.status === 'APPROVED' ? 'Booked' : 'Pending'}
                          tone={booking.status === 'APPROVED' ? 'success' : 'progress'}
                        />
                        <span className="text-sm font-bold text-navy-dark capitalize">{booking.boat.name}</span>
                      </div>
                      <a
                        href={`/admin-portal/buyers/${booking.buyer.id}`}
                        className="w-fit text-sm font-medium text-[#334155] hover:text-navy-dark hover:underline"
                      >
                        {booking.buyer.firstName} {booking.buyer.surname}
                      </a>
                      <span className="text-xs text-[#94a3b8]">
                        {booking.buyer.email}
                        {booking.buyer.phone ? ` · ${booking.buyer.phone}` : ''}
                      </span>
                      {booking.notes && <span className="max-w-md text-xs text-[#64748b] italic">&ldquo;{booking.notes}&rdquo;</span>}
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-2 sm:justify-end">
                {!booking && (
                  <ActionButton label="Delete" variant="delete" icon={TrashIcon} onClick={() => onDelete(slot.id)} />
                )}
                {booking && booking.status === 'PENDING' && (
                  <>
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
                  </>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
