import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type MouseEvent, type ReactNode, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowUp, Check, ChevronLeft, ChevronRight, Mail, MapPin, Pencil, Phone, Plus, Search, Tag, Trash2, X } from 'lucide-react'
import type { Notice } from '../../seller-portal/components/ToastNotice'
import { EASE } from '../../seller-portal/lib/motion'
import { createLead, deleteLead, updateLead, updateLeadStatus } from '../lib/api'
import { leadActivityEvent, leadName, leadSources, leadStatuses, leadStatusToApi, toAdminLead, validateLead } from '../lib/adminLeadData'
import type { AdminLead, LeadActivity, LeadFormValues, LeadStage } from '../lib/adminLeadData'
import { useLeads, invalidateLeadsCache } from '../data/useLeads'
import { AccountButton, AccountCloseButton, AccountField } from './AdminAccountSettings'
import { AdminActionButton, AdminResultsBody } from './AdminInteraction'
import AdminSelectField from './AdminSelectField'
import { AdminCollectionStats, AdminCollectionFilters } from './AdminCollectionControls'
import ContactCopyButton from './ContactCopyButton'
import '../styles/admin-leads.css'

// Ported from boat-brokers/src/components/AdminLeads.jsx. Markup, classes and
// copy match the prototype; records and mutations use the live leads API.
// Activity history is not persisted by the API — only "Lead added" is derived
// from createdAt/source, with session-local events after edits/status changes.

const PAGE_SIZE = 8
const fields: LeadFormValues = { firstName: '', surname: '', email: '', phone: '', address: '', source: '', notes: '' }
const shortDate = (value: string) => new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const activityDate = (value: string) => new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'Please try again.'

function LeadStatus({ value }: { value: string }) {
  return <span className={`lead-stage is-${value.toLowerCase()}`}><i aria-hidden="true" />{value}</span>
}

function LeadAvatar({ lead, large = false }: { lead: Pick<AdminLead, 'firstName' | 'surname'>; large?: boolean }) {
  return <span className={`lead-avatar ${large ? 'is-large' : ''}`} aria-hidden="true">{`${lead.firstName[0] || ''}${lead.surname[0] || ''}`.toUpperCase()}</span>
}

function Overlay({ type, titleId, onClose, initialFocusRef, returnRef, children }: {
  type: 'modal' | 'drawer'
  titleId: string
  onClose: () => void
  initialFocusRef: RefObject<HTMLElement | null>
  returnRef: RefObject<HTMLElement | null>
  children: ReactNode
}) {
  const panelRef = useRef<HTMLElement>(null)
  const closeRef = useRef(onClose)
  useEffect(() => { closeRef.current = onClose }, [onClose])
  const reduced = useReducedMotion()
  useEffect(() => {
    const root = document.getElementById('root')
    const inert = root?.inert
    const overflow = document.body.style.overflow
    const returnTarget = returnRef.current
    if (root) root.inert = true
    document.body.style.overflow = 'hidden'
    initialFocusRef.current?.focus({ preventScroll: true })
    const keydown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return
      if (document.querySelector('dialog:modal')) return
      if (event.key === 'Escape') { event.preventDefault(); closeRef.current(); return }
      if (event.key !== 'Tab') return
      const controls = [...(panelRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), textarea, a[href]') || [])].filter(element => element.getClientRects().length)
      const first = controls[0]
      const last = controls.at(-1)
      if (event.shiftKey && (document.activeElement === first || !controls.includes(document.activeElement as HTMLElement))) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && (document.activeElement === last || !panelRef.current?.contains(document.activeElement))) { event.preventDefault(); first?.focus() }
    }
    document.addEventListener('keydown', keydown)
    return () => {
      if (root) root.inert = inert ?? false
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', keydown)
      requestAnimationFrame(() => {
        if (document.querySelector('.lead-overlay')) return
        const target = returnTarget?.isConnected ? returnTarget : document.querySelector<HTMLElement>('[data-add-lead]')
        target?.focus({ preventScroll: true })
      })
    }
  }, [initialFocusRef, returnRef])
  const modal = type === 'modal'
  const spatial = modal ? { y: 20, scale: .965 } : { x: 38 }
  return createPortal(<motion.div className={`lead-overlay is-${type}${modal ? ' v2-settings-layer' : ''}`} initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .2, ease: EASE }}>
    <button className={modal ? 'v2-settings-scrim' : 'lead-scrim'} type="button" tabIndex={-1} aria-label={modal ? 'Close lead form' : 'Close lead details'} onClick={onClose} />
    <motion.section ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className={modal ? 'v2-glass-surface v2-settings-dialog lead-modal' : 'lead-panel lead-drawer'} initial={reduced ? false : { opacity: 0, ...spatial }} animate={{ opacity: 1, x: 0, y: 0, scale: 1 }} exit={reduced ? { opacity: 0 } : { opacity: 0, ...(modal ? { y: 10, scale: .99 } : spatial) }} transition={{ duration: reduced ? 0 : modal ? .35 : .32, ease: EASE }}>{children}</motion.section>
  </motion.div>, document.body)
}

