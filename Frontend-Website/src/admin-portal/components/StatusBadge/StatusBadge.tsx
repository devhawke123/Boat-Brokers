// Every status/type badge across the admin (vendor status, buyer status,
// lead status, sale status, listing status, booking status) shares five
// underlying meanings — new/info, in progress, success, danger, and one
// "special" tone for a standout state like Viewing Booked. Centralizing the
// chrome here (not just the five color pairs, which already existed inline
// per-table) is what makes every badge in the admin look like one system
// instead of five different tables inventing their own pill.
export type BadgeTone = 'info' | 'progress' | 'success' | 'danger' | 'special' | 'neutral'

const TONES: Record<BadgeTone, { bg: string; text: string; border: string; dot: string }> = {
  info: { bg: '#e3f7fe', text: '#0f7fb0', border: '#b7e9fb', dot: '#14b2ef' },
  progress: { bg: '#fef9c3', text: '#8a6116', border: '#fbe89a', dot: '#d97706' },
  success: { bg: '#dcfce7', text: '#116a37', border: '#b6ecc9', dot: '#16a34a' },
  danger: { bg: '#ffeae9', text: '#b3261e', border: '#ffcfcc', dot: '#dc2626' },
  special: { bg: '#ede9fe', text: '#5b21b6', border: '#ddd3fb', dot: '#7c3aed' },
  neutral: { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0', dot: '#64748b' },
}

type StatusBadgeProps = {
  label: string
  tone: BadgeTone
}

export default function StatusBadge({ label, tone }: StatusBadgeProps) {
  const c = TONES[tone]
  return (
    <span
      className="inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-[3px] text-[11px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: c.bg, color: c.text, borderColor: c.border }}
    >
      <span className="size-[5px] shrink-0 rounded-full" style={{ backgroundColor: c.dot }} />
      {label}
    </span>
  )
}
