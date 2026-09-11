import contactImg from '../../../../assets/icons/prefertoreach.jpg'
import mailIcon from '../../../../assets/icons/mail-outline.svg'
import callIcon from '../../../../assets/icons/call.svg'
import Button from '../../../../components/Button/Button'

export default function GetInTouch() {
  return (
    <section className="flex flex-col items-center rounded-2xl border border-[#e2e8f0] bg-white px-6 py-14 sm:px-16 sm:py-24">
      <div className="grid w-full max-w-[80rem] grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e3f7fe] px-4 py-1.5 text-sm font-medium tracking-[0.7px] text-[#14b2ef] uppercase">
              <span className="size-2 rounded-full bg-blue" />
              Get in Touch
            </span>
            <h2 className="font-display text-[34px] leading-[1.3] tracking-[-2px] text-ink capitalize sm:text-[3.375rem]">
              Do You Have A Question?
            </h2>
            <div className="flex flex-col gap-4 text-base leading-[26px] text-[#6e6e6e]">
              <p>
                Have a question about how we work or if we can do something specific for you?
              </p>
              <p>
                Just need some advise about how to sell? Whether you&rsquo;re looking for your new
                dream canal boat, are looking to sell on, or are just seeking some advice, our
                expert team can help.
              </p>
            </div>
          </div>

          <div className="h-px w-full bg-[#e5e7eb]" />

          <p className="text-base leading-[26px] text-[#6e6e6e]">
            Choose a convenient date and time directly from our calendar to schedule a call with
            our team.
          </p>

          <Button variant="dark" label="Contact Now" href="mailto:info@theboatbrokers.co.uk" />
        </div>

        <div className="flex flex-col justify-end gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="font-display text-2xl leading-[1.3] tracking-[-2px] text-ink capitalize sm:text-[2.375rem]">
              Prefer to reach us directly?
            </h3>
            <p className="text-base leading-[26px] text-[#9a9a9a]">
              Just send us your query and we will be in touch to best help you.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a href="mailto:info@theboatbrokers.co.uk" className="inline-flex items-center gap-1">
              <img src={mailIcon} alt="" aria-hidden="true" className="size-6" />
              <span className="text-base text-ink">info@theboatbrokers.co.uk</span>
            </a>
            <a href="tel:07960768724" className="inline-flex items-center gap-1">
              <img src={callIcon} alt="" aria-hidden="true" className="size-6" />
              <span className="text-base text-ink">07960 768724.</span>
            </a>
          </div>

          <img
            src={contactImg}
            alt="A narrowboat moored beside a canal towpath"
            className="h-[15.5rem] w-full rounded-[10px] object-cover"
          />
        </div>
      </div>
    </section>
  )
}
