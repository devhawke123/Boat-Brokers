import { useEffect } from 'react'
import Cal, { getCalApi } from '@calcom/embed-react'
import mailIcon from '../../../../assets/icons/mail-outline.svg'
import callIcon from '../../../../assets/icons/call.svg'

const CAL_LINK = import.meta.env.VITE_CAL_COM_LINK ?? 'your-team/consultation'

export default function BookAViewingCalendar() {
  useEffect(() => {
    ;(async () => {
      const cal = await getCalApi()
      cal('ui', {
        theme: 'light',
        styles: { branding: { brandColor: '#073040' } },
        hideEventTypeDetails: false,
        layout: 'month_view',
      })
    })()
  }, [])

  return (
    <section className="flex flex-col items-center gap-12 border-t border-[#639dbf] px-4 py-16 sm:px-20 sm:py-[7.5rem]">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e3f7fe] px-4 py-1.5 text-sm font-medium tracking-[0.7px] text-[#14b2ef] uppercase">
          <span className="size-2 rounded-full bg-blue" />
          Get in Touch
        </span>
        <h2 className="font-display text-4xl leading-[1.3] tracking-[-2px] text-ink capitalize sm:text-[3.375rem]">
          Book a Viewing
        </h2>
        <p className="max-w-3xl text-base leading-[26px] text-[#6e6e6e]">
          Whether you&rsquo;re looking for your new dream canal boat, are looking to sell on, or
          are just seeking some advice, our expert team can help. You can get in touch with us by
          simply using the calendar.
        </p>
      </div>

      <div className="w-full max-w-[50rem] overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
        <Cal
          calLink={CAL_LINK}
          style={{ width: '100%', height: '44rem', overflow: 'auto' }}
          config={{ layout: 'month_view' }}
        />
      </div>

      <div className="flex flex-col items-center gap-3 text-center">
        <h3 className="font-display text-[2rem] leading-[1.3] tracking-[-2px] text-ink capitalize sm:text-[2.125rem]">
          Prefer to reach us directly?
        </h3>
        <p className="text-base leading-[26px] text-[#9a9a9a]">
          Just send us your query and we will be in touch to best help you.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
          <a href="mailto:info@theboatbrokers.co.uk" className="inline-flex items-center gap-1">
            <img src={mailIcon} alt="" aria-hidden="true" className="size-6" />
            <span className="text-base text-ink">info@theboatbrokers.co.uk</span>
          </a>
          <a href="tel:07960768724" className="inline-flex items-center gap-1">
            <img src={callIcon} alt="" aria-hidden="true" className="size-6" />
            <span className="text-base text-ink">07960 768724.</span>
          </a>
        </div>
      </div>
    </section>
  )
}
