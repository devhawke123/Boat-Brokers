import { useMemo, useRef, useState, type FormEvent, type MouseEvent, type RefObject } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Mail, Pencil, Phone, Plus, Search, Tag, Trash2, X } from 'lucide-react'
import type { Notice } from '../../seller-portal/components/ToastNotice'
import { useBoatListings } from '../../seller-portal/data/useBoatListings'
import { createBuyer, deleteBuyer, updateBuyer, updateBuyerStatus } from '../lib/api'
import {
  buyerActivityEvent,
  buyerName,
  buyerSources,
  buyerStages,
  buyerStatusToApi,
  filterBuyers,
  toAdminBuyer,
  validateBuyer,
} from '../lib/buyerRecords'
import type { AdminBuyer, BuyerActivity, BuyerFormValues, BuyerStage, ListingInterestSource } from '../lib/buyerRecords'
import { toInventoryBoat } from '../lib/inventory'
import { useBuyers, invalidateBuyersCache } from '../data/useBuyers'
import { AccountButton, AccountField } from './AdminAccountSettings'
import { AdminActionButton, AdminResultsBody } from './AdminInteraction'
import AdminSelectField from './AdminSelectField'
import AdminRecordOverlay from './AdminRecordOverlay'
import AdminContactRow from './AdminContactRow'
import { AdminCollectionStats, AdminCollectionFilters } from './AdminCollectionControls'
import AdminInfoTooltip from './AdminInfoTooltip'
import { InventoryNoticeContext } from '../context/InventoryNoticeContext'
import '../styles/admin-leads.css'
import '../styles/admin-inventory.css'
import '../styles/admin-buyers.css'

// Ported from boat-brokers/src/components/AdminBuyers.jsx. Markup, classes and
// copy match the prototype; records and mutations use the live buyers API.
// Viewing requests come from API bookings (read-only). Boats of interest are
// derived from those bookings — no sample fixtures. Activity is session-local
// after the derived "Buyer added" event (API has no activity log).

const MotionLink = motion.create(Link)
const PAGE_SIZE = 8
const date = (value: string) => new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const money = (value: number | null) => value == null ? 'Price not set' : new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(value)
const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'Please try again.'

function Badge({ value }: { value: string }) {
  return <span className={'inventory-badge is-' + value.toLowerCase().replaceAll(' ', '-')}>{value}</span>
}

function Avatar({ buyer }: { buyer: Pick<AdminBuyer, 'firstName' | 'surname'> }) {
  return <span className="lead-avatar" aria-hidden="true">{[buyer.firstName, buyer.surname].map(part => part?.[0] || '').join('').toUpperCase()}</span>
}

export function BuyerEditor({ buyer, onClose, onSave, busy = false }: {
  buyer: AdminBuyer | null
  onClose: () => void
  onSave: (values: BuyerFormValues) => Promise<boolean>
  busy?: boolean
}) {
  const [values, setValues] = useState<BuyerFormValues>({
    firstName: buyer?.firstName || '',
    surname: buyer?.surname || '',
    email: buyer?.email || '',
    phone: buyer?.phone || '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof BuyerFormValues, string>>>({})
  const firstRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    const next = validateBuyer(values)
    setErrors(next)
    if (Object.keys(next).length) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    await onSave(Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.trim()])) as BuyerFormValues)
  }
  const fields: [keyof BuyerFormValues, string, string, string, string][] = [
    ['firstName', 'First name', 'e.g. Jane', 'text', 'given-name'],
    ['surname', 'Surname', 'e.g. Smith', 'text', 'family-name'],
    ['email', 'Email address', 'e.g. jane.smith@example.com', 'email', 'email'],
    ['phone', 'Phone number', 'e.g. 07700 900123', 'tel', 'tel'],
  ]
  return <AdminRecordOverlay modal title={buyer ? 'Edit buyer' : 'Add new buyer'} subject={buyer ? buyerName(buyer) : undefined} initialFocusRef={firstRef} onClose={() => { if (!busy) onClose() }} footer={<><AccountButton onClick={onClose} disabled={busy}>Cancel</AccountButton><AccountButton kind="primary" type="submit" form="admin-buyer-form" disabled={busy}>{buyer ? 'Save changes' : 'Add buyer'}</AccountButton></>}>
    <form id="admin-buyer-form" noValidate onSubmit={save} ref={formRef}><div className="v2-settings-fields">{fields.map(([key, label, placeholder, type, autoComplete], index) => <AccountField key={key} ref={index === 0 ? firstRef : undefined} label={label} name={key} type={type} autoComplete={autoComplete} placeholder={placeholder} required={key !== 'phone'} value={values[key]} error={errors[key]} onChange={event => { setValues(current => ({ ...current, [key]: event.target.value })); setErrors(current => ({ ...current, [key]: '' })) }} />)}</div></form>
  </AdminRecordOverlay>
}

