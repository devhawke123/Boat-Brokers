import image1 from '../../../../../assets/west-midlands-why-choose-1.png'
import image2 from '../../../../../assets/west-midlands-why-choose-2.png'
import image3 from '../../../../../assets/west-midlands-listings.png'
import arrowRight from '../../../../../assets/icons/arrow-right-dark.svg'

const rows = [
  {
    text: 'We are not a general agent who handles a bit of everything. The Boat Brokers is a dedicated narrowboat and canal boat brokerage, and the West Midlands is the market we know best. That focus makes a genuine difference to the service and results we deliver.',
    image: image1,
    imageAlt: 'A narrowboat moored on the water at sunset',
    textFirst: true,
  },
  {
    text: (
      <>
        Our{' '}
        <a
          href="https://theboatbrokers.co.uk/selling/"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          narrowboat broker West Midlands
        </a>{' '}
        service is built around honest advice, professional presentation and a commitment to
        getting the right result for every buyer and seller we work with. We have completed over
        500 canal boat sales across the region and our business grows primarily through personal
        recommendation rather than advertising.
      </>
    ),
    image: image2,
    imageAlt: 'A narrowboat moored beside a green riverbank at golden hour',
    textFirst: false,
  },
  {
    text: 'The West Midlands canal network attracts a wide range of buyers, from first-time purchasers drawn by the accessibility of Gas Street Basin and the surrounding city moorings, to experienced boaters looking for long-distance cruising access via the Grand Union or the Staffordshire and Worcestershire. We understand that buyer profile and we write our listings and conduct our viewings with that audience in mind. That local knowledge is what separates a specialist brokerage from a general one.',
    image: image3,
    imageAlt: 'A narrowboat on the water at sunset with its reflection',
    textFirst: true,
  },
]

export default function WestMidlandsWhyChoose() {
  return (
    <section className="flex flex-col items-center gap-12 rounded-2xl bg-navy-darkest px-6 py-14 sm:gap-16 sm:px-16 sm:py-20">
      <div className="flex w-full max-w-[80rem] flex-col gap-6">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[rgba(108,214,255,0.22)] px-4 py-1.5 text-[0.625rem] font-medium tracking-[0.7px] text-blue-light uppercase sm:text-sm">
          <span className="size-2 rounded-full bg-blue-light" />
          Built on Commitment
        </span>
        <h2 className="font-display text-[2.125rem] leading-[1.2] tracking-[-2px] text-white capitalize sm:text-[2.375rem] sm:leading-[1.3] lg:text-[3.375rem]">
          Why Choose The Boat Brokers in the West Midlands?
        </h2>
        <p className="max-w-[62rem] text-sm leading-[26px] text-[#e3e3e3] sm:text-base">
          As a specialist narrowboat and canal boat brokerage, The Boat Brokers combines deep
          local knowledge with honest advice, professional presentation and a personal approach.
          With over 500 canal boat sales across the region, we understand the West Midlands
          market and the buyers it attracts. From first-time boaters to experienced cruisers, our
          listings, viewings and service are tailored to connect the right boats with the right
          buyers.
        </p>
      </div>

      <div className="flex w-full max-w-[80rem] flex-col gap-8 border-t border-white/15 pt-12 sm:gap-16">
        {rows.map((row, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16"
          >
            <p
              className={`text-sm leading-[26px] text-[#b5b5b5] sm:text-lg lg:flex-1 ${
                row.textFirst ? 'lg:order-1' : 'lg:order-2'
              }`}
            >
              {row.text}
            </p>
            <div
              className={`aspect-[350/360] w-full overflow-hidden rounded-2xl lg:aspect-[2.89/1] lg:flex-1 ${
                row.textFirst ? 'lg:order-2' : 'lg:order-1'
              }`}
            >
              <img
                src={row.image}
                alt={row.imageAlt}
                className={`size-full object-cover ${
                  index === 0
                    ? 'scale-x-[-1] object-[35%_85%] lg:object-[center_85%]'
                    : index === 2
                      ? 'object-[center_75%] lg:object-center'
                      : ''
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      <a
        href="/boats-for-sale"
        className="inline-flex items-center gap-1.5 rounded-xl bg-white px-6 py-3 text-base font-medium tracking-[-0.32px] text-[#073040] shadow-btn transition-[transform,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.98]"
      >
        Explore All Boats
        <img src={arrowRight} alt="" aria-hidden="true" className="size-[18px]" />
      </a>
    </section>
  )
}
