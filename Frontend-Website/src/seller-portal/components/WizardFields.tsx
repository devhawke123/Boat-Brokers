import { useContext, useEffect, useId, useRef, useState, type ChangeEvent, type KeyboardEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import { EASE } from '../lib/motion'
import { FLOATING_SURFACE_GAP_PX } from '../lib/layout'

import { WizardThemeContext } from '../context/WizardTheme'

const inputBaseClass =
  'wizard-input w-full rounded-[8px] border border-sp-hairline bg-white font-medium text-sp-ink outline-none placeholder:font-normal placeholder:text-[#8797a1] focus:border-[#428eb0] focus:ring-[3px] focus:ring-[#dceef5]'
const inputClass = `${inputBaseClass} min-h-11 px-3.5 py-2.5 text-[14px]`

export function ValidationMessage({ id, children }: { id: string; children: ReactNode }) {
  const reducedMotion = useReducedMotion()
  return (
    <AnimatePresence>
      {children && (
        <motion.div
          key="validation-error"
          id={id}
          initial={reducedMotion ? false : { height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.28, ease: EASE }}
          className="overflow-hidden text-[11px] leading-4 text-[#a51f36]"
        >
          <span className="block pt-1.5">{children}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function SectionGlyph({ className = 'h-[10px] w-[10px]' }: { className?: string }) {
  const reducedMotion = useReducedMotion()
  return (
    <motion.svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="none"
      className={`shrink-0 text-sp-brand ${className}`}
      initial={reducedMotion ? false : { rotate: 0 }}
      whileInView={reducedMotion ? undefined : { rotate: 360 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: reducedMotion ? 0 : 1.35, ease: EASE, delay: reducedMotion ? 0 : 0.3 }}
    >
      <path
        d="M 112 32 L 54.627 32 L 128 105.373 L 201.373 32 L 144 32 L 144 0 L 256 0 L 256 112 L 224 112 L 224 54.627 L 150.627 128 L 224 201.373 L 224 144 L 256 144 L 256 256 L 144 256 L 144 224 L 201.373 224 L 128 150.627 L 54.627 224 L 112 224 L 112 256 L 0 256 L 0 144 L 32 144 L 32 201.373 L 105.373 128 L 32 54.627 L 32 112 L 0 112 L 0 0 L 112 0 Z"
        fill="currentColor"
      />
    </motion.svg>
  )
}

type FieldProps = {
  label: string
  name: string
  value?: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  type?: 'text' | 'number' | 'tel' | 'email'
  hint?: string
  error?: string
  suffix?: string
  trailingAction?: ReactNode
  className?: string
  min?: string
  minLength?: number
}

export function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  type = 'text',
  hint,
  error,
  suffix,
  trailingAction,
  className = '',
  min,
  minLength,
}: FieldProps) {
  const messageId = useId()
  const numeric = type === 'number'
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.value
    if (numeric && !/^\d*\.?\d*$/.test(nextValue)) return
    if (type === 'tel' && !/^\+?[\d\s()-]*$/.test(nextValue)) return
    onChange(event)
  }
  return (
    <label className={`wizard-field block min-w-0 ${className}`}>
      <span className="mb-2 block text-[12px] font-bold text-[#425a69]">
        {label}
        {required && (
          <span className="ml-1 text-[#ac5c42]" aria-label="required">
            *
          </span>
        )}
      </span>
      <span className="relative block">
        <input
          className={`${inputClass} ${suffix || trailingAction ? 'pr-14' : ''} ${error ? 'border-[#b44953]' : ''}`}
          aria-label={label}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          name={name}
          value={value ?? ''}
          onChange={handleChange}
          placeholder={placeholder}
          type={numeric ? 'text' : type}
          inputMode={numeric ? 'decimal' : type === 'tel' ? 'tel' : undefined}
          min={min}
          minLength={minLength}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-[#718694]">
            {suffix}
          </span>
        )}
        {trailingAction && <span className="absolute right-1 top-1/2 -translate-y-1/2">{trailingAction}</span>}
      </span>
      <ValidationMessage id={messageId}>{error}</ValidationMessage>
      {!error && hint && (
        <span id={messageId} className="mt-1.5 block text-[11px] leading-4 text-[#718694]">
          {hint}
        </span>
      )}
    </label>
  )
}

type SelectFieldProps = {
  label: string
  name: string
  value: string
  onChange: (event: { target: { name: string; value: string } }) => void
  options: string[]
  required?: boolean
  error?: string
  placeholder?: string
  className?: string
  labelHidden?: boolean
  size?: 'default' | 'sm'
  menuWidth?: number
  variant?: 'v2'
}

type MenuPosition = { left: number; top: number; width: number; maxHeight: number }

export function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required,
  error,
  placeholder = 'Select an option',
  className = '',
  labelHidden = false,
  size = 'default',
  menuWidth,
  variant,
}: SelectFieldProps) {
  const v2 = useContext(WizardThemeContext) || variant === 'v2'
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const [position, setPosition] = useState<MenuPosition | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const id = useId()
  const reducedMotion = useReducedMotion()
  const listId = `${id}-options`
  const errorId = `${id}-error`

  useEffect(() => {
    if (!open) return undefined
    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect()
      if (!rect) return
      const menuHeight = Math.min(options.length * 42 + 14, 280)
      const showAbove = window.innerHeight - rect.bottom < menuHeight + 12 && rect.top > window.innerHeight - rect.bottom
      const width = Math.max(rect.width, menuWidth || 0)
      setPosition({
        left: rect.right - width,
        top: showAbove ? Math.max(8, rect.top - menuHeight - FLOATING_SURFACE_GAP_PX) : rect.bottom + FLOATING_SURFACE_GAP_PX,
        width,
        maxHeight: Math.min(280, showAbove ? rect.top - 14 : window.innerHeight - rect.bottom - 14),
      })
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
  }, [open, options.length, menuWidth])

  function openMenu(startIndex = Math.max(0, options.indexOf(value))) {
    setHighlighted(startIndex)
    setOpen(true)
  }

  function choose(option: string) {
    onChange({ target: { name, value: option } })
    setOpen(false)
    triggerRef.current?.focus()
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Escape' && open) {
      event.preventDefault()
      setOpen(false)
      return
    }
    if (event.key === 'Tab') {
      setOpen(false)
      return
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) openMenu(event.key === 'ArrowDown' ? 0 : options.length - 1)
      else setHighlighted((index) => (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length)
      return
    }
    if (!open) return
    if (event.key === 'Home') {
      event.preventDefault()
      setHighlighted(0)
    }
    if (event.key === 'End') {
      event.preventDefault()
      setHighlighted(options.length - 1)
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      choose(options[highlighted])
    }
  }

  return (
    <div className={`wizard-select min-w-0 ${className}`}>
      <span className={labelHidden ? 'sr-only' : 'mb-2 block text-[12px] font-bold text-[#425a69]'}>
        {label}
        {required && (
          <span className="ml-1 text-[#ac5c42]" aria-label="required">
            *
          </span>
        )}
      </span>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-label={label}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open ? `${id}-option-${highlighted}` : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className={`${inputBaseClass} ${size === 'sm' ? 'min-h-9 px-3 py-1.5 text-[12px]' : 'min-h-11 px-3.5 py-2.5 text-[14px]'} flex items-center justify-between gap-3 text-left focus:border-[#428eb0] focus:ring-[3px] focus:ring-[#dceef5] ${error ? 'border-[#b44953]' : ''} ${!value ? 'text-[#8797a1]' : ''}`}
      >
        <span className="min-w-0 truncate">{value || placeholder}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.26, ease: EASE }}
          className="shrink-0 text-[#718694]"
        >
          <ChevronDown size={15} />
        </motion.span>
      </button>
      <ValidationMessage id={errorId}>{error}</ValidationMessage>
      {createPortal(
        <AnimatePresence>
          {open && position && (
            <motion.div
              ref={menuRef}
              id={listId}
              role="listbox"
              aria-label={label}
              initial={reducedMotion ? false : { opacity: 0, y: -5, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: reducedMotion ? 0 : 0.26, ease: EASE }}
              style={{
                position: 'fixed',
                left: position.left,
                top: position.top,
                width: position.width,
                maxHeight: position.maxHeight,
                scrollbarWidth: 'thin',
                scrollbarColor: '#9bbdd7 transparent',
              }}
              className={`${v2 ? 'v2-wizard-select-menu ' : ''}z-[70] overflow-y-auto rounded-[10px] border border-[#cfdee7] bg-white p-1.5 shadow-[0_16px_38px_rgba(11,58,88,0.14)]`}
            >
              {options.map((option, index) => (
                <div
                  key={option}
                  id={`${id}-option-${index}`}
                  role="option"
                  aria-selected={value === option}
                  onMouseEnter={() => setHighlighted(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => choose(option)}
                  className={`flex min-h-[42px] cursor-pointer items-center justify-between gap-3 rounded-[7px] px-3 text-[13px] font-medium ${highlighted === index ? 'bg-[#e8f2fa] text-sp-brand-deep' : 'text-[#425a69]'}`}
                >
                  <span>{option}</span>
                  {value === option && <Check size={15} className="shrink-0 text-sp-brand-deep" />}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  )
}

type TextAreaFieldProps = {
  label: string
  name: string
  value?: string
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  hint?: string
  error?: string
  rows?: number
  className?: string
}

export function TextAreaField({ label, name, value, onChange, placeholder, hint, error, rows = 4, className = '' }: TextAreaFieldProps) {
  const messageId = useId()
  return (
    <label className={`wizard-field block min-w-0 ${className}`}>
      <span className="mb-2 block text-[12px] font-bold text-[#425a69]">{label}</span>
      <textarea
        className={`${inputClass} resize-y leading-relaxed ${error ? 'border-[#b44953]' : ''}`}
        aria-label={label}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? messageId : undefined}
        rows={rows}
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
      />
      <ValidationMessage id={messageId}>{error}</ValidationMessage>
      {!error && hint && (
        <span id={messageId} className="mt-1.5 block text-[11px] leading-4 text-[#718694]">
          {hint}
        </span>
      )}
    </label>
  )
}

type SectionCardProps = { number: string; title: string; description?: string; children: ReactNode; aside?: ReactNode }

export function SectionCard({ number, title, description, children, aside }: SectionCardProps) {
  const v2 = useContext(WizardThemeContext)
  return (
    <section
      className={`wizard-section ${v2 ? 'v2-glass-surface ' : ''}overflow-hidden rounded-[14px] border border-[#e0e7eb] bg-white shadow-[0_8px_36px_rgba(11,58,88,0.025)]`}
    >
      <div className="wizard-section-grid grid gap-6 px-6 py-6 md:grid-cols-[190px_minmax(0,1fr)] md:gap-9 md:px-8 md:py-8 xl:grid-cols-[210px_minmax(0,1fr)]">
        <div className="wizard-section-intro min-w-0">
          <h2 className="flex items-center gap-2 text-[17px] font-semibold leading-snug tracking-[-0.025em] text-sp-ink">
            <SectionGlyph />
            <span className="sr-only">Section {number}: </span>
            {title}
          </h2>
          {description && <p className="mt-2 max-w-[220px] text-[12px] leading-[1.65] text-sp-body">{description}</p>}
          {aside}
        </div>
        <div className="wizard-section-fields min-w-0">{children}</div>
      </div>
    </section>
  )
}

type RadioOption = string | { value: string; title: string; description?: string }

export function RadioCards({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string
  name: string
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  options: RadioOption[]
}) {
  const v2 = useContext(WizardThemeContext)
  const reducedMotion = useReducedMotion()
  return (
    <fieldset className="wizard-radio-group min-w-0">
      <legend className="mb-2 text-[12px] font-bold text-[#425a69]">{label}</legend>
      <div className="overflow-hidden rounded-[10px] border border-sp-hairline divide-y divide-sp-hairline">
        {options.map((item) => {
          const option = typeof item === 'string' ? { value: item, title: item } : item
          const selected = value === option.value
          return (
            <motion.label
              key={option.value}
              animate={{ backgroundColor: selected ? (v2 ? '#e2effb' : '#e3f2fb') : v2 ? '#f8fcff' : '#ffffff' }}
              whileTap={reducedMotion ? undefined : { scale: 0.99 }}
              transition={{ duration: reducedMotion ? 0 : 0.38, ease: EASE }}
              className="wizard-radio-option relative flex min-h-[64px] cursor-pointer items-center justify-between gap-4 px-4 py-2.5"
            >
              <input type="radio" className="sr-only" name={name} value={option.value} checked={selected} onChange={onChange} />
              <motion.span
                aria-hidden="true"
                animate={{ opacity: selected ? 1 : 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.3, ease: EASE }}
                className="pointer-events-none absolute inset-0 rounded-[8px] border-2 border-sp-brand"
              />
              <span className="relative min-w-0">
                <span className="block text-[13px] font-bold text-sp-brand-deep">{option.title}</span>
                {option.description && <span className="mt-0.5 block text-[11px] leading-4 text-[#647b89]">{option.description}</span>}
              </span>
              <span
                aria-hidden="true"
                className="relative grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border-[1.5px] bg-white"
                style={{ borderColor: selected ? '#0d5673' : '#c8d5de' }}
              >
                <motion.span
                  animate={{ scale: selected ? 1 : 0, opacity: selected ? 1 : 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.28, ease: EASE }}
                  className="h-2 w-2 rounded-full bg-sp-brand"
                />
              </span>
            </motion.label>
          )
        })}
      </div>
    </fieldset>
  )
}
