import { useState, type ReactNode } from 'react'
import Seo from '../../../components/Seo/Seo'
import Sidebar from '../Sidebar/Sidebar'
import { MenuIcon } from '../Sidebar/icons'
import AdminDialogHost from '../AdminDialog/AdminDialog'
import sidebarLogo from '../../../seller-portal/assets/Sidebar/sidebar-logo.png'

type AdminShellProps = {
  children: ReactNode
  mainClassName?: string
}

export default function AdminShell({ children, mainClassName = 'bg-frost' }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const path = typeof window !== 'undefined' ? window.location.pathname : '/admin-portal'

  return (
    <div className="flex h-svh flex-col overflow-hidden lg:flex-row">
      <Seo
        title="Admin Portal"
        description="The Boat Brokers admin portal."
        path={path}
        noindex
      />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-[#1f2c4c] bg-[#0f172a] px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
          className="flex size-9 shrink-0 items-center justify-center rounded-lg text-[#94a3b8] hover:bg-white/5 hover:text-white"
        >
          <MenuIcon className="size-6" />
        </button>
        <img src={sidebarLogo} alt="The Boat Brokers" className="h-8 w-auto" />
      </div>

      <main className={`flex-1 overflow-y-auto ${mainClassName}`}>{children}</main>

      <AdminDialogHost />
    </div>
  )
}
