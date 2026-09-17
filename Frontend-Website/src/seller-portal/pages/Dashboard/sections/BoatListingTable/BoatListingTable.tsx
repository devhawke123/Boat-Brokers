import { useState } from 'react'
import type { ApiBoatListing, ListingStatus } from '../../../../lib/api'
import { formatDateTime } from '../../../../lib/formatDate'

type BoatListingTableProps = {
  listings: ApiBoatListing[]
}

const tabs: { label: string; status: ListingStatus | 'All' }[] = [
  { label: 'All', status: 'All' },
  { label: 'Pending', status: 'PENDING' },
  { label: 'Approved', status: 'APPROVED' },
  { label: 'Rejected', status: 'REJECTED' },
]

const statusLabels: Record<ListingStatus, string> = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
}

const statusBadgeClasses: Record<ListingStatus, string> = {
  APPROVED: 'bg-[#dcfce7] text-[#15803d]',
  PENDING: 'bg-[#fef9c3] text-[#a16207]',
  REJECTED: 'bg-[#ffeae9] text-[#dc2626]',
}

export default function BoatListingTable({ listings }: BoatListingTableProps) {
  const [activeTab, setActiveTab] = useState<ListingStatus | 'All'>('All')

  const filtered = activeTab === 'All' ? listings : listings.filter((listing) => listing.status === activeTab)

  return (
    <div className="w-full overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="border-b border-[#f3f4f6] px-5 py-3.5">
        <h2 className="font-display text-lg text-[#0f172a] capitalize">Boat Listing</h2>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-[#f3f4f6] bg-[#eff6fd] px-5 py-3.5">
        {tabs.map((tab) => (
          <button
            key={tab.status}
            type="button"
            onClick={() => setActiveTab(tab.status)}
            className={
              activeTab === tab.status
                ? 'rounded-md bg-[#eff6ff] px-3.5 py-1.5 text-xs font-bold text-[#0b3a58]'
                : 'rounded-md px-3.5 py-1.5 text-xs font-semibold text-[#6b7280] transition-colors duration-300 hover:text-[#0b3a58]'
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[32rem] border-collapse">
          <thead>
            <tr className="bg-[#f8fafc]">
              <th className="px-5 py-3.5 text-left text-[10px] font-bold tracking-[0.08em] text-[#64748b] uppercase">
                Listing
              </th>
              <th className="px-5 py-3.5 text-left text-[10px] font-bold tracking-[0.08em] text-[#64748b] uppercase">
                Submitted
              </th>
              <th className="px-5 py-3.5 text-right text-[10px] font-bold tracking-[0.08em] text-[#64748b] uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((listing) => (
              <tr key={listing.id} className="border-t border-[#f3f4f6]">
                <td className="py-2 pr-5 pl-5">
                  <div className="flex items-center gap-2.5">
                    {listing.boat.imageUrl ? (
                      <img
                        src={listing.boat.imageUrl}
                        alt=""
                        className="size-11 shrink-0 rounded-[5px] object-cover"
                      />
                    ) : (
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-[5px] bg-[#f1f5f9] text-[10px] text-[#94a3b8]">
                        No photo
                      </span>
                    )}
                    <span className="font-display text-sm text-[#0a192f]">{listing.boat.name}</span>
                  </div>
                </td>
                <td className="px-5 py-2 text-sm text-[#64748b]">{formatDateTime(listing.createdAt)}</td>
                <td className="px-5 py-2 text-right">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-[3px] text-[9.5px] font-bold ${statusBadgeClasses[listing.status]}`}
                  >
                    {statusLabels[listing.status]}
                  </span>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-6 text-center text-sm text-[#64748b]">
                  {listings.length === 0 ? 'No listings yet.' : 'No listings in this category.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
