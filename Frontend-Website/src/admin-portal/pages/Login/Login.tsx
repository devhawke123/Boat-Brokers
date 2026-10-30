import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import '@fontsource-variable/plus-jakarta-sans'
import { AccountButton, AccountField } from '../../../seller-portal/components/V2AccountSettings'
import { EASE, inventoryMotion } from '../../../seller-portal/lib/motion'
import { useAdminLogin } from '../../data/useAdminLogin'
import '../../../seller-portal/pages/v2-login.css'

const slides = [
  {
    source: '/seller-portal-assets/auth/first-horizon.mp4',
    video: true,
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
    source: '/seller-portal-assets/auth/marina-yacht.jpg',
    position: 'center 65%',
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
    source: '/seller-portal-assets/auth/coastal-yacht.jpg',
    position: 'center 65%',
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
    source: '/seller-portal-assets/auth/open-water.jpg',
    position: '43% center',
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

function LoginCarousel() {
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()
  const slide = slides[active]
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
          {slide.video ? (
            <video
              className="v2-login-slide"
              src={slide.source}
              poster="/seller-portal-assets/auth/open-water.jpg"
              autoPlay
              muted
              playsInline
              preload="metadata"
              style={{ objectPosition: slide.position }}
              aria-label="Yacht on the water; click or press Space to pause or play"
              tabIndex={0}
              onEnded={() => setActive(1)}
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
          ) : (
            <img className="v2-login-slide" src={slide.source} alt="" style={{ objectPosition: slide.position }} />
          )}
        </motion.div>
      </AnimatePresence>
      <div className="v2-login-image-wash" />
      <a className="v2-login-brand" href="/admin-portal/login" aria-label="The Boat Brokers admin sign in">
        <img src="/seller-portal-assets/boat-brokers-wordmark-blue.png" alt="The Boat Brokers" />
      </a>
      <div className="v2-login-caption" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={reduced ? false : { opacity: 0, y: 8, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
          >
            <h2>{slide.title}</h2>
            <p>{slide.caption}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="v2-login-dots" role="group" aria-label="Choose a slide">
        {slides.map((item, index) => (
          <button
            type="button"
            key={item.source}
            aria-label={`Show ${item.video ? 'video' : 'photo'} ${index + 1} of ${slides.length}`}
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

export default function Login() {
  const { login, loading, error } = useAdminLogin()
  const reduced = useReducedMotion()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    document.title = 'Admin sign in · The Boat Brokers'
  }, [])

  function update(field: string, setter: (value: string) => void) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value)
      setFieldErrors((current) => ({ ...current, [field]: '' }))
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next: Record<string, string> = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Enter your password.'
    setFieldErrors(next)
    if (Object.keys(next).length) {
      window.requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }

    const admin = await login(email.trim(), password)
    if (admin) {
      window.location.href = '/admin-portal/dashboard'
    }
  }

  return (
    <main className="v2-login-page">
      <div className="v2-login-shell">
        <LoginCarousel />
        <section className="v2-login-form-side" aria-labelledby="v2-login-title">
          <motion.div
            className="v2-login-form-content"
            initial={reduced ? false : { opacity: 0, y: 28, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
            transition={{ duration: reduced ? 0 : 1.05, ease: EASE }}
            onAnimationComplete={() => document.getElementById('v2-login-title')?.focus({ preventScroll: true })}
          >
            <p className="v2-login-eyebrow">Admin portal</p>
            <h1 id="v2-login-title" tabIndex={-1}>
              Welcome back.
            </h1>
            <p className="v2-login-intro">Sign in to your admin workspace.</p>
            <form className="v2-login-form" noValidate onSubmit={handleSubmit} ref={formRef}>
              <AccountField
                label="Email address"
                type="email"
                name="email"
                autoComplete="username"
                placeholder="admin@example.com"
                value={email}
                onChange={update('email', setEmail)}
                error={fieldErrors.email}
                required
              />
              <AccountField
                label="Password"
                name="password"
                secret
                autoComplete="current-password"
                placeholder="Your password"
                value={password}
                onChange={update('password', setPassword)}
                error={fieldErrors.password}
                required
              />
              {error && (
                <p className="v2-login-error" role="alert">
                  {error}
                </p>
              )}
              <AccountButton kind="primary" arrow="right" type="submit" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </AccountButton>
            </form>
          </motion.div>
        </section>
      </div>
    </main>
  )
}
