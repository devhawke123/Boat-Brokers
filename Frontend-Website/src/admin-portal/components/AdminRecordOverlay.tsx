import { useContext, useEffect, useId, useRef, type ReactNode, type RefObject, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { AccountCloseButton } from './AdminAccountSettings'
import AdminInfoTooltip from './AdminInfoTooltip'
import ToastNotice from '../../seller-portal/components/ToastNotice'
import AdminToastLayer from './AdminToastLayer'
import { EASE } from '../../seller-portal/lib/motion'
import { InventoryNoticeContext } from '../context/InventoryNoticeContext'
import '../styles/admin-record-overlay.css'

let openCount = 0
let previousOverflow = ''

type AdminRecordOverlayProps = {
  title: string
  subject?: string
  info?: ReactNode
  eyebrow?: ReactNode
  avatar?: ReactNode
  titleExtra?: ReactNode
  headerExtra?: ReactNode
  modal?: boolean
  behind?: boolean
  noClose?: boolean
  onClose: () => void
  children?: ReactNode
  footer?: ReactNode
  initialFocusRef?: RefObject<HTMLElement | null>
  returnFocusRef?: RefObject<HTMLElement | null>
}

// Native top-layer dialogs give nested drawers one active focus scope.
export default function AdminRecordOverlay({ title, subject, info, eyebrow, avatar, titleExtra, headerExtra, modal = false, behind = false, noClose = false, onClose, children, footer, initialFocusRef, returnFocusRef }: AdminRecordOverlayProps) {
  const heading = subject ? `${title.replace(/\?$/, '')} — ${subject}${title.endsWith('?') ? '?' : ''}` : title
  const feedback = useContext(InventoryNoticeContext)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const titleId = useId()
  const reduced = useReducedMotion()
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const trigger = returnFocusRef?.current || (document.activeElement as HTMLElement | null)
    if (openCount++ === 0) { previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden' }
    dialog.showModal()
    ;(initialFocusRef?.current || headingRef.current)?.focus({ preventScroll: true })
    return () => {
      dialog.close()
      if (--openCount === 0) document.body.style.overflow = previousOverflow
      if (trigger?.isConnected) trigger.focus({ preventScroll: true })
    }
  }, [initialFocusRef, returnFocusRef])
  function backdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget) return
    const rect = event.currentTarget.getBoundingClientRect()
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose()
  }
  return createPortal(<motion.dialog ref={dialogRef} className={modal ? 'v2-glass-surface v2-settings-dialog v2-settings-native-dialog inventory-modal' : `inventory-drawer ${behind ? 'is-behind' : ''}`} aria-labelledby={titleId} aria-modal="true" onClick={backdrop} onCancel={event => { event.preventDefault(); event.stopPropagation(); onClose() }} initial={reduced ? false : { opacity: 0, ...(modal ? { y: 20, scale: .965 } : { x: 38 }) }} animate={{ opacity: 1, x: behind && !reduced ? -32 : 0, y: 0, scale: 1 }} exit={reduced ? { opacity: 0 } : { opacity: 0, ...(modal ? { y: 10, scale: .99 } : { x: 38 }) }} transition={{ duration: reduced ? 0 : .32, ease: EASE }}>
    <header className={modal ? 'v2-settings-header' : 'inventory-drawer-header'}><div>{eyebrow && <p>{eyebrow}</p>}<div className="inventory-modal-title-line">{avatar && <span className="lead-avatar admin-header-avatar" aria-hidden="true">{avatar}</span>}<h2 ref={headingRef} tabIndex={-1} id={titleId}>{heading}</h2>{titleExtra}{info && <AdminInfoTooltip>{info}</AdminInfoTooltip>}</div>{headerExtra}</div>{!noClose && <AccountCloseButton label={modal ? 'Close dialog' : 'Close details'} onClick={onClose} />}</header>
    <div className={modal ? 'v2-settings-content' : 'inventory-drawer-body'}>{children}</div>
    {footer && <footer className={modal ? 'v2-settings-footer inventory-modal-footer' : 'inventory-drawer-footer'}>{footer}</footer>}
    {feedback && (modal ? <AdminToastLayer notice={feedback.notice} onClose={feedback.onClose} /> : <ToastNotice notice={feedback.notice} onClose={feedback.onClose} className="inventory-overlay-toast" />)}
  </motion.dialog>, document.body)
}
