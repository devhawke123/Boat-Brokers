import missionIcon from '../../../../assets/icons/purpose-mission.svg'
import visionIcon from '../../../../assets/icons/purpose-vision.svg'
import valuesIcon from '../../../../assets/icons/purpose-values.svg'

const pillars = [
  {
    icon: missionIcon,
    title: 'Mission',
    description:
      'The Boat Brokers is dedicated to delivering exceptional service for both buyers and sellers, combining industry expertise with cutting-edge technology to create seamless and hassle-free transactions that exceed client expectations.',
  },
  {
    icon: visionIcon,
    title: 'Vision',
    description:
      'We aspire to lead the boating industry by offering a transparent, accessible, and customer-centric brokerage experience, setting new standards in how boats are bought and sold, while fostering long-term relationships with our clients.',
  },
  {
    icon: valuesIcon,
    title: 'Values',
    description:
      'We are guided by integrity, prioritizing honest dealings. We focus on exceptional service, embracing innovation to enhance the experience, and ensuring efficiency to save clients time and costs.',
  },
]

export default function OurPurpose() {
  return (
    <section className="flex flex-col items-center gap-12 rounded-2xl bg-navy-darkest px-6 py-14 text-center sm:px-16 sm:py-20">
      <div className="flex max-w-[28rem] flex-col items-center gap-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(108,214,255,0.22)] px-4 py-1.5 text-sm font-medium tracking-[0.7px] text-blue-light uppercase">
          <span className="size-2 rounded-full bg-blue-light" />
          Built on Commitment
        </span>
        <h2 className="font-display text-[2.375rem] leading-[1.3] tracking-[-2px] text-white capitalize sm:text-[3.375rem]">
          Our Purpose &amp; Principles
        </h2>
        <p className="text-base leading-[26px] text-text-muted">
          We&rsquo;re guided by a clear purpose: delivering honest, expert, and effortless boat
          brokerage experiences.
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-3 lg:items-start">
        {pillars.map((pillar, index) => (
          <article
            key={pillar.title}
            className={`flex flex-col items-start gap-4 rounded-[10px] bg-white p-8 ${
              index === 2 ? 'sm:col-span-2 lg:col-span-1' : ''
            } ${index === 1 ? 'lg:mt-16' : ''}`}
          >
            <img src={pillar.icon} alt="" aria-hidden="true" className="h-16 w-auto" />
            <h3 className="font-display text-[1.75rem] leading-[1.3] tracking-[-1px] text-black capitalize">
              {pillar.title}
            </h3>
            <p className="text-base leading-[1.8] text-text-body">{pillar.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
