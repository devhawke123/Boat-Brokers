import { useState, type FormEvent } from 'react'
import AdminShell from '../../components/AdminShell/AdminShell'
import { useAdminSession } from '../../data/useAdminSession'
import { useSellerById, invalidateSellersCache } from '../../../seller-portal/data/useSellers'
import { createSeller, updateSeller } from '../../../seller-portal/lib/api'
import { TextField, FieldRow } from '../../../seller-portal/components/FormField/FormField'
import Button from '../../../components/Button/Button'

type VendorFormProps = {
  vendorId?: number
}

export default function VendorForm({ vendorId }: VendorFormProps) {
  const { checkedSession } = useAdminSession()
  const isEdit = vendorId !== undefined
  const { seller, loading } = useSellerById(vendorId ?? -1)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [initialized, setInitialized] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Populate the form once the existing vendor loads (edit mode only).
  if (isEdit && seller && !initialized) {
    setName(seller.name)
    setEmail(seller.email)
    setPhone(seller.phone ?? '')
    setLocation(seller.location ?? '')
    setInitialized(true)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      if (isEdit && vendorId !== undefined) {
        await updateSeller(vendorId, { name, email, phone: phone || undefined, location: location || undefined })
        invalidateSellersCache()
        window.location.href = `/admin-portal/vendors/${vendorId}`
      } else {
        const created = await createSeller({
          name,
          email,
          password,
          phone: phone || undefined,
          location: location || undefined,
        })
        invalidateSellersCache()
        window.location.href = `/admin-portal/vendors/${created.id}`
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save vendor.')
      setSaving(false)
    }
  }

  if (!checkedSession) return null
  if (isEdit && loading) {
    return (
      <AdminShell mainClassName="bg-frost">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="h-64 w-full max-w-2xl animate-pulse rounded-lg border border-[#e2e8f0] bg-[#f8fafc]" />
        </div>
      </AdminShell>
    )
  }
  if (isEdit && !seller) {
    return (
      <AdminShell mainClassName="bg-frost">
        <div className="flex flex-col items-center gap-2 p-8 text-center text-[#64748b]">
          <p>This vendor couldn&rsquo;t be found.</p>
          <a href="/admin-portal/vendors" className="text-sm font-semibold text-[#2563eb]">
            Back to Boat Vendors
          </a>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell mainClassName="bg-frost">
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">{isEdit ? 'Edit Vendor' : 'Add New Vendor'}</h1>

        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-2xl flex-col gap-4 rounded-lg border border-[#e2e8f0] bg-white p-6"
        >
          <FieldRow>
            <TextField label="Full Name" required value={name} onChange={setName} placeholder="Jane Smith" />
            <TextField label="Email" required value={email} onChange={setEmail} placeholder="jane@example.com" />
          </FieldRow>

          {!isEdit && (
            <TextField
              label="Password"
              required
              value={password}
              onChange={setPassword}
              placeholder="At least 8 characters"
            />
          )}

          <FieldRow>
            <TextField label="Phone" value={phone} onChange={setPhone} placeholder="07123 456789" />
            <TextField label="Location" value={location} onChange={setLocation} placeholder="Birmingham" />
          </FieldRow>

          {error && <p className="text-sm font-medium text-[#dc2626]">{error}</p>}

          <div className="flex items-center gap-3">
            <Button type="submit" variant="dark" label={saving ? 'Saving…' : 'Save Vendor'} icon="none" disabled={saving} />
            <a href="/admin-portal/vendors" className="text-sm font-semibold text-[#64748b] hover:text-[#0f172a]">
              Cancel
            </a>
          </div>
        </form>
      </div>
    </AdminShell>
  )
}
