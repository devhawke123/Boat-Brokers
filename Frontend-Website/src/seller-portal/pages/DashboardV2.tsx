import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { MessageCircle, Sailboat } from 'lucide-react'
import { useListings } from '../context/useListings'
import type { ClientComment, ClientListing } from '../lib/listingAdapter'
import { EASE, inventoryMotion } from '../lib/motion'
import ToastNotice, { type Notice } from '../components/ToastNotice'
import { V2Link as Link, V2Sidebar, V2Header, Arrow, EmptyBrokerUpdates } from '../components/V2Workspace'
import { revealProps } from '../lib/v2Motion'
import './dashboard-v2.css'

const money = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 })
const statusOptions = [
  { name: 'Approved', label: 'Live', className: 'live', description: 'On the marketplace' },
  { name: 'Pending', label: 'In review', className: 'pending', description: 'With your broker' },
  { name: 'Rejected', label: 'Needs changes', className: 'rejected', description: 'Ready for a fresh look' },
  { name: 'Draft', label: 'Drafts', className: 'draft', description: 'A work in progress' },
]

function Panel({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion()
  return (
    <motion.section className={`v2-panel ${className}`} {...revealProps(reduced, delay)}>
      {children}
    </motion.section>
  )
}

function activityForLastSixWeeks(listings: ClientListing[], referenceDate: Date) {
  const submitted = listings.filter((listing) => listing.status !== 'Draft' && /^\d{4}-\d{2}-\d{2}$/.test(listing.submittedAt || ''))
  const today = new Date(referenceDate)
  today.setHours(0, 0, 0, 0)
  // Anchor the six-week window to today, or to the newest future fixture date.
  const end = new Date(Math.max(today.getTime(), ...submitted.map((item) => new Date(`${item.submittedAt}T00:00:00`).getTime())))
  return Array.from({ length: 6 }, (_, index) => {
    const start = new Date(end)
    start.setDate(end.getDate() - 41 + index * 7)
    const stop = new Date(start)
    stop.setDate(start.getDate() + 7)
    const count = submitted.filter((listing) => {
      const date = new Date(`${listing.submittedAt}T00:00:00`)
      return date >= start && date < stop
    }).length
    return { label: start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), count }
  })
}

