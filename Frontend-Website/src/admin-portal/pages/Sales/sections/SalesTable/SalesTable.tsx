import { useMemo, useState } from 'react'
import type { ApiSale, SaleStatus } from '../../../../lib/api'
import StatusBadge, { type BadgeTone } from '../../../../components/StatusBadge/StatusBadge'
import ActionButton from '../../../../components/ActionButton/ActionButton'
import { EyeIcon, PlusIcon, TrashIcon } from '../../../../components/ActionButton/icons'
import chevronLeft from '../../../../../seller-portal/assets/MyBoats/chevron-left.svg'
import chevronRight from '../../../../../seller-portal/assets/MyBoats/chevron-right.svg'

// Column headers already state "(£)", so cells here are plain grouped
// numbers rather than repeating a currency symbol per row.
function formatAmount(value: number) {
  return value.toLocaleString('en-GB')
}

type SalesTableProps = {
  sales: ApiSale[]
  onDelete: (sale: ApiSale) => void
}

const tabs: { label: string; status: SaleStatus | 'All' }[] = [
  { label: 'All', status: 'All' },
  { label: 'Current', status: 'CURRENT' },
  { label: 'Completed', status: 'COMPLETED' },
  { label: 'Cancelled', status: 'CANCELLED' },
]

const statusLabels: Record<SaleStatus, string> = {
  CURRENT: 'Current',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

const statusTones: Record<SaleStatus, BadgeTone> = {
  CURRENT: 'info',
  COMPLETED: 'success',
  CANCELLED: 'danger',
}

const pageSizeOptions = [5, 10, 20]

export default function SalesTable({ sales, onDelete }: SalesTableProps) {
  const [activeTab, setActiveTab] = useState<SaleStatus | 'All'>('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return sales.filter((sale) => {
      const matchesTab = activeTab === 'All' || sale.status === activeTab
      const matchesSearch =
        query === '' ||
        sale.boat.name.toLowerCase().includes(query) ||
        sale.seller.name.toLowerCase().includes(query) ||
        `${sale.buyer.firstName} ${sale.buyer.surname}`.toLowerCase().includes(query)
      return matchesTab && matchesSearch
    })
  }, [sales, activeTab, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * pageSize
  const paginated = filtered.slice(pageStart, pageStart + pageSize)

  function selectTab(status: SaleStatus | 'All') {
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
          <input
            type="search"
            value={search}
            onChange={(event) => updateSearch(event.target.value)}
            placeholder="Search sales..."
            className="h-8 w-48 rounded-md border border-[#e5e7eb] bg-[#f8fafc] px-3 text-xs text-ink placeholder:text-[#9ca3af] focus:border-navy-dark focus:outline-none"
          />
          <ActionButton href="/admin-portal/sales/new" label="Add New Sale" variant="primary" icon={PlusIcon} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[64rem] border-collapse">
          <thead>
            <tr className="bg-[#f8fafc]">
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                #
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Status
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Boat Name
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Seller
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Buyer
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Sold Price (£)
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Deposit (£)
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Balance (£)
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Comm (£)
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((sale, index) => (
              <tr key={sale.id} className="border-t border-[#f3f4f6]">
                <td className="px-5 py-2.5 text-xs text-[#64748b]">{pageStart + index + 1}</td>
                <td className="px-5 py-2.5">
                  <StatusBadge label={statusLabels[sale.status]} tone={statusTones[sale.status]} />
                </td>
                <td className="px-5 py-2.5 font-display text-sm text-[#0a192f]">{sale.boat.name}</td>
                <td className="px-5 py-2.5 text-xs text-[#64748b]">{sale.seller.name}</td>
                <td className="px-5 py-2.5 text-xs text-[#64748b]">
                  {sale.buyer.firstName} {sale.buyer.surname}
                </td>
                <td className="px-5 py-2.5 text-right text-xs font-bold text-[#0a192f]">{formatAmount(sale.soldPrice)}</td>
                <td className="px-5 py-2.5 text-right text-xs text-[#64748b]">{formatAmount(sale.deposit)}</td>
                <td className="px-5 py-2.5 text-right text-xs text-[#64748b]">{formatAmount(sale.balance)}</td>
                <td className="px-5 py-2.5 text-right text-xs text-[#64748b]">{formatAmount(sale.commission)}</td>
                <td className="px-5 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <ActionButton href={`/admin-portal/sales/${sale.id}`} label="View Details" icon={EyeIcon} />
                    <ActionButton label="Delete" variant="delete" icon={TrashIcon} onClick={() => onDelete(sale)} />
                  </div>
                </td>
              </tr>
            ))}

            {paginated.length === 0 && (
              <tr>
                <td colSpan={10} className="px-5 py-8 text-center text-sm text-[#64748b]">
                  {sales.length === 0
                    ? 'No sales yet.'
                    : search
                      ? `No sales match "${search}".`
                      : 'No sales in this category.'}
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
            of <span className="font-semibold text-[#0f172a]">{filtered.length}</span> sales
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
