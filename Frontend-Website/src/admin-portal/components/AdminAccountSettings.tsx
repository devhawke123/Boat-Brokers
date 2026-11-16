import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type ElementType,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
  type RefObject,
  type TextareaHTMLAttributes,
} from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Eye, EyeOff, KeyRound, ShieldCheck, UserRound, X } from 'lucide-react'
import { directionalArrowVariants, EASE, inventoryMotion, quick } from '../../seller-portal/lib/motion'
import '../styles/v2-account-settings.css'

// Port of boat-brokers V2AccountSettings (accountRole="Administrator").
// Modal chrome/markup/CSS match the prototype. There is no admin profile or
// password API, so Save writes to the stored admin session only (this device)
// and the password view validates only, exactly like the prototype preview.

export type AdminProfileDraft = { name: string; email: string; phone: string; location: string }

type ButtonProps = Omit<ComponentProps<typeof motion.button>, 'children'> & {
  children?: ReactNode
  kind?: 'primary' | 'secondary' | 'quiet'
  arrow?: 'left' | 'right'
}

export function AccountButton({ children, kind = 'secondary', arrow, className = '', ...props }: ButtonProps) {
  const reduced = useReducedMotion()
  return (
    <motion.button
      type="button"
      className={`v2-settings-button is-${kind} ${className}`}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      whileTap={reduced ? undefined : { scale: inventoryMotion.pressScale }}
      variants={{
        rest: { backgroundColor: kind === 'primary' ? '#164f72' : '#ffffff65' },
        hover: { backgroundColor: kind === 'primary' ? '#103f5d' : '#ffffffc9' },
      }}
      transition={quick}
      {...props}
    >
      {arrow === 'left' && (
        <motion.span aria-hidden="true" variants={directionalArrowVariants(reduced, 'left')} transition={inventoryMotion.interaction}>
          <ArrowLeft size={14} />
        </motion.span>
      )}
      {children}
      {arrow === 'right' && (
        <motion.span aria-hidden="true" variants={directionalArrowVariants(reduced, 'right')} transition={inventoryMotion.interaction}>
          <ArrowRight size={14} />
        </motion.span>
      )}
    </motion.button>
  )
}

// Exported for AdminRecordOverlay (the prototype imports it from V2AccountSettings).
export function AccountCloseButton({ label = 'Close account settings', ...props }: Omit<ButtonProps, 'children' | 'kind'> & { label?: string }) {
  return (
    <AccountButton kind="quiet" className="v2-settings-close" aria-label={label} {...props}>
      <X size={18} strokeWidth={1.5} />
    </AccountButton>
  )
}

