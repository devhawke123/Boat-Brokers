import type { ApiLead, LeadStatus } from './api'

export type LeadStage = 'New' | 'Contacted' | 'Listed' | 'Lost'

export type LeadActivity = {
  id: string
  title: string
  detail: string
  at: string
}

export type AdminLead = {
  id: string
  numericId: number
  firstName: string
  surname: string
  email: string
  phone: string
  address: string
  source: string
  status: LeadStage
  notes: string
  createdAt: string
  activity: LeadActivity[]
}

export type LeadFormValues = {
  firstName: string
  surname: string
  email: string
  phone: string
  address: string
  source: string
  notes: string
}

export const leadStatuses: LeadStage[] = ['New', 'Contacted', 'Listed', 'Lost']
export const leadSources = ['Referral', 'Website', 'Apollo Duck', 'Other']

const stageFromApi: Record<LeadStatus, LeadStage> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  LISTED: 'Listed',
  LOST: 'Lost',
}

export const leadStatusToApi = (status: LeadStage): LeadStatus => status.toUpperCase() as LeadStatus

export const leadName = (lead: { firstName: string; surname: string }) => `${lead.firstName} ${lead.surname}`.trim()

export function validateLead(values: LeadFormValues) {
  const errors: Partial<Record<keyof LeadFormValues, string>> = {}
  if (!values.firstName.trim()) errors.firstName = 'Enter a first name.'
  if (!values.surname.trim()) errors.surname = 'Enter a surname.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Enter a valid email address.'
  if (values.notes.length > 1000) errors.notes = 'Keep notes within 1,000 characters.'
  return errors
}

export function leadActivityEvent(title: string, detail = ''): LeadActivity {
  return { id: crypto.randomUUID(), title, detail, at: new Date().toISOString() }
}

export function toAdminLead(lead: ApiLead, extraActivity: LeadActivity[] = []): AdminLead {
  const createdAt = typeof lead.createdAt === 'string' ? lead.createdAt : new Date(lead.createdAt).toISOString()
  return {
    id: lead.leadId,
    numericId: lead.id,
    firstName: lead.firstName,
    surname: lead.surname,
    email: lead.email,
    phone: lead.phone ?? '',
    address: lead.address ?? '',
    source: lead.source ?? '',
    status: stageFromApi[lead.status],
    notes: lead.notes ?? '',
    createdAt,
    activity: [
      {
        id: `${lead.leadId}-created`,
        title: 'Lead added',
        detail: lead.source ? `Received through ${lead.source}.` : 'Added manually.',
        at: createdAt,
      },
      ...extraActivity,
    ],
  }
}
