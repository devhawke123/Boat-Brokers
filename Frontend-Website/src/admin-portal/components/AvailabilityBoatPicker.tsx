import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, ChevronDown, Sailboat, Search } from 'lucide-react'
import { FLOATING_SURFACE_GAP_PX } from '../../seller-portal/lib/layout'
import { EASE } from '../../seller-portal/lib/motion'
import { slotBoatDetails, slotBoatLabel, type AvailabilityBoatOption } from '../lib/availabilityBoats'
import { AccountButton } from './AdminAccountSettings'
import { BoatPicture } from './BoatPicture'

const money = (value: number | null) =>
  value == null
    ? 'Price on request'
    : new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(value)

export function SlotBoatScope({
  slot,
  boats,
  compact = false,
}: {
  slot: { boatIds?: number[] | null }
  boats: AvailabilityBoatOption[]
  compact?: boolean
}) {
  const scoped = slotBoatDetails(slot, boats)
  const label = slotBoatLabel(slot, boats)
  return (
    <span className={'availability-boat-scope' + (compact ? ' is-compact' : '')} title={label}>
      {scoped === null ? (
        <>
          <Sailboat size={15} aria-hidden="true" />
          <span>All boats</span>
        </>
      ) : compact ? (
        <>
          <span className="availability-mini-boats" aria-hidden="true">
            {scoped.slice(0, 2).map((boat) => (
              <BoatPicture key={boat.id} image={boat.image} alt="" />
            ))}
          </span>
          <span>{scoped.length === 1 ? scoped[0].name : scoped.length + ' boats'}</span>
        </>
      ) : (
        scoped.map((boat) => (
          <span className="availability-boat-chip" key={boat.id}>
            <BoatPicture image={boat.image} alt="" />
            <span>{boat.name}</span>
          </span>
        ))
      )}
    </span>
  )
}

