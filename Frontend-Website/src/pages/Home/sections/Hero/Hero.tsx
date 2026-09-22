import heroBg from '../../../../assets/hero-bg.png'
import xLogo from '../../../../assets/icons/x-logo.svg'
import instagramLogo from '../../../../assets/icons/instagram-logo.svg'
import facebookLogo from '../../../../assets/icons/facebook-logo.svg'
import Navbar from '../../../../components/Navbar/Navbar'
import Button from '../../../../components/Button/Button'

const socialLinks = [
  {
    name: 'X',
    href: 'https://www.linkedin.com/company/the-boat-brokers/',
    icon: xLogo,
    bg: 'bg-blue',
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/theboatbrokersuk/',
    icon: instagramLogo,
    bg: 'bg-white',
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/theboatbrokersuk/',
    icon: facebookLogo,
    bg: 'bg-white',
  },
]

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

      <ul className="absolute top-[140px] right-section-x z-[5] hidden flex-col gap-4 sm:top-[297px] sm:flex">
        {socialLinks.map((social) => (
          <li key={social.name}>
            <a
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className={`flex size-12 items-center justify-center rounded-full ${social.bg}`}
              aria-label={social.name}
            >
              <img src={social.icon} alt="" aria-hidden="true" className="size-[23px]" />
            </a>
          </li>
        ))}
      </ul>

      <div className="relative z-[5] flex max-w-[45rem] flex-col gap-[30px] short:gap-4">
        <div className="flex flex-col gap-4 short:gap-2">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[rgba(96,166,192,0.28)] px-4 py-1.5 text-label font-medium text-white uppercase">
            <span className="size-2 rounded-full bg-white" />
            The Boat Breakers - Luxury Feel
          </span>

          <h1 className="font-display text-h1 text-white capitalize short:text-h1-short">
            The Simple Way
            <br />
            To Buy &amp; Sell.
          </h1>

          <p className="max-w-[35rem] text-body text-body-light">
            Helping at every stage of the sales process, from appointment to completion. We are
            passionate about boating and dedicated to providing our clients with exceptional
            service.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="light" label="Buy Boats Now" href="/boats-for-sale" />
            <Button variant="outline-white" label="Sell Your Boats" href="/selling" />
          </div>

          <div className="flex items-center gap-3.5 short:hidden">
           
           
          </div>
        </div>
      </div>
    </section>
  )
}
