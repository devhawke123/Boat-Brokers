import { useState } from 'react'
import AdminShell from '../../components/AdminShell/AdminShell'
import { useAdminSession } from '../../data/useAdminSession'
import { useLeads, invalidateLeadsCache } from '../../data/useLeads'
import { deleteLead, updateLeadStatus, type LeadStatus } from '../../lib/api'
import { formatDate } from '../../../seller-portal/lib/formatDate'

type LeadDetailProps = {
  leadId: number
}

const statusOptions: { value: LeadStatus; label: string }[] = [
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'LISTED', label: 'Listed' },
  { value: 'LOST', label: 'Lost' },
]

export default function LeadDetail({ leadId }: LeadDetailProps) {
  const { checkedSession } = useAdminSession()
  const { leads, loading, error, refetch } = useLeads()
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const lead = leads.find((l) => l.id === leadId) ?? null

  async function handleStatusChange(status: LeadStatus) {
    setUpdatingStatus(true)
    setActionError(null)
    try {
      await updateLeadStatus(leadId, status)
      invalidateLeadsCache()
      refetch()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update status.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  async function handleDelete() {
    if (!lead) return
    if (!window.confirm(`Delete lead "${lead.firstName} ${lead.surname}"? This can't be undone.`)) return
    try {
      await deleteLead(lead.id)
      invalidateLeadsCache()
      window.location.href = '/admin-portal/leads'
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Failed to delete lead.')
    }
  }

  if (!checkedSession) return null

  return (
    <AdminShell mainClassName="bg-frost">
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <a href="/admin-portal/leads" className="w-fit text-sm font-semibold text-[#64748b] hover:text-[#0f172a]">
          ← Back to Leads
        </a>

        {error ? (
          <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#fca5a5] bg-[#fef2f2] py-16 text-center text-[#b91c1c]">
            <p>Couldn&rsquo;t load this lead from the server: {error}</p>
          </div>
        ) : loading ? (
          <div className="h-56 w-full animate-pulse rounded-lg border border-[#e2e8f0] bg-[#f8fafc]" />
        ) : !lead ? (
          <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#e2e8f0] bg-white py-16 text-center text-[#64748b]">
            <p>This lead couldn&rsquo;t be found.</p>
          </div>
        ) : (
          <>
            {actionError && (
              <p className="rounded-md border border-[#fecaca] bg-[#fef2f2] px-4 py-2 text-sm font-medium text-[#dc2626]">
                {actionError}
              </p>
            )}

            <div className="flex flex-col gap-5 rounded-lg border border-[#e2e8f0] bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-h5 text-[#0a192f]">
                    {lead.firstName} {lead.surname}
                  </h2>
                  <p className="text-sm text-[#64748b]">{lead.leadId}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`/admin-portal/leads/${lead.id}/edit`}
                    className="rounded-md border border-[#e2e8f0] px-3 py-1.5 text-xs font-bold text-[#102a43] transition-colors duration-300 hover:bg-[#f8fafc]"
                  >
                    Edit
                  </a>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="rounded-md border border-[#fecaca] px-3 py-1.5 text-xs font-bold text-[#dc2626] transition-colors duration-300 hover:bg-[#fef2f2]"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#64748b]">Email</span>
                  <span className="text-sm text-[#0f172a]">{lead.email}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#64748b]">Phone</span>
                  <span className="text-sm text-[#0f172a]">{lead.phone ?? '—'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#64748b]">Address</span>
                  <span className="text-sm text-[#0f172a]">{lead.address ?? '—'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#64748b]">Source</span>
                  <span className="text-sm text-[#0f172a]">{lead.source ?? '—'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#64748b]">Added</span>
                  <span className="text-sm text-[#0f172a]">{formatDate(lead.createdAt)}</span>
                </div>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-[#64748b]">Status</span>
                <select
                  value={lead.status}
                  disabled={updatingStatus}
                  onChange={(event) => handleStatusChange(event.target.value as LeadStatus)}
                  className="h-10 w-fit min-w-[10rem] rounded-md border border-[#e2e8f0] bg-white px-3 text-sm font-medium text-[#0f172a] focus:border-navy-dark focus:outline-none disabled:opacity-60"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              {lead.notes && (
                <div className="flex flex-col gap-1.5 border-t border-[#f3f4f6] pt-4">
                  <span className="text-xs font-semibold text-[#64748b]">Notes</span>
                  <p className="text-sm whitespace-pre-wrap text-[#0f172a]">{lead.notes}</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminShell>
  )
}
