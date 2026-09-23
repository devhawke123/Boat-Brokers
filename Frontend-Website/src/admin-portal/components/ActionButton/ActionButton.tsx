import type { ComponentType, MouseEvent, SVGProps } from 'react'

// The one place every row/detail-page action (Approve, Reject, Edit, Delete,
// View, Comments...) gets its look from, instead of each table hand-rolling
// its own bordered rectangle. Renders as a link when href is given, a button
// otherwise — same chrome either way, so a row of mixed actions reads as one
// consistent control group rather than a link stitched next to a button.
export type ActionVariant = 'approve' | 'reject' | 'delete' | 'neutral' | 'primary'

const VARIANTS: Record<ActionVariant, string> = {
  approve:
    'border-[#b6ecc9] bg-[#f0fdf4] text-[#116a37] hover:bg-[#dcfce7] hover:border-[#8fe0ac] focus-visible:ring-[#16a34a]/40',
  reject:
    'border-[#ffcfcc] bg-[#fef2f2] text-[#b3261e] hover:bg-[#ffe4e2] hover:border-[#ffb3ad] focus-visible:ring-[#dc2626]/40',
  delete:
    'border-[#ffcfcc] bg-white text-[#b3261e] hover:bg-[#fef2f2] hover:border-[#ffb3ad] focus-visible:ring-[#dc2626]/40',
  neutral:
    'border-[#e2e8f0] bg-white text-[#102a43] hover:bg-[#f8fafc] hover:border-[#cbd5e1] focus-visible:ring-[#0a4359]/30',
  primary:
    'border-transparent bg-navy-dark text-white shadow-[0_1px_2px_rgba(10,67,89,0.35)] hover:opacity-90 hover:-translate-y-px focus-visible:ring-[#0a4359]/40',
}

type ActionButtonProps = {
  label: string
  variant?: ActionVariant
  icon?: ComponentType<SVGProps<SVGSVGElement>>
  href?: string
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  type?: 'button' | 'submit'
  target?: string
  rel?: string
}

export default function ActionButton({
  label,
  variant = 'neutral',
  icon: Icon,
  href,
  onClick,
  disabled,
  type = 'button',
  target,
  rel,
}: ActionButtonProps) {
  const className = `inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 ${VARIANTS[variant]}`

  const content = (
    <>
      {Icon && <Icon className="size-3" />}
      {label}
    </>
  )

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={className}>
        {content}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={className}>
      {content}
    </button>
  )
}
