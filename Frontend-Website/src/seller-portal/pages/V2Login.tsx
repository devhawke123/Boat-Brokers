import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthLoginCarousel } from '../components/AuthLoginCarousel'
import { AccountButton, AccountField } from '../components/V2AccountSettings'
import { useSession } from '../context/useSession'
import { createSeller, loginSeller, requestSellerPasswordReset, resetSellerPassword } from '../lib/api'
import { EASE } from '../lib/motion'
import './v2-login.css'

export default function V2Login() {
  const { seller, setSeller } = useSession()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const reduced = useReducedMotion()
  const recovering = location.pathname === '/forgot-password'
  const resetting = location.pathname === '/reset-password'
  const signingUp = location.pathname === '/signup'
  const resetToken = searchParams.get('token')?.trim() ?? ''
  const mode = resetting ? 'set-password' : recovering ? 'reset' : signingUp ? 'signup' : 'login'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [passwordResetDone, setPasswordResetDone] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const from: unknown = location.state?.from
  const destination =
    typeof from === 'string' &&
    from.startsWith('/') &&
    !/^\/(?:login|signup|forgot-password|reset-password)(?:[/?#]|$)/.test(from)
      ? from
      : '/dashboard'
  useEffect(() => {
    const title = resetting
      ? 'Choose a new password'
      : recovering
        ? 'Reset password'
        : signingUp
          ? 'Create account'
          : 'Sign in'
    document.title = `${title} · The Boat Brokers`
  }, [recovering, resetting, signingUp])
  function clearForm() {
    setPassword('')
    setConfirmation('')
    setErrors({})
    setResetEmailSent(false)
    setPasswordResetDone(false)
  }
  // Drop leftover signup/login errors when switching auth screens (e.g. signup
  // "Email already in use" must not sit on top of forgot-password).
  useEffect(() => {
    setErrors({})
    setResetEmailSent(false)
    setPasswordResetDone(false)
  }, [mode])
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
    if (!resetting && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Enter a valid email address.'
    if ((signingUp || resetting) && password.length < 8) next.password = 'Use at least 8 characters.'
    if (!recovering && !signingUp && !resetting && !password) next.password = 'Enter your password.'
    if ((signingUp || resetting) && confirmation !== password) next.confirmation = 'Your passwords must match.'
    if (resetting && !resetToken) next.form = 'This reset link is missing or invalid. Please request a new one.'
    setErrors(next)
    if (Object.keys(next).length) {
      window.requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    setSubmitting(true)
    try {
      if (recovering) {
        await requestSellerPasswordReset(email.trim())
        setResetEmailSent(true)
        return
      }
      if (resetting) {
        await resetSellerPassword(resetToken, password)
        clearForm()
        setPasswordResetDone(true)
        return
      }
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
  const title = resetting
    ? passwordResetDone
      ? 'Password updated.'
      : 'Choose a new password.'
    : recovering
      ? resetEmailSent
        ? 'Check your inbox.'
        : 'A fresh start.'
      : signingUp
        ? 'Come aboard.'
        : 'Welcome back.'
  const intro = resetting
    ? passwordResetDone
      ? 'You can sign in with your new password.'
      : 'Pick something memorable — at least 8 characters.'
    : recovering
      ? resetEmailSent
        ? 'If an account exists for that email, we sent a reset link. It expires in one hour.'
        : 'Reset access to your seller workspace.'
      : signingUp
        ? 'Create your seller workspace.'
        : 'Sign in to your seller workspace.'
  return (
    <main className="v2-login-page">
      <div className="v2-login-shell">
        <AuthLoginCarousel brandTo="/login" brandLabel="The Boat Brokers sign in" onBrandClick={clearForm} />
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
                {title}
              </h1>
              <p className="v2-login-intro">{intro}</p>
              {passwordResetDone ? (
                <AccountButton kind="primary" arrow="right" type="button" onClick={() => navigate('/login', { replace: true })}>
                  Back to sign in
                </AccountButton>
              ) : resetEmailSent ? (
                <Link className="v2-login-back" to="/login" state={location.state} onClick={clearForm}>
                  <ArrowLeft size={14} />
                  Back to sign in
                </Link>
              ) : (
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
                  {!resetting && (
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
                  )}
                  {!recovering && (
                    <AccountField
                      label={resetting ? 'New password' : 'Password'}
                      name="password"
                      secret
                      autoComplete={signingUp || resetting ? 'new-password' : 'current-password'}
                      placeholder={signingUp || resetting ? 'At least 8 characters' : 'Your password'}
                      value={password}
                      onChange={update('password', setPassword)}
                      error={errors.password}
                      required
                    />
                  )}
                  {(signingUp || resetting) && (
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
                  {!recovering && !signingUp && !resetting && (
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
                    {resetting ? 'Update password' : recovering ? 'Send reset link' : signingUp ? 'Create account' : 'Sign in'}
                  </AccountButton>
                </form>
              )}
              {(recovering || resetting) && !resetEmailSent && !passwordResetDone ? (
                <Link className="v2-login-back" to="/login" state={location.state} onClick={clearForm}>
                  <ArrowLeft size={14} />
                  Back to sign in
                </Link>
              ) : !recovering && !resetting ? (
                <p className="v2-login-switch">
                  {signingUp ? 'Already have an account?' : 'New here?'}{' '}
                  <Link to={signingUp ? '/login' : '/signup'} state={location.state} onClick={clearForm}>
                    {signingUp ? 'Sign in' : 'Sign up'}
                  </Link>
                </p>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>
    </main>
  )
}
