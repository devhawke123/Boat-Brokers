import { useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { EASE } from '../../seller-portal/lib/motion'

// Admin variant of boat-brokers BoatSpecificationGroup.jsx.
const hasValue = (value: unknown) => value !== undefined && value !== null && String(value).trim() !== ''

export default function BoatSpecificationGroup({ title, fields, data, initiallyOpen = false }: { title: string; fields: [string, string, string?][]; data: Record<string, unknown>; initiallyOpen?: boolean }) {
  const [open, setOpen] = useState(initiallyOpen)
  const id = useId()
  const reduced = useReducedMotion()
  return <div className="inventory-specification-group">
    <h3><button type="button" id={`${id}-trigger`} aria-expanded={open} aria-controls={`${id}-content`} onClick={() => setOpen(value => !value)} className="inventory-spec-trigger">
      {title}<motion.svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" animate={{ rotate: open ? 180 : 0 }} transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}><path d="M4 9h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><motion.path d="M9 4v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" animate={{ opacity: open ? 0 : 1, pathLength: open ? 0 : 1 }} transition={{ duration: reduced ? 0 : 0.2, ease: EASE }} /></motion.svg>
    </button></h3>
    <AnimatePresence initial={false}>{open && <motion.div key="content" id={`${id}-content`} role="region" aria-labelledby={`${id}-trigger`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : 0.32, ease: EASE }} className="overflow-hidden [overflow-anchor:none]">
      <dl className="inventory-specs">{fields.map(([key, label, unit]) => <div key={key} className="min-w-0"><dt>{label}</dt><dd>{hasValue(data[key]) ? `${data[key]}${unit ? ` ${unit}` : ''}` : 'Not provided'}</dd></div>)}</dl>
    </motion.div>}</AnimatePresence>
  </div>
}
