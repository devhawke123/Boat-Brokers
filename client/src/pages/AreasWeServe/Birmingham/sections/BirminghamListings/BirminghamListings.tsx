import listingsImage from '../../../../../assets/birmingham pic1 (2).jpg'
import Button from '../../../../../components/Button/Button'

export default function BirminghamListings() {
  return (
    <section className="pt-2 pb-14 lg:pt-4 lg:pb-20">
      <div className="mx-auto grid max-w-[87.5rem] grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,31rem)] lg:items-start lg:gap-20">
        <div className="flex flex-col gap-8 lg:h-[31rem] lg:justify-between">
          <div className="flex flex-col gap-3">
            <h2 className="font-display text-[2.375rem] leading-[1.3] tracking-[-2px] text-black capitalize sm:text-[3.375rem]">
              Narrowboats For Sale in Birmingham
            </h2>

            <div className="flex flex-col gap-2 text-base leading-[1.5] font-light text-text-body">
              <p>
                We maintain a regularly updated selection of{' '}
                <a
                  href="https://theboatbrokers.co.uk/boats-for-sale/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  canal boats for sale in Birmingham
                </a>
                , covering traditional stern narrowboats, cruiser stern vessels and wide beam
                canal boats across a broad range of budgets and specifications.
              </p>
              <p>
                Birmingham attracts one of the most diverse buyer pools in the country. City
                centre mooring locations along Gas Street Basin and the Mailbox draw buyers
                looking for a liveaboard lifestyle close to urban amenities, while the wider BCN
                network appeals to buyers who want extensive cruising without leaving the city. If
                you have specific requirements around mooring location, boat length or builder,
                register your details with us and we will contact you directly when a suitable
                vessel becomes available in Birmingham.
              </p>
              <p>
                Every listing includes professional photography, an accurate specification and an
                honest condition assessment. No inflated asking prices. No vague descriptions.
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
            alt="A narrowboat moored on a canal in Birmingham"
            className="size-full scale-x-[-1] object-cover"
          />
        </div>
      </div>
    </section>
  )
}
