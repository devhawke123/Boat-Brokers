import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { EASE, inventoryMotion } from '../lib/motion'

export const authLoginSlides = [
  {
    source: '/seller-portal-assets/auth/narrowboat-canal-journey.mp4',
    video: true as const,
    position: 'center',
    title: (
      <>
        Your next chapter,
        <br />
        on the water.
      </>
    ),
    caption: 'A little more horizon. A clearer way to sell.',
  },
  {
    source: '/seller-portal-assets/auth/little-venice-narrowboats.jpg',
    position: 'center 75%',
    title: (
      <>
        From first listing
        <br />
        to new beginnings.
      </>
    ),
    caption: 'Every detail, every conversation, all in one place.',
  },
  {
    source: '/seller-portal-assets/auth/leafy-canal-narrowboats.jpg',
    position: 'center 75%',
    title: (
      <>
        Make room for
        <br />
        what comes next.
      </>
    ),
    caption: 'Your boat’s next adventure starts here.',
  },
  {
    source: '/seller-portal-assets/auth/narrowboat-marina.jpg',
    position: 'center 55%',
    title: (
      <>
        A world
        <br />
        of possibility.
      </>
    ),
    caption: 'One workspace. A wider horizon.',
  },
]

type Slide = (typeof authLoginSlides)[number]

function SlideMedia({
  slide,
  reduced,
  onEnded,
}: {
  slide: Slide
  reduced: boolean | null
  onEnded: () => void
}) {
  const [ready, setReady] = useState(false)
  const mediaStyle = {
    objectFit: 'cover' as const,
    objectPosition: slide.position,
    opacity: ready ? 1 : 0,
  }

  if (slide.video) {
    // Poster is a still from this same clip (not slide 4) so first paint isn't a
    // blank wash while the ~5MB video buffers. Keep the element visible so the
    // poster shows; photos still fade in via `ready`.
    return (
      <video
        className="v2-login-slide"
        src={slide.source}
        poster="/seller-portal-assets/auth/narrowboat-canal-journey-poster.jpg"
        style={{ objectFit: 'cover', objectPosition: slide.position }}
        muted
        playsInline
        preload="metadata"
        // Autoplay only when reduced motion is not requested; otherwise start paused.
        autoPlay={!reduced}
        aria-label="Narrowboat on the canal; click or press Space to pause or play"
        tabIndex={0}
        onEnded={onEnded}
        onClick={(event) => {
          const video = event.currentTarget
          if (video.paused) video.play().catch(() => {})
          else video.pause()
        }}
        onKeyDown={(event) => {
          if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault()
            event.currentTarget.click()
          }
        }}
      />
    )
  }

  return (
    <img
      className="v2-login-slide"
      src={slide.source}
      alt=""
      style={mediaStyle}
      onLoad={() => setReady(true)}
      onError={() => setReady(false)}
    />
  )
}

type AuthLoginCarouselProps = {
  brandTo: string
  brandLabel: string
  onBrandClick?: () => void
  brandAsAnchor?: boolean
}

export function AuthLoginCarousel({
  brandTo,
  brandLabel,
  onBrandClick,
  brandAsAnchor = false,
}: AuthLoginCarouselProps) {
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()
  const slide = authLoginSlides[active]
  const brandClass = `v2-login-brand${active === 3 ? ' is-dark' : ''}`
  const brandImg = (
    <img src="/seller-portal-assets/boat-brokers-wordmark-blue.png" alt="The Boat Brokers" />
  )

  return (
    <section className="v2-login-carousel" aria-label="Life on the water" aria-roledescription="carousel">
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.source}
          className="v2-login-media"
          initial={reduced ? false : { opacity: 0, scale: 1.025 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ...inventoryMotion.media, duration: reduced ? 0 : 0.7 }}
        >
          <SlideMedia slide={slide} reduced={reduced} onEnded={() => setActive(1)} />
        </motion.div>
      </AnimatePresence>
      <div className="v2-login-image-wash" />
      {brandAsAnchor ? (
        <a className={brandClass} href={brandTo} aria-label={brandLabel} onClick={onBrandClick}>
          {brandImg}
        </a>
      ) : (
        <Link className={brandClass} to={brandTo} onClick={onBrandClick} aria-label={brandLabel}>
          {brandImg}
        </Link>
      )}
      <div className="v2-login-caption" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={reduced ? false : { opacity: 0, y: 8, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
          >
            <h2>{slide.title as ReactNode}</h2>
            <p>{slide.caption}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="v2-login-dots" role="group" aria-label="Choose a slide">
        {authLoginSlides.map((item, index) => (
          <button
            type="button"
            key={item.source}
            aria-label={`Show ${item.video ? 'video' : 'photo'} ${index + 1} of ${authLoginSlides.length}`}
            aria-pressed={index === active}
            onClick={() => setActive(index)}
          >
            <motion.span
              initial={false}
              animate={{ width: index === active ? 20 : 6, opacity: index === active ? 1 : 0.4 }}
              transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
            />
          </button>
        ))}
      </div>
    </section>
  )
}