function CloseButton({ onClick, label }: { onClick: () => void; label: string }) {
  return <AccountCloseButton label={label} onClick={onClick} />
}

function LeadEditor({ lead, onSave, onCancel, returnRef, busy }: {
  lead: AdminLead | null
  onSave: (values: LeadFormValues) => Promise<boolean>
  onCancel: () => void
  returnRef: RefObject<HTMLElement | null>
  busy: boolean
}) {
  const [values, setValues] = useState<LeadFormValues>(() => Object.fromEntries(Object.keys(fields).map(key => [key, lead?.[key as keyof LeadFormValues] || ''])) as LeadFormValues)
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormValues, string>>>({})
  const firstRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const titleId = useId()
  function change(key: keyof LeadFormValues, value: string) { setValues(current => ({ ...current, [key]: value })); setErrors(current => ({ ...current, [key]: '' })) }
  function close() { if (!busy) onCancel() }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    const next = validateLead(values)
    setErrors(next)
    if (Object.keys(next).length) { requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()); return }
    await onSave(Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.trim()])) as LeadFormValues)
  }
  return <Overlay type="modal" titleId={titleId} initialFocusRef={firstRef} returnRef={returnRef} onClose={close}>
    <header className="v2-settings-header"><h2 id={titleId}>{lead ? `Edit lead — ${leadName(lead)}` : 'Add new lead'}</h2><CloseButton label="Close lead form" onClick={close} /></header>
    <div className="v2-settings-content"><form id="admin-lead-form" ref={formRef} noValidate onSubmit={save} className="lead-form">
      <div className="v2-settings-fields"><AccountField label="First name" name="firstName" autoComplete="given-name" placeholder="e.g. Jane" ref={firstRef} required value={values.firstName} error={errors.firstName} onChange={event => change('firstName', event.target.value)} /><AccountField label="Surname" name="surname" autoComplete="family-name" placeholder="e.g. Smith" required value={values.surname} error={errors.surname} onChange={event => change('surname', event.target.value)} /><AccountField label="Email address" name="email" type="email" autoComplete="email" placeholder="e.g. jane.smith@example.com" required value={values.email} error={errors.email} onChange={event => change('email', event.target.value)} /><AccountField label="Phone number" name="phone" type="tel" autoComplete="tel" placeholder="e.g. 07700 900123" value={values.phone} onChange={event => change('phone', event.target.value)} /><AccountField label="Address" name="address" autoComplete="street-address" placeholder="Street, city and postcode" value={values.address} onChange={event => change('address', event.target.value)} /><div className="v2-settings-select"><AdminSelectField label="Source" name="source" value={values.source} options={leadSources} placeholder="Select a source" variant="v2" layerIndex={120} onChange={event => change('source', event.target.value)} /></div></div>
      <div className="lead-notes-field"><AccountField label="Notes" multiline name="notes" value={values.notes} maxLength={1000} rows={4} placeholder="Add boat details, preferred contact times or follow-up notes…" onChange={event => change('notes', event.target.value)} error={errors.notes} hint={`${values.notes.length.toLocaleString()} / 1,000`} /></div>
    </form></div>
    <footer className="v2-settings-footer lead-editor-footer"><div className="v2-settings-footer-actions"><AccountButton onClick={close} disabled={busy}>Cancel</AccountButton><AccountButton kind="primary" type="submit" form="admin-lead-form" disabled={busy}>{lead ? 'Save changes' : 'Add lead'}</AccountButton></div></footer>
  </Overlay>
}

