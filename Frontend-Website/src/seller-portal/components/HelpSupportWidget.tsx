import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { BadgeQuestionMark, Check, Copy, Mail, Phone, X } from 'lucide-react'
import { EASE } from '../lib/motion'

const SUPPORT_EMAIL = 'info@theboatbrokers.co.uk'
const SUPPORT_PHONE = '07960 768724'

export default function HelpSupportWidget() {
  // Only the client's v2 styling was ported; the flag keeps their markup diffable.
  const v2 = true
  const [open, setOpen] = useState(false)
  const [copiedContact, setCopiedContact] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const reducedMotion = useReducedMotion()

  async function copyContact(type: 'email' | 'phone', value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedContact(type)
      window.setTimeout(() => setCopiedContact((current) => (current === type ? '' : current)), 1800)
    } catch {
      setCopiedContact('')
    }
  }

  useEffect(() => {
    if (!open) return undefined
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div
      ref={rootRef}
      className={`fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6 ${v2 ? 'v2-help-widget' : ''}`}
    >
      <AnimatePresence initial={false}>
        {open && (
          <motion.section
            key="help-support-panel"
            id="help-support-panel"
            role="dialog"
            aria-labelledby="help-support-title"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: reducedMotion ? 0 : 0.26, ease: EASE }}
            className={
              v2
                ? 'v2-help-panel v2-glass-surface w-[min(360px,calc(100vw-32px))] overflow-hidden rounded-[18px]'
                : 'w-[min(360px,calc(100vw-32px))] overflow-hidden rounded-[16px] border border-[#dce7ed] bg-white shadow-[0_18px_52px_rgba(10,67,89,0.16)]'
            }
          >
            <header
              className={`flex items-center justify-between border-b px-4 py-3.5 sm:px-5 ${v2 ? 'v2-help-heading' : 'border-[#e4e9ed]'}`}
            >
              <h2
                id="help-support-title"
                className={`tracking-[-0.025em] text-sp-brand-deep ${v2 ? 'text-[14px] font-medium' : 'text-[16px] font-semibold'}`}
              >
                Help &amp; Support
              </h2>
              <button
                type="button"
                aria-label="Close help and support"
                onClick={() => setOpen(false)}
                className={`grid h-9 w-9 place-items-center rounded-[8px] text-[#718694] hover:bg-sp-surface-soft hover:text-sp-brand-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sp-brand ${v2 ? 'v2-help-close' : ''}`}
              >
                <X aria-hidden="true" size={17} />
              </button>
            </header>
            <div className="px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
              <div className="grid gap-1 divide-y divide-[#e8edf0]">
                <div className="flex items-start gap-3 py-3 first:pt-0">
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full ${v2 ? 'v2-help-icon' : 'bg-sp-blue-lighter/30 text-sp-blue-dark'}`}
                  >
                    <Mail size={16} strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0 flex-1 text-left">
                    <h3 className="text-[12px] font-semibold text-sp-brand-deep">Email support</h3>
                    <div className="mt-1 flex items-center gap-1.5">
                      <a
                        href={`mailto:${SUPPORT_EMAIL}`}
                        className="max-w-[calc(100%-36px)] break-all text-[12px] font-medium text-sp-brand-deep underline decoration-[#a8bac3] underline-offset-2 hover:decoration-sp-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sp-brand"
                      >
                        {SUPPORT_EMAIL}
                      </a>
                      <motion.button
                        type="button"
                        aria-label={copiedContact === 'email' ? 'Email copied' : 'Copy support email'}
                        onClick={() => copyContact('email', SUPPORT_EMAIL)}
                        whileTap={reducedMotion ? undefined : { scale: 0.88 }}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-[7px] text-[#718694] hover:bg-sp-surface-soft hover:text-sp-brand-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sp-brand"
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.span
                            key={copiedContact === 'email' ? 'email-copied' : 'email-copy'}
                            initial={reducedMotion ? false : { opacity: 0, scale: 0.7, y: 2 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.7, y: -2 }}
                            transition={{ duration: reducedMotion ? 0 : 0.16, ease: EASE }}
                          >
                            {copiedContact === 'email' ? (
                              <Check aria-hidden="true" size={15} className={v2 ? 'text-[#168ac1]' : 'text-[#26735b]'} />
                            ) : (
                              <Copy aria-hidden="true" size={15} />
                            )}
                          </motion.span>
                        </AnimatePresence>
                      </motion.button>
                    </div>
                    <p className={`mt-1 text-[11px] font-semibold ${v2 ? 'v2-help-availability' : 'text-[#26735b]'}`}>Available 24/7</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 py-3 last:pb-0">
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full ${v2 ? 'v2-help-icon' : 'bg-sp-blue-lighter/30 text-sp-blue-dark'}`}
                  >
                    <Phone size={16} strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0 flex-1 text-left">
                    <h3 className="text-[12px] font-semibold text-sp-brand-deep">Phone support</h3>
                    <div className="mt-1 flex items-center gap-1.5">
                      <a
                        href={`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`}
                        className="text-[12px] font-medium text-sp-brand-deep underline decoration-[#a8bac3] underline-offset-2 hover:decoration-sp-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sp-brand"
                      >
                        {SUPPORT_PHONE}
                      </a>
                      <motion.button
                        type="button"
                        aria-label={copiedContact === 'phone' ? 'Phone number copied' : 'Copy support phone number'}
                        onClick={() => copyContact('phone', SUPPORT_PHONE)}
                        whileTap={reducedMotion ? undefined : { scale: 0.88 }}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-[7px] text-[#718694] hover:bg-sp-surface-soft hover:text-sp-brand-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sp-brand"
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.span
                            key={copiedContact === 'phone' ? 'phone-copied' : 'phone-copy'}
                            initial={reducedMotion ? false : { opacity: 0, scale: 0.7, y: 2 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.7, y: -2 }}
                            transition={{ duration: reducedMotion ? 0 : 0.16, ease: EASE }}
                          >
                            {copiedContact === 'phone' ? (
                              <Check aria-hidden="true" size={15} className={v2 ? 'text-[#168ac1]' : 'text-[#26735b]'} />
                            ) : (
                              <Copy aria-hidden="true" size={15} />
                            )}
                          </motion.span>
                        </AnimatePresence>
                      </motion.button>
                    </div>
                    <p className="mt-1 text-[11px] font-semibold text-sp-brand-deep">Monday–Friday</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      <motion.button
        ref={triggerRef}
        type="button"
        aria-label={open ? 'Close help and support' : 'Open help and support'}
        aria-expanded={open}
        aria-controls={open ? 'help-support-panel' : undefined}
        onClick={() => setOpen((current) => !current)}
        whileTap={reducedMotion ? undefined : { scale: 0.94 }}
        whileHover={reducedMotion ? undefined : { backgroundColor: v2 ? '#168ac1' : '#18a3d9' }}
        className={`grid h-14 w-14 place-items-center rounded-full text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-sp-brand ${v2 ? 'v2-help-trigger' : 'bg-sp-blue-normal-hover'}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? 'close' : 'help'}
            initial={reducedMotion ? false : { opacity: 0, rotate: -35, scale: 0.72 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, rotate: 35, scale: 0.72 }}
            transition={{ duration: reducedMotion ? 0 : 0.18, ease: EASE }}
          >
            {open ? <X aria-hidden="true" size={24} /> : <BadgeQuestionMark aria-hidden="true" size={25} strokeWidth={1.8} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
