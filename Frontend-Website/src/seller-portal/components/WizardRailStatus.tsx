import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { EASE } from '../lib/motion'

const RING_DOTS = Array.from({ length: 12 }, (_, index) => {
  const angle = -Math.PI / 2 + (index * Math.PI) / 6
  return { x: 9 + Math.cos(angle) * 6.3, y: 9 + Math.sin(angle) * 6.3 }
})
export default function RailStatus({ state, variant }: { state: 'active' | 'complete' | 'pending'; variant?: 'v2' }) {
  const reducedMotion = useReducedMotion()
  return (
    <span
      aria-hidden="true"
      className={`relative z-10 grid h-[17px] w-[17px] shrink-0 place-items-center text-current ${variant === 'v2' ? `v2-wizard-status is-${state}` : ''}`}
    >
      <AnimatePresence mode="wait">
        {state === 'active' && (
          <motion.svg
            key="active"
            viewBox="0 0 18 18"
            width="17"
            height="17"
            fill="none"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.84 }}
            transition={{ duration: reducedMotion ? 0 : 0.4, ease: EASE }}
          >
            {RING_DOTS.map((dot, index) => (
              <motion.circle
                key={index}
                cx={dot.x}
                cy={dot.y}
                r="1"
                fill="currentColor"
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: reducedMotion ? 0 : 0.2,
                  ease: EASE,
                  delay: reducedMotion ? 0 : index * 0.04,
                }}
              />
            ))}
          </motion.svg>
        )}
        {state === 'complete' && (
          <motion.svg
            key="complete"
            viewBox="0 0 18 18"
            width="17"
            height="17"
            fill="none"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
            transition={{ duration: reducedMotion ? 0 : 0.4, ease: EASE }}
          >
            <motion.circle
              cx="9"
              cy="9"
              r="6.4"
              stroke="currentColor"
              strokeWidth="1.35"
              initial={reducedMotion ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: reducedMotion ? 0 : 0.42, ease: EASE }}
            />
            <motion.path
              d="m5.8 9 2.1 2.1 4.2-4.4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reducedMotion ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: reducedMotion ? 0 : 0.35,
                ease: EASE,
                delay: reducedMotion ? 0 : 0.14,
              }}
            />
          </motion.svg>
        )}
      </AnimatePresence>
    </span>
  )
}
