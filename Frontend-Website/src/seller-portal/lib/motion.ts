export const EASE = [0.32, 0.72, 0, 1] as const
export const quick = { duration: 0.5, ease: EASE }
export const textActionVariants = {
  rest: { backgroundColor: '#ffffff00' },
  hover: { backgroundColor: '#f0f8fb' },
}

// Shared dashboard and inventory timings; spatial effects opt out for reduced motion.
export const inventoryMotion = {
  interaction: { duration: 0.35, ease: EASE },
  row: { duration: 0.3, ease: EASE },
  indicator: { duration: 0.52, ease: EASE },
  media: { duration: 0.7, ease: EASE },
  exit: { duration: 0.12, ease: EASE },
  stagger: 0.035,
  pressScale: 0.98,
  rowHover: '#f4f9fb',
}

export function directionalArrowVariants(reducedMotion: boolean | null, direction: 'right' | 'left' | 'up-right' = 'up-right') {
  if (reducedMotion) return { rest: { x: 0, y: 0 }, hover: { x: 0, y: 0 } }
  const offsets = {
    right: { x: 2, y: 0 },
    left: { x: -2, y: 0 },
    'up-right': { x: 2, y: -2 },
  }
  return { rest: { x: 0, y: 0 }, hover: offsets[direction] }
}
