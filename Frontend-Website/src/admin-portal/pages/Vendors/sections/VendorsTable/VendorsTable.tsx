import { useMemo, useState } from 'react'
import type { ApiSeller, VendorStatus } from '../../../../../seller-portal/lib/api'
import { formatDate } from '../../../../../seller-portal/lib/formatDate'
import chevronLeft from '../../../../../seller-portal/assets/MyBoats/chevron-left.svg'
import chevronRight from '../../../../../seller-portal/assets/MyBoats/chevron-right.svg'

type VendorsTableProps = {
  vendors: ApiSeller[]
  boatCounts: Record<number, number>
  onDelete: (vendor: ApiSeller) => void
}

const tabs: { label: string; status: VendorStatus | 'All' }[] = [
  { label: 'All', status: 'All' },
  { label: 'New', status: 'NEW' },
  { label: 'Contacted', status: 'CONTACTED' },
  { label: 'Listed', status: 'LISTED' },
  { label: 'Lost', status: 'LOST' },
]

const statusLabels: Record<VendorStatus, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  LISTED: 'Listed',
  LOST: 'Lost',
}

const statusBadgeClasses: Record<VendorStatus, string> = {
  NEW: 'bg-[#dbeafe] text-[#1d4ed8]',
  CONTACTED: 'bg-[#fef9c3] text-[#a16207]',
  LISTED: 'bg-[#dcfce7] text-[#15803d]',
  LOST: 'bg-[#ffeae9] text-[#dc2626]',
}

const pageSizeOptions = [5, 10, 20]

export default function VendorsTable({ vendors, boatCounts, onDelete }: VendorsTableProps) {
  const [activeTab, setActiveTab] = useState<VendorStatus | 'All'>('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return vendors.filter((vendor) => {
      const matchesTab = activeTab === 'All' || vendor.status === activeTab
      const matchesSearch =
        query === '' || vendor.name.toLowerCase().includes(query) || vendor.email.toLowerCase().includes(query)
      return matchesTab && matchesSearch
    })
  }, [vendors, activeTab, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * pageSize
  const paginated = filtered.slice(pageStart, pageStart + pageSize)

  function selectTab(status: VendorStatus | 'All') {
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
            placeholder="Search vendors..."
            className="h-8 w-48 rounded-md border border-[#e5e7eb] bg-[#f8fafc] px-3 text-xs text-ink placeholder:text-[#9ca3af] focus:border-navy-dark focus:outline-none"
          />
          <a
            href="/admin-portal/vendors/new"
            className="inline-flex h-8 items-center rounded-md bg-navy-dark px-3 text-xs font-bold text-white transition-opacity duration-300 hover:opacity-90"
          >
            Add New Vendor
          </a>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[56rem] border-collapse">
          <thead>
            <tr className="bg-[#f8fafc]">
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Vendor
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Email
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Phone
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Boats
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Status
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Joined
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((vendor) => (
              <tr key={vendor.id} className="border-t border-[#f3f4f6]">
                <td className="px-5 py-2.5 font-display text-sm text-[#0a192f]">{vendor.name}</td>
                <td className="px-5 py-2.5 text-xs text-[#64748b]">{vendor.email}</td>
                <td className="px-5 py-2.5 text-xs text-[#64748b]">{vendor.phone ?? '—'}</td>
                <td className="px-5 py-2.5 text-xs font-semibold text-[#0f172a]">{boatCounts[vendor.id] ?? 0}</td>
                <td className="px-5 py-2.5">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-[3px] text-[9.5px] font-bold ${statusBadgeClasses[vendor.status]}`}
                  >
                    {statusLabels[vendor.status]}
                  </span>
                </td>
                <td className="px-5 py-2.5 text-xs text-[#64748b]">{formatDate(vendor.joiningDate)}</td>
                <td className="px-5 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={`/admin-portal/vendors/${vendor.id}`}
                      className="inline-flex items-center justify-center rounded-md border border-[#e5e7eb] px-3 py-1 text-[9.5px] font-bold text-[#102a43] transition-colors duration-300 hover:bg-[#f8fafc]"
                    >
                      View Details
                    </a>
                    <button
                      type="button"
                      onClick={() => onDelete(vendor)}
                      className="inline-flex items-center justify-center rounded-md border border-[#fecaca] px-3 py-1 text-[9.5px] font-bold text-[#dc2626] transition-colors duration-300 hover:bg-[#fef2f2]"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {paginated.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-sm text-[#64748b]">
                  {vendors.length === 0
                    ? 'No vendors yet.'
                    : search
                      ? `No vendors match "${search}".`
                      : 'No vendors in this category.'}
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
            of <span className="font-semibold text-[#0f172a]">{filtered.length}</span> vendors
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
