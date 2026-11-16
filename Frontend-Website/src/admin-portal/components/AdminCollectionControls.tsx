import { useEffect, useId, useRef, useState, type ComponentType, type ElementType } from 'react'
import { Link } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { Banknote, CalendarDays, CheckCircle2, ChevronDown, CircleMinus, Clock3, FilePenLine, ListFilter, MessageCircle, MessageSquareText, Sailboat, SlidersHorizontal, Sparkles, Trophy, UsersRound } from 'lucide-react'
import AdminSelectField from './AdminSelectField'
import { AdminActionButton } from './AdminInteraction'
import { FLOATING_SURFACE_GAP_PX } from '../../seller-portal/lib/layout'
import { EASE, inventoryMotion } from '../../seller-portal/lib/motion'
import '../styles/admin-collection-controls.css'

const MotionLink = motion.create(Link)
type StatIcon = ComponentType<{ size?: number; strokeWidth?: number; 'aria-hidden'?: boolean | 'true' | 'false' }>
const stageIcons: Record<string, StatIcon> = { Current: Clock3, Completed: CheckCircle2, Cancelled: CircleMinus, New: Sparkles, Contacted: MessageCircle, Listed: CheckCircle2, Lost: CircleMinus, 'Viewing Booked': CalendarDays, Won: Trophy, 'Awaiting review': Clock3, 'Changes required': MessageSquareText, Approved: CheckCircle2, Draft: FilePenLine }

export type AdminCollectionStat = { value: string; label: string; count: number | string; icon?: StatIcon; to?: string }
export type AdminCollectionFilterField = { label: string; value: string; options: string[]; onChange: (value: string) => void }
type FilterPosition = { width: number; left: number; top: number; maxHeight: number }

export function AdminCollectionStats({ label, items, value, onChange }: { label: string; items: AdminCollectionStat[]; value: string; onChange?: (value: string) => void }) {
  const reduced = useReducedMotion()
  const selectionId = useId()
  return <LayoutGroup id={selectionId}><div className="admin-stats-container"><div data-count={items.length} className="admin-collection-stats" role="group" aria-label={label}>{items.map(item => {
    const Icon = item.icon || stageIcons[item.value] || (item.label === 'All sales' ? Banknote : item.label === 'All boats' ? Sailboat : item.label === 'All leads' ? ListFilter : UsersRound)
    const Control = (item.to ? MotionLink : motion.button) as ElementType
    return <Control key={item.value} to={item.to} type={item.to ? undefined : 'button'} aria-pressed={item.to ? undefined : value === item.value} className={'v2-glass-surface' + (value === item.value ? ' is-active' : '')} onClick={item.to ? undefined : () => onChange?.(item.value)} initial="rest" animate="rest" whileHover="hover" whileFocus="hover" whileTap={reduced ? undefined : { scale: .98 }} transition={{ duration: reduced ? 0 : .2, ease: EASE }}><div className="admin-stat-heading"><span>{item.label}</span><motion.span className="admin-stat-icon" variants={{ rest: { opacity: .75 }, hover: { opacity: 1 } }}><Icon size={19} strokeWidth={1.5} aria-hidden="true" /></motion.span></div><motion.strong key={item.count} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : .2 }}>{item.count}</motion.strong>{value === item.value && <motion.i className="admin-stat-selection" aria-hidden="true" layoutId={reduced ? undefined : 'stat-selection'} initial={false} transition={{ ...inventoryMotion.indicator, duration: reduced ? 0 : inventoryMotion.indicator.duration }} />}</Control>
  })}</div></div></LayoutGroup>
}

// A single non-modal popover for every admin collection. SelectField keeps its
// existing keyboard behavior and portalled menus; changes apply immediately.
export function AdminCollectionFilters({ fields, active, onClear }: { fields: AdminCollectionFilterField[]; active?: boolean; onClear: () => void }) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<FilterPosition | null>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const id = useId()
  const reduced = useReducedMotion()
  function close() { setOpen(false); trigger.current?.focus({ preventScroll: true }) }
  const positioned = Boolean(position)
  useEffect(() => {
    if (!open) return
    const place = () => {
      if (!trigger.current) return
      const rect = trigger.current.getBoundingClientRect()
      const width = Math.min(320, window.innerWidth - 32)
      setPosition({ width, left: Math.max(16, Math.min(rect.right - width, window.innerWidth - width - 16)), top: Math.min(rect.bottom + FLOATING_SURFACE_GAP_PX, window.innerHeight - 180), maxHeight: Math.max(150, window.innerHeight - Math.min(rect.bottom + FLOATING_SURFACE_GAP_PX, window.innerHeight - 180) - 16) })
    }
    const outside = (event: PointerEvent) => {
      const target = event.target as Element
      if (!trigger.current?.contains(target) && !panel.current?.contains(target) && !target.closest('.v2-wizard-select-menu')) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.defaultPrevented) { event.preventDefault(); setOpen(false); trigger.current?.focus() }
    }
    place()
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true) }
  }, [open])
  useEffect(() => {
    if (open && positioned) panel.current?.querySelector('button')?.focus({ preventScroll: true })
  }, [open, positioned])
  return <div className="admin-filter-control">
    <AdminActionButton ref={trigger} type="button" className="admin-filter-trigger" aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? id : undefined} onClick={() => open ? close() : setOpen(true)}><SlidersHorizontal size={16} aria-hidden="true" />Filters{active && <><i aria-hidden="true" /><span className="sr-only">Filters applied</span></>}<motion.span aria-hidden="true" animate={{ rotate: open ? 180 : 0 }} transition={{ ...inventoryMotion.interaction, duration: reduced ? 0 : inventoryMotion.interaction.duration }}><ChevronDown size={15} /></motion.span></AdminActionButton>
    {createPortal(<AnimatePresence>{open && position && <motion.div ref={panel} id={id} role="dialog" aria-label="Collection filters" className="admin-filter-panel" style={position} initial={reduced ? false : { opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -5 }} transition={{ duration: reduced ? 0 : .2, ease: EASE }} onKeyDown={event => {
      if (event.key === 'Tab' && panel.current) {
        const controls = [...panel.current.querySelectorAll('button:not([disabled])')]
        if ((!event.shiftKey && document.activeElement === controls.at(-1)) || (event.shiftKey && document.activeElement === controls[0])) { event.preventDefault(); close() }
      }
    }}><h2>Filters</h2><div className="admin-filter-fields">{fields.map(field => <AdminSelectField collection key={field.label} variant="v2" label={field.label} value={field.value} options={field.options} onChange={event => field.onChange(event.target.value)} layerIndex={91} />)}</div><footer><AdminActionButton type="button" onClick={onClear}>Clear filters</AdminActionButton><AdminActionButton type="button" onClick={close}>Done</AdminActionButton></footer></motion.div>}</AnimatePresence>, document.body)}
  </div>
}
