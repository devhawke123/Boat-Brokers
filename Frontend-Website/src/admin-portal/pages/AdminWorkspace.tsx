import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { Banknote, CalendarDays, FileText, LayoutGrid, ListFilter, Sailboat, UsersRound } from 'lucide-react'
import type { ComponentType } from 'react'
import type { LucideProps } from 'lucide-react'
import { inventoryMotion } from '../../seller-portal/lib/motion'
import { V2Link } from '../../seller-portal/components/V2Workspace'
import ToastNotice from '../../seller-portal/components/ToastNotice'
import type { Notice } from '../../seller-portal/components/ToastNotice'
import { AdminHeader } from '../components/V2Workspace'
import { AdminProfileMenu } from '../components/AdminProfileMenu'
import '../styles/dashboard-v2.css'
import '../styles/admin-workspace.css'
import '../styles/admin-controls.css'
import '../styles/portal-typography.css'

// Ported from boat-brokers/src/pages/AdminWorkspace.jsx. Paths are basename
// relative (the router basename is /admin-portal). The section modules
// (Overview, Leads, …) are placeholders until they are ported.

type NavItem = { slug: string; label: string; Icon: ComponentType<LucideProps> }

const navigation: { label: string; items: NavItem[] }[] = [
  { label: 'Main', items: [
    { slug: 'dashboard', label: 'Overview', Icon: LayoutGrid },
    { slug: 'leads', label: 'Leads', Icon: ListFilter },
    { slug: 'boat-buyers', label: 'Boat Buyers', Icon: UsersRound },
    { slug: 'boats', label: 'Boats & Sellers', Icon: Sailboat },
  ] },
  { label: 'Business', items: [
    { slug: 'sales', label: 'Sales', Icon: Banknote },
    { slug: 'blogs', label: 'Blogs', Icon: FileText },
    { slug: 'availability', label: 'Availability', Icon: CalendarDays },
  ] },
]

const moduleSections = ['leads', 'boats', 'boat-buyers', 'sales', 'blogs', 'availability']
const wordmark = '/seller-portal-assets/boat-brokers-wordmark-blue.png'

function AdminSidebar({ section, onNotice }: { section: string; onNotice: (notice: Notice) => void }) {
  const reduced = useReducedMotion()
  return (
    <aside className="admin-sidebar v2-glass-surface" aria-label="Administration navigation">
      <Link to="/dashboard" className="admin-brand" aria-label="The Boat Brokers admin dashboard">
        <img src={wordmark} alt="The Boat Brokers" />
      </Link>
      <LayoutGroup id="admin-navigation">
        <nav className="admin-navigation v2-nav" aria-label="Admin workspace">
          {navigation.map((group) => (
            <div className="admin-nav-group" key={group.label}>
              {group.items.map(({ slug, label, Icon }) => (
                <V2Link
                  key={slug}
                  to={`/${slug}`}
                  className={`v2-nav-link ${section === slug ? 'is-active' : ''}`}
                  aria-current={section === slug ? 'page' : undefined}
                >
                  {section === slug && (
                    <motion.span
                      className="v2-nav-indicator"
                      aria-hidden="true"
                      layoutId="admin-active-navigation"
                      initial={false}
                      transition={{ ...inventoryMotion.indicator, duration: reduced ? 0 : inventoryMotion.indicator.duration }}
                    />
                  )}
                  <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
                  <span>{label}</span>
                </V2Link>
              ))}
            </div>
          ))}
        </nav>
      </LayoutGroup>
      <div className="admin-sidebar-bottom">
        <AdminProfileMenu onNotice={onNotice} />
      </div>
    </aside>
  )
}

// Stand-in for a section module: quiet empty-state chrome inside the content area.
function SectionPlaceholder({ label, Icon }: { label: string; Icon: ComponentType<LucideProps> }) {
  return (
    <section className="admin-records v2-glass-surface" aria-label={`${label} records`}>
      <div className="admin-quiet-state">
        <Icon size={25} strokeWidth={1.4} aria-hidden="true" />
        <h2>{label}</h2>
        <p>Coming soon.</p>
      </div>
    </section>
  )
}

export default function AdminWorkspace() {
  const { section: originalSection = '' } = useParams()
  const section = ['boat-sellers', 'listings'].includes(originalSection) ? 'boats' : originalSection
  const page = navigation.flatMap((group) => group.items).find((item) => item.slug === section)
  const [today] = useState(() => new Date())
  const location = useLocation()
  const [notice, setNotice] = useState<Notice | null>((location.state as { notice?: Notice } | null)?.notice ?? null)
  const mainRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!page || section === 'blogs') return
    document.title = `${page.label} · Admin · The Boat Brokers`
    window.scrollTo({ top: 0, behavior: 'instant' })
    mainRef.current?.focus({ preventScroll: true })
  }, [page, section])

  useEffect(() => {
    if (!notice) return undefined
    const timer = setTimeout(() => setNotice(null), 6500)
    return () => clearTimeout(timer)
  }, [notice])

  if (originalSection !== section) {
    const next = new URLSearchParams(location.search)
    if (originalSection === 'boat-sellers') next.set('view', 'sellers')
    if (next.get('status') === 'Needs changes') next.set('status', 'Changes required')
    return <Navigate to={`/boats?${next}`} replace />
  }
  if (!page) return <Navigate to="/dashboard" replace />

  const inBlogEditor = section === 'blogs' && location.pathname !== '/blogs'
  return (
    <div className={`dashboard-v2 admin-workspace ${section === 'leads' ? 'admin-leads-page' : ''}`}>
      <div className="v2-backdrop" aria-hidden="true" />
      <a href="#admin-main" className="v2-skip">Skip to admin content</a>
      <div className="admin-layout">
        <AdminSidebar section={section} onNotice={setNotice} />
        <main className="admin-main" id="admin-main" tabIndex={-1} ref={mainRef}>
          <AdminHeader
            title={inBlogEditor ? (location.pathname.endsWith('/edit') ? 'Edit post' : 'Add new post') : page.label}
            breadcrumbParent={inBlogEditor ? { label: 'Blogs', to: '/blogs' } : undefined}
            workspaceTo="/dashboard"
            today={today}
            showSearch={false}
            notificationEmptyMessage="No new admin notifications."
          />
          {!moduleSections.includes(section) && (
            <div className="admin-page-heading">
              <div>
                <h1>{section === 'dashboard' ? 'Your brokerage, in view.' : page.label}</h1>
              </div>
            </div>
          )}
          <motion.div
            key={section}
            className="admin-page-content"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...inventoryMotion.interaction, duration: reduced ? 0 : 0.35 }}
          >
            <SectionPlaceholder label={page.label} Icon={page.Icon} />
          </motion.div>
        </main>
      </div>
      <ToastNotice notice={notice} onClose={() => setNotice(null)} />
    </div>
  )
}