function LeadDeleteDialog({ lead, onCancel, onConfirm, returnRef, busy }: {
  lead: AdminLead
  onCancel: () => void
  onConfirm: () => void
  returnRef: RefObject<HTMLElement | null>
  busy: boolean
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const keepRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  const reduced = useReducedMotion()
  useEffect(() => {
    const dialog = dialogRef.current
    const trigger = returnRef.current
    dialog?.showModal()
    keepRef.current?.focus({ preventScroll: true })
    return () => {
      dialog?.close()
      if (trigger?.isConnected) trigger.focus({ preventScroll: true })
    }
  }, [returnRef])
  function backdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget) return
    const bounds = event.currentTarget.getBoundingClientRect()
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onCancel()
  }
  return createPortal(<motion.dialog ref={dialogRef} role="alertdialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId} className="v2-glass-surface v2-settings-dialog v2-settings-native-dialog lead-delete-dialog" initial={reduced ? false : { opacity: 0, y: 20, scale: .965 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduced ? 0 : 10, scale: reduced ? 1 : .99 }} transition={{ duration: reduced ? 0 : .25, ease: EASE }} onClick={backdropClick} onCancel={event => { event.preventDefault(); onCancel() }} onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onCancel() } }}>
    <header className="v2-settings-header"><h2 id={titleId}>Delete {leadName(lead)}?</h2></header>
    <div className="v2-settings-content"><p id={descriptionId}>This will remove their contact details, notes and activity from Leads. This action cannot be undone.</p></div>
    <footer className="v2-settings-footer lead-delete-dialog-footer"><div className="v2-settings-footer-actions"><AccountButton ref={keepRef} onClick={onCancel} disabled={busy}>Keep lead</AccountButton><AccountButton kind="primary" className="lead-danger-button" disabled={busy} variants={{ rest: { backgroundColor: '#99465a' }, hover: { backgroundColor: '#80364a' } }} onClick={onConfirm}><Trash2 size={15} aria-hidden="true" />Delete lead</AccountButton></div></footer>
  </motion.dialog>, document.body)
}

function LeadDrawer({ lead, onClose, onEdit, onDelete, onStatus, returnRef, busy }: {
  lead: AdminLead
  onClose: () => void
  onEdit: () => void
  onDelete: (id: string) => void
  onStatus: (id: string, value: LeadStage) => void
  returnRef: RefObject<HTMLElement | null>
  busy: boolean
}) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const deleteRef = useRef<HTMLButtonElement>(null)
  const [confirming, setConfirming] = useState(false)
  const titleId = useId()
  function close() { if (confirming) setConfirming(false); else onClose() }
  return <Overlay type="drawer" titleId={titleId} initialFocusRef={headingRef} returnRef={returnRef} onClose={close}>
    <header className="lead-drawer-top"><span>Lead details <span aria-hidden="true">/</span> {lead.id}</span><CloseButton label="Close lead details" onClick={close} /></header>
    <div className="lead-panel-body lead-drawer-body">
      <div className="lead-person"><LeadAvatar lead={lead} large /><div><h2 id={titleId} ref={headingRef} tabIndex={-1}>{leadName(lead)}</h2><p>Added <time dateTime={lead.createdAt}>{shortDate(lead.createdAt)}</time></p></div></div>
      <section className="lead-detail-section">
        <h3>Contact information</h3>
        <dl className="lead-contact-details">
          <div className="lead-contact-method">
            <dt><Mail size={15} strokeWidth={1.5} aria-hidden="true" />Email address</dt>
            <dd><a href={`mailto:${lead.email}`}><span>{lead.email}</span></a><ContactCopyButton value={lead.email} label="Copy lead email" copiedLabel="Email copied" /></dd>
          </div>
          <div className="lead-contact-method">
            <dt><Phone size={15} strokeWidth={1.5} aria-hidden="true" />Phone number</dt>
            <dd>{lead.phone ? <><a href={`tel:${lead.phone.replace(/[^+\d]/g, '')}`}><span>{lead.phone}</span></a><ContactCopyButton value={lead.phone} label="Copy lead phone number" copiedLabel="Phone number copied" /></> : 'Not provided'}</dd>
          </div>
          <div><dt><MapPin size={15} strokeWidth={1.5} aria-hidden="true" />Address</dt><dd>{lead.address || 'Not provided'}</dd></div>
          <div><dt><Tag size={15} strokeWidth={1.5} aria-hidden="true" />Source</dt><dd>{lead.source || 'Not recorded'}</dd></div>
        </dl>
      </section>
      <section className="lead-detail-section"><h3>Notes</h3><div className="lead-note">{lead.notes || 'No notes added yet.'}</div></section>
      <section className="lead-detail-section"><h3>Activity</h3><ol className="lead-timeline">{[...lead.activity].reverse().map((item, index) => <li key={item.id}><span className={`lead-timeline-mark ${index === 0 ? 'is-current' : ''}`} aria-hidden="true">{index !== 0 && <Check size={9} strokeWidth={2} />}</span><div><strong>{item.title}</strong>{item.detail && <p>{item.detail}</p>}<time dateTime={item.at}>{activityDate(item.at)}</time></div></li>)}</ol></section>
    </div>
    <footer className="lead-panel-footer"><div className="admin-stage-footer"><span>Lead stage</span><AdminSelectField label="Lead status" labelHidden value={lead.status} options={leadStatuses} name="status" variant="v2" layerIndex={120} onChange={event => onStatus(lead.id, event.target.value as LeadStage)} /></div><AdminActionButton ref={deleteRef} type="button" className="lead-delete" disabled={busy} onClick={() => setConfirming(true)}><Trash2 size={15} strokeWidth={1.5} />Delete lead</AdminActionButton><AccountButton kind="primary" disabled={busy} onClick={onEdit}><Pencil size={14} strokeWidth={1.5} />Edit lead</AccountButton></footer>
    <AnimatePresence>{confirming && <LeadDeleteDialog lead={lead} returnRef={deleteRef} busy={busy} onCancel={() => setConfirming(false)} onConfirm={() => onDelete(lead.id)} />}</AnimatePresence>
  </Overlay>
}

