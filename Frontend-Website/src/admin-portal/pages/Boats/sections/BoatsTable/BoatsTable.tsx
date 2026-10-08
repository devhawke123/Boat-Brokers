import { useMemo, useState } from 'react'
import type { ApiBoat } from '../../../../../lib/api'
import { formatPrice } from '../../../../../seller-portal/lib/formatDate'
import StatusBadge, { type BadgeTone } from '../../../../components/StatusBadge/StatusBadge'
import ActionButton from '../../../../components/ActionButton/ActionButton'
import { EditIcon, EyeIcon, RestoreIcon, TrashIcon } from '../../../../components/ActionButton/icons'
import { confirmDialog } from '../../../../components/AdminDialog/AdminDialog'
import chevronLeft from '../../../../../seller-portal/assets/MyBoats/chevron-left.svg'
import chevronRight from '../../../../../seller-portal/assets/MyBoats/chevron-right.svg'

export type SaleStatus = 'Live' | 'Under Offer' | 'Sold'

type BoatsTableProps = {
  boats: ApiBoat[]
  onDeleteToggle: (boatId: number, nextDeleted: boolean) => void
  onPermanentDelete: (boatId: number) => void
  onSaleStatusChange: (boatId: number, status: SaleStatus) => void
  onFeaturedChange: (boatId: number, isFeatured: boolean) => void
  updatingId: number | null
}

type BoatFilter = 'All' | 'Live' | 'Under Offer' | 'Sold' | 'Deleted'

const tabs: BoatFilter[] = ['All', 'Live', 'Under Offer', 'Sold', 'Deleted']

function saleStatus(boat: ApiBoat): SaleStatus {
  if (boat.isSold) return 'Sold'
  if (boat.isUnderOffer) return 'Under Offer'
  return 'Live'
}

const saleStatusTones: Record<SaleStatus, BadgeTone> = {
  Live: 'success',
  'Under Offer': 'progress',
  Sold: 'neutral',
}

// Matches StatusBadge's success/progress/neutral tones so this dropdown
// reads as the same badge system, just made interactive.
const saleStatusSelectClasses: Record<SaleStatus, string> = {
  Live: 'bg-[#dcfce7] text-[#116a37] border-[#b6ecc9]',
  'Under Offer': 'bg-[#fef9c3] text-[#8a6116] border-[#fbe89a]',
  Sold: 'bg-[#f1f5f9] text-[#475569] border-[#e2e8f0]',
}

function boatStatus(boat: ApiBoat): { label: string; tone: BadgeTone } {
  // Deleted takes priority over sold/under-offer — it's an admin-only
  // archival state, not a real sale status.
  if (boat.isDeleted) return { label: 'Deleted', tone: 'danger' }
  const status = saleStatus(boat)
  return { label: status, tone: saleStatusTones[status] }
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

export default function BoatsTable({
  boats,
  onDeleteToggle,
  onPermanentDelete,
  onSaleStatusChange,
  onFeaturedChange,
  updatingId,
}: BoatsTableProps) {
  const [activeTab, setActiveTab] = useState<BoatFilter>('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return boats
      .filter((boat) => {
        const matchesSearch =
          query === '' || boat.name.toLowerCase().includes(query) || boat.seller.name.toLowerCase().includes(query)
        return matchesTab(boat, activeTab) && matchesSearch
      })
      // Ids are auto-incrementing, so the highest id is the most recently created boat.
      .sort((a, b) => b.id - a.id)
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
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Featured
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((boat) => {
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
                    {boat.isDeleted ? (
                      <StatusBadge label="Deleted" tone="danger" />
                    ) : (
                      <select
                        value={saleStatus(boat)}
                        disabled={updatingId === boat.id}
                        onChange={(event) => onSaleStatusChange(boat.id, event.target.value as SaleStatus)}
                        className={`rounded-full border px-3 py-1 text-xs font-semibold focus:outline-none disabled:opacity-60 ${saleStatusSelectClasses[saleStatus(boat)]}`}
                      >
                        <option value="Live">Live</option>
                        <option value="Under Offer">Under Offer</option>
                        <option value="Sold">Sold</option>
                      </select>
                    )}
                  </td>
                  <td className="px-5 py-2">
                    <input
                      type="checkbox"
                      checked={boat.isFeatured}
                      disabled={boat.isDeleted || updatingId === boat.id}
                      onChange={(event) => onFeaturedChange(boat.id, event.target.checked)}
                      aria-label={`Feature ${boat.name} on the home page`}
                      className="size-4 accent-navy-dark disabled:opacity-60"
                    />
                  </td>
                  <td className="px-5 py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!boat.isDeleted && (
                        <>
                          <ActionButton href={`/admin-portal/boats/${boat.id}/edit`} label="Edit" icon={EditIcon} />
                          <ActionButton
                            href={`/boats/${slugify(boat.name) || boat.id}`}
                            target="_blank"
                            rel="noreferrer"
                            label="View"
                            icon={EyeIcon}
                          />
                        </>
                      )}
                      {boat.isDeleted ? (
                        <>
                          <ActionButton
                            label="Restore"
                            variant="approve"
                            icon={RestoreIcon}
                            disabled={updatingId === boat.id}
                            onClick={() => onDeleteToggle(boat.id, false)}
                          />
                          <ActionButton
                            label="Delete Permanently"
                            variant="delete"
                            icon={TrashIcon}
                            disabled={updatingId === boat.id}
                            onClick={async () => {
                              const confirmed = await confirmDialog(
                                `Permanently delete "${boat.name}"? This removes the boat, its photos and its listing for good and cannot be undone.`,
                                { title: 'Delete permanently' },
                              )
                              if (confirmed) onPermanentDelete(boat.id)
                            }}
                          />
                        </>
                      ) : (
                        <ActionButton
                          label="Delete"
                          variant="delete"
                          icon={TrashIcon}
                          disabled={updatingId === boat.id}
                          onClick={async () => {
                            const confirmed = await confirmDialog(
                              `Delete "${boat.name}"? It will be removed from the storefront immediately.`,
                              { title: 'Delete boat' },
                            )
                            if (confirmed) onDeleteToggle(boat.id, true)
                          }}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}

            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-[#64748b]">
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
