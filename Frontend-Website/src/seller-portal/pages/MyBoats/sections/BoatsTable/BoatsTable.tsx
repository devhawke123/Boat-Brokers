import { useMemo, useState } from 'react'
import Button from '../../../../../components/Button/Button'
import type { ApiBoatListing, ListingStatus } from '../../../../lib/api'
import { formatDateTime, formatPrice } from '../../../../lib/formatDate'
import searchIcon from '../../../../assets/MyBoats/search-icon.svg'
import commentIcon from '../../../../assets/MyBoats/comment-icon.svg'
import chevronLeft from '../../../../assets/MyBoats/chevron-left.svg'
import chevronRight from '../../../../assets/MyBoats/chevron-right.svg'

type BoatsTableProps = {
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

const pageSizeOptions = [5, 10, 20]

export default function BoatsTable({ listings }: BoatsTableProps) {
  const [activeTab, setActiveTab] = useState<ListingStatus | 'All'>('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return listings.filter((listing) => {
      const matchesTab = activeTab === 'All' || listing.status === activeTab
      const matchesSearch = query === '' || listing.boat.name.toLowerCase().includes(query)
      return matchesTab && matchesSearch
    })
  }, [listings, activeTab, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * pageSize
  const paginated = filtered.slice(pageStart, pageStart + pageSize)

  function selectTab(status: ListingStatus | 'All') {
    setActiveTab(status)
    setPage(1)
  }

  function updateSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  function updatePageSize(size: number) {
    setPageSize(size)
    setPage(1)
  }

  function getReviewHref(listing: ApiBoatListing) {
    return listing.status === 'PENDING'
      ? `/seller-portal/boats/new?step=5&listingId=${listing.id}`
      : `/seller-portal/listings/${listing.id}`
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f3f4f6] px-5 py-3">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.status}
              type="button"
              onClick={() => selectTab(tab.status)}
              className={
                activeTab === tab.status
                  ? 'rounded-md bg-[#eff6ff] px-3 py-1.5 text-xs font-bold text-[#2563eb]'
                  : 'rounded-md px-3 py-1.5 text-xs font-semibold text-[#6b7280] transition-colors duration-300 hover:text-[#2563eb]'
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <label className="relative flex items-center">
            <img src={searchIcon} alt="" aria-hidden="true" className="absolute left-3 size-3" />
            <input
              type="search"
              value={search}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Search listings..."
              className="h-8 w-48 rounded-md border border-[#e5e7eb] bg-[#f8fafc] pr-3 pl-8 text-xs text-ink placeholder:text-[#9ca3af] focus:border-navy-dark focus:outline-none"
            />
          </label>

          <Button variant="dark" label="Add New Boat" icon="none" href="/seller-portal/boats/new" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[52rem] border-collapse">
          <thead>
            <tr className="bg-[#f8fafc]">
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Listing
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
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Comments
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((listing) => (
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
                <td className="px-5 py-2 text-xs text-[#64748b]">{formatDateTime(listing.createdAt)}</td>
                <td className="px-5 py-2 text-xs font-bold text-[#0a192f]">{formatPrice(listing.boat.price)}</td>
                <td className="px-5 py-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-[3px] text-[9.5px] font-bold ${statusBadgeClasses[listing.status]}`}
                  >
                    {statusLabels[listing.status]}
                  </span>
                </td>
                <td className="px-5 py-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#475569]">
                    <img src={commentIcon} alt="" aria-hidden="true" className="size-3" />
                    {listing.comments.length}
                  </div>
                </td>
                <td className="px-5 py-2 text-right">
                  <a
                    href={getReviewHref(listing)}
                    className="inline-flex items-center justify-center rounded-md border border-[#e5e7eb] px-3 py-1 text-[9.5px] font-bold text-[#102a43] transition-colors duration-300 hover:bg-[#f8fafc]"
                  >
                    Review
                  </a>
                </td>
              </tr>
            ))}

            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-[#64748b]">
                  {listings.length === 0
                    ? 'No listings yet.'
                    : search
                      ? `No listings match "${search}".`
                      : 'No listings in this category.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e5eaf0] px-6 py-4">
          <p className="text-sm text-[#64748b]">
            Showing <span className="font-semibold text-[#0f172a]">{pageStart + 1}</span> to{' '}
            <span className="font-semibold text-[#0f172a]">{Math.min(pageStart + pageSize, filtered.length)}</span>{' '}
            of <span className="font-semibold text-[#0f172a]">{filtered.length}</span> listings
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex size-9 items-center justify-center rounded-lg border border-[#e5eaf0] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous page"
            >
              <img src={chevronLeft} alt="" className="h-3 w-[0.47rem]" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNumber = i + 1
              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={
                    pageNumber === currentPage
                      ? 'flex size-9 items-center justify-center rounded-lg bg-navy-dark text-sm font-bold text-white'
                      : 'flex size-9 items-center justify-center rounded-lg text-sm font-medium text-[#0f172a] transition-colors duration-300 hover:bg-[#f8fafc]'
                  }
                >
                  {pageNumber}
                </button>
              )
            })}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex size-9 items-center justify-center rounded-lg border border-[#e5eaf0] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next page"
            >
              <img src={chevronRight} alt="" className="h-3 w-[0.47rem]" />
            </button>
          </div>

          <label className="flex items-center gap-2 text-sm text-[#64748b]">
            Show
            <select
              value={pageSize}
              onChange={(event) => updatePageSize(Number(event.target.value))}
              className="rounded-lg border border-[#e5eaf0] bg-white px-3 py-1.5 text-sm font-semibold text-[#0f172a] focus:border-navy-dark focus:outline-none"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            per page
          </label>
        </div>
      )}
    </div>
  )
}
