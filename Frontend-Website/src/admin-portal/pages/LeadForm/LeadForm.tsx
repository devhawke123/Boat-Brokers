import { useState, type FormEvent } from 'react'
import AdminShell from '../../components/AdminShell/AdminShell'
import { useAdminSession } from '../../data/useAdminSession'
import { useLeadById, invalidateLeadsCache } from '../../data/useLeads'
import { createLead, updateLead } from '../../lib/api'
import { TextField, TextareaField, SelectField, FieldRow } from '../../../seller-portal/components/FormField/FormField'
import Button from '../../../components/Button/Button'

type LeadFormProps = {
  leadId?: number
}

const sourceOptions = ['Referral', 'Website', 'Apollo Duck', 'Other']

export default function LeadForm({ leadId }: LeadFormProps) {
  const { checkedSession } = useAdminSession()
  const isEdit = leadId !== undefined
  const { lead, loading } = useLeadById(leadId ?? -1)

  const [firstName, setFirstName] = useState('')
  const [surname, setSurname] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [source, setSource] = useState('')
  const [notes, setNotes] = useState('')
  const [initialized, setInitialized] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Populate the form once the existing lead loads (edit mode only).
  if (isEdit && lead && !initialized) {
    setFirstName(lead.firstName)
    setSurname(lead.surname)
    setEmail(lead.email)
    setPhone(lead.phone ?? '')
    setAddress(lead.address ?? '')
    setSource(lead.source ?? '')
    setNotes(lead.notes ?? '')
    setInitialized(true)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    const payload = {
      firstName,
      surname,
      email,
      phone: phone || undefined,
      address: address || undefined,
      source: source || undefined,
      notes: notes || undefined,
    }
    try {
      if (isEdit && leadId !== undefined) {
        await updateLead(leadId, payload)
        invalidateLeadsCache()
        window.location.href = `/admin-portal/leads/${leadId}`
      } else {
        const created = await createLead(payload)
        invalidateLeadsCache()
        window.location.href = `/admin-portal/leads/${created.id}`
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save lead.')
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
  if (isEdit && !lead) {
    return (
      <AdminShell mainClassName="bg-frost">
        <div className="flex flex-col items-center gap-2 p-8 text-center text-[#64748b]">
          <p>This lead couldn&rsquo;t be found.</p>
          <a href="/admin-portal/leads" className="text-sm font-semibold text-[#2563eb]">
            Back to Leads
          </a>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell mainClassName="bg-frost">
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">{isEdit ? 'Edit Lead' : 'Add New Lead'}</h1>

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

          <FieldRow>
            <TextField label="Address" value={address} onChange={setAddress} placeholder="Street, City, Postcode" />
            <SelectField label="Source" placeholder="Select source" options={sourceOptions} value={source} onChange={setSource} />
          </FieldRow>

          <TextareaField label="Notes" value={notes} onChange={setNotes} placeholder="Optional" maxLength={1000} />

          {error && <p className="text-sm font-medium text-[#dc2626]">{error}</p>}

          <div className="flex items-center gap-3">
            <Button type="submit" variant="dark" label={saving ? 'Saving…' : 'Save Lead'} icon="none" disabled={saving} />
            <a href="/admin-portal/leads" className="text-sm font-semibold text-[#64748b] hover:text-[#0f172a]">
              Cancel
            </a>
          </div>
        </form>
      </div>
    </AdminShell>
  )
}
