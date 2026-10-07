import heroBg from '../../../../assets/test.png'
import Navbar from '../../../../components/Navbar/Navbar'
import Button from '../../../../components/Button/Button'

export default function Hero() {
  return (
    <section className="section relative justify-end rounded-3xl px-section-x pt-[8.75rem] min-h-[calc((100vw-3rem)*1537/1023)] sm:min-h-0 sm:h-[95svh] sm:max-h-[59.375rem] sm:pt-section-y">
      <div className="media-frame absolute inset-0 rounded-3xl">
        <img
          src={heroBg}
          alt=""
          aria-hidden="true"
          className="object-center lg:object-[center_65%]"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0)_35%,rgba(0,0,0,0.15)_100%)]" />
      <Navbar />

      <div className="relative z-[5] flex max-w-[45rem] flex-col gap-[30px] overflow-x-hidden short:gap-4">
        <div className="flex flex-col gap-4 short:gap-2">
       

          <h1 className="hero-reveal hero-reveal-delay-1 font-display text-h1 text-white capitalize short:text-h1-short">
            The Simple Way
            <br />
            To Buy &amp; Sell.
          </h1>

          <p className="hero-reveal hero-reveal-delay-2 max-w-[35rem] text-body text-body-light">
            Helping at every stage of the sales process, from appointment to completion. We are
            passionate about boating and dedicated to providing our clients with exceptional
            service.
          </p>
        </div>

        <div className="hero-reveal hero-reveal-delay-3 flex flex-wrap items-center gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="light" label="Buy Boats Now" href="/boats-for-sale" />
            <Button variant="outline-white" label="Sell Your Boats" href="/selling" />
          </div>
        </div>
      </div>
    </section>
  )
}
