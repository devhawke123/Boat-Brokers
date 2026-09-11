import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import logo from '../../assets/logo/logo.svg'
import chevronDown from '../../assets/icons/chevron-down.svg'
import menuIcon from '../../assets/icons/menu.svg'
import Button from '../Button/Button'

type DropdownItem = {
  label: string
  href: string
}

type NavLink = {
  label: string
  href: string
  hasDropdown?: boolean
  dropdownItems?: DropdownItem[]
}

const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Boats for Sale', href: '/boats-for-sale' },
  { label: 'Buying', href: '/buying', hasDropdown: true },
  { label: 'Selling', href: '/selling', hasDropdown: true },
  {
    label: 'Areas We Serve',
    href: '/areas-we-serve',
    hasDropdown: true,
    dropdownItems: [
      { label: 'Birmingham', href: '/areas-we-serve' },
      { label: 'Coventry', href: '/areas-we-serve' },
      { label: 'Wolverhampton', href: '/areas-we-serve' },
      { label: 'Worcester', href: '/areas-we-serve' },
      { label: 'West Midlands', href: '/areas-we-serve/west-midlands' },
      { label: 'Worcestershire', href: '/areas-we-serve' },
      { label: 'Warwickshire', href: '/areas-we-serve/warwickshire' },
    ],
  },
  { label: 'About', href: '/about', hasDropdown: true },
]

type NavbarProps = {
  activeLabel?: string
}

export default function Navbar({ activeLabel = 'Home' }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null)
  const headerRef = useRef<HTMLElement>(null)
  const [mobilePanelStyle, setMobilePanelStyle] = useState<{
    top: number
    left: number
    width: number
  } | null>(null)

  useEffect(() => {
    if (!isMenuOpen || !headerRef.current) return

    const updatePosition = () => {
      const rect = headerRef.current!.getBoundingClientRect()
      setMobilePanelStyle({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [isMenuOpen])

  return (
    <header
      ref={headerRef}
      className="absolute top-6 left-1/2 z-20 w-[calc(100%-3rem)] max-w-[100rem] -translate-x-1/2 rounded-3xl bg-[rgba(23,23,23,0.25)] backdrop-blur-[15px]"
    >
      <div className="flex items-center justify-between gap-6 px-5 py-3">
        <a href="/" className="flex shrink-0 items-center" aria-label="The Boat Brokers home">
          <img src={logo} alt="The Boat Brokers" className="h-11 w-auto" />
        </a>

        <nav className="flex flex-wrap items-center text-white gap-5 max-[1100px]:hidden" aria-label="Primary">
          {navLinks.map((link) => (
            <div key={link.label} className="group relative">
              <a
                href={link.href}
                className={`inline-flex items-center gap-1.5 rounded-xl px-2 py-1 text-base transition-colors duration-150 hover:text-blue-active ${
                  link.label === activeLabel ? 'font-semibold text-blue-active' : 'text-white'
                }`}
              >
                {link.label}
                {link.hasDropdown && (
                  <img
                    src={chevronDown}
                    alt=""
                    aria-hidden="true"
                    className="h-[14px] w-[7px] rotate-90 transition-transform duration-150 group-hover:-rotate-90"
                  />
                )}
              </a>

              {link.dropdownItems && (
                <div className="invisible absolute top-full left-0 z-30 pt-3 opacity-0 transition-[opacity,visibility] duration-150 group-hover:visible group-hover:opacity-100">
                  <ul className="flex min-w-[15rem] flex-col gap-1 rounded-2xl bg-[rgba(23,23,23,0.7)] p-3 shadow-btn backdrop-blur-[15px]">
                    {link.dropdownItems.map((item) => (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          className="block rounded-xl px-3 py-2 text-left text-base text-white transition-colors duration-150 hover:bg-white/10 hover:text-blue-active"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
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

      {isMenuOpen &&
        mobilePanelStyle &&
        createPortal(
          <div
            id="mobile-nav-panel"
            style={{
              position: 'absolute',
              top: mobilePanelStyle.top,
              left: mobilePanelStyle.left,
              width: mobilePanelStyle.width,
              maxHeight: `calc(100vh - ${mobilePanelStyle.top}px)`,
            }}
            className="z-20 flex flex-col gap-4 overflow-y-auto rounded-3xl bg-[rgba(23,23,23,0.25)] px-5 py-4 shadow-btn backdrop-blur-[15px] min-[1101px]:hidden"
          >
            <nav className="flex flex-col text-white gap-1" aria-label="Primary">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <div className="flex items-center">
                    <a
                      href={link.href}
                      className={`inline-flex flex-1 items-center gap-1.5 rounded-xl px-2 py-2 text-base transition-colors duration-150 hover:text-blue-active ${
                        link.label === activeLabel ? 'font-semibold text-blue-active' : 'text-white'
                      }`}
                    >
                      {link.label}
                    </a>
                    {link.dropdownItems && (
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMobileDropdown((current) =>
                            current === link.label ? null : link.label,
                          )
                        }
                        aria-expanded={openMobileDropdown === link.label}
                        aria-label={`Toggle ${link.label} submenu`}
                        className="flex size-8 shrink-0 items-center justify-center"
                      >
                        <img
                          src={chevronDown}
                          alt=""
                          aria-hidden="true"
                          className={`h-[14px] w-[7px] transition-transform duration-150 ${
                            openMobileDropdown === link.label ? '-rotate-90' : 'rotate-90'
                          }`}
                        />
                      </button>
                    )}
                    {link.hasDropdown && !link.dropdownItems && (
                      <span className="flex size-8 shrink-0 items-center justify-center">
                        <img
                          src={chevronDown}
                          alt=""
                          aria-hidden="true"
                          className="h-[14px] w-[7px] rotate-90"
                        />
                      </span>
                    )}
                  </div>

                  {link.dropdownItems && openMobileDropdown === link.label && (
                    <ul className="mt-1 mb-1 ml-4 flex flex-col gap-1 border-l border-white/10 pl-3">
                      {link.dropdownItems.map((item) => (
                        <li key={item.label}>
                          <a
                            href={item.href}
                            className="block rounded-xl px-2 py-2 text-sm text-white/90 transition-colors duration-150 hover:text-blue-active"
                          >
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
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
          </div>,
          document.body,
        )}
    </header>
  )
}
