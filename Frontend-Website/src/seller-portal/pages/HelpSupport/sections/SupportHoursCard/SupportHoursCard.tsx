import emailIcon from '../../../../assets/HelpSupport/email-icon.svg'
import phoneIcon from '../../../../assets/HelpSupport/phone-icon.svg'

function ContactRow({
  icon,
  title,
  subtitle,
  value,
  href,
}: {
  icon: string
  title: string
  subtitle: string
  value: string
  href?: string
}) {
  return (
    <div className="flex w-full items-start gap-4">
      <img src={icon} alt="" aria-hidden="true" className="size-10 shrink-0" />
      <div className="flex flex-col gap-0.5">
        <h4 className="text-base font-semibold text-[#0f172a]">{title}</h4>
        <p className="text-sm text-[#6e6e6e]">{subtitle}</p>
        {href ? (
          <a href={href} className="text-sm font-medium text-[#0f172a] underline underline-offset-2">
            {value}
          </a>
        ) : (
          <p className="text-sm font-medium text-[#0f172a]">{value}</p>
        )}
      </div>
    </div>
  )
}

export default function SupportHoursCard() {
  return (
    <div className="flex w-full flex-col rounded-lg border border-[#e2e8f0] bg-white sm:w-[380px] sm:shrink-0">
      <div className="border-b border-[#e2e8f0] px-6 py-5">
        <h3 className="font-display text-h6 capitalize text-[#0f172a]">Support Hours</h3>
      </div>

      <div className="flex flex-col gap-6 p-6">
        <ContactRow
          icon={emailIcon}
          title="Email Support"
          subtitle="Available 24/7"
          value="info@theboatbrokers.co.uk"
          href="mailto:info@theboatbrokers.co.uk"
        />
        <ContactRow
          icon={phoneIcon}
          title="Phone Support"
          subtitle="Monday - Friday"
          value="07960 768724"
          href="tel:07960768724"
        />
      </div>
    </div>
  )
}
