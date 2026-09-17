import { useRef, type ChangeEvent } from 'react'
import type { ApiSeller } from '../../../../lib/api'
import { formatMonthYear } from '../../../../lib/formatDate'
import emailIcon from '../../../../assets/icons/email.svg'
import phoneIcon from '../../../../assets/AddBoat/key-details/phone-icon.svg'
import locationIcon from '../../../../assets/Profile/location-icon.svg'
import calendarIcon from '../../../../assets/AddBoat/spec-tabs/calendar.svg'
import cameraIcon from '../../../../assets/Profile/camera-icon.svg'

type ProfileCardProps = {
  seller: ApiSeller
  onAvatarSelected: (file: File) => void
  uploadingAvatar: boolean
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function InfoRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex w-full items-center gap-3">
      <img src={icon} alt="" aria-hidden="true" className="size-3 shrink-0" />
      <span className="text-xs text-[#6b7280]">{text}</span>
    </div>
  )
}

export default function ProfileCard({ seller, onAvatarSelected, uploadingAvatar }: ProfileCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) onAvatarSelected(file)
    event.target.value = ''
  }

  return (
    <div className="flex w-[280px] shrink-0 flex-col items-center gap-4 rounded-lg border border-[#e5eaf2] bg-white p-6 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
      <div className="relative">
        <div className="flex size-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#eff6ff] bg-[#eff6ff]">
          {seller.avatarUrl ? (
            <img src={seller.avatarUrl} alt="" className="size-full object-cover" />
          ) : (
            <span className="text-xl font-bold text-[#0b3a58]">{initials(seller.name)}</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingAvatar}
          aria-label="Change profile photo"
          className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full border border-[#e5eaf2] bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05)] disabled:opacity-50"
        >
          <img src={cameraIcon} alt="" aria-hidden="true" className="size-3" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="flex flex-col items-center gap-0.5">
        <h2 className="text-lg font-bold text-[#1e293b]">{seller.name}</h2>
        <p className="text-xs font-semibold text-[#0a4359]">Seller</p>
      </div>

      <div className="flex w-full flex-col gap-3 border-t border-[#f1f5f9] pt-4">
        <InfoRow icon={emailIcon} text={seller.email} />
        <InfoRow icon={phoneIcon} text={seller.phone ?? 'No phone on file'} />
        <InfoRow icon={locationIcon} text={seller.location ?? 'No location on file'} />
        <InfoRow icon={calendarIcon} text={`Member since ${formatMonthYear(seller.joiningDate)}`} />
      </div>
    </div>
  )
}
