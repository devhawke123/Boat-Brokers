import { useMemo, useState } from 'react'
import type { ApiLead, LeadStatus } from '../../../../lib/api'
import { formatDate } from '../../../../../seller-portal/lib/formatDate'
import StatusBadge, { type BadgeTone } from '../../../../components/StatusBadge/StatusBadge'
import ActionButton from '../../../../components/ActionButton/ActionButton'
import { EyeIcon, PlusIcon, TrashIcon } from '../../../../components/ActionButton/icons'
import chevronLeft from '../../../../../seller-portal/assets/MyBoats/chevron-left.svg'
import chevronRight from '../../../../../seller-portal/assets/MyBoats/chevron-right.svg'

type LeadsTableProps = {
  leads: ApiLead[]
  onDelete: (lead: ApiLead) => void
}

const tabs: { label: string; status: LeadStatus | 'All' }[] = [
  { label: 'All', status: 'All' },
  { label: 'New', status: 'NEW' },
  { label: 'Contacted', status: 'CONTACTED' },
  { label: 'Listed', status: 'LISTED' },
  { label: 'Lost', status: 'LOST' },
]

const statusLabels: Record<LeadStatus, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  LISTED: 'Listed',
  LOST: 'Lost',
}

const statusTones: Record<LeadStatus, BadgeTone> = {
  NEW: 'info',
  CONTACTED: 'progress',
  LISTED: 'success',
  LOST: 'danger',
}

const pageSizeOptions = [5, 10, 20]

export default function LeadsTable({ leads, onDelete }: LeadsTableProps) {
  const [activeTab, setActiveTab] = useState<LeadStatus | 'All'>('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return leads.filter((lead) => {
      const matchesTab = activeTab === 'All' || lead.status === activeTab
      const fullName = `${lead.firstName} ${lead.surname}`.toLowerCase()
      const matchesSearch = query === '' || fullName.includes(query) || lead.email.toLowerCase().includes(query)
      return matchesTab && matchesSearch
    })
  }, [leads, activeTab, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * pageSize
  const paginated = filtered.slice(pageStart, pageStart + pageSize)

  function selectTab(status: LeadStatus | 'All') {
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
            placeholder="Search leads..."
            className="h-8 w-48 rounded-md border border-[#e5e7eb] bg-[#f8fafc] px-3 text-xs text-ink placeholder:text-[#9ca3af] focus:border-navy-dark focus:outline-none"
          />
          <ActionButton href="/admin-portal/leads/new" label="Add New Lead" variant="primary" icon={PlusIcon} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[52rem] border-collapse">
          <thead>
            <tr className="bg-[#f8fafc]">
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Lead
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Email
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Source
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Status
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Added
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((lead) => (
              <tr key={lead.id} className="border-t border-[#f3f4f6]">
                <td className="px-5 py-2.5 font-display text-sm text-[#0a192f]">
                  {lead.firstName} {lead.surname}
                </td>
                <td className="px-5 py-2.5 text-xs text-[#64748b]">{lead.email}</td>
                <td className="px-5 py-2.5 text-xs text-[#64748b]">{lead.source ?? '—'}</td>
                <td className="px-5 py-2.5">
                  <StatusBadge label={statusLabels[lead.status]} tone={statusTones[lead.status]} />
                </td>
                <td className="px-5 py-2.5 text-xs text-[#64748b]">{formatDate(lead.createdAt)}</td>
                <td className="px-5 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <ActionButton href={`/admin-portal/leads/${lead.id}`} label="View Details" icon={EyeIcon} />
                    <ActionButton label="Delete" variant="delete" icon={TrashIcon} onClick={() => onDelete(lead)} />
                  </div>
                </td>
              </tr>
            ))}

            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-[#64748b]">
                  {leads.length === 0
                    ? 'No leads yet.'
                    : search
                      ? `No leads match "${search}".`
                      : 'No leads in this category.'}
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
            of <span className="font-semibold text-[#0f172a]">{filtered.length}</span> leads
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
