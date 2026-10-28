import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { V2Header, V2Sidebar } from '../components/V2Workspace'
import ToastNotice, { type Notice } from '../components/ToastNotice'
import { useListings } from '../context/useListings'
import BoatDetail from './BoatDetail'
import './dashboard-v2.css'
import './v2-boat-detail.css'

export default function V2BoatDetail() {
  const { boatId } = useParams()
  const { hash } = useLocation()
  const { listings, loading } = useListings()
  const listing = listings.find((item) => item.id === boatId)
  const [today] = useState(() => new Date())
  const [notice, setNotice] = useState<Notice | null>(null)
  useEffect(() => {
    document.title = `${listing?.name || 'Listing not found'} · The Boat Brokers`
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' })
    // Wait for the destination to mount, including direct comment links.
    const frame = requestAnimationFrame(() => {
      if (!hash) return
      const target = document.getElementById(hash.slice(1))
      target?.scrollIntoView({ block: 'start', behavior: 'instant' })
      target?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(frame)
  }, [boatId, hash, listing?.name])
  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(null), 6500)
    return () => clearTimeout(timer)
  }, [notice])
  return (
    <div className="dashboard-v2 v2-detail-page">
      <div className="v2-backdrop" aria-hidden="true" />
      <a href="#v2-detail-main" className="v2-skip">
        Skip to boat details
      </a>
      <div className="v2-workspace">
        <V2Sidebar onNotice={setNotice} />
        <main id="v2-detail-main" className="v2-main" tabIndex={-1}>
          <V2Header title={listing?.name || 'Listing details'} breadcrumbParent={{ label: 'My boats', to: '/boats' }} today={today} />
          {/* Hold off on "not found" until the listings have loaded. */}
          {(listing || !loading) && <BoatDetail key={boatId} listing={listing} variant="v2" onNotice={setNotice} />}
        </main>
      </div>
      <ToastNotice notice={notice} onClose={() => setNotice(null)} />
    </div>
  )
}
