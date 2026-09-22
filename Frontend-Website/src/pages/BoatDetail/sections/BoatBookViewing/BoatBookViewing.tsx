import { useEffect, useState, useMemo, type FormEvent } from 'react'
import { createBooking, fetchAvailabilitySlots, type ApiAvailabilitySlot } from '../../../../lib/api'
import { formatDateTime } from '../../../../seller-portal/lib/formatDate'
import { TextField, TextareaField, FieldRow } from '../../../../seller-portal/components/FormField/FormField'
import Button from '../../../../components/Button/Button'

type BoatBookViewingProps = {
  boatId: number
  boatName: string
}

export default function BoatBookViewing({ boatId, boatName }: BoatBookViewingProps) {
  const [slots, setSlots] = useState<ApiAvailabilitySlot[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null)

  const [firstName, setFirstName] = useState('')
  const [surname, setSurname] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchAvailabilitySlots()
      .then((data) => {
        if (!cancelled) setSlots(data)
      })
      .catch((err: unknown) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Failed to load viewing slots.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Computed once per mount rather than on every render — good enough for
  // a single viewing session, and avoids calling the impure Date.now()
  // during render.
  const mountedAt = useMemo(() => Date.now(), [])
  const openSlots = slots
    .filter((slot) => slot.available && new Date(slot.startsAt).getTime() > mountedAt)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedSlotId || submitting) return

    setSubmitting(true)
    setSubmitError(null)
    try {
      await createBooking({
        boatId,
        slotId: selectedSlotId,
        firstName,
        surname,
        email,
        phone: phone || undefined,
        notes: notes || undefined,
      })
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to send your booking request.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <section className="flex flex-col items-center gap-3 rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4] p-8 text-center">
        <h2 className="font-display text-h5 text-[#15803d]">Viewing Requested</h2>
        <p className="max-w-md text-sm text-[#166534]">
          Thanks, {firstName}! We&rsquo;ve sent your request to view <strong>{boatName}</strong>. We&rsquo;ll email you at{' '}
          {email} once it&rsquo;s confirmed.
        </p>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-6 rounded-2xl border border-[#e5e7eb] p-6 sm:p-8">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-h5 text-ink">Book a Viewing</h2>
        <p className="text-sm text-[#6e6e6e]">Pick an available slot to view {boatName} in person.</p>
      </div>

      {loading ? (
        <div className="h-24 w-full animate-pulse rounded-lg bg-[#f1f5f9]" />
      ) : loadError ? (
        <p className="text-sm text-[#dc2626]">Couldn&rsquo;t load viewing slots: {loadError}</p>
      ) : openSlots.length === 0 ? (
        <p className="text-sm text-[#6e6e6e]">
          No viewing slots are open right now. Please{' '}
          <a href="/book-a-viewing" className="font-semibold text-navy-dark underline">
            get in touch directly
          </a>{' '}
          and we&rsquo;ll arrange a time.
        </p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {openSlots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => setSelectedSlotId(slot.id)}
                className={
                  selectedSlotId === slot.id
                    ? 'rounded-lg border-2 border-navy-dark bg-navy-dark px-4 py-2 text-sm font-semibold text-white'
                    : 'rounded-lg border-2 border-[#e5e7eb] px-4 py-2 text-sm font-semibold text-ink transition-colors duration-300 hover:border-navy-dark'
                }
              >
                {formatDateTime(slot.startsAt)}
              </button>
            ))}
          </div>

          {selectedSlotId && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 border-t border-[#e5e7eb] pt-6">
              <FieldRow>
                <TextField label="First Name" required value={firstName} onChange={setFirstName} placeholder="Jane" />
                <TextField label="Surname" required value={surname} onChange={setSurname} placeholder="Smith" />
              </FieldRow>
              <FieldRow>
                <TextField label="Email" required value={email} onChange={setEmail} placeholder="jane@example.com" />
                <TextField label="Phone" value={phone} onChange={setPhone} placeholder="07123 456789" />
              </FieldRow>
              <TextareaField
                label="Anything else we should know?"
                value={notes}
                onChange={setNotes}
                placeholder="Optional"
                maxLength={500}
              />

              {submitError && <p className="text-sm font-medium text-[#dc2626]">{submitError}</p>}

              <Button
                type="submit"
                variant="dark"
                label={submitting ? 'Sending…' : 'Request Viewing'}
                icon="none"
                disabled={submitting}
                className="w-fit disabled:cursor-not-allowed disabled:opacity-70"
              />
            </form>
          )}
        </>
      )}
    </section>
  )
}
