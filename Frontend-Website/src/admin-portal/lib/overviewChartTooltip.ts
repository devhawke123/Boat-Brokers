import { createContext, useContext } from 'react'
import type { FocusEvent, MouseEvent } from 'react'

export type TooltipAnchor = { left: number; top: number; bottom: number; element?: Element }
export type OverviewTooltipApi = { id: string; show: (label: string, value: string, anchor: TooltipAnchor) => void; hide: () => void }

export const OverviewTooltipContext = createContext<OverviewTooltipApi | null>(null)

// Shared no-op so consumers outside a provider never crash on hover.
const inert: OverviewTooltipApi = { id: '', show: () => {}, hide: () => {} }
export function useOverviewChartTooltip(): OverviewTooltipApi {
  return useContext(OverviewTooltipContext) ?? inert
}
export function chartTooltipEvents(tooltip: OverviewTooltipApi, label: string, value: string) {
  const show = (event: MouseEvent<HTMLElement> | FocusEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    tooltip.show(label, value, { left: rect.left, top: rect.top, bottom: rect.bottom, element: event.currentTarget })
  }
  return { onMouseEnter: show, onMouseLeave: tooltip.hide, onFocus: show, onBlur: tooltip.hide }
}
