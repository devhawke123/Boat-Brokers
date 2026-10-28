import { useEffect, useId, useRef, useState, type ComponentProps } from 'react'
import { useLocation } from 'react-router-dom'
import { Link as RouterLink } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Bell, CalendarDays, ChevronRight, LayoutGrid, MessageCircle, Play, Sailboat, Search } from 'lucide-react'
import { directionalArrowVariants, EASE, inventoryMotion, quick } from '../lib/motion'
import { FLOATING_SURFACE_GAP_PX } from '../lib/layout'
import { ProfileMenu } from './ProfileMenu'
import { useListings } from '../context/useListings'
import type { ClientComment, ClientListing } from '../lib/listingAdapter'
import type { Notice } from './ToastNotice'
const MotionLink = motion.create(RouterLink)

export function V2Link({ children, className = '', ...props }: ComponentProps<typeof MotionLink>) {
  const reduced = useReducedMotion()
  const isNav = className.includes('v2-nav-link')
  return (
    <MotionLink
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      whileTap={reduced ? undefined : { scale: inventoryMotion.pressScale }}
      variants={
        isNav
          ? {
              rest: { backgroundColor: '#ffffff00' },
              hover: { backgroundColor: '#edf6fc' },
            }
          : undefined
      }
      transition={quick}
      {...props}
      className={className}
    >
      {children}
    </MotionLink>
  )
}

