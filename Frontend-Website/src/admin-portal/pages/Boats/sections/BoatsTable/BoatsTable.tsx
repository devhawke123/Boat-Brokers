import { useMemo, useState } from 'react'
import type { ApiBoat } from '../../../../../lib/api'
import { formatPrice } from '../../../../../seller-portal/lib/formatDate'
import StatusBadge, { type BadgeTone } from '../../../../components/StatusBadge/StatusBadge'
import ActionButton from '../../../../components/ActionButton/ActionButton'
import { EditIcon, EyeIcon } from '../../../../components/ActionButton/icons'
import chevronLeft from '../../../../../seller-portal/assets/MyBoats/chevron-left.svg'
import chevronRight from '../../../../../seller-portal/assets/MyBoats/chevron-right.svg'

type BoatsTableProps = {
  boats: ApiBoat[]
}

type BoatFilter = 'All' | 'Live' | 'Under Offer' | 'Sold'

const tabs: BoatFilter[] = ['All', 'Live', 'Under Offer', 'Sold']

function boatStatus(boat: ApiBoat): { label: string; tone: BadgeTone } {
  if (boat.isSold) return { label: 'Sold', tone: 'neutral' }
  if (boat.isUnderOffer) return { label: 'Under Offer', tone: 'progress' }
  return { label: 'Live', tone: 'success' }
}

function matchesTab(boat: ApiBoat, tab: BoatFilter) {
  if (tab === 'All') return true
  return boatStatus(boat).label === tab
}

// Matches the public site's own slug derivation (src/data/boats.ts) so the
// "View" link lands on the same URL the storefront uses for this boat.
function slugify(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || ''
  )
}

const pageSizeOptions = [10, 20, 50]

export default function BoatsTable({ boats }: BoatsTableProps) {
  const [activeTab, setActiveTab] = useState<BoatFilter>('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return boats.filter((boat) => {
      const matchesSearch =
        query === '' || boat.name.toLowerCase().includes(query) || boat.seller.name.toLowerCase().includes(query)
      return matchesTab(boat, activeTab) && matchesSearch
    })
  }, [boats, activeTab, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * pageSize
  const paginated = filtered.slice(pageStart, pageStart + pageSize)

  function selectTab(tab: BoatFilter) {
    setActiveTab(tab)
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

  return (
    <div className="w-full overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f3f4f6] px-5 py-3">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => selectTab(tab)}
              className={
                activeTab === tab
                  ? 'rounded-md bg-[#eff6ff] px-3 py-1.5 text-xs font-bold text-[#2563eb]'
                  : 'rounded-md px-3 py-1.5 text-xs font-semibold text-[#6b7280] transition-colors duration-300 hover:text-[#2563eb]'
              }
            >
              {tab}
            </button>
          ))}
        </div>

        <input
          type="search"
          value={search}
          onChange={(event) => updateSearch(event.target.value)}
          placeholder="Search by boat or seller..."
          className="h-8 w-64 rounded-md border border-[#e5e7eb] bg-[#f8fafc] px-3 text-xs text-ink placeholder:text-[#9ca3af] focus:border-navy-dark focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[56rem] border-collapse">
          <thead>
            <tr className="bg-[#f8fafc]">
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Boat
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Seller
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
            {paginated.map((boat) => {
              const status = boatStatus(boat)
              return (
                <tr key={boat.id} className="border-t border-[#f3f4f6]">
                  <td className="py-2 pr-5 pl-5">
                    <div className="flex items-center gap-2.5">
                      {boat.imageUrl ? (
                        <img src={boat.imageUrl} alt="" className="size-11 shrink-0 rounded-[5px] object-cover" />
                      ) : (
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-[5px] bg-[#f1f5f9] text-[10px] text-[#94a3b8]">
                          No photo
                        </span>
                      )}
                      <span className="font-display text-sm text-[#0a192f]">{boat.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-2 text-xs text-[#64748b]">
                    <a href={`/admin-portal/sellers/${boat.sellerId}`} className="font-semibold text-[#2563eb] hover:underline">
                      {boat.seller.name}
                    </a>
                  </td>
                  <td className="px-5 py-2 text-xs font-bold text-[#0a192f]">{formatPrice(boat.price)}</td>
                  <td className="px-5 py-2">
                    <StatusBadge label={status.label} tone={status.tone} />
                  </td>
                  <td className="px-5 py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <ActionButton href={`/admin-portal/boats/${boat.id}/edit`} label="Edit" icon={EditIcon} />
                      <ActionButton
                        href={`/boats/${slugify(boat.name) || boat.id}`}
                        target="_blank"
                        rel="noreferrer"
                        label="View"
                        icon={EyeIcon}
                      />
                    </div>
                  </td>
                </tr>
              )
            })}

            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-[#64748b]">
                  {boats.length === 0 ? 'No boats yet.' : search ? `No boats match "${search}".` : 'No boats in this category.'}
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
            of <span className="font-semibold text-[#0f172a]">{filtered.length}</span> boats
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
                      ? 'flex size-9 items-center justify-center rounded-lg bg-navy-dark text-sm font-bold text-white shadow-[0_1px_2px_rgba(10,67,89,0.35)]'
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
