import { useState, type FormEvent } from 'react'
import Button from '../../../../../components/Button/Button'
import { createAvailabilitySlot } from '../../../../lib/api'

type CreateSlotFormProps = {
  onCreated: () => void
}

// Viewing slots are always 2 hours — no admin-facing control for it.
const SLOT_DURATION_HOURS = 2

// Slots are on the hour only — no minutes. 24 options, midnight to 11pm.
const HOUR_OPTIONS = Array.from({ length: 24 }, (_, hour) => ({
  value: `${String(hour).padStart(2, '0')}:00`,
  label: new Date(2000, 0, 1, hour).toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' }),
}))

export default function CreateSlotForm({ onCreated }: CreateSlotFormProps) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    <div className="flex flex-col gap-4 rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-base font-bold text-[#0f172a]">Add a Viewing Slot</h2>
        <p className="text-sm text-[#64748b]">Open a 2-hour window for buyers to request a viewing.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-[#64748b]">Date</span>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-11 rounded-lg border border-[#e2e8f0] bg-white px-3 text-sm text-[#0f172a] focus:border-navy-dark focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-[#64748b]">Start Time</span>
          <select
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="h-11 rounded-lg border border-[#e2e8f0] bg-white px-3 text-sm text-[#0f172a] focus:border-navy-dark focus:outline-none"
          >
            <option value="" disabled>
              Select hour
            </option>
            {HOUR_OPTIONS.map((hour) => (
              <option key={hour.value} value={hour.value}>
                {hour.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-[#64748b]">Duration</span>
          <span className="flex h-11 items-center rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 text-sm text-[#0f172a]">
            {SLOT_DURATION_HOURS} hours
          </span>
        </label>
        <Button type="submit" variant="dark" label={saving ? 'Adding…' : 'Add Slot'} icon="none" disabled={saving} className="h-11" />
      </form>

      {error && (
        <p className="w-fit rounded-lg border border-[#ffcfcc] bg-[#fef2f2] px-3 py-2 text-sm font-medium text-[#b3261e]">
          {error}
        </p>
      )}
    </div>
  )
}
