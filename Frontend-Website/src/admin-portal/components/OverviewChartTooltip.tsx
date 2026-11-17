import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { inventoryMotion } from '../../seller-portal/lib/motion'
import { OverviewTooltipContext } from '../lib/overviewChartTooltip'
import type { TooltipAnchor } from '../lib/overviewChartTooltip'
import '../styles/admin-info-tooltip.css'

type Tip = { label: string; value: string; anchor: TooltipAnchor }

// A single top-layer tooltip keeps canvas, HTML marks and legends on the same plane.
export function OverviewChartTooltipProvider({ children }: { children: ReactNode }) {
  const id = useId()
  const reduced = useReducedMotion()
  const [tip, setTip] = useState<Tip | null>(null)
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null)
  const bubble = useRef<HTMLDivElement>(null)
  const show = useCallback((label: string, value: string, anchor: TooltipAnchor) => {
    setTip(previous => previous?.label === label && previous?.value === value && previous?.anchor.left === anchor.left && previous?.anchor.bottom === anchor.bottom ? previous : { label, value, anchor })
  }, [])
  const hide = useCallback(() => setTip(null), [])
  const api = useMemo(() => ({ id, show, hide }), [id, show, hide])
  useLayoutEffect(() => {
    if (!tip || !bubble.current) return
    const element = bubble.current
    if (!element.matches(':popover-open')) element.showPopover()
    const bounds = element.getBoundingClientRect()
    const left = Math.max(12, Math.min(tip.anchor.left, window.innerWidth - bounds.width - 12))
    const below = tip.anchor.bottom + 8
    const top = Math.max(12, Math.min(below + bounds.height <= window.innerHeight - 12 ? below : tip.anchor.top - bounds.height - 8, window.innerHeight - bounds.height - 12))
    setPosition({ left, top })
  }, [tip])
  useEffect(() => {
    if (!tip) return
    const dismiss = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      hide()
    }
    const reposition = () => {
      const element = tip.anchor.element
      if (!element || document.activeElement !== element) { hide(); return }
      const rect = element.getBoundingClientRect()
      show(tip.label, tip.value, { left: rect.left, top: rect.top, bottom: rect.bottom, element })
    }
    window.addEventListener('scroll', reposition, true)
    window.addEventListener('resize', reposition)
    document.addEventListener('keydown', dismiss)
    return () => {
      window.removeEventListener('scroll', reposition, true)
      window.removeEventListener('resize', reposition)
      document.removeEventListener('keydown', dismiss)
    }
  }, [tip, hide, show])
  return (
    <OverviewTooltipContext.Provider value={api}>
      {children}
      {createPortal(
        <AnimatePresence>
          {tip && (
            <motion.div
              ref={bubble}
              id={id}
              role="tooltip"
              popover="manual"
              className="admin-floating-tooltip overview-chart-tooltip"
              style={{
                // Explicit edges beat Safari's [popover] { inset: 0 } so the
                // tip stays content-sized instead of a full-height strip.
                position: 'fixed',
                inset: 'auto',
                right: 'auto',
                bottom: 'auto',
                margin: 0,
                width: 'max-content',
                height: 'fit-content',
                left: position?.left,
                top: position?.top,
                visibility: position ? 'visible' : 'hidden',
              }}
              initial={reduced ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ ...inventoryMotion.exit, duration: reduced ? 0 : 0.12 }}
            >
              <strong>{tip.label}</strong>
              <span>{tip.value}</span>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </OverviewTooltipContext.Provider>
  )
}
