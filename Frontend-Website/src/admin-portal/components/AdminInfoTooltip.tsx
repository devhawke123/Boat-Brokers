import { useEffect, useId, useLayoutEffect, useRef, useState, type ComponentType, type MouseEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Info } from 'lucide-react'
import { AdminActionButton } from './AdminInteraction'
import { EASE } from '../../seller-portal/lib/motion'
import '../styles/admin-info-tooltip.css'

type TooltipPosition = { width: number; left: number; top: number }
type TooltipIcon = ComponentType<{ size?: number; strokeWidth?: number; fill?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>

// Top-layer popovers escape scrolling drawers without leaving their focus scope.
export default function AdminInfoTooltip({ children, label = 'About this action', icon: Icon = Info as TooltipIcon, action, pressed, className = '' }: {
  children?: ReactNode
  label?: string
  icon?: TooltipIcon
  action?: (event: MouseEvent<HTMLButtonElement>) => void
  pressed?: boolean
  className?: string
}) {
  const id = useId()
  const reduced = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<TooltipPosition | null>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const bubble = useRef<HTMLSpanElement>(null)
  const [target, setTarget] = useState<Element>(() => document.body)
  function show() {
    setTarget(trigger.current?.closest('dialog') || document.body)
    setOpen(true)
  }
  useLayoutEffect(() => {
    if (!open || !bubble.current) return
    const tip = bubble.current
    if (!tip.matches(':popover-open')) tip.showPopover()
    function place() {
      if (!trigger.current) return
      const anchor = trigger.current.getBoundingClientRect()
      const dialog = trigger.current.closest('dialog')?.getBoundingClientRect()
      const leftBound = Math.max(12, (dialog?.left || 0) + 12)
      const rightBound = Math.min(window.innerWidth - 12, dialog ? dialog.right - 12 : window.innerWidth - 12)
      const width = Math.min(280, rightBound - leftBound)
      tip.style.width = width + 'px'
      const height = tip.getBoundingClientRect().height
      const below = anchor.bottom + 8
      setPosition({ width, left: Math.max(leftBound, Math.min(anchor.left, rightBound - width)), top: Math.max(12, Math.min(below + height <= window.innerHeight - 12 ? below : anchor.top - height - 8, window.innerHeight - height - 12)) })
    }
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true) }
  }, [open])
  useEffect(() => {
    if (!open) return
    function dismiss(event: Event) {
      if (event.type === 'keydown') {
        if ((event as KeyboardEvent).key !== 'Escape') return
        event.preventDefault()
        event.stopPropagation()
      } else if (trigger.current?.contains(event.target as Node)) return
      setOpen(false)
    }
    document.addEventListener('keydown', dismiss, true)
    document.addEventListener('pointerdown', dismiss)
    return () => { document.removeEventListener('keydown', dismiss, true); document.removeEventListener('pointerdown', dismiss) }
  }, [open])
  return <span className={'inventory-comment-info ' + className} onMouseEnter={show} onMouseLeave={() => { if (document.activeElement !== trigger.current) setOpen(false) }}>
    <AdminActionButton ref={trigger} type="button" aria-label={label} aria-pressed={pressed} aria-describedby={open ? id : undefined} onFocus={show} onBlur={() => setOpen(false)} onClick={event => { show(); action?.(event) }}><Icon size={17} strokeWidth={1.6} fill={pressed ? 'currentColor' : 'none'} aria-hidden="true" /></AdminActionButton>
    {createPortal(
      <AnimatePresence>
        {open && (
          <motion.span
            ref={bubble}
            popover="manual"
            role="tooltip"
            id={id}
            className="admin-floating-tooltip"
            style={{
              position: 'fixed',
              inset: 'auto',
              right: 'auto',
              bottom: 'auto',
              margin: 0,
              height: 'fit-content',
              width: position?.width,
              left: position?.left,
              top: position?.top,
              visibility: position ? 'visible' : 'hidden',
            }}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.18, ease: EASE }}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>,
      target,
    )}
  </span>
}