export default function AdminLeads({ onNotice }: { onNotice: (notice: Notice) => void }) {
  const reduced = useReducedMotion()
  const { leads: apiLeads, loading, error, refetch } = useLeads()
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [source, setSource] = useState(() => {
    const value = params.get('source') || ''
    return leadSources.includes(value) ? value : 'All sources'
  })
  const [page, setPage] = useState(1)
  const [oldestFirst, setOldestFirst] = useState(false)
  const [editor, setEditor] = useState<AdminLead | Record<string, never> | null>(null)
  const [busy, setBusy] = useState(false)
  const [sessionActivity, setSessionActivity] = useState<Record<string, LeadActivity[]>>({})
  const returnRef = useRef<HTMLElement | null>(null)
  const addRef = useRef<HTMLButtonElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const leads = useMemo(() => apiLeads.map(lead => toAdminLead(lead, sessionActivity[lead.leadId] || [])), [apiLeads, sessionActivity])
  const selected = leads.find(lead => lead.id === params.get('lead'))
  const rawStatus = params.get('status') ?? 'New'
  const status = rawStatus === 'All' || rawStatus === '' ? '' : [...leadStatuses, 'Open'].includes(rawStatus) ? rawStatus : 'New'
  const matchesStage = (lead: AdminLead, value: string) => !value || (value === 'Open' ? ['New', 'Contacted'].includes(lead.status) : lead.status === value)
  const filtered = leads.filter(lead => matchesStage(lead, status) && (source === 'All sources' || lead.source === source) && [leadName(lead), lead.email, lead.phone, lead.address, lead.source, lead.notes].some(value => value.toLowerCase().includes(search.trim().toLowerCase()))).sort((a, b) => b.createdAt.localeCompare(a.createdAt) * (oldestFirst ? -1 : 1))
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const activePage = Math.min(page, pages)
  const visible = filtered.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE)
  function refresh() {
    invalidateLeadsCache()
    refetch()
  }
  function rememberActivity(id: string, event: LeadActivity) {
    setSessionActivity(current => ({ ...current, [id]: [...(current[id] || []), event] }))
  }
  function selectLead(id: string | null, trigger?: HTMLElement | null) {
    if (trigger) returnRef.current = trigger.matches('button') ? trigger : trigger.querySelector('button')
    const next = new URLSearchParams(params)
    if (id) next.set('lead', id)
    else next.delete('lead')
    setParams(next, { replace: true })
  }
  function filterStatus(value: string) {
    const next = new URLSearchParams(params)
    next.delete('lead')
    next.set('status', value || 'All')
    setParams(next, { replace: true })
    setPage(1)
  }
  function filterSource(value: string) {
    setSource(value)
    setPage(1)
    const next = new URLSearchParams(params)
    if (value && value !== 'All sources') next.set('source', value)
    else next.delete('source')
    setParams(next, { replace: true })
  }
  function clearFilters(options: { search?: boolean } = {}) {
    if (options.search) setSearch('')
    setSource('All sources')
    setPage(1)
    const next = new URLSearchParams(params)
    next.delete('lead')
    next.delete('source')
    next.set('status', 'All')
    setParams(next, { replace: true })
  }
  async function save(values: LeadFormValues) {
    const editing = editor && 'numericId' in editor && typeof editor.numericId === 'number' ? editor as AdminLead : null
    setBusy(true)
    try {
      if (editing) {
        await updateLead(editing.numericId, {
          firstName: values.firstName,
          surname: values.surname,
          email: values.email,
          phone: values.phone || undefined,
          address: values.address || undefined,
          source: values.source || undefined,
          notes: values.notes || undefined,
        })
        rememberActivity(editing.id, leadActivityEvent('Contact details updated'))
        refresh()
        onNotice({ type: 'success', title: 'Lead updated', description: `${leadName(values)}’s details have been saved.` })
      } else {
        const created = await createLead({
          firstName: values.firstName,
          surname: values.surname,
          email: values.email,
          phone: values.phone || undefined,
          address: values.address || undefined,
          source: values.source || undefined,
          notes: values.notes || undefined,
        })
        setSearch('')
        setSource('All sources')
        setPage(1)
        setOldestFirst(false)
        const next = new URLSearchParams(params)
        next.delete('status')
        next.delete('source')
        next.set('lead', created.leadId)
        setParams(next, { replace: true })
        returnRef.current = addRef.current
        refresh()
        onNotice({ type: 'success', title: 'Lead added', description: `${leadName(values)} is ready for the next conversation.` })
      }
      setEditor(null)
      return true
    } catch (error) {
      onNotice({ type: 'error', title: 'Changes not saved', description: errorMessage(error) })
      return false
    } finally {
      setBusy(false)
    }
  }
  async function updateStatus(id: string, value: LeadStage) {
    if (busy || selected?.status === value) return
    const lead = leads.find(item => item.id === id)
    if (!lead) return
    setBusy(true)
    try {
      await updateLeadStatus(lead.numericId, leadStatusToApi(value))
      rememberActivity(id, leadActivityEvent(`Marked as ${value.toLowerCase()}`, `Changed from ${lead.status.toLowerCase()}.`))
      refresh()
      onNotice({ type: 'success', title: 'Lead stage updated', description: `${leadName(lead)} is now ${value.toLowerCase()}.` })
    } catch (error) {
      onNotice({ type: 'error', title: 'Stage not updated', description: errorMessage(error) })
    } finally {
      setBusy(false)
    }
  }
  async function remove(id: string) {
    const lead = leads.find(item => item.id === id)
    if (!lead || busy) return
    setBusy(true)
    try {
      await deleteLead(lead.numericId)
      setSessionActivity(current => {
        const next = { ...current }
        delete next[id]
        return next
      })
      selectLead(null)
      returnRef.current = addRef.current
      refresh()
      onNotice({ type: 'success', title: 'Lead deleted', description: 'The contact has been removed from Leads.' })
    } catch (error) {
      onNotice({ type: 'error', title: 'Lead not deleted', description: errorMessage(error) })
    } finally {
      setBusy(false)
    }
  }
  function changePage(value: number) { setPage(value); requestAnimationFrame(() => resultsRef.current?.focus({ preventScroll: true })) }
  const editingLead = editor && 'numericId' in editor && typeof editor.numericId === 'number' ? editor as AdminLead : null
  return <>
    <div className="leads-heading"><h1>Leads</h1><AccountButton kind="primary" ref={addRef} data-add-lead onClick={() => { returnRef.current = addRef.current; setEditor({}) }}><Plus size={16} strokeWidth={1.6} />Add new lead</AccountButton></div>
    <AdminCollectionStats label="Lead statistics" value={status} onChange={filterStatus} items={['', ...leadStatuses].map(value => ({ value, label: value || 'All leads', count: leads.filter(lead => matchesStage(lead, value)).length }))} />
    <section className="leads-list" aria-label="Leads"><div className="leads-toolbar"><div className="leads-tools"><div className="leads-search"><Search size={16} strokeWidth={1.5} aria-hidden="true" /><input type="search" aria-label="Search leads" placeholder="Search name, email or notes…" value={search} onChange={event => { setSearch(event.target.value); setPage(1) }} />{search && <AdminActionButton type="button" aria-label="Clear search" onClick={() => { setSearch(''); setPage(1) }}><X size={15} /></AdminActionButton>}</div><AdminCollectionFilters active={Boolean(status || source !== 'All sources')} fields={[{ label: 'Lead stage', value: status || 'All stages', options: ['All stages', ...leadStatuses, ...(status === 'Open' ? ['Open'] : [])], onChange: value => filterStatus(value === 'All stages' ? '' : value) }, { label: 'Source', value: source, options: ['All sources', ...leadSources], onChange: filterSource }]} onClear={clearFilters} /></div></div>
    <div className="leads-table-wrap" role="region" aria-label="Lead contacts" tabIndex={0} ref={resultsRef}><table className="leads-table"><thead><tr><th scope="col">Lead</th><th scope="col">Contact</th><th scope="col">Source</th><th scope="col">Stage</th><th scope="col" aria-sort={oldestFirst ? 'ascending' : 'descending'}><AdminActionButton type="button" onClick={() => { setOldestFirst(value => !value); setPage(1) }}>Added{oldestFirst ? <ArrowUp size={12} /> : <ArrowDown size={12} />}</AdminActionButton></th><th scope="col"><span className="sr-only">Open details</span></th></tr></thead><AdminResultsBody identity={JSON.stringify([status, source, search, activePage, oldestFirst, loading])}>{visible.map(lead => <motion.tr key={lead.id} className={selected?.id === lead.id ? 'is-selected' : ''} whileHover={{ backgroundColor: '#f1f6fa' }} transition={{ duration: reduced ? 0 : .3, ease: EASE }} onClick={event => selectLead(lead.id, event.currentTarget)}><td><div className="lead-row-person"><LeadAvatar lead={lead} /><div><AdminActionButton type="button" data-lead-open={lead.id} aria-label={`View lead ${leadName(lead)}`} onClick={event => { event.stopPropagation(); selectLead(lead.id, event.currentTarget) }}>{leadName(lead)}</AdminActionButton><span>{lead.address || 'Address not provided'}</span></div></div></td><td><span className="lead-row-email">{lead.email}</span><span className="lead-row-phone">{lead.phone || '—'}</span></td><td><span className="lead-row-source">{lead.source || '—'}</span></td><td><LeadStatus value={lead.status} /></td><td><time dateTime={lead.createdAt}>{shortDate(lead.createdAt)}</time></td><td><ChevronRight size={16} strokeWidth={1.4} aria-hidden="true" /></td></motion.tr>)}</AdminResultsBody></table></div>
    {!visible.length && <motion.div className="leads-empty" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : .3 }}>{loading || error ? <><Search size={27} strokeWidth={1.3} aria-hidden="true" /><h2>{loading ? 'Loading leads…' : 'Couldn’t load leads'}</h2>{error && !loading && <><p>{error}</p><AccountButton onClick={refresh}>Try again</AccountButton></>}</> : <><Search size={27} strokeWidth={1.3} aria-hidden="true" /><h2>{leads.length ? 'No matching leads' : 'Start a new conversation'}</h2><p>{leads.length ? 'Try another name, source or stage.' : 'Add your first contact to keep their details and next steps together.'}</p><AccountButton onClick={() => leads.length ? clearFilters({ search: true }) : (returnRef.current = addRef.current, setEditor({}))}>{leads.length ? 'Clear filters' : 'Add a lead'}</AccountButton></>}</motion.div>}
    <footer className="leads-pagination"><p role="status">{filtered.length ? <>{(activePage - 1) * PAGE_SIZE + 1}–{Math.min(activePage * PAGE_SIZE, filtered.length)} <span>of</span> {filtered.length} leads</> : '0 leads'}</p><div><AdminActionButton type="button" aria-label="Previous page" disabled={activePage === 1} onClick={() => changePage(activePage - 1)}><ChevronLeft size={15} /></AdminActionButton><span>{activePage} <span>/ {pages}</span></span><AdminActionButton type="button" aria-label="Next page" disabled={activePage === pages} onClick={() => changePage(activePage + 1)}><ChevronRight size={15} /></AdminActionButton></div></footer></section>
    <AnimatePresence mode="wait">{editor ? <LeadEditor key={editingLead?.id || 'new-lead'} lead={editingLead} returnRef={returnRef} busy={busy} onSave={save} onCancel={() => setEditor(null)} /> : selected ? <LeadDrawer key={`view-${selected.id}`} lead={selected} onClose={() => selectLead(null)} onEdit={() => setEditor(selected)} onDelete={remove} onStatus={updateStatus} returnRef={returnRef} busy={busy} /> : null}</AnimatePresence>
  </>
}
