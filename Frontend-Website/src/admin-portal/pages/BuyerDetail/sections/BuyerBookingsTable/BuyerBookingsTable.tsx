import type { ApiBuyerBooking, BookingStatus } from '../../../../lib/api'
import { formatDateTime } from '../../../../../seller-portal/lib/formatDate'
import StatusBadge, { type BadgeTone } from '../../../../components/StatusBadge/StatusBadge'

type BuyerBookingsTableProps = {
  bookings: ApiBuyerBooking[]
}

const statusLabels: Record<BookingStatus, string> = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
}

const statusTones: Record<BookingStatus, BadgeTone> = {
  APPROVED: 'success',
  PENDING: 'progress',
  REJECTED: 'danger',
}

export default function BuyerBookingsTable({ bookings }: BuyerBookingsTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="border-b border-[#f3f4f6] px-5 py-3">
        <h2 className="text-sm font-bold text-[#102a43]">Viewing Requests</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse">
          <thead>
            <tr className="bg-[#f8fafc]">
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Boat
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Slot
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Requested
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-t border-[#f3f4f6]">
                <td className="px-5 py-2.5">
                  <div className="flex items-center gap-2.5">
                    {booking.boat.imageUrl ? (
                      <img src={booking.boat.imageUrl} alt="" className="size-11 shrink-0 rounded-[5px] object-cover" />
                    ) : (
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-[5px] bg-[#f1f5f9] text-[10px] text-[#94a3b8]">
                        No photo
                      </span>
                    )}
                    <span className="font-display text-sm text-[#0a192f]">{booking.boat.name}</span>
                  </div>
                </td>
                <td className="px-5 py-2.5 text-xs text-[#64748b]">
                  {formatDateTime(booking.slot.startsAt)} – {formatDateTime(booking.slot.endsAt)}
                </td>
                <td className="px-5 py-2.5 text-xs text-[#64748b]">{formatDateTime(booking.createdAt)}</td>
                <td className="px-5 py-2.5">
                  <StatusBadge label={statusLabels[booking.status]} tone={statusTones[booking.status]} />
                </td>
              </tr>
            ))}

            {bookings.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-sm text-[#64748b]">
                  No viewing requests from this buyer yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