export default function AvailabilityBoatPicker({
  boats,
  value,
  onChange,
  error,
}: {
  boats: AvailabilityBoatOption[]
  value: number[] | null
  onChange: (value: number[] | null) => void
  error?: string
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [position, setPosition] = useState<{ width: number; left: number; top: number; maxHeight: number } | null>(null)
  const [target, setTarget] = useState<HTMLElement>(() => document.body)
  const trigger = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const search = useRef<HTMLInputElement>(null)
  const id = useId()
  const reduced = useReducedMotion()
  const filtered = boats.filter((boat) =>
    [boat.name, boat.type, boat.builder, boat.year].filter(Boolean).join(' ').toLowerCase().includes(query.trim().toLowerCase()),
  )
  const validation = error || (value?.length === 0 ? 'Choose at least one boat, or select All boats.' : '')
  const summary =
    value === null
      ? 'All boats'
      : value.length === 1
        ? boats.find((boat) => boat.id === value[0])?.name || '1 boat selected'
        : value.length + ' boats selected'

  function close(restore = false) {
    setOpen(false)
    if (restore) trigger.current?.focus({ preventScroll: true })
  }

  function show() {
    setTarget(trigger.current?.closest('dialog') || document.body)
    setQuery('')
    setOpen(true)
  }

  useLayoutEffect(() => {
    if (!open) return
    const node = menu.current
    if (node && 'showPopover' in node && typeof node.showPopover === 'function' && !node.matches(':popover-open')) {
      node.showPopover()
    }
    function place() {
      if (!trigger.current || !menu.current) return
      const rect = trigger.current.getBoundingClientRect()
      const width = Math.min(rect.width, window.innerWidth - 24)
      const below = window.innerHeight - rect.bottom - 20
      const above = rect.top - 20
      const up = below < 320 && above > below
      const maxHeight = Math.min(420, Math.max(120, up ? above : below))
      setPosition({
        width,
        left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)),
        top: up
          ? Math.max(12, rect.top - Math.min(420, menu.current.scrollHeight, maxHeight) - FLOATING_SURFACE_GAP_PX)
          : rect.bottom + FLOATING_SURFACE_GAP_PX,
        maxHeight,
      })
    }
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [open])

  const positioned = position !== null
  useEffect(() => {
    if (open && positioned) search.current?.focus({ preventScroll: true })
  }, [open, positioned])

  useEffect(() => {
    if (!open) return
    function outside(event: PointerEvent) {
      const targetNode = event.target as Node
      if (!trigger.current?.contains(targetNode) && !menu.current?.contains(targetNode)) setOpen(false)
    }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [open])

  function keys(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      requestAnimationFrame(() => {
        if (menu.current && !menu.current.contains(document.activeElement)) setOpen(false)
      })
      return
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      close(true)
      return
    }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key) || (event.target === search.current && event.key !== 'ArrowDown')) return
    const options = [...(menu.current?.querySelectorAll<HTMLElement>('[data-boat-option]') || [])]
    if (!options.length) return
    event.preventDefault()
    const current = options.indexOf(document.activeElement as HTMLElement)
    const index =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? options.length - 1
          : (current + (event.key === 'ArrowUp' ? -1 : 1) + options.length) % options.length
    options[index].focus()
  }

  function toggle(boatId: number) {
    onChange(value === null ? [boatId] : value.includes(boatId) ? value.filter((item) => item !== boatId) : [...value, boatId])
  }

  return (
    <div className="availability-boat-picker">
      <span id={id + '-label'}>Boats</span>
      <motion.button
        ref={trigger}
        type="button"
        className="availability-boat-trigger"
        aria-labelledby={id + '-label ' + id + '-summary'}
        aria-haspopup="dialog"
        aria-describedby={validation ? id + '-hint' : undefined}
        aria-invalid={Boolean(validation) || undefined}
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => (open ? close() : show())}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            show()
          }
        }}
        whileTap={reduced ? undefined : { scale: 0.99 }}
      >
        <Sailboat size={18} aria-hidden="true" />
        <span id={id + '-summary'}>{summary}</span>
        <motion.span animate={{ rotate: open && !reduced ? 180 : 0 }} transition={{ duration: reduced ? 0 : 0.2, ease: EASE }}>
          <ChevronDown size={16} />
        </motion.span>
      </motion.button>
      {validation && (
        <p id={id + '-hint'} className="v2-settings-error" role="alert">
          {validation}
        </p>
      )}
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              ref={menu}
              id={id}
              // @ts-expect-error popover is supported in Chromium; types lag behind.
              popover="manual"
              role="dialog"
              aria-label="Choose boats"
              onKeyDownCapture={keys}
              className="availability-boat-menu"
              style={{ ...position, visibility: position ? 'visible' : 'hidden' }}
              initial={reduced ? false : { opacity: 0, y: 5, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.2, ease: EASE }}
            >
              <div className="availability-boat-search">
                <Search size={17} aria-hidden="true" />
                <input
                  ref={search}
                  type="search"
                  aria-label="Search boats"
                  placeholder="Search name, type or builder…"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <div className="availability-boat-options" role="group" aria-label="Boats for this slot">
                <motion.button
                  type="button"
                  data-boat-option
                  aria-pressed={value === null}
                  className="availability-all-boats"
                  onClick={() => onChange(null)}
                  whileHover={{ backgroundColor: '#edf6fc' }}
                  whileFocus={{ backgroundColor: '#edf6fc' }}
                >
                  <Sailboat size={22} aria-hidden="true" />
                  <span>
                    <strong>All boats</strong>
                    <span>Entire current inventory</span>
                  </span>
                  <span className={'availability-selection-box' + (value === null ? ' is-checked' : '')}>
                    {value === null && <Check size={14} />}
                  </span>
                </motion.button>
                {filtered.map((boat) => (
                  <motion.label key={boat.id} className="availability-boat-option" whileHover={{ backgroundColor: '#edf6fc' }}>
                    <input
                      data-boat-option
                      type="checkbox"
                      checked={value?.includes(boat.id) || false}
                      onChange={() => toggle(boat.id)}
                      aria-label={boat.name}
                    />
                    <BoatPicture image={boat.image} alt="" />
                    <span className="availability-boat-option-copy">
                      <strong>{boat.name}</strong>
                      <span>
                        {boat.type}
                        {boat.year ? ' · ' + boat.year : ''} · {money(boat.price)}
                      </span>
                    </span>
                    <span aria-hidden="true" className={'availability-selection-box' + (value?.includes(boat.id) ? ' is-checked' : '')}>
                      {value?.includes(boat.id) && <Check size={14} />}
                    </span>
                  </motion.label>
                ))}
                {!filtered.length && (
                  <p className="availability-picker-empty">
                    {boats.length ? 'No boats match your search.' : 'No boats available to select.'}
                  </p>
                )}
              </div>
              <footer>
                <span role="status" aria-live="polite">
                  {value === null ? 'All boats included' : value.length + ' selected'}
                </span>
                <AccountButton onClick={() => close(true)}>Done</AccountButton>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>,
        target,
      )}
    </div>
  )
}
