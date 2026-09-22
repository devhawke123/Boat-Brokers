import AdminShell from '../../components/AdminShell/AdminShell'
import { useAdminSession } from '../../data/useAdminSession'
import { useLeads, invalidateLeadsCache } from '../../data/useLeads'
import { deleteLead, type ApiLead } from '../../lib/api'
import LeadsTable from './sections/LeadsTable/LeadsTable'

export default function Leads() {
  const { checkedSession } = useAdminSession()
  const { leads, loading, error, refetch } = useLeads()

  async function handleDelete(lead: ApiLead) {
    if (!window.confirm(`Delete lead "${lead.firstName} ${lead.surname}"? This can't be undone.`)) return
    try {
      await deleteLead(lead.id)
      invalidateLeadsCache()
      refetch()
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Failed to delete lead.')
    }
  }

  if (!checkedSession) return null

  return (
    <AdminShell mainClassName="bg-frost">
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Leads</h1>

        {error ? (
          <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#fca5a5] bg-[#fef2f2] py-16 text-center text-[#b91c1c]">
            <p>Couldn&rsquo;t load leads from the server: {error}</p>
            <p className="text-sm text-[#6b7280]">Make sure the API server is running at http://localhost:4000.</p>
          </div>
        ) : loading ? (
          <div className="h-80 w-full animate-pulse rounded-lg border border-[#e2e8f0] bg-[#f8fafc]" />
        ) : (
          <LeadsTable leads={leads} onDelete={handleDelete} />
        )}
      </div>
    </AdminShell>
  )
}
