import logo from '../../assets/logo/logo.svg'
import chevronDown from '../../assets/icons/chevron-down.svg'
import Button from '../Button/Button'

type NavLink = {
  label: string
  href: string
  hasDropdown?: boolean
}

const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Boats for Sale', href: '/boats-for-sale' },
  { label: 'Buying', href: '/buying', hasDropdown: true },
  { label: 'Selling', href: '/selling', hasDropdown: true },
  { label: 'About', href: '/about', hasDropdown: true },
]

export default function Navbar() {
  return (
    <header className="absolute top-6 left-1/2 z-20 w-[calc(100%-3rem)] max-w-[100rem] -translate-x-1/2 rounded-3xl bg-[rgba(23,23,23,0.25)] backdrop-blur-[15px]">
      <div className="flex items-center justify-between gap-6 px-5 py-3">
        <a href="/" className="flex shrink-0 items-center" aria-label="The Boat Brokers home">
          <img src={logo} alt="The Boat Brokers" className="h-11 w-auto" />
        </a>

        <nav className="flex flex-wrap items-center gap-2 max-[1100px]:hidden" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`inline-flex items-center gap-1.5 rounded-xl px-2 py-1 text-base text-white transition-colors duration-150 hover:text-blue-active ${
                link.label === 'Home' ? 'font-semibold text-blue-active' : ''
              }`}
            >
              {link.label}
              {link.hasDropdown && (
                <img src={chevronDown} alt="" aria-hidden="true" className="size-2.5" />
              )}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-4 max-[700px]:hidden">
          <Button
            variant="outline-white"
            label="Buy Boats Now"
            sublabel="Find Your Perfect Boat"
            href="/boats-for-sale"
          />
          <Button variant="light" label="Seller Portal" sublabel="Manage Your Boats" href="/seller-portal" />
        </div>
      </div>
    </header>
  )
}
