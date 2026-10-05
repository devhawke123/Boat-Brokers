import type { SVGProps } from 'react'
import type { ApiAvailabilitySlot } from '../../../../../lib/api'
import type { ApiAdminBooking } from '../../../../lib/api'
import { formatTime, formatWeekdayDate } from '../../../../../seller-portal/lib/formatDate'
import StatusBadge from '../../../../components/StatusBadge/StatusBadge'
import ActionButton from '../../../../components/ActionButton/ActionButton'
import { CheckIcon, CrossIcon, TrashIcon } from '../../../../components/ActionButton/icons'

function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="2.5" y="4.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3.5 5.5L10 11L16.5 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M5.5 3h2.2l1 3.2-1.6 1.4a9.5 9.5 0 0 0 4.3 4.3l1.4-1.6 3.2 1v2.2c0 .9-.8 1.6-1.7 1.5A13.5 13.5 0 0 1 4 4.7c-.1-.9.6-1.7 1.5-1.7Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

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
    <div className="flex flex-col gap-4">
      {slots.map((slot) => {
        // A slot's PENDING/APPROVED booking, if any — the backend never
        // returns more than one active booking per slot.
        const booking = bookings.find(
          (b) => b.slot.id === slot.id && (b.status === 'PENDING' || b.status === 'APPROVED'),
        )

        return (
          <div
            key={slot.id}
            className="flex flex-col gap-5 rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-colors duration-150 hover:border-[#cbd5e1] sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              {/* Slot time */}
              <div className="flex flex-col gap-0.5">
                <span className="text-base font-bold text-[#0f172a]">{formatWeekdayDate(slot.startsAt)}</span>
                <span className="text-sm text-[#64748b]">
                  {formatTime(slot.startsAt)} – {formatTime(slot.endsAt)}
                </span>
              </div>

              {!booking ? (
                <StatusBadge label="Open" tone="neutral" />
              ) : (
                <div className="flex shrink-0 items-center gap-2">
                  {booking.status === 'PENDING' && (
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
                  {booking.status === 'APPROVED' && (
                    <ActionButton
                      label="Cancel"
                      variant="reject"
                      icon={CrossIcon}
                      disabled={busyBookingId === booking.id}
                      onClick={() => onReject(booking.id)}
                    />
                  )}
                </div>
              )}
              {!booking && (
                <ActionButton label="Delete" variant="delete" icon={TrashIcon} onClick={() => onDelete(slot.id)} />
              )}
            </div>

            {booking && (
              <div className="flex flex-col gap-4 border-t border-[#f1f5f9] pt-5 sm:flex-row sm:items-start">
                {booking.boat.imageUrl ? (
                  <img
                    src={booking.boat.imageUrl}
                    alt=""
                    className="size-16 shrink-0 rounded-xl object-cover ring-1 ring-[#e5e7eb]"
                  />
                ) : (
                  <span className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-[#f1f5f9] text-[10px] font-medium text-[#94a3b8]">
                    No photo
                  </span>
                )}

                <div className="flex flex-1 flex-col gap-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge
                      label={booking.status === 'APPROVED' ? 'Booked' : 'Pending'}
                      tone={booking.status === 'APPROVED' ? 'success' : 'progress'}
                    />
                    <span className="text-base font-bold text-navy-dark capitalize">{booking.boat.name}</span>
                  </div>

                  <a
                    href={`/admin-portal/buyers/${booking.buyer.id}`}
                    className="w-fit text-sm font-semibold text-[#334155] hover:text-navy-dark hover:underline"
                  >
                    {booking.buyer.firstName} {booking.buyer.surname}
                  </a>

                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`mailto:${booking.buyer.email}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-badge-bg px-3 py-1.5 text-sm font-semibold text-badge-text hover:bg-[#c9effb]"
                    >
                      <MailIcon className="size-4 shrink-0" />
                      {booking.buyer.email}
                    </a>
                    {booking.buyer.phone && (
                      <a
                        href={`tel:${booking.buyer.phone}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#dcfce7] px-3 py-1.5 text-sm font-semibold text-[#116a37] hover:bg-[#bbf3cd]"
                      >
                        <PhoneIcon className="size-4 shrink-0" />
                        {booking.buyer.phone}
                      </a>
                    )}
                  </div>

                  {booking.notes && (
                    <span className="max-w-2xl text-sm text-[#64748b] italic">&ldquo;{booking.notes}&rdquo;</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
