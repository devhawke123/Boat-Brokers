import { useState, type FormEvent } from 'react'
import { sendValuationRequest } from '../../../../lib/api'
import Button from '../../../../components/Button/Button'

export default function ValuationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSent, setIsSent] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const phone = String(data.get('phone') ?? '').trim()
    const boatName = String(data.get('boatName') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()

    setSubmitError(null)
    setIsSubmitting(true)
    try {
      await sendValuationRequest({ name, email, phone: phone || undefined, boatName, message })
      setIsSent(true)
      form.reset()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to send your request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="section flex flex-col items-center gap-10 short:gap-6 px-section-x">
      <div className="flex max-w-[32rem] flex-col items-center gap-4 short:gap-2 text-center">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-badge-bg px-4 py-1.5 text-label font-medium text-badge-text uppercase">
          <span className="size-2 rounded-full bg-blue" />
          Get In Touch
        </span>
        <h2 className="font-display text-h2 text-ink capitalize">Book A Free Valuation</h2>
        <p className="text-body text-text-body">
          Tell us a bit about your boat and we&rsquo;ll get back to you with a free, no-obligation
          valuation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex w-full max-w-[33rem] flex-col gap-5">
        <label className="flex w-full flex-col gap-2">
          <span className="text-body font-medium text-ink">Name</span>
          <input
            type="text"
            name="name"
            required
            placeholder="Your Name"
            className="h-[3.25rem] w-full rounded-md border border-[#cbcad7] bg-[#f8f8f8] px-4 text-body-sm text-ink placeholder:text-text-muted focus:border-navy-dark focus:outline-none"
          />
        </label>

        <label className="flex w-full flex-col gap-2">
          <span className="text-body font-medium text-ink">Email</span>
          <input
            type="email"
            name="email"
            required
            placeholder="Your Email"
            className="h-[3.25rem] w-full rounded-md border border-[#cbcad7] bg-[#f8f8f8] px-4 text-body-sm text-ink placeholder:text-text-muted focus:border-navy-dark focus:outline-none"
          />
        </label>

        <label className="flex w-full flex-col gap-2">
          <span className="text-body font-medium text-ink">Phone Number</span>
          <input
            type="tel"
            name="phone"
            placeholder="Your Phone Number"
            className="h-[3.25rem] w-full rounded-md border border-[#cbcad7] bg-[#f8f8f8] px-4 text-body-sm text-ink placeholder:text-text-muted focus:border-navy-dark focus:outline-none"
          />
        </label>

        <label className="flex w-full flex-col gap-2">
          <span className="text-body font-medium text-ink">Boat Name</span>
          <input
            type="text"
            name="boatName"
            required
            placeholder="e.g. Sentinel"
            className="h-[3.25rem] w-full rounded-md border border-[#cbcad7] bg-[#f8f8f8] px-4 text-body-sm text-ink placeholder:text-text-muted focus:border-navy-dark focus:outline-none"
          />
        </label>

        <label className="flex w-full flex-col gap-2">
          <span className="text-body font-medium text-ink">Message</span>
          <textarea
            name="message"
            required
            rows={5}
            placeholder="Tell us a bit about your boat"
            className="w-full resize-none rounded-md border border-[#cbcad7] bg-[#f8f8f8] p-4 text-body-sm text-ink placeholder:text-text-muted focus:border-navy-dark focus:outline-none"
          />
        </label>

        {submitError && <p className="text-body-sm font-medium text-red-600">{submitError}</p>}
        {isSent && (
          <p className="text-body-sm font-medium text-[#15803d]">
            Thanks — your valuation request has been sent. We&rsquo;ll be in touch soon.
          </p>
        )}

        <Button
          type="submit"
          variant="dark"
          label={isSubmitting ? 'Sending…' : 'Send Request'}
          icon="none"
          disabled={isSubmitting}
          className="w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"
        />
      </form>
    </section>
  )
}
