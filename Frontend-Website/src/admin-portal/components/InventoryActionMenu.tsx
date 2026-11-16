import { useEffect, useId, useRef, useState, type ComponentType, type KeyboardEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Ellipsis } from 'lucide-react'
import { AccountButton } from './AdminAccountSettings'
import { EASE } from '../../seller-portal/lib/motion'

// Ported from boat-brokers InventoryActionMenu.jsx.
export type InventoryMenuItem = { label: string; icon: ComponentType<{ size?: number; strokeWidth?: number; 'aria-hidden'?: boolean | 'true' | 'false' }>; onSelect: () => void; disabled?: boolean }

export default function InventoryActionMenu({ items, label = 'More boat actions' }: { items: InventoryMenuItem[]; label?: string }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (!open) return
    root.current?.querySelector<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')?.focus()
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false) }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [open])
  function close() { setOpen(false); trigger.current?.focus() }
  function navigate(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); return }
    if (event.key === 'Tab') { setOpen(false); return }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key) || !root.current) return
    event.preventDefault()
    const buttons = [...root.current.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')]
    const current = buttons.indexOf(document.activeElement as HTMLButtonElement)
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (current + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length
    buttons[next]?.focus()
  }
  return <div className="inventory-actions-menu" ref={root} onKeyDown={navigate} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false) }}>
    <AccountButton ref={trigger} aria-label={label} aria-haspopup="menu" aria-expanded={open} aria-controls={open ? id : undefined} className="inventory-more-trigger" onClick={() => setOpen(value => !value)} onKeyDown={event => { if (!open && ['ArrowDown', 'ArrowUp'].includes(event.key)) { event.preventDefault(); event.stopPropagation(); setOpen(true) } }}><Ellipsis size={20} aria-hidden="true" /></AccountButton>
    <AnimatePresence>{open && <motion.div id={id} role="menu" aria-label={label} className="inventory-actions-popover" initial={reduced ? false : { opacity: 0, y: 5, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .2, ease: EASE }}>
      {items.map(({ label, icon: Icon, onSelect, disabled }) => <motion.button key={label} type="button" role="menuitem" tabIndex={-1} disabled={disabled} onClick={() => { close(); onSelect() }} whileHover={{ backgroundColor: '#edf4f9' }} whileFocus={{ backgroundColor: '#edf4f9' }} transition={{ duration: reduced ? 0 : .16 }}><Icon size={17} strokeWidth={1.5} aria-hidden="true" />{label}</motion.button>)}
    </motion.div>}</AnimatePresence>
  </div>
}
