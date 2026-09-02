type Milestone = {
  year: string
  title: string
  description: string
}

const milestones: Milestone[] = [
  {
    year: '1999',
    title: 'The Beginning',
    description:
      'Took my first job selling canal boat holidays, unknowingly stepping into a lifelong passion.',
  },
  {
    year: 'Early 2000s',
    title: 'Immersing in the Industry',
    description:
      'Discovered the art of narrowboating — learning about craftsmanship, design, and the unique lifestyle of boaters.',
  },
  {
    year: 'Mid 2000s',
    title: 'Designing & Selling Bespoke Boats',
    description:
      'Transitioned into helping customers create custom-built narrowboats, working with one of the top builders in the country.',
  },
  {
    year: '2010',
    title: 'Helping Buyers & Sellers Navigate Their Journey',
    description:
      'Assisted countless individuals and families in buying and selling boats, guiding them with expertise and passion.',
  },
  {
    year: 'Present',
    title: 'A Life Dedicated to the Waterways',
    description:
      'Continues to share knowledge, connect people to their dream boats, and celebrate the canal boat lifestyle.',
  },
]

export default function NoelCrearyJourney() {
  return (
    <section className="flex flex-col items-center gap-12 border-t border-[#639dbf] px-6 py-16 sm:px-20 sm:py-24">
      <div className="flex max-w-[42rem] flex-col items-center gap-4 text-center">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e3f7fe] px-4 py-1.5 text-sm font-medium tracking-[0.7px] text-[#14b2ef] uppercase">
          <span className="size-2 rounded-full bg-blue" />
          My Journey
        </span>
        <h2 className="font-display text-[2.375rem] leading-[1.3] tracking-[-2px] text-[#020f17] capitalize sm:text-[3.375rem]">
          My Journey
        </h2>
        <p className="max-w-[38rem] text-base leading-[26px] text-text-body">
          Whether you’re looking for your new dream canal boat, are looking to sell on, or are
          just seeking some advice, our expert team can help. You can get in touch with us by
          simply using the Calender.
        </p>
      </div>

      <ol className="relative flex w-full max-w-[56rem] flex-col gap-10 sm:gap-20">
        <div
          aria-hidden="true"
          className="absolute top-2 bottom-4 left-[7.5rem] hidden w-px bg-[#a7d1e0] sm:block"
        />

        {milestones.map((milestone, index) => {
          const isPresent = index === milestones.length - 1

          return (
            <li key={milestone.year} className="relative flex flex-col gap-3 sm:flex-row">
              <div className="shrink-0 pt-4 text-right text-sm font-bold tracking-[0.35px] text-navy-darkest sm:w-[7.5rem] sm:pr-6">
                {milestone.year}
              </div>

              <span
                aria-hidden="true"
                className={`absolute top-[1.125rem] left-[7.5rem] hidden size-4 -translate-x-1/2 rounded-full border-2 sm:block ${
                  isPresent
                    ? 'border-navy-darkest bg-navy-darkest shadow-[0_0_0_4px_#eaf4fc]'
                    : 'border-[#4fa8dc] bg-white shadow-[0_0_0_4px_#eaf4fc]'
                }`}
              />

              <div
                className={`flex-1 rounded-sm border p-8 ${
                  isPresent
                    ? 'border-[#a7d1e0] shadow-[0px_8px_30px_-4px_rgba(184,147,90,0.15)]'
                    : 'border-[#e2e8f0]/60 shadow-[0px_4px_20px_-4px_rgba(0,0,0,0.05)]'
                }`}
              >
                <h3 className="font-display text-[1.75rem] leading-[1.3] tracking-[-1px] text-[#0b2545] capitalize">
                  {milestone.title}
                </h3>
                <p className="mt-3 text-base leading-[26px] text-text-body">
                  {milestone.description}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
