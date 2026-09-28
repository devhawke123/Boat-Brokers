import { useState, type FormEvent } from 'react'
import Button from '../../../components/Button/Button'
import { useSellerLogin } from '../../data/useSellerLogin'
import loginHero from '../../assets/Login/login-hero.png'
import emailIcon from '../../assets/Login/email-icon.svg'
import lockIcon from '../../assets/Login/lock-icon.svg'
import eyeIcon from '../../assets/Login/eye-icon.svg'
import logo from '../../../assets/The_Boat_Brokers_Blue_Logo.png'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading, error } = useSellerLogin()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') ?? '')
    const password = String(form.get('password') ?? '')

    const seller = await login(email, password)
    if (seller) {
      window.location.href = '/seller-portal/dashboard'
    }
  }

  return (
    <main className="flex h-svh items-center justify-center overflow-hidden bg-[#fcfcfc] px-6 py-6 short:py-4 nav:gap-10 nav:px-16">
      <div className="flex w-full max-w-[33rem] flex-col items-start gap-6 rounded-2xl border border-border p-6 short:gap-4 short:p-4 sm:p-8">
        <div className="flex items-center gap-3">
          <img src={logo} alt="The Boat Brokers" className="h-12 w-auto" />
          <span className="h-9 w-px bg-border" />
          <span className="text-label font-semibold tracking-[2px] text-gold uppercase">Seller Portal</span>
        </div>

        <div className="flex w-full flex-col gap-4 short:gap-2">
          <h1 className="font-display text-h3 capitalize text-ink">Sell your boat with confidence.</h1>
          <p className="text-body text-text-body">
            Create an account to add your boat and manage your listing. Noel Creary and The Boat Brokers team will
            guide you through the sale.
          </p>
        </div>

        <div className="flex w-full rounded-full bg-[#f1f0ee] p-1">
          <span className="flex-1 rounded-full bg-navy-dark px-4 py-2.5 text-center text-body-sm font-semibold text-white">
            Log in
          </span>
          <a
            href="/seller-portal/signup"
            className="flex-1 rounded-full px-4 py-2.5 text-center text-body-sm font-semibold text-ink"
          >
            Sign up
          </a>
        </div>

        <form className="flex w-full flex-col items-center gap-5 short:gap-3" onSubmit={handleSubmit}>
          <div className="flex w-full flex-col gap-4 short:gap-3">
            <label className="flex w-full flex-col gap-2">
              <span className="text-body font-medium text-ink">Email address</span>
              <span className="relative flex w-full items-center">
                <img src={emailIcon} alt="" aria-hidden="true" className="absolute left-4 size-4" />
                <input
                  type="email"
                  name="email"
                  autoComplete="username"
                  placeholder="you@example.com"
                  className="h-[3.25rem] w-full rounded-md border border-[#cbcad7] bg-[#f8f8f8] py-3 pr-4 pl-12 text-body-sm text-ink placeholder:text-text-muted focus:border-navy-dark focus:outline-none"
                />
              </span>
            </label>

            <label className="flex w-full flex-col gap-2">
              <span className="text-body font-medium text-ink">Password</span>
              <span className="relative flex w-full items-center">
                <img src={lockIcon} alt="" aria-hidden="true" className="absolute left-4 size-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="h-[3.25rem] w-full rounded-md border border-[#cbcad7] bg-[#f8f8f8] py-3 pr-12 pl-12 text-body-sm text-ink placeholder:text-text-muted focus:border-navy-dark focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-4 flex items-center justify-center"
                >
                  <img src={eyeIcon} alt="" aria-hidden="true" className="h-3.5 w-[1.125rem]" />
                </button>
              </span>
            </label>

            <a href="/seller-portal/forgot-password" className="self-start text-body-sm font-semibold text-navy-dark underline">
              Forgot password?
            </a>
          </div>

          <div className="flex w-full flex-col items-center gap-5">
            {error && <p className="w-full text-body-sm text-red-600">{error}</p>}

            <Button
              type="submit"
              variant="dark"
              label={loading ? 'Logging in…' : 'Log in'}
              icon="none"
              disabled={loading}
              className="w-full disabled:cursor-not-allowed disabled:opacity-70"
            />

            <p className="text-body text-text-body">
              New to the seller portal?{' '}
              <a href="/seller-portal/signup" className="font-semibold text-navy-dark underline">
                Sign up
              </a>
            </p>
          </div>
        </form>

        <div className="h-px w-full bg-border" />

        <p className="w-full text-center text-caption text-text-muted">Design &amp; Develop By Blue Hawke</p>
      </div>

      <div className="hidden max-h-[70.375rem] w-full max-w-[44.1875rem] self-stretch overflow-clip rounded-xl nav:block">
        <img src={loginHero} alt="A narrowboat at sunset" className="size-full object-cover" />
      </div>
    </main>
  )
}
