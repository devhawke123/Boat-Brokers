import brokerPortrait from '../../../../assets/areas-we-serve-broker.png'
import britishMarine from '../../../../assets/BritishMarineLogo.png'
import addressPin from '../../../../assets/icons/address-pin.png'
import Button from '../../../../components/Button/Button'

const areas = [
  'Narrowboats For Sale Birmingham',
  'Narrowboats For Sale Coventry',
  'Narrowboats For Sale Wolverhampton',
  'Narrowboats For Sale Worcester',
  'Narrowboats For Sale West Midlands',
  'Narrowboats For Sale Worcestershire',
  'Narrowboats For Sale Warwickshire',
]

export default function AreasWeServeCoverage() {
  return (
    <section className="pt-14 pb-4 lg:py-20">
      <div className="mx-auto grid max-w-[77rem] grid-cols-1 items-start justify-between gap-10 lg:grid-cols-[minmax(0,25rem)_minmax(0,25rem)_minmax(0,25rem)] lg:gap-6 xl:max-w-[87.5rem]">
        <div className="flex flex-col gap-8">
          <h2 className="font-display text-[1.875rem] leading-[1.2] tracking-[-1.7528px] text-black capitalize sm:text-[2.375rem] sm:leading-[1.3] sm:tracking-[-2px] lg:text-[3.375rem]">
            Not Sure if We Cover Your Area?
          </h2>
          <p className="text-sm leading-[26px] text-text-body sm:text-base lg:text-xl lg:leading-[30px]">
            If your narrowboat is moored on any canal connected to the West Midlands network, the
            answer is almost certainly yes. Call us on 07960 768724 and we will confirm within
            minutes whether we can help and if we can, we will arrange a free valuation at a time
            that suits you.
          </p>
          <img
            src={britishMarine}
            alt="British Marine - Leading the Industry"
            className="h-auto w-[13.25rem]"
          />
        </div>

        <div className="h-[280px] overflow-hidden rounded-2xl sm:h-[24rem] lg:h-[33.4rem]">
          <img
            src={brokerPortrait}
            alt="A Boat Brokers broker standing by a narrowboat on the canal"
            className="size-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-end gap-6 lg:h-[33.4rem]">
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-[2.0813rem] leading-[1.3] tracking-[-1.7528px] text-black capitalize sm:text-[2.375rem] sm:tracking-[-2px]">
              Areas We Cover
            </h3>
            <ul className="flex flex-col gap-4">
              {areas.map((area) => (
                <li key={area} className="flex items-center gap-2">
                  <img src={addressPin} alt="" aria-hidden="true" className="size-[1.425rem] shrink-0 sm:size-[26px]" />
                  <span className="text-sm leading-[26px] text-text-body sm:text-base">{area}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button variant="dark" label="More About Me" href="/noel-creary" className="w-fit" />
        </div>
      </div>
    </section>
  )
}
