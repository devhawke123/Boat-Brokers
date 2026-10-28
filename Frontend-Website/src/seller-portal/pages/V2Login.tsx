import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AccountButton, AccountField } from '../components/V2AccountSettings'
import { useSession } from '../context/useSession'
import { createSeller, loginSeller } from '../lib/api'
import { EASE, inventoryMotion } from '../lib/motion'
import './v2-login.css'

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

function LoginCarousel({ onNavigate }: { onNavigate: () => void }) {
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
              // Plays even with reduced motion on (product decision); click still pauses it.
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
      <Link className="v2-login-brand" to="/login" onClick={onNavigate} aria-label="The Boat Brokers sign in">
        <img src="/seller-portal-assets/boat-brokers-wordmark-blue.png" alt="The Boat Brokers" />
      </Link>
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

export default function V2Login() {
  const { seller, setSeller } = useSession()
  const location = useLocation()
  const navigate = useNavigate()
  const reduced = useReducedMotion()
  const recovering = location.pathname === '/forgot-password'
  const signingUp = location.pathname === '/signup'
  const mode = recovering ? 'reset' : signingUp ? 'signup' : 'login'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const from: unknown = location.state?.from
  const destination =
    typeof from === 'string' && from.startsWith('/') && !/^\/(?:login|signup|forgot-password)(?:[/?#]|$)/.test(from) ? from : '/dashboard'
  useEffect(() => {
    document.title = `${recovering ? 'Reset password' : signingUp ? 'Create account' : 'Sign in'} · The Boat Brokers`
  }, [recovering, signingUp])
  function clearForm() {
    setPassword('')
    setConfirmation('')
    setErrors({})
  }
  function update(field: string, setter: (value: string) => void) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value)
      setErrors((current) => ({ ...current, [field]: '', form: '' }))
    }
  }
  async function submit(event: FormEvent) {
    event.preventDefault()
    const next: Record<string, string> = {}
    if (signingUp && !name.trim()) next.name = 'Enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Enter a valid email address.'
    if (signingUp && password.length < 8) next.password = 'Use at least 8 characters.'
    if (!recovering && !signingUp && !password) next.password = 'Enter your password.'
    if (signingUp && confirmation !== password) next.confirmation = 'Your passwords must match.'
    setErrors(next)
    if (Object.keys(next).length) {
      window.requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    if (recovering) {
      setErrors({ form: 'Password reset is currently unavailable. Please contact support for help accessing your account.' })
      return
    }
    setSubmitting(true)
    try {
      const account = signingUp
        ? await createSeller({ name: name.trim(), email: email.trim(), password })
        : await loginSeller(email.trim(), password)
      clearForm()
      setSeller(account)
      navigate(destination, { replace: true })
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Something went wrong. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }
  if (seller) return <Navigate to={destination} replace />
  return (
    <main className="v2-login-page">
      <div className="v2-login-shell">
        <LoginCarousel onNavigate={clearForm} />
        <section className="v2-login-form-side" aria-labelledby="v2-login-title">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              className="v2-login-form-content"
              initial={reduced ? false : { opacity: 0, y: 28, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
              exit={{ opacity: 0, y: reduced ? 0 : -8, transition: { duration: reduced ? 0 : 0.12 } }}
              transition={{ duration: reduced ? 0 : 1.05, ease: EASE }}
              onAnimationComplete={() => document.getElementById('v2-login-title')?.focus({ preventScroll: true })}
            >
              <h1 id="v2-login-title" tabIndex={-1}>
                {recovering ? 'A fresh start.' : signingUp ? 'Come aboard.' : 'Welcome back.'}
              </h1>
              <p className="v2-login-intro">
                {recovering
                  ? 'Reset access to your seller workspace.'
                  : signingUp
                    ? 'Create your seller workspace.'
                    : 'Sign in to your seller workspace.'}
              </p>
              <form className="v2-login-form" noValidate onSubmit={submit} ref={formRef}>
                {signingUp && (
                  <AccountField
                    label="Full name"
                    name="name"
                    autoComplete="name"
                    placeholder="Your full name"
                    value={name}
                    onChange={update('name', setName)}
                    error={errors.name}
                    required
                  />
                )}
                <AccountField
                  label="Email address"
                  type="email"
                  name="email"
                  autoComplete={signingUp ? 'email' : 'username'}
                  placeholder="you@example.com"
                  value={email}
                  onChange={update('email', setEmail)}
                  error={errors.email}
                  required
                />
                {!recovering && (
                  <AccountField
                    label="Password"
                    name="password"
                    secret
                    autoComplete={signingUp ? 'new-password' : 'current-password'}
                    placeholder={signingUp ? 'At least 8 characters' : 'Your password'}
                    value={password}
                    onChange={update('password', setPassword)}
                    error={errors.password}
                    required
                  />
                )}
                {signingUp && (
                  <AccountField
                    label="Confirm password"
                    name="confirmation"
                    secret
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={confirmation}
                    onChange={update('confirmation', setConfirmation)}
                    error={errors.confirmation}
                    required
                  />
                )}
                {!recovering && !signingUp && (
                  <Link className="v2-login-forgot" to="/forgot-password" state={location.state} onClick={clearForm}>
                    Forgot password?
                  </Link>
                )}
                {errors.form && (
                  <p className="v2-login-error" role="alert">
                    {errors.form}
                  </p>
                )}
                <AccountButton kind="primary" arrow="right" type="submit" disabled={submitting}>
                  {recovering ? 'Send reset link' : signingUp ? 'Create account' : 'Sign in'}
                </AccountButton>
              </form>
              {recovering ? (
                <Link className="v2-login-back" to="/login" state={location.state} onClick={clearForm}>
                  <ArrowLeft size={14} />
                  Back to sign in
                </Link>
              ) : (
                <p className="v2-login-switch">
                  {signingUp ? 'Already have an account?' : 'New here?'}{' '}
                  <Link to={signingUp ? '/login' : '/signup'} state={location.state} onClick={clearForm}>
                    {signingUp ? 'Sign in' : 'Sign up'}
                  </Link>
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>
    </main>
  )
}
