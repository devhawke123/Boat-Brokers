import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import type { ApiSeller } from './lib/api'
import { clearStoredSeller, getStoredSeller, setStoredSeller } from './lib/session'
import { quick } from './lib/motion'
import { SessionContext, useSession } from './context/useSession'
import { ListingsProvider } from './context/ListingsProvider'
import HelpSupportWidget from './components/HelpSupportWidget'
import V2Login from './pages/V2Login'
import DashboardV2 from './pages/DashboardV2'
import V2Boats from './pages/V2Boats'
import V2BoatDetail from './pages/V2BoatDetail'
import BoatWizard from './pages/BoatWizard'
import './seller-portal.css'

// The seller portal is the one part of the site that uses react-router: the
// client's design depends on its Link/useNavigate/location state. App.tsx hands
// every /seller-portal/* URL to this component (see Frontend-Website/CLAUDE.md).

function Access() {
  const { seller } = useSession()
  const location = useLocation()
  if (!seller) return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}${location.hash}` }} />
  return (
    <ListingsProvider seller={seller}>
      <Outlet />
    </ListingsProvider>
  )
}

// Links from the previous portal (emails, bookmarks) land somewhere sensible.
function LegacyAddBoat() {
  const [params] = useSearchParams()
  const listingId = params.get('listingId')
  return <Navigate to={listingId ? `/boats/${listingId}` : '/boats/new/basic'} replace />
}

function CommentsRedirect() {
  const { listingId } = useParams()
  return <Navigate to={`/boats/${listingId}#listing-comments`} replace />
}

function PortalRoutes() {
  const { pathname } = useLocation()
  const wizardActive = /^\/boats\/new(?:\/|$)/.test(pathname)
  const authScreen = ['/login', '/signup', '/forgot-password'].includes(pathname)
  return (
    <>
      <Routes>
        <Route path="/login" element={<V2Login />} />
        <Route path="/signup" element={<V2Login />} />
        <Route path="/forgot-password" element={<V2Login />} />
        <Route element={<Access />}>
          <Route path="/dashboard" element={<DashboardV2 />} />
          <Route path="/boats" element={<V2Boats />} />
          <Route path="/boats/new" element={<LegacyAddBoat />} />
          <Route path="/boats/new/:step" element={<BoatWizard />} />
          <Route path="/boats/:boatId" element={<V2BoatDetail />} />
          <Route path="/my-boats" element={<Navigate to="/boats" replace />} />
          <Route path="/comments/:listingId" element={<CommentsRedirect />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
      {!wizardActive && !authScreen && <HelpSupportWidget />}
    </>
  )
}

export default function SellerPortalApp() {
  const [seller, setSellerState] = useState<ApiSeller | null>(getStoredSeller)

  useEffect(() => {
    document.body.classList.add('seller-portal-body')
    return () => document.body.classList.remove('seller-portal-body')
  }, [])

  function setSeller(next: ApiSeller | null) {
    if (next) setStoredSeller(next)
    else clearStoredSeller()
    setSellerState(next)
  }

  return (
    <SessionContext.Provider value={{ seller, setSeller }}>
      <MotionConfig reducedMotion="user" transition={quick}>
        <BrowserRouter basename="/seller-portal">
          <PortalRoutes />
        </BrowserRouter>
      </MotionConfig>
    </SessionContext.Provider>
  )
}
