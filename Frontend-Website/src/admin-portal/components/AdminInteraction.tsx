import type { ComponentProps, ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { inventoryMotion } from '../../seller-portal/lib/motion'

type AdminActionButtonProps = Omit<ComponentProps<typeof motion.button>, 'children'> & { children?: ReactNode }

// Small controls share feedback without lifting cards or moving the page.
export function AdminActionButton({ children, disabled = false, ...props }: AdminActionButtonProps) {
  const reduced = useReducedMotion()
  return <motion.button type="button" disabled={disabled} whileHover={disabled ? undefined : { opacity: .78 }} whileFocus={disabled ? undefined : { opacity: .78 }} whileTap={reduced || disabled ? undefined : { scale: .96 }} transition={{ ...inventoryMotion.interaction, duration: reduced ? 0 : inventoryMotion.interaction.duration }} {...props}>{children}</motion.button>
}

// Change only the results, not the search/filters or their keyboard focus.
export function AdminResultsBody({ identity, children }: { identity: string | number; children?: ReactNode }) {
  const reduced = useReducedMotion()
  return <motion.tbody key={identity} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...inventoryMotion.row, duration: reduced ? 0 : inventoryMotion.row.duration }}>{children}</motion.tbody>
}
