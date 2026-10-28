import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { EASE } from '../lib/motion'

const styles = {
  success: {
    panel: 'border-[#cde9dd] bg-[#eaf8f2]',
    icon: 'text-[#25a876]',
    title: 'text-[#164d43]',
    body: 'text-[#4c756c]',
  },
  warning: {
    panel: 'border-[#f0dfb9] bg-[#fff8e9]',
    icon: 'text-[#c58b23]',
    title: 'text-[#694c1b]',
    body: 'text-[#806c49]',
  },
  error: {
    panel: 'border-[#f2d0d0] bg-[#fff0ef]',
    icon: 'text-[#ce5555]',
    title: 'text-[#7a3333]',
    body: 'text-[#8b6060]',
  },
  info: {
    panel: 'border-[#cbe4f0] bg-[#eaf6fb]',
    icon: 'text-sp-brand',
    title: 'text-sp-brand-deep',
    body: 'text-[#567889]',
  },
}

const icons = {
  success: CheckCircle2,
  warning: AlertCircle,
  error: AlertCircle,
  info: Info,
}

export type Notice = {
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  description?: string
}

export default function ToastNotice({
  notice,
  onClose,
  className = '',
}: {
  notice: Notice | null
  onClose: () => void
  className?: string
}) {
  const reducedMotion = useReducedMotion()
  const tone = notice ? styles[notice.type] || styles.info : styles.info
  const Icon = notice ? icons[notice.type] || Info : Info

  return (
    <AnimatePresence mode="wait">
      {notice && (
        <motion.aside
          key={notice.title}
          role={notice.type === 'error' ? 'alert' : 'status'}
          aria-live={notice.type === 'error' ? 'assertive' : 'polite'}
          initial={reducedMotion ? false : { opacity: 0, x: 18, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 12, y: 6, scale: 0.98 }}
          transition={{ duration: reducedMotion ? 0 : 0.34, ease: EASE }}
          className={`fixed bottom-5 right-5 z-[100] flex w-[min(380px,calc(100vw-40px))] items-start gap-3 rounded-[14px] border p-3.5 shadow-[0_14px_42px_rgba(11,58,88,0.12)] ${tone.panel} ${className}`}
        >
          <span aria-hidden="true" className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white ${tone.icon}`}>
            <Icon size={21} strokeWidth={2} />
          </span>
          <span className="min-w-0 flex-1 pt-0.5">
            <span className={`block text-[13px] font-bold leading-5 ${tone.title}`}>{notice.title}</span>
            {notice.description && <span className={`mt-0.5 block text-[11px] leading-[1.5] ${tone.body}`}>{notice.description}</span>}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss notification"
            className={`-mr-1 -mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-[7px] opacity-65 hover:bg-white/70 hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sp-brand ${tone.title}`}
          >
            <X size={16} />
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
