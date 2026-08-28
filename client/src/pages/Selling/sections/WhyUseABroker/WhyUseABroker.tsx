import brokerImg from '../../../../assets/confidence 2.jpg'
import Button from '../../../../components/Button/Button'

export default function WhyUseABroker() {
  return (
    <section className="flex flex-col gap-8 px-6 py-16 sm:px-16 sm:py-24">
      <h2 className="font-display text-[34px] leading-[1.3] tracking-[-2px] text-ink capitalize sm:text-[3.375rem]">
        Why Use A Broker?
      </h2>

      <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:gap-16">
        <img
          src={brokerImg}
          alt="Miss Sassy Lady narrowboat moored on a tree-lined canal"
          className="aspect-square w-full max-w-[35.375rem] rounded-2xl object-cover lg:shrink-0"
        />

        <div className="flex flex-col items-start gap-8">
          <div className="flex flex-col gap-4 text-base leading-[26px] text-[#6e6e6e]">
            <p>
              You may have considered trying to sell your own boat, placing adverts, dealing with
              the enquiries and negotiating and administering the sale yourself.
            </p>
            <p>
              The reality is, selling can be extremely challenging if you lack the experience, as
              your goal is to secure the best possible deal for a boat that holds your affection.
            </p>
            <p>
              That&rsquo;s why, most sellers choose to use a broker for both their expertise and
              the additional services they can offer potential purchasers, and of course to
              remove the day to day responsibility for answering enquiries and managing the sale.
            </p>
            <p>
              Buyers also like much of the same. They prefer to buy through a broker because it
              offers them peace of mind by facilitating necessary paperwork, inspections, and
              ensuring a smooth transaction process from start to finish.
            </p>
          </div>

          <Button variant="dark" label="Book a Free Valuation" href="mailto:info@theboatbrokers.co.uk" />
        </div>
      </div>
    </section>
  )
}
