import buyersImg from '../../../../assets/confidence-buyers.png'
import sellersImg from '../../../../assets/confidence-sellers.png'
import budgetIcon from '../../../../assets/icons/icon-budget.png'
import resellerIcon from '../../../../assets/icons/icon-reseller.png'
import Button from '../../../../components/Button/Button'

export default function BuySellConfidence() {
  return (
    <section className="py-14 lg:py-20">
      <div className="mx-auto flex max-w-[87.5rem] flex-col gap-14 lg:gap-16">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e3f7fe] px-4 py-1.5 text-[0.625rem] font-medium tracking-[0.7px] text-[#14b2ef] uppercase sm:text-sm">
            <span className="size-2 rounded-full bg-blue" />
            A Few Words About Us
          </span>
          <h2 className="font-display text-[2.125rem] leading-[1.2] tracking-[-2px] text-black capitalize sm:max-w-[43rem] sm:text-[2.375rem] sm:leading-[1.3] lg:text-[3.375rem]">
            Buy or Sell Your
            <br /> Boat with Confidence
          </h2>
        </div>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 mx-auto aspect-square w-full max-w-[35.375rem] overflow-hidden rounded-2xl lg:order-1 lg:mx-0">
          <img
            src={buyersImg}
            alt="A narrowboat moored beside a green riverbank"
            className="size-full scale-x-[-1] object-cover"
          />
        </div>

        <div className="order-1 flex flex-col gap-8 lg:order-2">
          <div className="flex flex-col gap-6">
            <h3 className="font-display text-[1.5rem] leading-[1.3] tracking-[-2px] text-[#1a1a1a] capitalize sm:text-[1.75rem] lg:text-[2.375rem]">
              Your Boat Journey, Made Simple
            </h3>
            <p className="text-sm leading-[26px] text-text-body sm:text-base lg:text-xl lg:leading-[30px]">
              Whether you&rsquo;re looking to buy your dream boat or sell your current vessel, our
              expert team ensures a smooth and seamless process every step of the way.
            </p>
          </div>

          <div className="flex items-start gap-4">
            <img
              src={budgetIcon}
              alt=""
              aria-hidden="true"
              className="size-11 shrink-0 object-contain lg:size-[4.6875rem]"
            />
            <div className="flex flex-1 flex-col gap-2">
              <p className="font-accent text-xl text-[#1a1a1a]">For Buyers</p>
              <p className="text-sm leading-[1.5] font-light text-text-body">
                Our website features a comprehensive listing of boats for sale, including detailed
                descriptions and high-quality photos to help you make an informed decision. We
                also provide a range of services to make the buying process as easy as possible,
                including financing, insurance, and boat inspections.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="order-1 flex flex-col justify-end gap-8">
          <div className="flex flex-col gap-8">
            <p className="text-sm leading-[1.5] font-light text-text-body sm:text-lg">
              We make selling your boat simple, from professional marketing and maximum exposure
              to expert negotiations and a smooth, hassle-free completion.
            </p>

            <div className="flex items-start gap-3">
              <img
                src={resellerIcon}
                alt=""
                aria-hidden="true"
                className="size-16 shrink-0 object-contain lg:size-[4.6875rem]"
              />
              <div className="flex flex-1 flex-col gap-2">
                <p className="font-accent text-xl text-[#1a1a1a]">For Sellers</p>
                <p className="text-sm leading-[1.5] font-light text-text-body">
                  We offer a hassle free experience that ensures your boat receives maximum
                  exposure to potential buyers. We work with you every step of the way to market
                  your boat effectively, handle negotiations and finalize the sale.
                </p>
              </div>
            </div>
          </div>

          <div className="hidden flex-wrap items-center gap-3 lg:flex">
            <Button variant="dark" label="Buy Boats Now" href="/boats-for-sale" />
            <Button variant="outline-dark" label="Sell Your Boat" href="/sell" />
          </div>
        </div>

        <div className="order-2 mx-auto aspect-square w-full max-w-[35.375rem] overflow-hidden rounded-2xl lg:mr-0 lg:ml-auto">
          <img
            src={sellersImg}
            alt="A narrowboat moored on a canal surrounded by trees"
            className="size-full scale-x-[-1] object-cover"
          />
        </div>
      </div>
      </div>
    </section>
  )
}
