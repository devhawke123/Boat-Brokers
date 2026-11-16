import { useEffect, useId, useRef, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Bell, CalendarDays, ChevronRight, Search } from 'lucide-react'
import { EASE } from '../../seller-portal/lib/motion'
import { FLOATING_SURFACE_GAP_PX } from '../../seller-portal/lib/layout'
import { V2IconButton } from '../../seller-portal/components/V2Workspace'

// Ported from boat-brokers/src/components/V2Workspace.jsx (V2Header +
// Notifications). V2Link / V2IconButton are imported from the seller portal,
// where they are identical. The admin workspace has no broker feedback feed, so
// the notification list is always the "all caught up" state.

export function AdminNotifications({ emptyMessage }: { emptyMessage?: string }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const id = useId()
  const reduced = useReducedMotion()

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

  return (
    <div className="v2-notifications" ref={containerRef}>
      <V2IconButton
        ref={triggerRef}
        className="v2-notification"
        aria-label="Notifications, 0 unread"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        <Bell size={17} strokeWidth={1.6} />
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
            transition={{ duration: reduced ? 0 : 0.35, ease: EASE, layout: { duration: reduced ? 0 : 0.35, ease: EASE } }}
          >
            <motion.header layout={reduced ? false : 'position'} className="v2-notifications-heading">
              <h2>
                Notifications <span>0</span>
              </h2>
            </motion.header>
            <motion.div layout={reduced ? false : 'position'} className="v2-notification-list">
              <motion.div
                key="caught-up"
                role="status"
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
              >
                <div className="v2-notification-empty">
                  <span className="v2-empty-illustration" aria-hidden="true">
                    <Bell size={20} strokeWidth={1.5} />
                  </span>
                  <h3>You’re all caught up</h3>
                  <p>{emptyMessage ?? 'New feedback from your broker will appear here.'}</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}

export function AdminHeader({
  title = 'Overview',
  breadcrumbParent,
  workspaceTo,
  today,
  showSearch = true,
  notificationEmptyMessage,
}: {
  title?: string
  breadcrumbParent?: { label: string; to: string }
  workspaceTo?: string
  today: Date
  showSearch?: boolean
  notificationEmptyMessage?: string
}) {
  const date = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  return (
    <header className="v2-header">
      <nav className="v2-breadcrumb" aria-label="Breadcrumb">
        {workspaceTo ? <RouterLink to={workspaceTo}>Workspace</RouterLink> : 'Workspace'}{' '}
        <ChevronRight size={11} aria-hidden="true" />
        {breadcrumbParent && (
          <>
            <RouterLink to={breadcrumbParent.to}>{breadcrumbParent.label}</RouterLink>
            <ChevronRight size={11} aria-hidden="true" />
          </>
        )}
        <span aria-current="page">{title}</span>
      </nav>
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
        {showSearch && (
          <V2IconButton aria-label="Find a boat">
            <Search size={17} strokeWidth={1.6} />
          </V2IconButton>
        )}
        <AdminNotifications emptyMessage={notificationEmptyMessage} />
      </div>
    </header>
  )
}
