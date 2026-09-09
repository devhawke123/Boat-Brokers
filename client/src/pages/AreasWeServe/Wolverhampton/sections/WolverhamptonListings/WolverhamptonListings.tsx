import listingsImage from '../../../../../assets/birmingham pic1 (2).jpg'
import Button from '../../../../../components/Button/Button'

export default function WolverhamptonListings() {
  return (
    <section className="pt-2 pb-14 lg:pt-4 lg:pb-20">
      <div className="mx-auto grid max-w-[87.5rem] grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,31rem)] lg:items-start lg:gap-20">
        <div className="flex flex-col gap-8 lg:h-[31rem] lg:justify-between">
          <div className="flex flex-col gap-3">
            <h2 className="font-display text-[2.375rem] leading-[1.3] tracking-[-2px] text-black capitalize sm:text-[3.375rem]">
              Narrowboats For Sale in Wolverhampton
            </h2>

            <div className="flex flex-col gap-2 text-base leading-[1.5] font-light text-text-body">
              <p>
                We list a carefully selected range of{' '}
                <a
                  href="https://theboatbrokers.co.uk/boats-for-sale/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  used narrowboats for sale
                </a>{' '}
                in the Wolverhampton area, updated regularly as new vessels come to market. Every
                listing includes professional photography, an accurate team-verified
                specification and an honest condition description.
              </p>
              <p>
                Wolverhampton draws buyers who value connectivity above all else. The ability to
                cruise south into the scenic Staffordshire and Worcestershire countryside,
                north-west into the Welsh border country via the Shropshire Union, or east into
                the extensive BCN network makes this one of the most versatile bases in the
                Midlands for a narrowboat. We understand the buyer profile in this area well and
                present every listing with that audience in mind.
              </p>
              <p>
                Have specific requirements? Register your details with us and we will match you
                to suitable boats, sometimes before they appear publicly.
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
            alt="A narrowboat moored on a canal near Wolverhampton"
            className="size-full scale-x-[-1] object-cover"
          />
        </div>
      </div>
    </section>
  )
}
