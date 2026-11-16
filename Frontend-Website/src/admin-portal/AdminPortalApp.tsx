import { useEffect } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { quick } from '../seller-portal/lib/motion'
import { getStoredAdmin } from './lib/session'
import Login from './pages/Login/Login'
import '../seller-portal/seller-portal.css'
import './styles/admin-workspace.css'
import './styles/admin-controls.css'

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

// Stub until the V2 workspace lands (Task 2+).
function OverviewStub() {
  useEffect(() => {
    document.title = 'Overview · The Boat Brokers admin'
  }, [])

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Overview</h1>
    </main>
  )
}

export default function AdminPortalApp() {
  useEffect(() => {
    document.body.classList.add('seller-portal-body', 'admin-portal-body')
    return () => document.body.classList.remove('seller-portal-body', 'admin-portal-body')
  }, [])

  return (
    <MotionConfig reducedMotion="user" transition={quick}>
      <BrowserRouter basename="/admin-portal">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Access />}>
            <Route path="/dashboard" element={<OverviewStub />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  )
}