function AccountFieldError({ id, children }: { id: string; children?: string }) {
  const reduced = useReducedMotion()
  return (
    <AnimatePresence initial={false}>
      {children && (
        <motion.p
          key="field-error"
          id={id}
          role="alert"
          className="v2-settings-error"
          initial={reduced ? false : { opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : -2 }}
          transition={{ duration: reduced ? 0 : 0.25, ease: EASE }}
        >
          {children}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  label: string
  error?: string
  secret?: boolean
  multiline?: boolean
  rows?: number
  hint?: ReactNode
  onChange?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  ref?: Ref<HTMLInputElement | HTMLTextAreaElement>
}

export function AccountField({ label, error, secret = false, multiline = false, rows, hint, ref, ...props }: FieldProps) {
  const id = useId()
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(false)
  const Icon = visible ? EyeOff : Eye
  return (
    <motion.div
      layout={reduced ? false : 'position'}
      transition={{ duration: reduced ? 0 : 0.25, ease: EASE }}
      className="v2-settings-field"
    >
      <label htmlFor={id}>
        {label}
        {props.required && (
          <span className="v2-settings-required" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      <div className="v2-settings-input-wrap">
        {multiline ? (
          <textarea
            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            ref={ref as Ref<HTMLTextAreaElement>}
            id={id}
            rows={rows}
            aria-invalid={Boolean(error)}
            aria-describedby={[error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined}
          />
        ) : (
          <input
            {...props}
            ref={ref as Ref<HTMLInputElement>}
            id={id}
            type={secret ? (visible ? 'text' : 'password') : props.type || 'text'}
            aria-invalid={Boolean(error)}
            aria-describedby={[error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined}
            className={secret ? 'has-action' : ''}
          />
        )}
        {secret && (
          <motion.button
            className="v2-settings-eye"
            type="button"
            initial="rest"
            animate="rest"
            whileHover="hover"
            whileFocus="hover"
            whileTap={reduced ? undefined : { scale: 0.96 }}
            aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`}
            aria-pressed={visible}
            onClick={() => setVisible(!visible)}
          >
            <motion.span
              className="v2-settings-eye-surface"
              variants={{
                rest: { backgroundColor: '#e4f1fa00', color: '#6d8da4' },
                hover: { backgroundColor: '#e4f1fa', color: '#386f91' },
              }}
              transition={{ ...inventoryMotion.interaction, duration: reduced ? 0 : inventoryMotion.interaction.duration }}
            >
              <Icon size={16} strokeWidth={1.5} />
            </motion.span>
          </motion.button>
        )}
      </div>
      <AccountFieldError id={`${id}-error`}>{error}</AccountFieldError>
      {hint && <span className="v2-settings-field-hint" id={`${id}-hint`}>{hint}</span>}
    </motion.div>
  )
}

function SettingsMessage({ title, children, icon: Icon = ShieldCheck }: { title: string; children: ReactNode; icon?: ElementType }) {
  return (
    <div className="v2-settings-message" role="status">
      <span aria-hidden="true">
        <Icon size={17} strokeWidth={1.5} />
      </span>
      <div>
        <strong>{title}</strong>
        <p>{children}</p>
      </div>
    </div>
  )
}

type View = 'profile' | 'password'

export default function AdminAccountSettings({
  profile,
  photo,
  adminId,
  onSave,
  onOpenChange,
  returnFocusRef,
}: {
  profile: AdminProfileDraft
  photo?: string | null
  adminId: string
  onSave: (profile: AdminProfileDraft) => void
  onOpenChange: (open: boolean) => void
  returnFocusRef: RefObject<HTMLButtonElement | null>
}) {
  const [draft, setDraft] = useState(profile)
  const [view, setView] = useState<View>('profile')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [password, setPassword] = useState({ current: '', next: '', confirm: '' })
  const [passwordPreview, setPasswordPreview] = useState(false)
  const dialogRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const reduced = useReducedMotion()
  const headingId = useId()

  useEffect(() => {
    const overflow = document.body.style.overflow
    const returnTarget = returnFocusRef.current
    const dialogElement = dialogRef.current
    const appRoot = document.getElementById('root')
    const wasInert = appRoot?.inert ?? false
    if (appRoot) appRoot.inert = true
    document.body.style.overflow = 'hidden'
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onOpenChange(false)
        return
      }
      if (event.key !== 'Tab') return
      const controls = [
        ...(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), a[href]') || []),
      ].filter((el) => el.getClientRects().length)
      const first = controls[0]
      const last = controls.at(-1)
      const active = document.activeElement as HTMLElement | null
      if (event.shiftKey && (active === first || !active || !controls.includes(active))) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && (active === last || !dialogRef.current?.contains(active))) {
        event.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener('keydown', keydown)
    headingRef.current?.focus()
    return () => {
      document.body.style.overflow = overflow
      if (appRoot) appRoot.inert = wasInert
      document.removeEventListener('keydown', keydown)
      window.requestAnimationFrame(() => {
        if (!dialogElement?.isConnected) returnTarget?.focus()
      })
    }
  }, [onOpenChange, returnFocusRef])

  function switchView(next: View) {
    setErrors({})
    setPasswordPreview(false)
    setPassword({ current: '', next: '', confirm: '' })
    setView(next)
  }
  function changeProfile(key: keyof AdminProfileDraft, value: string) {
    setDraft((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: '' }))
  }
  function changePassword(key: keyof typeof password, value: string) {
    setPassword((current) => ({ ...current, [key]: value }))
    setErrors({})
    setPasswordPreview(false)
  }
  function saveProfile(event: FormEvent) {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!draft.name.trim()) nextErrors.name = 'Enter your full name.'
    if (draft.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) nextErrors.email = 'Enter a valid email address.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    onSave({ name: draft.name.trim(), email: draft.email.trim(), phone: draft.phone.trim(), location: draft.location.trim() })
  }
  function updatePassword(event: FormEvent) {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!password.current) nextErrors.current = 'Enter your current password.'
    if (password.next.length < 8) nextErrors.next = 'Use at least 8 characters.'
    else if (password.next === password.current) nextErrors.next = 'Choose a different password from your current one.'
    if (!password.confirm || password.next !== password.confirm) nextErrors.confirm = 'The new passwords do not match.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setPassword({ current: '', next: '', confirm: '' })
    setPasswordPreview(true)
  }

  return createPortal(
    <motion.div
      className="v2-settings-layer"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.2, ease: EASE }}
    >
      <button
        type="button"
        className="v2-settings-scrim"
        aria-label="Close account settings"
        tabIndex={-1}
        onClick={() => onOpenChange(false)}
      />
      <AnimatePresence mode="wait">
        <motion.section
          key={view === 'profile' ? 'profile-dialog' : 'password-dialog'}
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={headingId}
          className={`v2-glass-surface v2-settings-dialog ${view === 'profile' ? 'is-profile' : 'is-security'}`}
          initial={reduced ? false : { opacity: 0, y: 20, scale: 0.965 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.99 }}
          transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
          onAnimationComplete={() => headingRef.current?.focus({ preventScroll: true })}
        >
          {view === 'profile' ? (
            <div className="v2-settings-banner">
              <div className="v2-settings-banner-avatar">
                {photo ? <img src={photo} alt="" /> : <UserRound size={30} strokeWidth={1.4} />}
              </div>
              <AccountCloseButton onClick={() => onOpenChange(false)} />
            </div>
          ) : (
            <header className="v2-settings-header">
              <h2 id={headingId} ref={headingRef} tabIndex={-1}>
                Change password
              </h2>
              <AccountCloseButton onClick={() => onOpenChange(false)} />
            </header>
          )}
          <div className="v2-settings-content">
            {view === 'profile' && (
              <div className="v2-settings-profile-summary">
                <div>
                  <h2 id={headingId} ref={headingRef} tabIndex={-1}>
                    {profile.name || 'Your profile'}
                  </h2>
                  <span>Administrator</span>
                </div>
                <p>
                  Admin ID <span aria-hidden="true">·</span> {adminId}
                </p>
              </div>
            )}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={view}
                className="v2-settings-view"
                initial={reduced ? false : { opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.2, ease: EASE }}
                onAnimationComplete={() => headingRef.current?.focus({ preventScroll: true })}
              >
                {view === 'profile' && (
                  <form id="v2-profile-form" noValidate onSubmit={saveProfile}>
                    <div className="v2-settings-fields">
                      <AccountField
                        label="Full name"
                        autoComplete="name"
                        name="name"
                        value={draft.name}
                        onChange={(e) => changeProfile('name', e.target.value)}
                        error={errors.name}
                        required
                      />
                      <AccountField
                        label="Email address"
                        autoComplete="email"
                        type="email"
                        name="email"
                        value={draft.email}
                        onChange={(e) => changeProfile('email', e.target.value)}
                        error={errors.email}
                      />
                      <AccountField
                        label="Phone number"
                        autoComplete="tel"
                        type="tel"
                        name="phone"
                        value={draft.phone}
                        onChange={(e) => changeProfile('phone', e.target.value)}
                      />
                      <AccountField
                        label="Location"
                        autoComplete="address-level2"
                        name="location"
                        value={draft.location}
                        onChange={(e) => changeProfile('location', e.target.value)}
                        placeholder="City or region"
                      />
                    </div>
                  </form>
                )}
                {view === 'password' && (
                  <form id="v2-password-form" noValidate onSubmit={updatePassword}>
                    <div className="v2-settings-fields is-single">
                      <AccountField
                        label="Current password"
                        secret
                        autoComplete="current-password"
                        value={password.current}
                        onChange={(e) => changePassword('current', e.target.value)}
                        error={errors.current}
                        required
                      />
                      <AccountField
                        label="New password"
                        secret
                        autoComplete="new-password"
                        value={password.next}
                        onChange={(e) => changePassword('next', e.target.value)}
                        error={errors.next}
                        placeholder="At least 8 characters"
                        minLength={8}
                        required
                      />
                      <AccountField
                        label="Confirm new password"
                        secret
                        autoComplete="new-password"
                        value={password.confirm}
                        onChange={(e) => changePassword('confirm', e.target.value)}
                        error={errors.confirm}
                        required
                      />
                    </div>
                    <div className="v2-settings-password-hint">
                      Use at least 8 characters and a password different from your current one.
                    </div>
                    {passwordPreview && (
                      <SettingsMessage title="Password checked">
                        Your new password meets the requirements. This preview doesn’t change your sign-in password.
                      </SettingsMessage>
                    )}
                  </form>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          <footer className="v2-settings-footer">
            {view === 'profile' ? (
              <AccountButton kind="quiet" onClick={() => switchView('password')}>
                <KeyRound size={14} strokeWidth={1.5} />
                Change password
              </AccountButton>
            ) : (
              <AccountButton kind="quiet" arrow="left" onClick={() => switchView('profile')}>
                Back to profile
              </AccountButton>
            )}
            <div className="v2-settings-footer-actions">
              <AccountButton onClick={() => onOpenChange(false)}>Cancel</AccountButton>
              <AccountButton
                kind="primary"
                arrow="right"
                type="submit"
                form={view === 'profile' ? 'v2-profile-form' : 'v2-password-form'}
              >
                {view === 'profile' ? 'Save changes' : 'Update password'}
              </AccountButton>
            </div>
          </footer>
        </motion.section>
      </AnimatePresence>
    </motion.div>,
    document.body,
  )
}
