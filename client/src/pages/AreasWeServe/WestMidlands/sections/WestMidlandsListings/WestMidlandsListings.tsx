import listingsImage from '../../../../../assets/west-midlands-listings.png'
import Button from '../../../../../components/Button/Button'

export default function WestMidlandsListings() {
  return (
    <section className="pt-2 pb-14 lg:pt-4 lg:pb-20">
      <div className="mx-auto grid max-w-[87.5rem] grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,31rem)] lg:items-start lg:gap-20">
        <div className="flex flex-col gap-8 lg:h-[31rem] lg:justify-between">
          <div className="flex flex-col gap-3">
            <h2 className="font-display text-[2.375rem] leading-[1.3] tracking-[-2px] text-black capitalize sm:text-[3.375rem]">
              Narrowboats For Sale in the West Midlands
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
                  canal boats for sale in the West Midlands
                </a>
                , covering traditional stern narrowboats, cruiser stern vessels and wide beam
                canal boats across a broad range of budgets and specifications.
              </p>
              <p>
                Every listing is professionally photographed, accurately specified by our team and
                honestly priced to reflect the current market.
              </p>
              <p>
                The West Midlands buyer pool is one of the strongest in the country. Active
                purchasers from Birmingham, Wolverhampton, Coventry and the surrounding areas
                search our listings throughout the year, which means well-presented boats at
                realistic prices move quickly. If you are looking for a specific length, builder
                or mooring location along the Birmingham Canal Navigations or the Grand Union
                corridor, register your details with us and we will contact you directly when a
                suitable vessel comes to market.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="dark" label="Buy Boats Now" href="/boats-for-sale" />
            <Button variant="outline-dark" label="Sell Your Boats" href="/sell" />
          </div>
        </div>

        <div className="aspect-square w-full overflow-hidden rounded-2xl lg:w-[31rem]">
          <img
            src={listingsImage}
            alt="A narrowboat on a canal at sunset in the West Midlands"
            className="size-full scale-x-[-1] object-cover"
          />
        </div>
      </div>
    </section>
  )
}
