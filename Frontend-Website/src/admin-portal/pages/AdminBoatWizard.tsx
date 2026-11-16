import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import BoatWizard from '../../seller-portal/pages/BoatWizard'
import { ListingsProvider } from '../../seller-portal/context/ListingsProvider'
import { SessionContext } from '../../seller-portal/context/useSession'
import { fetchListing, fetchSeller, type ApiSeller } from '../../seller-portal/lib/api'
import { AccountButton } from '../../seller-portal/components/V2AccountSettings'

// Admin create/edit reuses the seller BoatWizard with `admin` chrome. Inventory
// opens `/boats/new/basic?seller=` (or `/boats/new/review?draft=`). Seller
// session context is only for ListingsProvider — it does not touch admin auth.

export default function AdminBoatWizard() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const sellerParam = params.get('seller')
  const draftParam = params.get('draft')
  const [seller, setSeller] = useState<ApiSeller | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        if (sellerParam) {
          const id = Number(sellerParam)
          if (!Number.isFinite(id)) throw new Error('Choose a seller before creating a boat.')
          const next = await fetchSeller(id)
          if (!cancelled) setSeller(next)
          return
        }
        if (draftParam && !draftParam.startsWith('draft-')) {
          const id = Number(draftParam)
          if (!Number.isFinite(id)) throw new Error('That listing could not be opened.')
          const listing = await fetchListing(id)
          if (!cancelled) setSeller(listing.seller)
          return
        }
        if (!cancelled) {
          setSeller(null)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setSeller(null)
          setError(err instanceof Error ? err.message : 'Could not open the boat wizard.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [sellerParam, draftParam])

  if (!sellerParam && !draftParam) {
    return <Navigate to="/boats?view=sellers" replace />
  }

  if (loading) return null

  if (error || !seller) {
    return (
      <div className="dashboard-v2 flex min-h-dvh items-center justify-center px-6 text-sp-ink">
        <div className="v2-glass-surface max-w-md rounded-[16px] border border-[#dfe8ec] bg-white p-8 text-center">
          <h1 className="text-[22px] font-semibold tracking-[-0.04em] text-sp-brand-deep">Couldn’t open wizard</h1>
          <p className="mt-3 text-[14px] leading-6 text-[#5f7f95]">{error || 'Choose a seller from Boats & Sellers, then add a boat.'}</p>
          <div className="mt-6 flex justify-center">
            <AccountButton kind="primary" onClick={() => navigate('/boats')}>
              Back to boats &amp; sellers
            </AccountButton>
          </div>
        </div>
      </div>
    )
  }

  return (
    <SessionContext.Provider value={{ seller, setSeller }}>
      <ListingsProvider seller={seller}>
        <BoatWizard admin />
      </ListingsProvider>
    </SessionContext.Provider>
  )
}
