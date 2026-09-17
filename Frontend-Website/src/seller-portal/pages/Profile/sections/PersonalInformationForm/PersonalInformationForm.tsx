import { useState } from 'react'
import type { ApiSeller } from '../../../../lib/api'

export type PersonalInformationValues = {
  name: string
  email: string
  phone: string
  location: string
}

type PersonalInformationFormProps = {
  seller: ApiSeller
  onSave: (values: PersonalInformationValues) => Promise<void>
  saving: boolean
  error: string | null
}

function CompactField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string
  value: string
  onChange?: (value: string) => void
  disabled?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-[#64748b]">{label}</span>
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.value)}
        className="h-[38px] w-full rounded-md border border-[#e5eaf2] bg-[#f9fafb] px-3 text-sm text-[#0f172a] placeholder:text-[#a7a7a7] focus:border-navy-dark focus:outline-none disabled:text-[#9ca3af]"
      />
    </div>
  )
}

export default function PersonalInformationForm({ seller, onSave, saving, error }: PersonalInformationFormProps) {
  const [values, setValues] = useState<PersonalInformationValues>({
    name: seller.name,
    email: seller.email,
    phone: seller.phone ?? '',
    location: seller.location ?? '',
  })

  function update<K extends keyof PersonalInformationValues>(field: K, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex w-full flex-col gap-6 rounded-lg border border-[#e5eaf2] bg-white p-8 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
      <h3 className="text-base font-semibold text-[#0a4359]">Personal Information</h3>

      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        <CompactField label="Full Name" value={values.name} onChange={(v) => update('name', v)} />
        <CompactField label="Seller ID" value={seller.sellerId} disabled />
        <CompactField label="Email" value={values.email} onChange={(v) => update('email', v)} />
        <CompactField label="Phone" value={values.phone} onChange={(v) => update('phone', v)} />
        <CompactField label="Location" value={values.location} onChange={(v) => update('location', v)} />
      </div>

      {error && <p className="text-sm font-medium text-[#dc2626]">{error}</p>}

      <button
        type="button"
        onClick={() => onSave(values)}
        disabled={saving}
        className="w-fit rounded-md bg-[#0a4359] px-6 py-2.5 text-sm font-semibold text-white transition-opacity duration-300 hover:opacity-90 disabled:opacity-60"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  )
}
