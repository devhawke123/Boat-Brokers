import { useState, type FormEvent } from 'react'
import AdminShell from '../../components/AdminShell/AdminShell'
import { useAdminSession } from '../../data/useAdminSession'
import { useBuyerById, invalidateBuyersCache } from '../../data/useBuyers'
import { createBuyer, updateBuyer } from '../../lib/api'
import { TextField, FieldRow } from '../../../seller-portal/components/FormField/FormField'
import Button from '../../../components/Button/Button'

type BuyerFormProps = {
  buyerId?: number
}

export default function BuyerForm({ buyerId }: BuyerFormProps) {
  const { checkedSession } = useAdminSession()
  const isEdit = buyerId !== undefined
  const { buyer, loading } = useBuyerById(buyerId ?? -1)

  const [firstName, setFirstName] = useState('')
  const [surname, setSurname] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [initialized, setInitialized] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Populate the form once the existing buyer loads (edit mode only).
  if (isEdit && buyer && !initialized) {
    setFirstName(buyer.firstName)
    setSurname(buyer.surname)
    setEmail(buyer.email)
    setPhone(buyer.phone ?? '')
    setInitialized(true)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      if (isEdit && buyerId !== undefined) {
        await updateBuyer(buyerId, { firstName, surname, email, phone: phone || undefined })
        invalidateBuyersCache()
        window.location.href = `/admin-portal/buyers/${buyerId}`
      } else {
        const created = await createBuyer({ firstName, surname, email, phone: phone || undefined })
        invalidateBuyersCache()
        window.location.href = `/admin-portal/buyers/${created.id}`
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save buyer.')
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
  if (isEdit && !buyer) {
    return (
      <AdminShell mainClassName="bg-frost">
        <div className="flex flex-col items-center gap-2 p-8 text-center text-[#64748b]">
          <p>This buyer couldn&rsquo;t be found.</p>
          <a href="/admin-portal/buyers" className="text-sm font-semibold text-[#2563eb]">
            Back to Boat Buyers
          </a>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell mainClassName="bg-frost">
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">{isEdit ? 'Edit Buyer' : 'Add New Buyer'}</h1>

        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-2xl flex-col gap-4 rounded-lg border border-[#e2e8f0] bg-white p-6"
        >
          <FieldRow>
            <TextField label="First Name" required value={firstName} onChange={setFirstName} placeholder="Jane" />
            <TextField label="Surname" required value={surname} onChange={setSurname} placeholder="Smith" />
          </FieldRow>

          <FieldRow>
            <TextField label="Email" required value={email} onChange={setEmail} placeholder="jane@example.com" />
            <TextField label="Phone" value={phone} onChange={setPhone} placeholder="07123 456789" />
          </FieldRow>

          {error && <p className="text-sm font-medium text-[#dc2626]">{error}</p>}

          <div className="flex items-center gap-3">
            <Button type="submit" variant="dark" label={saving ? 'Saving…' : 'Save Buyer'} icon="none" disabled={saving} />
            <a href="/admin-portal/buyers" className="text-sm font-semibold text-[#64748b] hover:text-[#0f172a]">
              Cancel
            </a>
          </div>
        </form>
      </div>
    </AdminShell>
  )
}
