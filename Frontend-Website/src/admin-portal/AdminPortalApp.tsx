import '../seller-portal/seller-portal.css'
import { useEffect } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { quick } from '../seller-portal/lib/motion'
import { getStoredAdmin } from './lib/session'
import AdminWorkspace from './pages/AdminWorkspace'
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
            <Route path="/:section/*" element={<AdminWorkspace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  )
}
