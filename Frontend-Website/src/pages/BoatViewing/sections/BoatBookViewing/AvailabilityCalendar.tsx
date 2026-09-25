import { useEffect, useState } from 'react'
import type { ApiAvailabilitySlot } from '../../../../lib/api'
import { formatTime } from '../../../../seller-portal/lib/formatDate'
import { IconChevronLeft, IconChevronRight } from '../../../BoatDetail/icons'

type AvailabilityCalendarProps = {
  slots: ApiAvailabilitySlot[]
  selectedSlotId: number | null
  onSelectSlot: (slotId: number) => void
}

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export default function AvailabilityCalendar({ slots, selectedSlotId, onSelectSlot }: AvailabilityCalendarProps) {
  const slotsByDate = new Map<string, ApiAvailabilitySlot[]>()
  for (const slot of slots) {
    const key = dateKey(new Date(slot.startsAt))
    const bucket = slotsByDate.get(key)
    if (bucket) bucket.push(slot)
    else slotsByDate.set(key, [slot])
  }
  const availableDateKeys = [...slotsByDate.keys()].sort()

  const [viewMonth, setViewMonth] = useState(() => {
    const first = availableDateKeys[0]
    const base = first ? new Date(first) : new Date()
    return new Date(base.getFullYear(), base.getMonth(), 1)
  })
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(availableDateKeys[0] ?? null)

  // If the selected slot changes from outside (or slots reload), make sure the
  // visible month/date still matches it instead of silently drifting.
  useEffect(() => {
    const slot = slots.find((s) => s.id === selectedSlotId)
    if (!slot) return
    const date = new Date(slot.startsAt)
    setSelectedDateKey(dateKey(date))
    setViewMonth(new Date(date.getFullYear(), date.getMonth(), 1))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSlotId])

  const today = startOfDay(new Date())
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)

  const firstOfMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1)
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate()
  const leadingBlanks = (firstOfMonth.getDay() + 6) % 7 // Monday-first grid
  const totalCells = Math.ceil((leadingBlanks + daysInMonth) / 7) * 7

  const cells: (Date | null)[] = []
  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - leadingBlanks + 1
    cells.push(dayNum >= 1 && dayNum <= daysInMonth ? new Date(viewMonth.getFullYear(), viewMonth.getMonth(), dayNum) : null)
  }

  const selectedDaySlots = (selectedDateKey && slotsByDate.get(selectedDateKey)) || []

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
      <div className="flex flex-col gap-3 sm:w-76 sm:shrink-0">
        <div className="flex items-center justify-between">
          <p className="font-body text-sm font-semibold text-navy-dark">
            {viewMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Previous month"
              disabled={firstOfMonth <= currentMonthStart}
              onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
              className="flex size-7 items-center justify-center rounded-md text-navy-dark transition-colors duration-300 hover:bg-[#f1f5f9] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <IconChevronLeft className="size-3.5" />
            </button>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
              className="flex size-7 items-center justify-center rounded-md text-navy-dark transition-colors duration-300 hover:bg-[#f1f5f9]"
            >
              <IconChevronRight className="size-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {WEEKDAY_LABELS.map((label) => (
            <span key={label} className="text-[11px] font-semibold text-text-muted">
              {label}
            </span>
          ))}

          {cells.map((date, i) => {
            if (!date) return <span key={i} />

            const key = dateKey(date)
            const daySlots = slotsByDate.get(key)
            const hasSlots = !!daySlots?.length
            const isSelected = key === selectedDateKey
            const isToday = key === dateKey(today)

            return (
              <button
                key={key}
                type="button"
                disabled={!hasSlots}
                onClick={() => setSelectedDateKey(key)}
                className={[
                  'relative flex aspect-square items-center justify-center rounded-lg text-sm font-medium transition-colors duration-300',
                  isSelected
                    ? 'bg-navy-dark text-white'
                    : hasSlots
                      ? 'text-navy-dark hover:bg-badge-bg'
                      : 'cursor-not-allowed text-[#d1d5db]',
                  isToday && !isSelected ? 'ring-1 ring-inset ring-navy-dark/30' : '',
                ].join(' ')}
              >
                {date.getDate()}
                {hasSlots && (
                  <span
                    className={`absolute bottom-1 size-1 rounded-full ${isSelected ? 'bg-white' : 'bg-blue'}`}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 border-t border-[#e5e7eb] pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-8">
        <p className="text-sm font-semibold text-navy-dark">
          {selectedDateKey
            ? (() => {
                const [y, m, d] = selectedDateKey.split('-').map(Number)
                return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })
              })()
            : 'Pick a highlighted date'}
        </p>
        {selectedDaySlots.length === 0 ? (
          <p className="text-sm text-text-body">No slots on this date — pick another highlighted day.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedDaySlots
              .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
              .map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => onSelectSlot(slot.id)}
                  className={
                    selectedSlotId === slot.id
                      ? 'rounded-lg border-2 border-navy-dark bg-navy-dark px-4 py-2 text-sm font-semibold text-white'
                      : 'rounded-lg border-2 border-[#e5e7eb] px-4 py-2 text-sm font-semibold text-ink transition-colors duration-300 hover:border-navy-dark'
                  }
                >
                  {formatTime(slot.startsAt)}
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
