import type { ComponentType, SVGProps } from 'react'
import sidebarLogo from '../../assets/Sidebar/sidebar-logo.png'
import { AddBoatIcon, CommentsIcon, DashboardIcon, HelpIcon, MyBoatsIcon, ProfileIcon } from './icons'

type NavItem = {
  label: string
  href: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  badge?: number
}

type NavSection = {
  label: string
  items: NavItem[]
}

type SidebarProps = {
  boatsCount?: number
  commentsCount?: number
}

export default function Sidebar({ boatsCount = 12, commentsCount = 3 }: SidebarProps) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''

  const sections: NavSection[] = [
    {
      label: 'Main',
      items: [
        { label: 'Dashboard', href: '/seller-portal/dashboard', icon: DashboardIcon },
        { label: 'My Boats', href: '/seller-portal/my-boats', icon: MyBoatsIcon, badge: boatsCount },
        { label: 'Add New Boat', href: '/seller-portal/boats/new', icon: AddBoatIcon },
      ],
    },
    {
      label: 'Communication',
      items: [{ label: 'Comments', href: '/seller-portal/comments', icon: CommentsIcon, badge: commentsCount }],
    },
    {
      label: 'System',
      items: [
        { label: 'Profile & Settings', href: '/seller-portal/profile', icon: ProfileIcon },
        { label: 'Help & Support', href: '/seller-portal/help', icon: HelpIcon },
      ],
    },
  ]

  return (
    <aside className="flex h-svh w-[18.5rem] shrink-0 flex-col bg-[#0f172a]">
      <div className="flex shrink-0 items-center border-b border-[#1f2c4c] px-6 py-5">
        <img src={sidebarLogo} alt="The Boat Brokers" className="h-[3.75rem] w-auto" />
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

                  {item.badge !== undefined && (
                    <span className="rounded-full bg-blue px-2.5 py-0.5 text-caption font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </a>
              )
            })}
          </div>
        ))}
      </nav>
    </aside>
  )
}
