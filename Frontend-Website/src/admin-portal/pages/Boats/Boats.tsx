import { useEffect, useState } from 'react'
import AdminShell from '../../components/AdminShell/AdminShell'
import { useAdminSession } from '../../data/useAdminSession'
import { fetchBoats, type ApiBoat } from '../../../lib/api'
import BoatsTable from './sections/BoatsTable/BoatsTable'

export default function Boats() {
  const { checkedSession } = useAdminSession()
  const [boats, setBoats] = useState<ApiBoat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchBoats()
      .then((data) => {
        if (!cancelled) setBoats(data)
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load boats.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (!checkedSession) return null

  return (
    <AdminShell mainClassName="bg-frost">
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-[#0f172a]">Boats</h1>
          <p className="text-sm text-[#64748b]">Every boat currently live on the website — new submissions are moderated in Listings.</p>
        </div>

        {error ? (
          <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#fca5a5] bg-[#fef2f2] py-16 text-center text-[#b91c1c]">
            <p>Couldn&rsquo;t load boats from the server: {error}</p>
            <p className="text-sm text-[#6b7280]">Make sure the API server is running at http://localhost:4000.</p>
          </div>
        ) : loading ? (
          <div className="h-80 w-full animate-pulse rounded-lg border border-[#e2e8f0] bg-[#f8fafc]" />
        ) : (
          <BoatsTable boats={boats} />
        )}
      </div>
    </AdminShell>
  )
}
