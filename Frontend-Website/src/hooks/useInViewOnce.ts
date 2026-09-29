import { useEffect, useRef, useState } from 'react'

/**
 * Reports whether an element has scrolled into the viewport, flipping to
 * `true` exactly once and never resetting — for entrance animations that
 * should only play the first time an element appears.
 *
 * Falls back to already-visible when the user has requested reduced motion
 * or the browser has no IntersectionObserver, so the "animation" degrades to
 * just showing the content immediately rather than leaving it hidden.
 */
export function useInViewOnce<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.15 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}
