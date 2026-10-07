import { useEffect, useState } from 'react'
import AdminShell from '../../components/AdminShell/AdminShell'
import { useAdminSession } from '../../data/useAdminSession'
import { deleteBoat, fetchBoats, restoreBoat, updateBoatFeatured, updateBoatSaleStatus, type ApiBoat } from '../../../lib/api'
import BoatsTable, { type SaleStatus } from './sections/BoatsTable/BoatsTable'

const MAX_FEATURED_BOATS = 4

export default function Boats() {
  const { checkedSession } = useAdminSession()
  const [boats, setBoats] = useState<ApiBoat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    // includeDeleted: the admin Boats page must still show deleted boats
    // (tagged "Deleted") — only the public storefront excludes them.
    fetchBoats({ includeDeleted: true })
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

  async function handleDeleteToggle(boatId: number, nextDeleted: boolean) {
    setUpdatingId(boatId)
    setActionError(null)
    try {
      const updated = nextDeleted ? await deleteBoat(boatId) : await restoreBoat(boatId)
      setBoats((prev) => prev.map((boat) => (boat.id === boatId ? updated : boat)))
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update boat.')
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleSaleStatusChange(boatId: number, status: SaleStatus) {
    setUpdatingId(boatId)
    setActionError(null)
    try {
      const updated = await updateBoatSaleStatus(boatId, {
        isSold: status === 'Sold',
        isUnderOffer: status === 'Under Offer',
      })
      setBoats((prev) => prev.map((boat) => (boat.id === boatId ? updated : boat)))
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update boat status.')
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleFeaturedChange(boatId: number, isFeatured: boolean) {
    setActionError(null)
    if (isFeatured) {
      const target = boats.find((boat) => boat.id === boatId)
      if (target?.isSold || target?.isUnderOffer) {
        setActionError('Boats that are under offer or sold cannot be featured.')
        return
      }
      const featuredCount = boats.filter((boat) => boat.isFeatured && !boat.isDeleted && boat.id !== boatId).length
      if (featuredCount >= MAX_FEATURED_BOATS) {
        setActionError(`You can only have ${MAX_FEATURED_BOATS} featured boats at a time.`)
        return
      }
    }
    setUpdatingId(boatId)
    try {
      const updated = await updateBoatFeatured(boatId, isFeatured)
      setBoats((prev) => prev.map((boat) => (boat.id === boatId ? updated : boat)))
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update featured status.')
    } finally {
      setUpdatingId(null)
    }
  }

  if (!checkedSession) return null

  return (
    <AdminShell mainClassName="bg-frost">
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-[#0f172a]">Boats</h1>
          <p className="text-sm text-[#64748b]">Every boat currently live on the website — new submissions are moderated in Listings.</p>
        </div>

        {actionError && (
          <p className="rounded-md border border-[#fecaca] bg-[#fef2f2] px-4 py-2 text-sm font-medium text-[#dc2626]">
            {actionError}
          </p>
        )}

        {error ? (
          <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#fca5a5] bg-[#fef2f2] py-16 text-center text-[#b91c1c]">
            <p>Couldn&rsquo;t load boats from the server: {error}</p>
            <p className="text-sm text-[#6b7280]">Make sure the API server is running at http://localhost:4000.</p>
          </div>
        ) : loading ? (
          <div className="h-80 w-full animate-pulse rounded-lg border border-[#e2e8f0] bg-[#f8fafc]" />
        ) : (
          <BoatsTable
            boats={boats}
            onDeleteToggle={handleDeleteToggle}
            onSaleStatusChange={handleSaleStatusChange}
            onFeaturedChange={handleFeaturedChange}
            updatingId={updatingId}
          />
        )}
      </div>
    </AdminShell>
  )
}
