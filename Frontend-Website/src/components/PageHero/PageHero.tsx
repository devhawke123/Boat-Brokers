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

type PageHeroProps = {
  /** Desktop (or only) background image. */
  image: string
  /** Optional separate background image swapped in below the `sm` breakpoint. */
  imageMobile?: string
  /** Navbar link to highlight as active. */
  activeLabel?: string
  size?: PageHeroSize
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
}

export default function PageHero({
  image,
  imageMobile,
  activeLabel,
  size = 'sm',
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
}: PageHeroProps) {
  return (
    <section
      className={`relative flex ${sectionSizeClassNames[size]} flex-col items-center justify-center overflow-hidden rounded-3xl bg-cover bg-center p-8 text-center max-[900px]:p-5`}
      style={imageMobile ? undefined : { backgroundImage: `url(${image})` }}
    >
      {imageMobile && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center sm:hidden"
            style={{ backgroundImage: `url(${imageMobile})` }}
          />
          <div
            className="absolute inset-0 hidden bg-cover bg-center sm:block"
            style={{ backgroundImage: `url(${image})` }}
          />
        </>
      )}

      <div className={`pointer-events-none absolute inset-0 ${overlayClassName}`} />
      <Navbar activeLabel={activeLabel} />

      <div
        className={`relative z-[5] flex ${maxWidthClassName} flex-col items-center ${gapClassName} ${contentClassName}`}
      >
        {eyebrow}
        <h1
          className={`${titleFontClassNames[titleFont]} ${titleSizeClassNames[size]} text-white capitalize`}
        >
          {title}
        </h1>
        {body && <p className={bodyClassName}>{body}</p>}
        {children}
      </div>
    </section>
  )
}