function BuyerDelete({ buyer, onClose, onConfirm, busy }: {
  buyer: AdminBuyer
  onClose: () => void
  onConfirm: () => void
  busy: boolean
}) {
  const keep = useRef<HTMLButtonElement>(null)
  return <AdminRecordOverlay modal noClose title="Delete buyer?" subject={buyerName(buyer)} initialFocusRef={keep} onClose={() => { if (!busy) onClose() }} footer={<><AccountButton ref={keep} onClick={onClose} disabled={busy}>Keep buyer</AccountButton><AccountButton kind="primary" disabled={busy} variants={{ rest: { backgroundColor: '#99465a' }, hover: { backgroundColor: '#80364a' } }} onClick={onConfirm}><Trash2 size={15} />Delete buyer</AccountButton></>}>
    <p className="inventory-muted">This permanently removes this buyer’s contact details, viewing requests and local activity. It does not archive boats or change sale records.</p>
  </AdminRecordOverlay>
}

function BuyerDrawer({ buyer, onClose, onEdit, onDelete, onStatus, returnRef, busy }: {
  buyer: AdminBuyer
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
  onStatus: (value: BuyerStage) => void
  returnRef: RefObject<HTMLElement | null>
  busy: boolean
}) {
  const [deleting, setDeleting] = useState(false)
  const reduced = useReducedMotion()
  const interests = buyer.interestedBoats
  return <AdminRecordOverlay title="Buyer details" eyebrow={buyer.id} onClose={onClose} returnFocusRef={returnRef} footer={<><div className="admin-stage-footer"><span>Buyer stage</span><AdminSelectField label="Buyer stage" labelHidden variant="v2" value={buyer.status} options={buyerStages} onChange={event => onStatus(event.target.value as BuyerStage)} /></div><AdminActionButton type="button" className="buyers-delete" disabled={busy} onClick={() => setDeleting(true)}><Trash2 size={16} strokeWidth={1.5} />Delete buyer</AdminActionButton><AccountButton kind="primary" disabled={busy} onClick={onEdit}><Pencil size={15} />Edit buyer</AccountButton></>}>
    <div className="buyers-summary"><Avatar buyer={buyer} /><div><h3>{buyerName(buyer)}</h3><p>Added <time dateTime={buyer.createdAt}>{date(buyer.createdAt)}</time></p></div></div>
    <section className="inventory-detail-section"><h3>Contact information</h3><dl className="inventory-contact-details"><AdminContactRow owner="buyer" icon={Mail} label="Email address" value={buyer.email} kind="email" /><AdminContactRow owner="buyer" icon={Phone} label="Phone number" value={buyer.phone} kind="phone" /><AdminContactRow icon={Tag} label="Source" value={buyer.source} /></dl></section>
    <section className="inventory-detail-section"><h3>Boats of interest</h3>{interests.length ? <div className="buyers-interests">{interests.map(boat => <MotionLink whileHover={{ backgroundColor: '#f1f6fa' }} whileFocus={{ backgroundColor: '#f1f6fa' }} whileTap={reduced ? undefined : { scale: .98 }} transition={{ duration: reduced ? 0 : .35 }} key={boat.boatId} className="buyers-interest" to={'/boats?boat=' + encodeURIComponent(boat.id)}>{boat.image && <img src={boat.image} alt="" />}<span><strong>{boat.name}</strong><span>{boat.type} · {money(boat.price)}</span></span><ChevronRight size={17} aria-hidden="true" /></MotionLink>)}</div> : <p className="inventory-muted">No boat interest recorded yet.</p>}</section>
    <section className="inventory-detail-section"><div className="admin-request-heading"><h3>Viewing requests</h3><AdminInfoTooltip>Changing buyer stage does not approve or book a viewing.</AdminInfoTooltip></div>{buyer.viewingRequests.length ? <div className="buyers-viewings">{buyer.viewingRequests.map(request => <article key={request.id}><div><strong>{request.boatName}</strong><Badge value={request.status} /></div><p>{request.slot}</p><p>Requested {date(request.requestedAt)}</p></article>)}</div> : <p className="inventory-muted">No viewing requests from this buyer yet.</p>}</section>
    <section className="inventory-detail-section"><h3>Activity</h3><ol className="inventory-activity">{[...buyer.activity].reverse().map(item => <li key={item.id}><span>{item.title}</span><time dateTime={item.at}>{date(item.at)}</time></li>)}</ol></section>
    <AnimatePresence>{deleting && <BuyerDelete buyer={buyer} busy={busy} onClose={() => setDeleting(false)} onConfirm={onDelete} />}</AnimatePresence>
  </AdminRecordOverlay>
}

