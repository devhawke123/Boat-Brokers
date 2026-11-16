import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, Copy } from 'lucide-react'
import { EASE } from '../../seller-portal/lib/motion'
import '../styles/admin-record-overlay.css'

// Matches the copy/check interaction in the seller-information panel.
export default function ContactCopyButton({ value, label, copiedLabel }: { value: string; label: string; copiedLabel: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const mounted = useRef(false)
  const reduced = useReducedMotion()
  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false; clearTimeout(timer.current) }
  }, [])

  async function copy() {
    clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(value)
      if (!mounted.current) return
      setState('copied')
    } catch {
      if (!mounted.current) return
      setState('failed')
    }
    timer.current = setTimeout(() => setState('idle'), 2400)
  }

  const message = state === 'copied' ? copiedLabel : state === 'failed' ? 'Could not copy. Select and copy the contact text instead.' : ''
  return <span className="lead-copy-control">
    <motion.button type="button" className="lead-copy-button" aria-label={state === 'copied' ? copiedLabel : label} title={state === 'copied' ? copiedLabel : label} onClick={copy} whileTap={reduced ? undefined : { scale: .88 }}>
      <AnimatePresence mode="wait" initial={false}><motion.span key={state === 'copied' ? 'copied' : 'copy'} initial={reduced ? false : { opacity: 0, scale: .7, y: 2 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={reduced ? { opacity: 0 } : { opacity: 0, scale: .7, y: -2 }} transition={{ duration: reduced ? 0 : .16, ease: EASE }}>{state === 'copied' ? <Check aria-hidden="true" size={15} color="#26735b" /> : <Copy aria-hidden="true" size={15} />}</motion.span></AnimatePresence>
    </motion.button>
    <span className={state === 'failed' ? 'lead-copy-error' : 'sr-only'} role="status">{message}</span>
  </span>
}
