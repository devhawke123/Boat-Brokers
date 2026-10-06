import type { ReactNode } from 'react'
import Navbar from '../Navbar/Navbar'

type PageHeroSize = 'sm' | 'md' | 'lg'

const sectionSizeClassNames: Record<PageHeroSize, string> = {
  sm: 'min-h-[calc((100vw-3rem)*1537/1023)] sm:min-h-[95svh] sm:p-14',
  md: 'min-h-[calc((100vw-3rem)*1537/1023)] sm:min-h-[95svh] sm:p-14',
  lg: 'min-h-[calc((100vw-3rem)*1537/1023)] sm:min-h-[95svh] sm:p-16',
}

const titleSizeClassNames: Record<PageHeroSize, string> = {
  sm: 'text-[44px] leading-[1.2] tracking-[-1.6px] sm:text-[5rem]',
  md: 'text-[44px] leading-[1.2] tracking-[-1.6px] sm:text-[5rem]',
  lg: 'text-[40px] leading-[1.2] tracking-[-1.6px] sm:text-[5rem] sm:tracking-[-2px]',
}

const titleFontClassNames = {
  display: 'font-display',
  accent: 'font-accent',
} as const

type PageHeroAlign = 'center' | 'left'

// 'left' matches Home's bespoke Hero (pages/Home/sections/Hero/Hero.tsx):
// content anchored bottom-left instead of centered.
const alignSectionClassNames: Record<PageHeroAlign, string> = {
  center: 'items-center justify-center text-center',
  left: 'items-start justify-end text-left',
}

const alignContentClassNames: Record<PageHeroAlign, string> = {
  center: 'items-center',
  left: 'items-start',
}

type PageHeroProps = {
  /** Desktop (or only) background image. */
  image: string
  /** Optional separate background image swapped in below the `sm` breakpoint. */
  imageMobile?: string
  /** Navbar link to highlight as active. */
  activeLabel?: string
  size?: PageHeroSize
  /** Content alignment — 'center' (default) or 'left' (matches Home's hero). */
  align?: PageHeroAlign
  /** Content rendered above the title, e.g. a meta row or eyebrow badge. */
  eyebrow?: ReactNode
  title: ReactNode
  titleFont?: 'display' | 'accent'
  body?: ReactNode
  bodyClassName?: string
  overlayClassName?: string
  maxWidthClassName?: string
  gapClassName?: string
  contentClassName?: string
  /** Extra content rendered after the body copy, e.g. a meta row or badges. */
  children?: ReactNode
  /**
   * Opt-in slide+fade-in-on-load stagger for the eyebrow/title/body/children,
   * matching Home's bespoke Hero (pages/Home/sections/Hero/Hero.tsx). Off by
   * default since PageHero is shared by pages that shouldn't animate (e.g.
   * navbar dropdown-only pages) — set true only on top-level navbar pages.
   */
  animateEntrance?: boolean
  /** Opt-in bottom-left down-arrow button that scrolls past the hero. */
  scrollHint?: boolean
}

export default function PageHero({
  image,
  imageMobile,
  activeLabel,
  size = 'sm',
  align = 'center',
  eyebrow,
  title,
  titleFont = 'display',
  body,
  bodyClassName = 'max-w-[35rem] text-base leading-[26px] text-[#ededed] sm:text-xl sm:leading-[30px]',
  overlayClassName = 'bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0)_35%,rgba(0,0,0,0.15)_100%)]',
  maxWidthClassName = 'max-w-[43rem]',
  gapClassName = 'gap-6',
  contentClassName = '',
  children,
  animateEntrance = false,
  scrollHint = false,
}: PageHeroProps) {
  const reveal = (delayClass: string) => (animateEntrance ? `hero-reveal ${delayClass}` : '')
  return (
    <section
      className={`relative flex ${sectionSizeClassNames[size]} flex-col ${alignSectionClassNames[align]} overflow-hidden rounded-3xl bg-cover bg-center p-8 max-[900px]:p-5`}
      style={imageMobile ? undefined : { backgroundImage: `url("${image}")` }}
    >
      {imageMobile && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center sm:hidden"
            style={{ backgroundImage: `url("${imageMobile}")` }}
          />
          <div
            className="absolute inset-0 hidden bg-cover bg-center sm:block"
            style={{ backgroundImage: `url("${image}")` }}
          />
        </>
      )}

      <div className={`pointer-events-none absolute inset-0 ${overlayClassName}`} />
      <Navbar activeLabel={activeLabel} />

      <div
        className={`relative z-[5] flex ${maxWidthClassName} flex-col ${alignContentClassNames[align]} ${gapClassName} ${contentClassName}`}
      >
        {eyebrow && (animateEntrance ? <div className={reveal('')}>{eyebrow}</div> : eyebrow)}
        <h1
          className={`${reveal('hero-reveal-delay-1')} ${titleFontClassNames[titleFont]} ${titleSizeClassNames[size]} text-white capitalize`}
        >
          {title}
        </h1>
        {body && <p className={`${reveal('hero-reveal-delay-2')} ${bodyClassName}`}>{body}</p>}
        {children && (animateEntrance ? <div className={reveal('hero-reveal-delay-3')}>{children}</div> : children)}
      </div>

      {scrollHint && (
        <button
          type="button"
          aria-label="Scroll down"
          onClick={() => window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' })}
          className="group absolute right-5 bottom-5 z-[5] flex size-14 items-center justify-center rounded-full bg-blue text-navy-darkest shadow-btn transition-colors duration-300 motion-safe:animate-bounce sm:right-8 sm:bottom-8 lg:hover:bg-blue-light"
        >
          <span className="absolute inset-0 rounded-full bg-blue/60 motion-safe:animate-ping" aria-hidden="true" />
          <svg className="relative"width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </button>
      )}
    </section>
  )
}
