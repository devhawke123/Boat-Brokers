import logoWhite from '../../assets/logo/logo.svg'
import britishMarine from '../../assets/icons/british-marine.png'
import xLogo from '../../assets/icons/x-logo.svg'
import instagramLogo from '../../assets/icons/instagram-logo.svg'
import facebookLogo from '../../assets/icons/facebook-logo.svg'
import arrowRightWhite from '../../assets/Arrow.svg'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Areas We Serve', href: '/areas-we-serve' },
  { label: 'Faq', href: '/faq' },
]

const serviceLinks = [
  { label: 'Buying Process', href: '/buying' },
  { label: 'Boats for Sale', href: '/boats-for-sale' },
  { label: 'Jargon Buster', href: '/jargon-buster', badge: 'New' },
  { label: 'Selling Process', href: '/selling' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Condition', href: '/terms' },
]

const socialLinks = [
  { name: 'X', href: 'https://www.linkedin.com/company/the-boat-brokers/', icon: xLogo, bg: 'bg-white' },
  { name: 'Instagram', href: 'https://www.instagram.com/theboatbrokersuk/', icon: instagramLogo, bg: 'bg-blue' },
  { name: 'Facebook', href: 'https://www.facebook.com/theboatbrokersuk/', icon: facebookLogo, bg: 'bg-white' },
]

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="relative flex flex-col gap-6 rounded-3xl bg-navy-darkest px-6 pt-20 pb-12 sm:px-14">
      <div className="flex flex-wrap justify-between gap-10 border-b border-[#094165] pb-20 sm:gap-[7.5rem]">
        <div className="flex max-w-[24.875rem] flex-1 flex-col justify-between gap-6" style={{ flexBasis: '24.875rem' }}>
          <div className="flex flex-col gap-6">
            <img src={logoWhite} alt="The Boat Brokers" className="h-[4.75rem] w-auto" />
            <p className="text-sm leading-[1.5] text-[#ededed]">
              The Boat Brokers delivers unforgettable luxury yacht experiences with premium
              comfort, exclusive destinations, and world-class hospitality designed for elegant
              ocean adventures.
            </p>
          </div>
          <ul className="flex gap-2">
            {socialLinks.map((social) => (
              <li key={social.name}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex size-10 items-center justify-center rounded-full ${social.bg}`}
                  aria-label={social.name}
                >
                  <img src={social.icon} alt="" aria-hidden="true" className="size-[1.2rem]" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="font-display text-2xl leading-[1.3] text-white">Quick Links</h3>
          <ul className="flex flex-col gap-4 text-sm text-[#ededed]">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="inline-flex items-center gap-1.5">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="font-display text-2xl leading-[1.3] text-white">Services Links</h3>
          <ul className="flex flex-col gap-4 text-sm text-[#ededed]">
            {serviceLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="inline-flex items-center gap-1.5">
                  {link.label}
                  {link.badge && (
                    <span className="inline-flex items-center justify-center rounded-full bg-white px-1 py-0.5 text-[0.5rem] text-[#0b3a58]">
                      {link.badge}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="font-display text-2xl leading-[1.3] text-white">Contact Information</h3>
          <div className="flex flex-col gap-4 text-sm text-[#ededed]">
            <p>07960 768724</p>
            <a href="mailto:info@theboatbrokers.co.uk" className="underline">
              info@theboatbrokers.co.uk
            </a>
            <p>Indonesia, Bandung, Jawa Barat</p>
          </div>
          <img src={britishMarine} alt="British Marine - Leading the Industry" className="h-auto w-[13.25rem]" />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-[#ededed]">
        <p>&copy; 2026 The Boat Brokers. All Rights Reserved</p>
        <p>Designed and Developed By Blue Hawke.</p>
      </div>

      <button
        type="button"
        className="absolute bottom-20 left-1/2 flex size-20 -translate-x-1/2 items-center justify-center rounded-full border-6 border-[#fafafa] bg-navy-darkest max-[900px]:-bottom-10"
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <img src={arrowRightWhite} alt="" aria-hidden="true" className="size-10" />
      </button>
    </footer>
  )
}
