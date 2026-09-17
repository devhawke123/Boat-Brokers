import { useEffect, useState } from 'react'
import SellerPortalShell from '../../components/SellerPortalShell/SellerPortalShell'
import { useSellerSession } from '../../data/useSellerSession'
import { setStoredSeller } from '../../lib/session'
import { changeSellerPassword, updateSeller, uploadSellerAvatar, type ApiSeller } from '../../lib/api'
import ProfileCard from './sections/ProfileCard/ProfileCard'
import PersonalInformationForm, {
  type PersonalInformationValues,
} from './sections/PersonalInformationForm/PersonalInformationForm'
import ChangePasswordForm from './sections/ChangePasswordForm/ChangePasswordForm'

export default function Profile() {
  const { seller: sessionSeller, checkedSession } = useSellerSession()
  const [seller, setSeller] = useState<ApiSeller | null>(sessionSeller)
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const [changingPassword, setChangingPassword] = useState(false)

  // useSellerSession resolves the seller asynchronously after mount — pick it
  // up once it lands, without clobbering any local edits made since.
  useEffect(() => {
    if (sessionSeller) setSeller(sessionSeller)
  }, [sessionSeller])

  // Redirecting — render nothing rather than flashing page content.
  if (!checkedSession) return null

  function applyUpdatedSeller(updated: ApiSeller) {
    setSeller(updated)
    setStoredSeller(updated)
  }

  async function handleSaveProfile(values: PersonalInformationValues) {
    if (!seller) return
    setSavingProfile(true)
    setProfileError(null)
    try {
      const updated = await updateSeller(seller.id, {
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        location: values.location || undefined,
      })
      applyUpdatedSeller(updated)
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Failed to save changes. Please try again.')
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleAvatarSelected(file: File) {
    if (!seller) return
    setUploadingAvatar(true)
    setAvatarError(null)
    try {
      const updated = await uploadSellerAvatar(seller.id, file)
      applyUpdatedSeller(updated)
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : 'Failed to upload photo. Please try again.')
    } finally {
      setUploadingAvatar(false)
    }
  }

  async function handleChangePassword(currentPassword: string, newPassword: string) {
    if (!seller) return
    setChangingPassword(true)
    try {
      await changeSellerPassword(seller.id, currentPassword, newPassword)
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <SellerPortalShell mainClassName="bg-[#fafbfc]">
      <div className="flex w-full max-w-[1144px] flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-h4 capitalize text-[#1e293b]">Profile & Settings</h1>
          <p className="text-sm text-[#6b7280]">Manage your profile information and account preferences.</p>
        </div>

        <div className="flex items-start border-b border-[#e5eaf2]">
          <span className="border-b-2 border-[#3b82f6] px-6 py-3 text-sm font-semibold text-[#1e293b]">
            Profile Information
          </span>
        </div>

        {!seller ? (
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="h-[20rem] w-[280px] shrink-0 animate-pulse rounded-lg border border-[#e2e8f0] bg-white" />
            <div className="h-80 w-full animate-pulse rounded-lg border border-[#e2e8f0] bg-white" />
          </div>
        ) : (
          <div className="flex flex-col items-start gap-6 sm:flex-row">
            <div className="flex flex-col gap-2">
              <ProfileCard seller={seller} onAvatarSelected={handleAvatarSelected} uploadingAvatar={uploadingAvatar} />
              {avatarError && <p className="max-w-[280px] text-xs font-medium text-[#dc2626]">{avatarError}</p>}
            </div>

            <div className="flex min-w-0 w-full flex-1 flex-col gap-4">
              <PersonalInformationForm
                seller={seller}
                onSave={handleSaveProfile}
                saving={savingProfile}
                error={profileError}
              />
              <ChangePasswordForm onSubmit={handleChangePassword} submitting={changingPassword} />
            </div>
          </div>
        )}
      </div>
    </SellerPortalShell>
  )
}
