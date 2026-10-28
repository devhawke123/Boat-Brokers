import { useId, type RefObject } from 'react'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, X } from 'lucide-react'
import RailStatus from './WizardRailStatus'
import { Link } from 'react-router-dom'
import { EASE, inventoryMotion, quick } from '../lib/motion'

export default function V2WizardRail({
  steps,
  sections,
  activeIndex,
  specIndex,
  isEditingDraft,
  onStep,
  onSpec,
  mobileOpen,
  onClose,
  railRef,
  closeRef,
}: {
  steps: { slug: string; title: string }[]
  sections: { key: string; title: string }[]
  activeIndex: number
  specIndex: number
  isEditingDraft: boolean
  onStep: (index: number) => boolean
  onSpec: (index: number) => void
  mobileOpen: boolean
  onClose: () => void
  railRef: RefObject<HTMLElement | null>
  closeRef: RefObject<HTMLButtonElement | null>
}) {
  const reduced = useReducedMotion()
  const layoutId = useId()
  function chooseStep(index: number) {
    if (onStep(index) !== false) onClose()
  }
  function chooseSpec(index: number) {
    onSpec(index)
    onClose()
  }
  return (
    <aside ref={railRef} className={`v2-wizard-rail ${mobileOpen ? 'is-open' : ''}`} aria-label="Listing navigation">
      <motion.div
        className="v2-wizard-rail-surface v2-glass-surface"
        initial={reduced ? false : { opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
      >
        <div className="v2-wizard-brand-row">
          <Link to="/boats" aria-label="The Boat Brokers — return to My boats">
            <img src="/seller-portal-assets/boat-brokers-wordmark-blue.png" alt="The Boat Brokers" />
          </Link>
          <motion.button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close steps"
            className="v2-wizard-close"
            whileHover={{ backgroundColor: '#e5f1fb' }}
            transition={quick}
          >
            <X size={17} />
          </motion.button>
        </div>
        <div className="v2-wizard-rail-title">
          <h2>{isEditingDraft ? 'Edit your listing' : 'Create a listing'}</h2>
        </div>
        <LayoutGroup id={layoutId}>
          <nav aria-label="Creation steps" className="v2-wizard-steps">
            {steps.map((step, index) => {
              const active = index === activeIndex
              const complete = index < activeIndex
              return (
                <div key={step.slug}>
                  <motion.button
                    type="button"
                    onClick={() => chooseStep(index)}
                    aria-current={active ? 'step' : undefined}
                    aria-label={`${step.title}${complete ? ', completed' : active ? ', current step' : ''}`}
                    className={`v2-wizard-step ${active ? 'is-active' : ''} ${complete ? 'is-complete' : ''}`}
                    initial={false}
                    animate={{ backgroundColor: '#ffffff00' }}
                    whileHover={{ backgroundColor: '#e9f4fc' }}
                    whileTap={reduced ? undefined : { scale: 0.98 }}
                    transition={quick}
                  >
                    {active && (
                      <motion.span
                        className="v2-wizard-step-indicator"
                        layoutId="wizard-active-step"
                        transition={{
                          ...inventoryMotion.indicator,
                          duration: reduced ? 0 : inventoryMotion.indicator.duration,
                        }}
                      />
                    )}
                    <span className="v2-wizard-step-number" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="v2-wizard-step-label">{step.title}</span>
                    <RailStatus variant="v2" state={active ? 'active' : complete ? 'complete' : 'pending'} />
                  </motion.button>
                  <AnimatePresence initial={false}>
                    {active && index === 1 && (
                      <motion.div
                        className="v2-wizard-substeps"
                        initial={reduced ? false : { height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{
                          duration: reduced ? 0 : 0.35,
                          ease: EASE,
                        }}
                      >
                        {sections.map((section, subIndex) => (
                          <motion.button
                            type="button"
                            key={section.key}
                            onClick={() => chooseSpec(subIndex)}
                            aria-current={subIndex === specIndex ? 'step' : undefined}
                            aria-label={`${section.title}${subIndex === specIndex ? ', current section' : subIndex < specIndex ? ', completed' : ''}`}
                            className={subIndex === specIndex ? 'is-active' : ''}
                            whileHover={{ backgroundColor: '#e5f0f9' }}
                            transition={quick}
                          >
                            <span>{section.title}</span>
                            <RailStatus
                              variant="v2"
                              state={subIndex === specIndex ? 'active' : subIndex < specIndex ? 'complete' : 'pending'}
                            />
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </nav>
        </LayoutGroup>
        <div className="v2-wizard-rail-bottom">
          <Link to="/boats" className="v2-wizard-exit">
            <ArrowLeft size={13} strokeWidth={1.5} />
            Back to my boats
          </Link>
        </div>
      </motion.div>
    </aside>
  )
}