function ActivityPanel({ listings, today }: { listings: ClientListing[]; today: Date }) {
  const reduced = useReducedMotion()
  const weeks = activityForLastSixWeeks(listings, today)
  const total = weeks.reduce((sum, week) => sum + week.count, 0)
  const max = Math.max(1, ...weeks.map((week) => week.count))
  return (
    <Panel className="v2-activity" delay={0.12}>
      <div className="v2-panel-header">
        <h2>Submission activity</h2>
      </div>
      <div className="v2-activity-value" aria-live="polite">
        {total.toString().padStart(2, '0')}
        <span>boats submitted</span>
      </div>
      <p className="v2-activity-dates">
        {weeks[0].label} – {today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
      </p>
      <div
        className="v2-activity-chart"
        style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}
        role="img"
        aria-label={`Last 6 weeks: ${weeks.map((week) => `${week.label}: ${week.count}`).join('; ')}`}
      >
        {weeks.map((week, index) => (
          <div key={week.label} className={`v2-chart-column ${index === weeks.length - 1 ? 'current' : ''}`}>
            <span className="v2-chart-count">{week.count}</span>
            <div className="v2-chart-bar-track">
              {week.count > 0 && (
                <motion.span
                  className="v2-chart-bar"
                  style={{ height: `${(week.count / max) * 72}px` }}
                  initial={reduced ? false : { scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{
                    duration: reduced ? 0 : inventoryMotion.interaction.duration,
                    ease: EASE,
                    delay: reduced ? 0 : index * 0.06,
                  }}
                />
              )}
            </div>
            <span className="v2-chart-label">{week.label}</span>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function UpdatesPanel({ listings, updates }: { listings: ClientListing[]; updates: ClientComment[] }) {
  const reduced = useReducedMotion()
  const unread = updates
  return (
    <Panel className="v2-updates" delay={0.19}>
      <div id="v2-updates" tabIndex={-1} className="v2-panel-header">
        <h2>
          From your broker <span className="v2-unread-count">{unread.length}</span>
        </h2>
        <MessageCircle size={16} strokeWidth={1.4} aria-hidden="true" />
      </div>
      <div className="v2-update-list">
        <AnimatePresence mode="wait" initial={false}>
          {unread.length ? (
            <motion.div
              key="broker-updates"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -5 }}
              transition={{ duration: reduced ? 0 : 0.2, ease: EASE }}
            >
              {unread.slice(0, 3).map((comment) => {
                const listing = listings.find((item) => item.id === comment.listingId)
                if (!listing) return null
                const image = listing.photos[0]?.src
                return (
                  <Link key={comment.id} to={`/boats/${listing.id}#listing-comments`} className="v2-update-row">
                    <span className="v2-update-image">
                      {image ? <img src={image} alt="" loading="lazy" /> : <Sailboat size={19} aria-hidden="true" />}
                      <i />
                    </span>
                    <span className="v2-update-copy">
                      <span className="v2-update-heading">
                        <strong>{listing.name}</strong>
                        <time>{comment.date}</time>
                      </span>
                      <span className="v2-update-message">{comment.text}</span>
                    </span>
                    <Arrow size={13} />
                  </Link>
                )
              })}
            </motion.div>
          ) : (
            <motion.div
              key="broker-empty"
              role="status"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
            >
              <EmptyBrokerUpdates className="v2-empty-updates" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Panel>
  )
}

function StatusPanel({ listings }: { listings: ClientListing[] }) {
  return (
    <Panel className="v2-status" delay={0.26}>
      <div className="v2-panel-header">
        <h2>Listing status</h2>
        <Link to="/boats" aria-label="View all listing statuses">
          <Arrow />
        </Link>
      </div>
      <div className="v2-status-grid">
        {statusOptions.map((status) => {
          const count = listings.filter((listing) => listing.status === status.name).length
          const percent = listings.length ? Math.round((count / listings.length) * 100) : 0
          return (
            <Link
              key={status.name}
              to={`/boats?status=${status.name.toLowerCase()}`}
              className={`v2-status-tile ${status.className}`}
              aria-label={`${status.label}: ${count} boats, ${percent}% of your fleet`}
            >
              <span className="v2-tile-label">
                {status.label}
                <Arrow size={12} />
              </span>
              <strong>{count.toString().padStart(2, '0')}</strong>
              <span className="v2-tile-caption">{status.description}</span>
              <span className="v2-tile-percentage">{percent}%</span>
            </Link>
          )
        })}
      </div>
    </Panel>
  )
}

export default function DashboardV2() {
  const { listings, updates } = useListings()
  const [today] = useState(() => new Date())
  const [notice, setNotice] = useState<Notice | null>(null)
  const reduced = useReducedMotion()
  const totalValue = listings.reduce((sum, listing) => sum + (Number(listing.price) || 0), 0)
  const live = listings.filter((listing) => listing.status === 'Approved')
  const liveValue = live.reduce((sum, listing) => sum + (Number(listing.price) || 0), 0)
  const pending = listings.filter((listing) => listing.status === 'Pending')
  const drafts = listings.filter((listing) => listing.status === 'Draft')
  const draft = drafts[0]
  useEffect(() => {
    document.title = 'Fleet overview · The Boat Brokers'
  }, [])
  useEffect(() => {
    if (!notice) return undefined
    const timeout = window.setTimeout(() => setNotice(null), 6500)
    return () => window.clearTimeout(timeout)
  }, [notice])
  return (
    <div className="dashboard-v2">
      <div className="v2-backdrop" aria-hidden="true" />
      <a href="#v2-main" className="v2-skip">
        Skip to dashboard
      </a>
      <div className="v2-workspace">
        <V2Sidebar onNotice={setNotice} />
        <main id="v2-main" className="v2-main" tabIndex={-1}>
          <V2Header today={today} />
          <div className="v2-hero">
            <motion.div className="v2-hero-copy" {...revealProps(reduced)}>
              <h1>
                Your fleet.
                <br />A world of possibility.
              </h1>
              <div className="v2-portfolio-label">
                Total portfolio asking value <span>GBP</span>
              </div>
              <p className="v2-portfolio-value">{money.format(totalValue)}</p>
              <Link to="/boats" className="v2-portfolio-link">
                <span>{listings.length} boats in your collection</span>
                <Arrow direction="right" />
              </Link>
              <div className="v2-hero-metrics">
                <Link to="/boats?status=approved">
                  <span className="v2-metric-label">Live asking value</span>
                  <strong>{money.format(liveValue)}</strong>
                  <span>{live.length} approved listings</span>
                </Link>
                <Link to="/boats?status=pending">
                  <span className="v2-metric-label">With your broker</span>
                  <strong>
                    {pending.length.toString().padStart(2, '0')} <span>boats</span>
                  </strong>
                  <span>Awaiting review</span>
                </Link>
              </div>
            </motion.div>
            <motion.aside className="v2-draft-card" aria-label="Continue your listing" {...revealProps(reduced, 0.08)}>
              <div className="v2-panel-header">
                <h2>{draft ? 'Continue your listing' : 'Your next listing'}</h2>
              </div>
              <div className="v2-draft-body">
                <span className="v2-draft-type">{draft?.type || 'A new chapter'}</span>
                <h3>{draft?.name || 'Room for one more?'}</h3>
                <p>
                  {draft
                    ? 'The details are taking shape. Pick up where you left off.'
                    : 'Introduce your next boat to a world of possibilities.'}
                </p>
              </div>
              <Link className="v2-draft-action" to={draft ? `/boats/new/review?draft=${encodeURIComponent(draft.id)}` : '/boats/new/basic'}>
                {draft ? 'Continue editing' : 'Create a listing'}
                <span>
                  <Arrow direction="right" />
                </span>
              </Link>
            </motion.aside>
          </div>
          <div className="v2-statistics" aria-label="Your fleet statistics">
            <ActivityPanel listings={listings} today={today} />
            <UpdatesPanel listings={listings} updates={updates} />
            <StatusPanel listings={listings} />
          </div>
        </main>
      </div>
      <ToastNotice notice={notice} onClose={() => setNotice(null)} />
    </div>
  )
}