export function V2IconButton({ children, className = '', ref, ...props }: ComponentProps<typeof motion.button>) {
  const reduced = useReducedMotion()
  return (
    <motion.button
      ref={ref}
      type="button"
      className={`v2-icon-button ${className}`}
      initial={false}
      animate={{ backgroundColor: '#ffffff00' }}
      whileHover={{ backgroundColor: '#ffffffb0' }}
      whileFocus={{ backgroundColor: '#ffffffb0' }}
      whileTap={reduced ? undefined : { scale: 0.96 }}
      transition={quick}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export function Arrow({ direction = 'diagonal', size = 15 }: { direction?: 'diagonal' | 'right'; size?: number }) {
  const reduced = useReducedMotion()
  const Icon = direction === 'right' ? ArrowRight : ArrowUpRight
  return (
    <motion.span
      className="v2-arrow"
      aria-hidden="true"
      variants={directionalArrowVariants(reduced, direction === 'right' ? 'right' : 'up-right')}
      transition={inventoryMotion.interaction}
    >
      <Icon size={size} strokeWidth={1.6} />
    </motion.span>
  )
}

function SellerGuide() {
  const reduced = useReducedMotion()
  const url = import.meta.env.VITE_SELLER_TUTORIAL_URL
  const Card = url ? motion.a : motion.div
  return (
    <Card
      initial="rest"
      animate="rest"
      whileHover={url ? 'hover' : undefined}
      whileFocus={url ? 'hover' : undefined}
      className={`v2-tutorial ${url ? 'is-playable' : ''}`}
      {...(url
        ? {
            href: url,
            target: '_blank',
            rel: 'noreferrer',
            'aria-label': 'Watch the seller guide on YouTube',
          }
        : {})}
    >
      <div className="v2-tutorial-visual">
        <motion.img
          src="/seller-portal-assets/yacht-horizon.jpg"
          alt=""
          loading="lazy"
          variants={{
            rest: { scale: 1 },
            hover: { scale: reduced ? 1 : 1.035 },
          }}
          transition={inventoryMotion.media}
        />
        <span className="v2-tutorial-wash" />
        <span className="v2-tutorial-play" aria-hidden="true">
          <Play size={17} fill="currentColor" strokeWidth={0} />
        </span>
      </div>
      <div className="v2-tutorial-body">
        <span className="v2-tutorial-title">Your seller guide{url && <Arrow size={13} />}</span>
        <p>
          A short tour of your dashboard,
          <br />
          listings and tools.
        </p>
      </div>
    </Card>
  )
}

export function V2Sidebar({ onNotice }: { onNotice: (notice: Notice) => void }) {
  const reduced = useReducedMotion()
  const { pathname } = useLocation()
  const inBoats = pathname.startsWith('/boats')
  return (
    <aside className="v2-sidebar" aria-label="Workspace navigation">
      <V2Link to="/dashboard" aria-label="The Boat Brokers overview" className="v2-brand">
        <img src="/seller-portal-assets/boat-brokers-wordmark-blue.png" alt="The Boat Brokers" />
      </V2Link>
      <LayoutGroup id="v2-sidebar">
        <nav aria-label="Workspace" className="v2-nav">
          {[
            {
              to: '/dashboard',
              label: 'Overview',
              Icon: LayoutGrid,
              active: !inBoats,
            },
            {
              to: '/boats',
              label: 'My boats',
              Icon: Sailboat,
              active: inBoats,
            },
          ].map(({ to, label, Icon, active }) => (
            <V2Link key={to} to={to} className={`v2-nav-link ${active ? 'is-active' : ''}`} aria-current={active ? 'page' : undefined}>
              {active && (
                <motion.span
                  aria-hidden="true"
                  className="v2-nav-indicator"
                  layoutId="active-navigation"
                  initial={false}
                  transition={{
                    ...inventoryMotion.indicator,
                    duration: reduced ? 0 : inventoryMotion.indicator.duration,
                  }}
                />
              )}
              <Icon size={17} strokeWidth={1.6} />
              <span>{label}</span>
            </V2Link>
          ))}
        </nav>
      </LayoutGroup>
      <div className="v2-sidebar-bottom">
        <SellerGuide />
        <ProfileMenu onNotice={onNotice} />
      </div>
    </aside>
  )
}

export function EmptyBrokerUpdates({ className = '' }: { className?: string }) {
  return (
    <div className={`v2-notification-empty ${className}`}>
      <span className="v2-empty-illustration" aria-hidden="true">
        <Bell size={20} strokeWidth={1.5} />
      </span>
      <h3>You’re all caught up</h3>
      <p>New feedback from your broker will appear here.</p>
    </div>
  )
}

function Notifications({
  listings,
  updates,
  onRead,
  onReadAll,
}: {
  listings: ClientListing[]
  updates: ClientComment[]
  onRead: (id: string) => void
  onReadAll: () => void
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const id = useId()
  const reduced = useReducedMotion()
  const rowMotion = {
    hidden: { opacity: 0, y: reduced ? 0 : 6 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : 0.3, ease: EASE },
    },
    exit: {
      opacity: 0,
      y: reduced ? 0 : -5,
      transition: { duration: reduced ? 0 : 0.18, ease: EASE },
    },
  }
  useEffect(() => {
    if (!open) return undefined
    const outside = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('keydown', escape)
    }
  }, [open])
  function markAllRead() {
    onReadAll()
    // The action leaves the DOM; retain keyboard focus on a stable control.
    triggerRef.current?.focus({ preventScroll: true })
  }
  return (
    <div className="v2-notifications" ref={containerRef}>
      <V2IconButton
        ref={triggerRef}
        className="v2-notification"
        aria-label={`Notifications, ${updates.length} unread`}
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        <Bell size={17} strokeWidth={1.6} />
        <AnimatePresence>
          {updates.length > 0 && (
            <motion.i
              key="unread-dot"
              initial={false}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reduced ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 0.2, ease: EASE }}
            />
          )}
        </AnimatePresence>
      </V2IconButton>
      <AnimatePresence>
        {open && (
          <motion.section
            layout={reduced ? false : 'size'}
            id={id}
            aria-label="Notifications"
            className="v2-notification-menu"
            style={{ top: `calc(100% + ${FLOATING_SURFACE_GAP_PX}px)` }}
            initial={reduced ? false : { opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
            transition={{
              duration: reduced ? 0 : 0.35,
              ease: EASE,
              layout: { duration: reduced ? 0 : 0.35, ease: EASE },
            }}
          >
            <motion.header layout={reduced ? false : 'position'} className="v2-notifications-heading">
              <h2>
                Notifications{' '}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={updates.length}
                    initial={reduced ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduced ? 0 : -4 }}
                    transition={{ duration: reduced ? 0 : 0.15, ease: EASE }}
                  >
                    {updates.length}
                  </motion.span>
                </AnimatePresence>
              </h2>
              <AnimatePresence>
                {updates.length > 0 && (
                  <motion.button
                    key="mark-all"
                    type="button"
                    onClick={markAllRead}
                    initial={false}
                    animate={{
                      opacity: 1,
                      color: '#4185b1',
                      backgroundColor: '#eaf5fc00',
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: reduced ? 0 : 0.12 },
                    }}
                    whileHover={{
                      color: '#123c59',
                      backgroundColor: '#eaf5fc',
                    }}
                    transition={quick}
                  >
                    Mark all read
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.header>
            <motion.div layout={reduced ? false : 'position'} className="v2-notification-list">
              <AnimatePresence mode="wait" initial={false}>
                {updates.length ? (
                  <motion.div
                    key="unread"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={{
                      hidden: {},
                      visible: {
                        transition: { staggerChildren: reduced ? 0 : 0.035 },
                      },
                      exit: {
                        transition: {
                          staggerChildren: reduced ? 0 : 0.025,
                          staggerDirection: -1,
                        },
                      },
                    }}
                  >
                    {updates.map((comment) => {
                      const listing = listings.find((item) => item.id === comment.listingId)
                      const image = listing?.photos?.[0]?.src
                      return (
                        <motion.div key={comment.id} variants={rowMotion}>
                          <V2Link
                            to={`/boats/${comment.listingId}`}
                            className="v2-notification-row"
                            onClick={() => {
                              onRead(comment.id)
                              setOpen(false)
                            }}
                            variants={{
                              rest: { backgroundColor: '#ffffff00' },
                              hover: { backgroundColor: '#f1f8fd' },
                            }}
                          >
                            <span className="v2-notification-photo">
                              {image ? <img src={image} alt="" /> : <Sailboat size={20} />}
                              <MessageCircle size={10} />
                            </span>
                            <span className="v2-notification-copy">
                              <span>
                                <strong>{comment.author}</strong>
                                <time>{comment.date}</time>
                              </span>
                              <b>{listing?.name}</b>
                              <span className="v2-notification-message">{comment.text}</span>
                            </span>
                            <i className="v2-notification-unread" />
                          </V2Link>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                ) : (
                  <motion.div
                    key="caught-up"
                    role="status"
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
                  >
                    <EmptyBrokerUpdates />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}

export function V2Header({
  title = 'Overview',
  breadcrumbParent,
  today,
  onSearch,
}: {
  title?: string
  breadcrumbParent?: { label: string; to: string }
  today: Date
  onSearch?: () => void
}) {
  const { listings, updates, markRead, markAllRead } = useListings()
  const date = today.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return (
    <header className="v2-header">
      <div className="v2-breadcrumb">
        Workspace <ChevronRight size={11} aria-hidden="true" />
        {breadcrumbParent && (
          <>
            <RouterLink to={breadcrumbParent.to}>{breadcrumbParent.label}</RouterLink>
            <ChevronRight size={11} aria-hidden="true" />
          </>
        )}
        <span>{title}</span>
      </div>
      <div className="v2-header-actions">
        <div className="v2-header-date">
          <CalendarDays size={14} strokeWidth={1.5} aria-hidden="true" />
          <time
            dateTime={`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`}
          >
            <span className="v2-date-weekday">{today.toLocaleDateString('en-GB', { weekday: 'long' })}, </span>
            {date}
          </time>
        </div>
        {onSearch ? (
          <V2IconButton aria-label="Find a boat" onClick={onSearch}>
            <Search size={17} strokeWidth={1.6} />
          </V2IconButton>
        ) : (
          <V2Link
            className="v2-icon-button"
            to="/boats"
            aria-label="Find a boat"
            variants={{
              rest: { backgroundColor: '#ffffff00' },
              hover: { backgroundColor: '#ffffffb0' },
            }}
          >
            <Search size={17} strokeWidth={1.6} />
          </V2Link>
        )}
        <Notifications listings={listings} updates={updates} onRead={markRead} onReadAll={markAllRead} />
      </div>
    </header>
  )
}
