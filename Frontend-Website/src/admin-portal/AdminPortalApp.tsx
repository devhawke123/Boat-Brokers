import '../seller-portal/seller-portal.css'
import { useEffect } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useSearchParams } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { quick } from '../seller-portal/lib/motion'
import { getStoredAdmin } from './lib/session'
import AdminWorkspace from './pages/AdminWorkspace'
import AdminBoatWizard from './pages/AdminBoatWizard'
import Login from './pages/Login/Login'
// The admin portal runs its own react-router app, same as the seller portal:
// App.tsx hands every /admin-portal/* URL to this component. Links inside use
// basename-relative paths (/dashboard, not /admin-portal/dashboard).

function Access() {
  const location = useLocation()
  if (!getStoredAdmin()) {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}${location.hash}` }} />
  }
  return <Outlet />
}

function NewBoatRedirect() {
  const [params] = useSearchParams()
  const query = params.toString()
  return <Navigate to={`/boats/new/basic${query ? `?${query}` : ''}`} replace />
}

export default function AdminPortalApp() {
  useEffect(() => {
    const root = document.documentElement
    const previous = root.dataset.portalUi
    root.dataset.portalUi = 'current'
    document.body.classList.add('seller-portal-body', 'admin-portal-body')
    return () => {
      document.body.classList.remove('seller-portal-body', 'admin-portal-body')
      if (previous === undefined) delete root.dataset.portalUi
      else root.dataset.portalUi = previous
    }
  }, [])

  return (
    <MotionConfig reducedMotion="user" transition={quick}>
      <BrowserRouter basename="/admin-portal">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Access />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/boats/new" element={<NewBoatRedirect />} />
            <Route path="/boats/new/:step" element={<AdminBoatWizard />} />
            <Route path="/sellers/*" element={<Navigate to="/boats?view=sellers" replace />} />
            <Route path="/listings/*" element={<Navigate to="/boats" replace />} />
            <Route path="/boat-sellers/*" element={<Navigate to="/boats?view=sellers" replace />} />
            <Route path="/:section/*" element={<AdminWorkspace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  )
}