export default function AdminBuyers({ onNotice, notice, onDismissNotice }: {
  onNotice: (notice: Notice) => void
  notice: Notice | null
  onDismissNotice: () => void
}) {
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [editor, setEditor] = useState<AdminBuyer | Record<string, never> | null>(null)
  const [busy, setBusy] = useState(false)
  const [sessionActivity, setSessionActivity] = useState<Record<string, BuyerActivity[]>>({})
  const triggerRef = useRef<HTMLElement | null>(null)
  const addRef = useRef<HTMLButtonElement>(null)
  const reduced = useReducedMotion()
  const { buyers: apiBuyers, loading, error, refetch } = useBuyers()
  const { listings } = useBoatListings()
  const listingSources = useMemo<ListingInterestSource[]>(() => listings.map(listing => {
    const boat = toInventoryBoat(listing)
    return { id: boat.id, boatId: boat.boatId, name: boat.name, type: boat.type, price: boat.price, image: boat.photos[0]?.src || null }
  }), [listings])
  const buyers = useMemo(
    () => apiBuyers.map(buyer => toAdminBuyer(buyer, sessionActivity[buyer.buyerId] || [], listingSources)),
    [apiBuyers, sessionActivity, listingSources],
  )
  const status = buyerStages.includes(params.get('status') as BuyerStage) ? params.get('status') as BuyerStage : ''
  const source = buyerSources.includes(params.get('source') || '') ? params.get('source')! : 'All sources'
  const selected = buyers.find(buyer => buyer.id === params.get('buyer'))
  const rows = filterBuyers(buyers, { status, source, search })
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const currentPage = Math.min(page, pages)
  const visible = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function refresh() {
    invalidateBuyersCache()
    refetch()
  }
  function rememberActivity(id: string, event: BuyerActivity) {
    setSessionActivity(current => ({ ...current, [id]: [...(current[id] || []), event] }))
  }
  function change(values: Record<string, string | null | undefined>) {
    const next = new URLSearchParams(params)
    Object.entries(values).forEach(([key, value]) => value ? next.set(key, value) : next.delete(key))
    setParams(next, { replace: true })
  }
  function open(buyer: AdminBuyer, event: MouseEvent<HTMLElement>) {
    triggerRef.current = event.currentTarget.matches('button') ? event.currentTarget : event.currentTarget.querySelector('button')
    change({ buyer: buyer.id })
  }
  async function save(values: BuyerFormValues) {
    const editing = editor && 'numericId' in editor && typeof editor.numericId === 'number' ? editor as AdminBuyer : null
    setBusy(true)
    try {
      if (editing) {
        await updateBuyer(editing.numericId, {
          firstName: values.firstName,
          surname: values.surname,
          email: values.email,
          phone: values.phone || undefined,
        })
        rememberActivity(editing.id, buyerActivityEvent('Contact details updated'))
        refresh()
        onNotice({ type: 'success', title: 'Buyer updated', description: buyerName(values) + '’s contact details have been saved.' })
        setEditor(null)
      } else {
        const created = await createBuyer({
          firstName: values.firstName,
          surname: values.surname,
          email: values.email,
          phone: values.phone || undefined,
        })
        setSearch('')
        setPage(1)
        triggerRef.current = addRef.current
        change({ buyer: created.buyerId, status: null, source: null })
        refresh()
        onNotice({ type: 'success', title: 'Buyer added', description: buyerName(values) + '’s contact details have been saved.' })
        setEditor(null)
      }
      return true
    } catch (err) {
      onNotice({ type: 'error', title: 'Changes not saved', description: errorMessage(err) })
      return false
    } finally {
      setBusy(false)
    }
  }
  async function updateStatus(value: BuyerStage) {
    if (!selected || busy || selected.status === value) return
    setBusy(true)
    try {
      await updateBuyerStatus(selected.numericId, buyerStatusToApi(value))
      rememberActivity(selected.id, buyerActivityEvent('Marked as ' + value.toLowerCase()))
      refresh()
      onNotice({ type: 'success', title: 'Buyer stage updated', description: buyerName(selected) + ' is now ' + value.toLowerCase() + '.' })
    } catch (err) {
      onNotice({ type: 'error', title: 'Stage not updated', description: errorMessage(err) })
    } finally {
      setBusy(false)
    }
  }
  async function remove() {
    if (!selected || busy) return
    setBusy(true)
    try {
      await deleteBuyer(selected.numericId)
      setSessionActivity(current => {
        const next = { ...current }
        delete next[selected.id]
        return next
      })
      change({ buyer: null })
      triggerRef.current = addRef.current
      refresh()
      onNotice({ type: 'success', title: 'Buyer deleted', description: 'The buyer contact and viewing requests were removed.' })
    } catch (err) {
      onNotice({ type: 'error', title: 'Buyer not deleted', description: errorMessage(err) })
    } finally {
      setBusy(false)
    }
  }
  const editingBuyer = editor && 'numericId' in editor && typeof editor.numericId === 'number' ? editor as AdminBuyer : null
  return <InventoryNoticeContext.Provider value={{ notice, onClose: onDismissNotice }}>
    <div className="leads-heading"><h1>Boat Buyers</h1><AccountButton kind="primary" ref={addRef} onClick={() => { triggerRef.current = addRef.current; setEditor({}) }}><Plus size={16} />Add buyer</AccountButton></div>
    <AdminCollectionStats label="Buyer statistics" value={status} items={['', ...buyerStages].map(value => ({ value, label: value || 'All buyers', count: buyers.filter(buyer => !value || buyer.status === value).length }))} onChange={value => { change({ status: value, buyer: null }); setPage(1) }} />
    <section className="leads-list inventory-list buyers-list" aria-label="Boat buyers">
      <div className="leads-toolbar"><div className="leads-tools"><div className="leads-search"><Search size={16} aria-hidden="true" /><input type="search" aria-label="Search buyers" placeholder="Search name, email or phone…" value={search} onChange={event => { setSearch(event.target.value); setPage(1) }} />{search && <AdminActionButton type="button" aria-label="Clear buyer search" onClick={() => { setSearch(''); setPage(1) }}><X size={15} /></AdminActionButton>}</div><AdminCollectionFilters active={Boolean(status || source !== 'All sources')} fields={[{ label: 'Buyer stage', value: status || 'All stages', options: ['All stages', ...buyerStages], onChange: value => { change({ status: value === 'All stages' ? null : value, buyer: null }); setPage(1) } }, { label: 'Source', value: source, options: ['All sources', ...buyerSources], onChange: value => { change({ source: value === 'All sources' ? null : value }); setPage(1) } }]} onClear={() => { change({ status: null, source: null }); setPage(1) }} /></div>
      </div>
      <div className="inventory-table-scroll" role="region" aria-label="Buyer contacts" tabIndex={0}><table className="inventory-table is-buyers"><thead><tr>{['Buyer', 'Contact', 'Source', 'Viewing requests', 'Stage', 'Added'].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead><AdminResultsBody identity={JSON.stringify([status, source, search, currentPage, loading])}>{visible.map(buyer => <motion.tr key={buyer.id} onClick={event => open(buyer, event)} ><td><div className="inventory-person"><Avatar buyer={buyer} /><AdminActionButton type="button" aria-label={'View buyer ' + buyerName(buyer)} onClick={event => { event.stopPropagation(); open(buyer, event) }}>{buyerName(buyer)}</AdminActionButton></div></td><td><span className="buyers-email">{buyer.email}</span><span className="buyers-phone">{buyer.phone || '—'}</span></td><td>{buyer.source}</td><td className="buyers-request-count">{buyer.viewingRequests.length}</td><td><Badge value={buyer.status} /></td><td><time dateTime={buyer.createdAt}>{date(buyer.createdAt)}</time></td></motion.tr>)}</AdminResultsBody></table></div>
      {!rows.length && <motion.div className="leads-empty" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : .3 }}><Search size={25} /><h2>{loading ? 'Loading buyers…' : error ? 'Couldn’t load buyers' : 'No buyers found'}</h2>{error && !loading ? <><p>{error}</p><AccountButton onClick={refresh}>Try again</AccountButton></> : !loading && <><p>Try another name, source or stage.</p><AccountButton onClick={() => { setSearch(''); setPage(1); change({ status: null, source: null }) }}>Clear filters</AccountButton></>}</motion.div>}
      <footer className="leads-pagination"><p role="status">{rows.length ? (currentPage - 1) * PAGE_SIZE + 1 + '–' + Math.min(currentPage * PAGE_SIZE, rows.length) + ' of ' + rows.length + ' buyers' : '0 buyers'}</p><div><AdminActionButton type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft size={16} /></AdminActionButton><span>{currentPage} / {pages}</span><AdminActionButton type="button" aria-label="Next page" disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}><ChevronRight size={16} /></AdminActionButton></div></footer>
    </section>
    <AnimatePresence onExitComplete={() => { if (!selected && !editor) triggerRef.current?.focus({ preventScroll: true }) }}>{selected && <BuyerDrawer key={selected.id} buyer={selected} onClose={() => change({ buyer: null })} onEdit={() => setEditor(selected)} onDelete={remove} onStatus={updateStatus} returnRef={triggerRef} busy={busy} />}{editor && <BuyerEditor key={'buyer-editor-' + (editingBuyer?.id || 'new')} buyer={editingBuyer} onClose={() => setEditor(null)} onSave={save} busy={busy} />}</AnimatePresence>
  </InventoryNoticeContext.Provider>
}
