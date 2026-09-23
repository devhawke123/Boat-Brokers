import type { ComponentType, SVGProps } from 'react'
import sidebarLogo from '../../../seller-portal/assets/Sidebar/sidebar-logo.png'
import {
  AvailabilityIcon,
  BlogsIcon,
  BuyersIcon,
  CloseIcon,
  DashboardIcon,
  LeadsIcon,
  ListingsIcon,
  LogoutIcon,
  SalesIcon,
  SellersIcon,
} from './icons'
import { clearStoredAdmin } from '../../lib/session'

type NavItem = {
  label: string
  href: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
}

type NavSection = {
  label: string
  items: NavItem[]
}

type SidebarProps = {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''

  const sections: NavSection[] = [
    {
      label: 'Main',
      items: [
        { label: 'Dashboard', href: '/admin-portal/dashboard', icon: DashboardIcon },
        { label: 'Leads', href: '/admin-portal/leads', icon: LeadsIcon },
        { label: 'Boat Sellers', href: '/admin-portal/sellers', icon: SellersIcon },
        { label: 'Boat Buyers', href: '/admin-portal/buyers', icon: BuyersIcon },
        { label: 'Listings', href: '/admin-portal/listings', icon: ListingsIcon },
      ],
    },
    {
      label: 'Business',
      items: [
        { label: 'Sales', href: '/admin-portal/sales', icon: SalesIcon },
        { label: 'Blogs', href: '/admin-portal/blogs', icon: BlogsIcon },
        { label: 'Availability', href: '/admin-portal/availability', icon: AvailabilityIcon },
      ],
    },
  ]

  function handleLogout() {
    clearStoredAdmin()
    window.location.href = '/'
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-svh w-[18.5rem] max-w-[85vw] shrink-0 flex-col bg-[#0f172a] transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#1f2c4c] px-6 py-5">
          <img src={sidebarLogo} alt="The Boat Brokers" className="h-[3.75rem] w-auto" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-[#94a3b8] hover:bg-white/5 hover:text-white lg:hidden"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
          {sections.map((section) => (
            <div key={section.label} className="flex flex-col gap-1">
              <p className="px-3 pb-1.5 text-label font-bold tracking-[0.09em] text-[#64748b] uppercase">
                {section.label}
              </p>

              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                const Icon = item.icon

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={
                      isActive
                        ? 'flex items-center justify-between rounded-lg border-l-4 border-[#117399] bg-gradient-to-r from-[#2563eb]/20 to-transparent px-4 py-3 text-white transition-colors duration-300'
                        : 'flex items-center justify-between rounded-lg border-l-4 border-transparent px-4 py-3 text-[#94a3b8] transition-colors duration-300 hover:bg-white/5 hover:text-white'
                    }
                  >
                    <span className="flex items-center gap-3">
                      <Icon className={isActive ? 'size-5 text-[#19ade6]' : 'size-5'} />
                      <span className="text-body font-medium whitespace-nowrap">{item.label}</span>
                    </span>
                  </a>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-[#1f2c4c] px-3 py-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg border-l-4 border-transparent px-4 py-3 text-[#94a3b8] transition-colors duration-300 hover:bg-white/5 hover:text-white"
          >
            <LogoutIcon className="size-5" />
            <span className="text-body font-medium whitespace-nowrap">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
