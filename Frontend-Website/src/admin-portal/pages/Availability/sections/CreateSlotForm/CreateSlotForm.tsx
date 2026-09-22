import { useState, type FormEvent } from 'react'
import Button from '../../../../../components/Button/Button'
import { createAvailabilitySlot } from '../../../../lib/api'

type CreateSlotFormProps = {
  onCreated: () => void
}

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
      await createAvailabilitySlot(startsAt.toISOString())
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
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3 rounded-lg border border-[#e2e8f0] bg-white p-4">
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-[#64748b]">Date</span>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-10 rounded-md border border-[#e2e8f0] bg-white px-3 text-sm text-[#0f172a] focus:border-navy-dark focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-[#64748b]">Start Time</span>
        <input
          type="time"
          required
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="h-10 rounded-md border border-[#e2e8f0] bg-white px-3 text-sm text-[#0f172a] focus:border-navy-dark focus:outline-none"
        />
      </label>
      <p className="pb-2.5 text-xs text-[#94a3b8]">2-hour block</p>
      <Button type="submit" variant="dark" label={saving ? 'Adding…' : 'Add Slot'} icon="none" disabled={saving} />
      {error && <p className="w-full text-xs font-medium text-[#dc2626]">{error}</p>}
    </form>
  )
}
