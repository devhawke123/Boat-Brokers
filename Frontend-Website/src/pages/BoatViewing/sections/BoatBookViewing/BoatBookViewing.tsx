import { useEffect, useState, useMemo, type FormEvent, type SVGProps } from 'react'
import { createBooking, fetchAvailabilitySlots, type ApiAvailabilitySlot } from '../../../../lib/api'
import { TextField, TextareaField, FieldRow } from '../../../../seller-portal/components/FormField/FormField'
import Button from '../../../../components/Button/Button'
import AvailabilityCalendar from './AvailabilityCalendar'

function IconCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m5 13 4 4L19 7" />
    </svg>
  )
}

function IconAlert(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  )
}

function IconCalendarOff(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
      <path d="M16 2v4M8 2v4M3 10h18M17 17v4M15 19h4" />
    </svg>
  )
}

type BoatBookViewingProps = {
  boatId: number
  boatName: string
  boatSlug: string
}

export default function BoatBookViewing({ boatId, boatName, boatSlug }: BoatBookViewingProps) {
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
      <section className="animate-fade-up flex flex-col items-center gap-4 rounded-3xl border border-[#bbf7d0] bg-linear-to-b from-[#f0fdf4] to-white p-8 text-center sm:p-12">
        <span className="animate-pop-in flex size-16 items-center justify-center rounded-full bg-[#16a34a] shadow-[0px_8px_24px_-6px_rgba(22,163,74,0.5)]">
          <IconCheck className="size-8 text-white" />
        </span>
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-h5 text-[#15803d]">Viewing Requested!</h2>
          <p className="max-w-md text-sm leading-[1.6] text-[#166534]">
            Thanks, {firstName}! We&rsquo;ve sent your request to view <strong>{boatName}</strong>. We&rsquo;ll email you at{' '}
            <strong>{email}</strong> once it&rsquo;s confirmed.
          </p>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Button variant="dark" icon="none" label="Back to Listing" href={`/boats/${boatSlug}`} />
          <Button variant="outline-dark" icon="none" label="Browse More Boats" href="/boats-for-sale" />
        </div>
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
        <div className="animate-fade-up flex flex-col items-center gap-3 rounded-2xl border border-[#fecaca] bg-[#fef2f2] p-8 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-[#fee2e2]">
            <IconAlert className="size-6 text-[#dc2626]" />
          </span>
          <div className="flex flex-col gap-1">
            <h3 className="font-body text-base font-semibold text-[#991b1b]">Couldn&rsquo;t load viewing slots</h3>
            <p className="max-w-sm text-sm text-[#b91c1c]">{loadError}</p>
          </div>
        </div>
      ) : openSlots.length === 0 ? (
        <div className="animate-fade-up flex flex-col items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-frost p-8 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-badge-bg">
            <IconCalendarOff className="size-6 text-badge-text" />
          </span>
          <div className="flex flex-col gap-1">
            <h3 className="font-body text-base font-semibold text-navy-dark">No slots open right now</h3>
            <p className="max-w-sm text-sm text-text-body">
              Get in touch directly and we&rsquo;ll arrange a time that suits you.
            </p>
          </div>
          <Button
            variant="outline-dark"
            icon="none"
            label="Get In Touch"
            href="/book-a-viewing"
            className="mt-1"
          />
        </div>
      ) : (
        <>
          <AvailabilityCalendar slots={openSlots} selectedSlotId={selectedSlotId} onSelectSlot={setSelectedSlotId} />

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

              {submitError && (
                <div className="animate-fade-up flex items-start gap-2.5 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3">
                  <IconAlert className="mt-0.5 size-4 shrink-0 text-[#dc2626]" />
                  <p className="text-sm font-medium text-[#b91c1c]">{submitError}</p>
                </div>
              )}

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
