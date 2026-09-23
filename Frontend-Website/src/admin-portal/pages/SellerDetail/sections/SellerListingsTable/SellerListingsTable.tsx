import type { ApiBoatListing, ListingStatus } from '../../../../../seller-portal/lib/api'
import { formatDateTime, formatPrice } from '../../../../../seller-portal/lib/formatDate'
import StatusBadge, { type BadgeTone } from '../../../../components/StatusBadge/StatusBadge'
import ActionButton from '../../../../components/ActionButton/ActionButton'
import { CheckIcon, CommentIcon, CrossIcon } from '../../../../components/ActionButton/icons'

type SellerListingsTableProps = {
  listings: ApiBoatListing[]
  onStatusChange: (listingId: number, status: ListingStatus) => void
  updatingId: number | null
}

const statusLabels: Record<ListingStatus, string> = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
}

const statusTones: Record<ListingStatus, BadgeTone> = {
  APPROVED: 'success',
  PENDING: 'progress',
  REJECTED: 'danger',
}

export default function SellerListingsTable({ listings, onStatusChange, updatingId }: SellerListingsTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="border-b border-[#f3f4f6] px-5 py-3">
        <h2 className="text-sm font-bold text-[#102a43]">Boats & Listings</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[48rem] border-collapse">
          <thead>
            <tr className="bg-[#f8fafc]">
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Boat
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Submitted
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Price
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Status
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing.id} className="border-t border-[#f3f4f6]">
                <td className="py-2 pr-5 pl-5">
                  <div className="flex items-center gap-2.5">
                    {listing.boat.imageUrl ? (
                      <img src={listing.boat.imageUrl} alt="" className="size-11 shrink-0 rounded-[5px] object-cover" />
                    ) : (
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-[5px] bg-[#f1f5f9] text-[10px] text-[#94a3b8]">
                        No photo
                      </span>
                    )}
                    <span className="font-display text-sm text-[#0a192f]">{listing.boat.name}</span>
                  </div>
                </td>
                <td className="px-5 py-2 text-xs text-[#64748b]">{formatDateTime(listing.createdAt)}</td>
                <td className="px-5 py-2 text-xs font-bold text-[#0a192f]">{formatPrice(listing.boat.price)}</td>
                <td className="px-5 py-2">
                  <StatusBadge label={statusLabels[listing.status]} tone={statusTones[listing.status]} />
                </td>
                <td className="px-5 py-2 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {listing.status === 'PENDING' && (
                      <>
                        <ActionButton
                          label="Approve"
                          variant="approve"
                          icon={CheckIcon}
                          disabled={updatingId === listing.id}
                          onClick={() => onStatusChange(listing.id, 'APPROVED')}
                        />
                        <ActionButton
                          label="Reject"
                          variant="reject"
                          icon={CrossIcon}
                          disabled={updatingId === listing.id}
                          onClick={() => onStatusChange(listing.id, 'REJECTED')}
                        />
                      </>
                    )}
                    <ActionButton
                      href={`/admin-portal/listings/${listing.id}`}
                      label={`Comments (${listing.comments.length})`}
                      icon={CommentIcon}
                    />
                  </div>
                </td>
              </tr>
            ))}

            {listings.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-[#64748b]">
                  This seller hasn&rsquo;t listed any boats yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
