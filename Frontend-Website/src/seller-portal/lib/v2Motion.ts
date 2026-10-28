import { EASE } from './motion'

// Blur-in on scroll; filter clears to none afterwards so backdrop-filter glass keeps working.
export function revealProps(reduced: boolean | null, delay = 0) {
  return {
    'data-reveal': true,
    initial: reduced ? false : { opacity: 0, y: 28, filter: 'blur(12px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } },
    viewport: { once: true, amount: 0.12, margin: '0px 0px -6% 0px' },
    transition: { duration: reduced ? 0 : 1.05, delay: reduced ? 0 : delay, ease: EASE },
  }
}
