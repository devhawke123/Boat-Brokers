import { useContext, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import { EASE } from '../../seller-portal/lib/motion'
import { FLOATING_SURFACE_GAP_PX } from '../../seller-portal/lib/layout'
import { WizardThemeContext } from '../../seller-portal/context/WizardTheme'
import { ValidationMessage } from '../../seller-portal/components/WizardFields'
import '../styles/collection-select.css'

// Port of the boat-brokers (V2) SelectField, which is ahead of the seller-portal
// copy: `collection` styling, `layerIndex`, dialog-scoped popover menus and
// `footerAction`. The seller-portal SelectField is left untouched.
const inputBaseClass =
  'wizard-input w-full rounded-[8px] border border-sp-hairline bg-white font-medium text-sp-ink outline-none placeholder:font-normal placeholder:text-[#8797a1] focus:border-[#428eb0] focus:ring-[3px] focus:ring-[#dceef5]'

type SelectFieldProps = {
  label: string
  name?: string
  value: string
  onChange: (event: { target: { name: string | undefined; value: string } }) => void
  options: string[]
  required?: boolean
  error?: string
  placeholder?: string
  className?: string
  labelHidden?: boolean
  size?: 'default' | 'sm'
  menuWidth?: number
  variant?: 'v2'
  collection?: boolean
  layerIndex?: number
  footerAction?: { label: string; onSelect: () => void }
}

type MenuPosition = { left: number; top: number; width: number; maxHeight: number }

export default function AdminSelectField({ label, name, value, onChange, options, required, error, placeholder = 'Select an option', className = '', labelHidden = false, size = 'default', menuWidth, variant, collection = false, layerIndex = 70, footerAction }: SelectFieldProps) {
  const v2 = useContext(WizardThemeContext) || variant === 'v2'
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const [position, setPosition] = useState<MenuPosition | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLButtonElement>(null)
  const id = useId()
  const reducedMotion = useReducedMotion()
  const listId = `${id}-options`
  const errorId = `${id}-error`
  // Keep menus inside native dialogs' focus/inert scope. A popover escapes
  // the dialog's scrolling clip while retaining that DOM relationship.
  const [portalTarget, setPortalTarget] = useState<Element>(() => document.body)
  const inDialog = portalTarget !== document.body
  const hasFooter = Boolean(footerAction)
  useEffect(() => {
    if (open && position && inDialog && menuRef.current && !menuRef.current.matches(':popover-open')) menuRef.current.showPopover()
  }, [open, position, inDialog])

  useEffect(() => {
    if (!open) return undefined
    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect()
      if (!rect) return
      const menuHeight = Math.min(options.length * 44 + 12, 280) + (hasFooter ? 56 : 0)
      const showAbove = window.innerHeight - rect.bottom < menuHeight + 12 && rect.top > window.innerHeight - rect.bottom
      const width = Math.max(rect.width, menuWidth || 0)
      setPosition({ left: rect.right - width, top: showAbove ? Math.max(8, rect.top - menuHeight - FLOATING_SURFACE_GAP_PX) : rect.bottom + FLOATING_SURFACE_GAP_PX, width, maxHeight: Math.min(hasFooter ? 336 : 280, showAbove ? rect.top - 14 : window.innerHeight - rect.bottom - 14) })
    }
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (!triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) setOpen(false)
    }
    updatePosition()
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open, options.length, menuWidth, hasFooter])

  function openMenu(startIndex = Math.max(0, options.indexOf(value))) {
    setPortalTarget(triggerRef.current?.closest('dialog') || document.body)
    setHighlighted(startIndex)
    setOpen(true)
  }

  function choose(option: string | undefined) {
    if (option === undefined) return
    onChange({ target: { name, value: option } })
    setOpen(false)
    triggerRef.current?.focus()
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Escape' && open) { event.preventDefault(); setOpen(false); return }
    if (event.key === 'Tab') { if (open && footerAction && !event.shiftKey) { event.preventDefault(); footerRef.current?.focus() } else setOpen(false); return }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) openMenu(event.key === 'ArrowDown' ? 0 : options.length - 1)
      else if (options.length) setHighlighted((index) => (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length)
      return
    }
    if (!open) return
    if (event.key === 'Home') { event.preventDefault(); setHighlighted(0) }
    if (event.key === 'End') { event.preventDefault(); setHighlighted(options.length - 1) }
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(options[highlighted]) }
  }

  return (
    <div className={`wizard-select min-w-0 ${collection ? 'is-collection-filter' : ''} ${className}`}>
      <span className={labelHidden ? 'sr-only' : 'mb-2 block text-[12px] font-bold text-[#425a69]'}>{label}{required && <span className="ml-1 text-[#ac5c42]" aria-label="required">*</span>}</span>
      <motion.button whileTap={reducedMotion ? undefined : { scale: .99 }} transition={{ duration: reducedMotion ? 0 : .26, ease: EASE }} ref={triggerRef} type="button" role="combobox" aria-label={label} aria-required={required || undefined} aria-invalid={error ? true : undefined} aria-describedby={error ? errorId : undefined} aria-haspopup={footerAction ? 'dialog' : 'listbox'} aria-expanded={open} aria-controls={open ? (footerAction ? `${id}-menu` : listId) : undefined} aria-activedescendant={open ? `${id}-option-${highlighted}` : undefined} onClick={() => open ? setOpen(false) : openMenu()} onKeyDown={onKeyDown} className={`${inputBaseClass} ${size === 'sm' ? 'min-h-9 px-3 py-1.5 text-[12px]' : 'min-h-11 px-3.5 py-2.5 text-[14px]'} flex items-center justify-between gap-3 text-left focus:border-[#428eb0] focus:ring-[3px] focus:ring-[#dceef5] ${error ? 'border-[#b44953]' : ''} ${!value ? 'text-[#8797a1]' : ''}`}>
        <span className="min-w-0 truncate">{value || placeholder}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: reducedMotion ? 0 : 0.26, ease: EASE }} className="shrink-0 text-[#718694]"><ChevronDown size={15} /></motion.span>
      </motion.button>
      <ValidationMessage id={errorId}>{error}</ValidationMessage>
      {createPortal(<AnimatePresence>{open && position && <motion.div ref={menuRef} popover={inDialog ? 'manual' : undefined} id={footerAction ? `${id}-menu` : listId} role={footerAction ? 'dialog' : 'listbox'} aria-label={label} initial={reducedMotion ? false : { opacity: 0, y: -5, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }} transition={{ duration: reducedMotion ? 0 : 0.26, ease: EASE }} style={{ ...(inDialog ? { inset: 'auto', margin: 0 } : {}), position: 'fixed', zIndex: layerIndex, left: position.left, top: position.top, width: position.width, maxHeight: position.maxHeight, scrollbarWidth: 'thin', scrollbarColor: '#9bbdd7 transparent' }} className={`${v2 ? 'v2-wizard-select-menu ' : ''}${footerAction ? 'select-with-footer' : 'overflow-y-auto'} rounded-[10px] border border-[#cfdee7] bg-white ${footerAction ? '' : 'p-1.5'} shadow-[0_16px_38px_rgba(11,58,88,0.14)]`}><div className={footerAction ? 'select-options-scroll' : undefined} role={footerAction ? 'listbox' : undefined} id={footerAction ? listId : undefined} aria-label={footerAction ? label : undefined}>{options.map((option, index) => <div key={option} id={`${id}-option-${index}`} role="option" aria-selected={value === option} onMouseEnter={() => setHighlighted(index)} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(option)} className={`flex min-h-[44px] cursor-pointer items-center justify-between gap-3 rounded-[7px] px-3 text-[13px] font-medium ${highlighted === index ? 'bg-[#e8f2fa] text-sp-brand-deep' : 'text-[#425a69]'}`}><span>{option}</span>{value === option && <Check size={15} className="shrink-0 text-sp-brand-deep" />}</div>)}</div>{footerAction && <div className="select-fixed-footer"><motion.button ref={footerRef} type="button" whileHover={{ backgroundColor: '#e8f2fa', color: '#174d6c' }} whileFocus={{ backgroundColor: '#e8f2fa', color: '#174d6c' }} transition={{ duration: reducedMotion ? 0 : .26, ease: EASE }} whileTap={reducedMotion ? undefined : { scale: .98 }} onKeyDown={event => { if (event.key === 'Escape' || event.key === 'Tab' || event.key === 'ArrowUp') { event.preventDefault(); event.stopPropagation(); if (event.key !== 'ArrowUp') setOpen(false); triggerRef.current?.focus() } }} onClick={() => { setOpen(false); triggerRef.current?.focus(); footerAction.onSelect() }}>{footerAction.label}</motion.button></div>}</motion.div>}</AnimatePresence>, portalTarget)}
    </div>
  )
}
