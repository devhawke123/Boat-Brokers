import ctaBg from '../../assets/letsgetyou.jpg'
import Button from '../Button/Button'

export default function CtaBanner() {
  return (
    <section
      className="section relative min-h-0 flex-col items-start justify-center overflow-hidden rounded-2xl bg-cover bg-center px-section-x py-16"
      style={{ backgroundImage: `url(${ctaBg})` }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.45)_20%,rgba(0,0,0,0)_60%)]" />
      <div className="relative z-[1] flex max-w-[41.375rem] flex-col gap-8 short:gap-4">
        <h2 className="font-display text-cta text-white capitalize short:text-h1-short">
          Lets Get You Started!
        </h2>
        <p className="max-w-[28rem] text-body text-body-light">
          Click on the &lsquo;Contact Us&rsquo; button to get in touch with us, and a team member
          will contact you as soon as possible.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="light" label="Buy Boats Now" href="/boats-for-sale" />
          <Button variant="outline-white" label="Sell Your Boats" href="/selling" />
        </div>
      </div>
    </section>
  )
}
