import { useState } from 'react'
import logo from '../../assets/logo/logo.svg'
import chevronDown from '../../assets/icons/chevron-down.svg'
import menuIcon from '../../assets/icons/menu.svg'
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

type NavbarProps = {
  activeLabel?: string
}

export default function Navbar({ activeLabel = 'Home' }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="absolute top-6 left-1/2 z-20 w-[calc(100%-3rem)] max-w-[100rem] -translate-x-1/2 rounded-3xl bg-[rgba(23,23,23,0.25)] backdrop-blur-[15px]">
      <div className="flex items-center justify-between gap-6 px-5 py-3">
        <a href="/" className="flex shrink-0 items-center" aria-label="The Boat Brokers home">
          <img src={logo} alt="The Boat Brokers" className="h-11 w-auto" />
        </a>

        <nav className="flex flex-wrap items-center text-white gap-2 max-[1100px]:hidden" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`inline-flex items-center gap-1.5 rounded-xl px-2 py-1 text-base text-white transition-colors duration-150 hover:text-blue-active ${
                link.label === activeLabel ? 'font-semibold ' : ''
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

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-panel"
          aria-label="Toggle menu"
          className="flex size-[30px] shrink-0 items-center justify-center min-[1101px]:hidden"
        >
          <img src={menuIcon} alt="" aria-hidden="true" className="size-full" />
        </button>
      </div>

      {isMenuOpen && (
        <div
          id="mobile-nav-panel"
          className="flex flex-col  gap-4 border-t border-white/10 px-5 py-4 min-[1101px]:hidden"
        >
          <nav className="flex flex-col text-white gap-1" aria-label="Primary">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`inline-flex items-center gap-1.5 rounded-xl px-2 py-2 text-base text-white transition-colors duration-150 hover:text-blue-active ${
                  link.label === activeLabel ? 'font-semibold ' : ''
                }`}
              >
                {link.label}
                {link.hasDropdown && (
                  <img src={chevronDown} alt="" aria-hidden="true" className="size-2.5" />
                )}
              </a>
            ))}
          </nav>

          <div className="flex flex-col items-stretch gap-3">
            <Button
              variant="outline-white"
              label="Buy Boats Now"
              sublabel="Find Your Perfect Boat"
              href="/boats-for-sale"
              className="justify-center"
            />
            <Button
              variant="light"
              label="Seller Portal"
              sublabel="Manage Your Boats"
              href="/seller-portal"
              className="justify-center"
            />
          </div>
        </div>
      )}
    </header>
  )
}
