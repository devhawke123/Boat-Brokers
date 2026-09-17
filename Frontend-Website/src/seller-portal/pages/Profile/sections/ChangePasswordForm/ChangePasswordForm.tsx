import { useState } from 'react'
import lockIcon from '../../../../assets/Login/lock-icon.svg'
import eyeIcon from '../../../../assets/Login/eye-icon.svg'
import lockBadgeIcon from '../../../../assets/Profile/lock-badge-icon.svg'

type ChangePasswordFormProps = {
  onSubmit: (currentPassword: string, newPassword: string) => Promise<void>
  submitting: boolean
}

function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  autoComplete: string
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="flex flex-1 flex-col gap-1.5">
      <span className="text-xs font-semibold text-[#64748b]">{label}</span>
      <span className="relative flex h-[38px] w-full items-center">
        <img src={lockIcon} alt="" aria-hidden="true" className="absolute left-3 size-3.5" />
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          placeholder="••••••••"
          className="h-full w-full rounded-md border border-[#e5eaf2] bg-[#f9fafb] py-2 pr-9 pl-9 text-sm text-[#0f172a] placeholder:text-[#9ca3af] focus:border-navy-dark focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-3 flex items-center justify-center"
        >
          <img src={eyeIcon} alt="" aria-hidden="true" className="h-3 w-4" />
        </button>
      </span>
    </div>
  )
}

export default function ChangePasswordForm({ onSubmit, submitting }: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit() {
    setSuccess(false)
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Fill in all three password fields.')
      return
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.')
      return
    }

    setError(null)
    try {
      await onSubmit(currentPassword, newPassword)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password.')
    }
  }

  return (
    <div className="flex w-full flex-col gap-6 rounded-lg border border-[#e5eaf2] bg-white p-8 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#eff6ff]">
          <img src={lockBadgeIcon} alt="" aria-hidden="true" className="size-3.5" />
        </span>
        <h3 className="text-base font-semibold text-[#0a4359]">Change Password</h3>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <PasswordField
          label="Current Password"
          value={currentPassword}
          onChange={setCurrentPassword}
          autoComplete="current-password"
        />
        <PasswordField
          label="New Password"
          value={newPassword}
          onChange={setNewPassword}
          autoComplete="new-password"
        />
        <PasswordField
          label="Confirm New Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
        />
      </div>

      {error && <p className="text-sm font-medium text-[#dc2626]">{error}</p>}
      {success && <p className="text-sm font-medium text-[#15803d]">Password updated successfully.</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="w-fit rounded-md bg-[#0a4359] px-6 py-2.5 text-sm font-semibold text-white transition-opacity duration-300 hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? 'Updating...' : 'Update Password'}
      </button>
    </div>
  )
}
