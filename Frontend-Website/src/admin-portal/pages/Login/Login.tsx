import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import '@fontsource-variable/plus-jakarta-sans'
import { AuthLoginCarousel } from '../../../seller-portal/components/AuthLoginCarousel'
import { AccountButton, AccountField } from '../../../seller-portal/components/V2AccountSettings'
import { EASE } from '../../../seller-portal/lib/motion'
import { useAdminLogin } from '../../data/useAdminLogin'
import '../../../seller-portal/pages/v2-login.css'

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
        <AuthLoginCarousel
          brandTo="/admin-portal/login"
          brandLabel="The Boat Brokers admin sign in"
          brandAsAnchor
        />
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
                markedInvalid={Boolean(error)}
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
                markedInvalid={Boolean(error)}
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
