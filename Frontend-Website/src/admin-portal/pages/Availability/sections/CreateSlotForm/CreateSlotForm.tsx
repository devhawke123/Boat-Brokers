import { useMemo, useState, type FormEvent } from 'react'
import Button from '../../../../../components/Button/Button'
import { createAvailabilitySlot } from '../../../../lib/api'
import type { ApiAvailabilitySlot } from '../../../../../lib/api'

type CreateSlotFormProps = {
  existingSlots: ApiAvailabilitySlot[]
  onCreated: () => void
}

// Viewing slots are always 2 hours — no admin-facing control for it.
const SLOT_DURATION_HOURS = 2

// Slots are on the hour only, even hours only, so back-to-back 2-hour
// viewings always land on a clean boundary (10–12, 12–2, ...) instead of
// creating awkward half-taken hours. 12 options, midnight to 10pm.
const HOUR_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const hour = i * 2
  return {
    value: `${String(hour).padStart(2, '0')}:00`,
    label: new Date(2000, 0, 1, hour).toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' }),
  }
})

// Both the <input type="date"> value and an ISO string's local calendar day
// need to line up here, so this reads the date in the browser's local
// timezone rather than UTC (toISOString().slice(0, 10) would shift near
// midnight for anyone not on UTC).
function localDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function localHourKey(date: Date) {
  return `${String(date.getHours()).padStart(2, '0')}:00`
}

function takenHoursFor(date: string, existingSlots: ApiAvailabilitySlot[]) {
  const taken = new Set<string>()
  for (const slot of existingSlots) {
    const start = new Date(slot.startsAt)
    if (localDateKey(start) === date) taken.add(localHourKey(start))
  }
  return taken
}

export default function CreateSlotForm({ existingSlots, onCreated }: CreateSlotFormProps) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Hours already taken on the selected date — a slot can't be created on
  // top of one, so it's removed from the picker rather than left to fail
  // server-side.
  const takenHours = useMemo(() => (date ? takenHoursFor(date, existingSlots) : new Set<string>()), [
    date,
    existingSlots,
  ])

  const availableCount = HOUR_OPTIONS.length - takenHours.size

  function handleDateChange(nextDate: string) {
    setDate(nextDate)
    // The previously-picked hour may no longer be free on the new date.
    if (time && takenHoursFor(nextDate, existingSlots).has(time)) setTime('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!date || !time) return

    // Treated as local time — new Date('YYYY-MM-DDTHH:mm') parses in the
    // browser's local timezone, which is what an admin picking a slot expects.
    const startsAt = new Date(`${date}T${time}`)
    if (Number.isNaN(startsAt.getTime())) {
      setError('Please pick a valid date and time.')
      return
    }

    setSaving(true)
    setError(null)
    try {
      await createAvailabilitySlot(startsAt.toISOString(), SLOT_DURATION_HOURS)
      setDate('')
      setTime('')
      onCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create slot.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-base font-bold text-[#0f172a]">Add a Viewing Slot</h2>
        <p className="text-sm text-[#64748b]">
          Open a 2-hour window for buyers to request a viewing. Slots start on even hours, and a
          date/time already in use won&rsquo;t be offered again.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_auto]">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-[#64748b]">Date</span>
            <input
              type="date"
              required
              value={date}
              min={localDateKey(new Date())}
              onChange={(e) => handleDateChange(e.target.value)}
              className="h-11 rounded-lg border border-[#e2e8f0] bg-white px-3 text-sm text-[#0f172a] transition-colors focus:border-navy-dark focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-[#64748b]">Start Time</span>
            <select
              required
              value={time}
              disabled={!date}
              onChange={(e) => setTime(e.target.value)}
              className="h-11 rounded-lg border border-[#e2e8f0] bg-white px-3 text-sm text-[#0f172a] transition-colors focus:border-navy-dark focus:outline-none disabled:cursor-not-allowed disabled:bg-[#f8fafc] disabled:text-[#94a3b8]"
            >
              <option value="" disabled>
                {date ? 'Select hour' : 'Pick a date first'}
              </option>
              {HOUR_OPTIONS.map((hour) => (
                <option key={hour.value} value={hour.value} disabled={takenHours.has(hour.value)}>
                  {hour.label}
                  {takenHours.has(hour.value) ? ' — already booked' : ''}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-[#64748b]">Duration</span>
            <span className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-[#eff6ff] px-3.5 text-sm font-semibold whitespace-nowrap text-[#2563eb]">
              {SLOT_DURATION_HOURS} hours
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#f1f5f9] pt-4">
          <span className="text-xs text-[#94a3b8]">
            {date
              ? `${availableCount} of ${HOUR_OPTIONS.length} hourly slots still open on this date`
              : 'Pick a date to see which hours are still open'}
          </span>
          <Button
            type="submit"
            variant="dark"
            label={saving ? 'Adding…' : 'Add Slot'}
            icon="none"
            disabled={saving || (!!date && availableCount === 0)}
            className="h-11"
          />
        </div>
      </form>

      {error && (
        <p className="w-fit rounded-lg border border-[#ffcfcc] bg-[#fef2f2] px-3 py-2 text-sm font-medium text-[#b3261e]">
          {error}
        </p>
      )}
    </div>
  )
}
