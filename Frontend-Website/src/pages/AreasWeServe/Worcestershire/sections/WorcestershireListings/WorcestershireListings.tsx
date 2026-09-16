import listingsImage from '../../../../../assets/west-midlands-listings.png'
import Button from '../../../../../components/Button/Button'

export default function WorcestershireListings() {
  return (
    <section className="pt-2 pb-14 lg:pt-4 lg:pb-20">
      <div className="mx-auto grid max-w-[87.5rem] grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,31rem)] lg:items-start lg:gap-20">
        <div className="flex flex-col gap-8 lg:h-[31rem] lg:justify-between">
          <div className="flex flex-col gap-3">
            <h2 className="font-display text-[2.375rem] leading-[1.3] tracking-[-2px] text-black capitalize sm:text-[3.375rem]">
              Narrowboats For Sale in Worcestershire
            </h2>

            <div className="flex flex-col gap-2 text-base leading-[1.5] font-light text-text-body">
              <p>
                We regularly update our selection of{' '}
                <a
                  href="https://theboatbrokers.co.uk/boats-for-sale/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  canal boats for sale in Worcestershire
                </a>
                . Every listing is professionally photographed, accurately specified by our team
                and honestly priced to reflect the current Worcestershire market.
              </p>
              <p>
                Worcestershire attracts buyers who value the quality of the waterway as much as
                the boat itself. The stretch of the Staffordshire &amp; Worcestershire Canal
                between Kinver and Stourport is widely regarded as some of the finest cruising in
                the country, and buyers specifically seeking moorings along this corridor are a
                regular part of our enquiry base. If you have specific requirements around a
                particular canal or boat specification, register your details with us and we will
                contact you directly when a suitable vessel becomes available.
              </p>
              <p>
                We cover the full range — entry-level used narrowboats to well-specified boats
                from respected builders across a wide range of price points.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="dark" label="Buy Boats Now" href="/boats-for-sale" />
            <Button variant="outline-dark" label="Sell Your Boat" href="/sell" />
          </div>
        </div>

        <div className="aspect-square w-full overflow-hidden rounded-2xl lg:w-[31rem]">
          <img
            src={listingsImage}
            alt="A narrowboat moored on a canal surrounded by trees"
            className="size-full scale-x-[-1] object-cover"
          />
        </div>
      </div>
    </section>
  )
}
