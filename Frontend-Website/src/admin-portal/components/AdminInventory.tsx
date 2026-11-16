import { useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { Archive, ArrowUpRight, Check, ChevronLeft, ChevronRight, Expand, Mail, MapPin, Pencil, Phone, Plus, RotateCcw, Sailboat, Search, Send, Star, Trash2, Users, X } from 'lucide-react'
import { useBoatListings } from '../../seller-portal/data/useBoatListings'
import { useSellers } from '../../seller-portal/data/useSellers'
import { addListingComment, createSeller, updateListingStatus, updateSeller } from '../../seller-portal/lib/api'
import { completedAdditionalDetails } from '../../seller-portal/lib/additionalDetails'
import { EASE, directionalArrowVariants, inventoryMotion } from '../../seller-portal/lib/motion'
import type { Notice } from '../../seller-portal/components/ToastNotice'
import { deleteBoat, permanentlyDeleteBoat, restoreBoat, updateBoatFeatured, updateBoatSaleStatus } from '../../lib/api'
import { updateSellerStatus } from '../lib/api'
import type { ApiSale } from '../lib/api'
import { getStoredAdmin } from '../lib/session'
import { useSales, invalidateSalesCache } from '../data/useSales'
import { approvalStatuses } from '../lib/adminOverview'
import { activeSaleFor, boatSpecificationGroups, canRequestListingChanges, canReviewListing, featuredRefusal, publicationStatus, sellerStageValue, sellerStages, toInventoryBoat, toInventorySeller } from '../lib/inventory'
import type { Availability, InventoryBoat, InventoryComment, InventoryPhoto, InventorySeller, SellerStage } from '../lib/inventory'
import type { SaleStage } from '../lib/saleRecords'
import SaleRecordModal from './SaleRecordModal'
import '../styles/admin-sales.css'
import { AccountButton, AccountField } from './AdminAccountSettings'
import AdminInfoTooltip from './AdminInfoTooltip'
import InventoryActionMenu from './InventoryActionMenu'
import BoatSpecificationGroup from './BoatSpecificationGroup'
import { AdminCollectionStats, AdminCollectionFilters } from './AdminCollectionControls'
import ContactRow from './AdminContactRow'
import AdminRecordOverlay from './AdminRecordOverlay'
import AdminSelectField from './AdminSelectField'
import { BoatPicture as Picture } from './BoatPicture'
import { InventoryNoticeContext } from '../context/InventoryNoticeContext'
import { AdminActionButton, AdminResultsBody } from './AdminInteraction'
import '../styles/admin-leads.css'
import '../styles/admin-inventory.css'

// Ported from boat-brokers/src/components/AdminInventory.jsx. Markup, classes,
// copy and motion follow the prototype; records and mutations are the live
// listing/seller/boat APIs (see lib/inventory.ts for the workflow mapping).
// There is no separate publish flag, so Publish/Unpublish and the submitted-
// changes comparison (no stored approved version) are not shown.

type BoatAction = 'archive' | 'restore' | 'approve' | 'request-changes' | 'delete'

const money = (value: number | null) => value == null ? 'Price not set' : new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(value)
const date = (value: string | null | undefined) => value ? new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not recorded'
const PAGE_SIZE = 8
const wordmark = '/seller-portal-assets/boat-brokers-wordmark-blue.png'
const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'Please try again.'
const initialsOf = (name: string) => name.replace(/^The\s+/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join('')

function Badge({ children }: { children: string }) { return <span className={`inventory-badge is-${children.toLowerCase().replaceAll(' ', '-')}`}>{children}</span> }
function PartyIdentity({ name = 'Not recorded', email, children }: { name?: string; email?: string; children?: ReactNode }) {
  return <div className="inventory-person"><span className="lead-avatar" aria-hidden="true">{initialsOf(name)}</span><div>{children || <strong>{name}</strong>}{email && <span>{email}</span>}</div></div>
}
function SellerIdentity({ seller, email = false, children }: { seller?: InventorySeller; email?: boolean; children?: ReactNode }) {
  return <PartyIdentity name={seller?.name || 'Seller not recorded'} email={email ? seller?.email : undefined}>{children}</PartyIdentity>
}
function BoatPreview({ boat, onClick }: { boat: InventoryBoat; onClick: () => void }) {
  const publication = publicationStatus(boat)
  return <div className="inventory-seller-boats"><AdminActionButton aria-label={'View boat ' + boat.name} onClick={onClick}><Picture image={boat.photos[0]?.src} /><span><strong>{boat.name}</strong><span>{money(boat.price)} · Approval: {boat.approval}</span></span><span className={'inventory-badge is-' + publication.toLowerCase().replaceAll(' ', '-')}>{publication}</span><ChevronRight size={15} aria-hidden="true" /></AdminActionButton></div>
}

function SharedComment({ comment, seller }: { comment: InventoryComment; seller: InventorySeller }) {
  const broker = !comment.fromSeller
  const initials = comment.author.split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join('')
  const tones = ['ice', 'slate', 'mist']
  const hash = [...comment.author].reduce((total, letter) => total + letter.charCodeAt(0), 0)
  const tone = broker ? 'ocean' : comment.author === seller.name ? 'slate' : tones[hash % tones.length]
  const reduced = useReducedMotion()
  return <motion.article initial={reduced ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ ...inventoryMotion.row, duration: reduced ? 0 : inventoryMotion.row.duration }} className={`inventory-comment is-${tone} ${broker ? 'is-own' : ''}`}>
    <span className="inventory-comment-avatar" aria-hidden="true">{broker ? <img src={wordmark} alt="" /> : initials}</span>
    <div className="inventory-comment-content"><div className="inventory-comment-meta"><strong>{comment.author}</strong><time dateTime={comment.at}>{date(comment.at)}</time></div><p>{comment.text}</p></div>
  </motion.article>
}

type SellerValues = { name: string; email: string; phone: string; location: string; password: string }
type SellerKey = keyof SellerValues

export function SellerForm({ seller, onClose, onSave }: { seller: InventorySeller | null; onClose: () => void; onSave: (values: SellerValues) => Promise<boolean> }) {
  const [values, setValues] = useState<SellerValues>({ name: seller?.name ?? '', email: seller?.email ?? '', phone: seller?.phone ?? '', location: seller?.location ?? '', password: '' })
  const [errors, setErrors] = useState<Partial<Record<SellerKey, string>>>({})
  const [busy, setBusy] = useState(false)
  const firstRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  // The API has no seller source field; account creation needs a password instead.
  const fields: [SellerKey, string, string][] = [['name', 'Seller name', 'e.g. Alex Morgan'], ['email', 'Email address', 'e.g. alex@example.com'], ['phone', 'Phone number', 'e.g. 07700 900123'], ['location', 'Location', 'City or region'], ['password', seller ? 'New password' : 'Password', seller ? 'Leave blank to keep the current password' : 'At least 8 characters']]
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    const errors: Partial<Record<SellerKey, string>> = {}
    if (!values.name.trim()) errors.name = 'Enter a seller name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Enter a valid email address.'
    if ((!seller || values.password) && values.password.length < 8) errors.password = 'Use at least 8 characters.'
    setErrors(errors)
    if (Object.keys(errors).length) { requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()); return }
    setBusy(true)
    const saved = await onSave({ name: values.name.trim(), email: values.email.trim(), phone: values.phone.trim(), location: values.location.trim(), password: values.password })
    if (!saved) setBusy(false)
  }
  return <AdminRecordOverlay modal title={seller ? 'Edit seller' : 'Add seller'} subject={seller?.name} onClose={onClose} initialFocusRef={firstRef} footer={<><AccountButton onClick={onClose}>Cancel</AccountButton><AccountButton kind="primary" type="submit" form="inventory-seller-form" disabled={busy}>{seller ? 'Save changes' : 'Add seller'}</AccountButton></>}>
    <form id="inventory-seller-form" ref={formRef} noValidate onSubmit={save}><div className="v2-settings-fields">{fields.map(([key, label, placeholder], index) => <AccountField key={key} ref={index === 0 ? firstRef : undefined} label={label} type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'} secret={key === 'password'} autoComplete={key === 'password' ? 'new-password' : undefined} value={values[key]} required={key === 'name' || key === 'email' || (key === 'password' && !seller)} error={errors[key]} placeholder={placeholder} onChange={event => { setValues(current => ({ ...current, [key]: event.target.value })); setErrors(current => ({ ...current, [key]: '' })) }} />)}</div></form>
  </AdminRecordOverlay>
}

export function BoatActionModal({ boat, action, onClose, onConfirm }: { boat: InventoryBoat; action: BoatAction; onClose: () => void; onConfirm: (payload: { comment?: string }) => Promise<boolean> }) {
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const keepRef = useRef<HTMLButtonElement>(null)
  const approved = boat.status === 'APPROVED'
  const titles: Record<BoatAction, string> = { archive: 'Archive listing?', restore: 'Restore listing?', approve: 'Approve listing?', 'request-changes': 'Request changes', delete: 'Delete listing permanently?' }
  async function confirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    if (action === 'request-changes' && !comment.trim()) { setError('Explain what needs to change.'); return }
    setBusy(true)
    if (!await onConfirm(action === 'request-changes' ? { comment: comment.trim() } : {})) setBusy(false)
  }
  const actionInfo = action === 'request-changes' ? `${boat.published ? 'This boat will be unpublished until it is approved again.' : 'This boat stays unpublished.'} Your feedback is shared with the seller and admins.` : undefined
  const confirmLabel: Record<BoatAction, string> = { archive: 'Archive listing', restore: 'Restore listing', approve: 'Approve & publish', 'request-changes': 'Send changes required', delete: 'Delete permanently' }
  return <AdminRecordOverlay modal noClose title={titles[action]} subject={boat.name} info={actionInfo} initialFocusRef={keepRef} onClose={onClose} footer={<><AccountButton ref={keepRef} onClick={onClose}>Cancel</AccountButton><AccountButton kind="primary" type="submit" form="inventory-boat-action" disabled={busy}>{confirmLabel[action]}</AccountButton></>}>
    <form id="inventory-boat-action" onSubmit={confirm} noValidate className="inventory-action-form">
      {action === 'archive' && <><p>This listing will move to Archived and will no longer appear on the public boats-for-sale page.</p><ul><li>The seller, boat details, comments and history are retained.</li><li>Sale status and any recorded sale are not erased.</li><li>{approved ? 'Restoring it republishes the last approved version, not unapproved changes.' : 'It has never been approved; restoring it will not publish it.'}</li></ul></>}
      {action === 'restore' && <p>{approved ? `The last approved version will return to public view as ${boat.availability.toLowerCase()}. Unapproved changes will stay unpublished.` : 'The listing will return to its previous review stage. It must be submitted and approved before becoming public.'}</p>}
      {action === 'approve' && <p>Approve this submission and publish it on Boats for sale.</p>}
      {action === 'delete' && <><p>This permanently removes the boat, its photos, listing and shared comments. It cannot be undone.</p><ul><li>Boats with a recorded sale cannot be permanently deleted.</li></ul></>}
      {action === 'request-changes' && <AccountField label="Required changes" multiline rows={4} value={comment} required maxLength={2000} placeholder="Explain what needs to be added or corrected…" error={error} onChange={event => { setComment(event.target.value); setError('') }} />}
    </form>
  </AdminRecordOverlay>
}

export function SellerDrawer({ seller, boats, behind, onClose, onBoat, onEdit, onAddBoat, onStatus }: { seller: InventorySeller; boats: InventoryBoat[]; behind?: boolean; onClose: () => void; onBoat: (id: string) => void; onEdit: () => void; onAddBoat: () => void; onStatus: (status: SellerStage) => void }) {
  return <AdminRecordOverlay title={seller.name} avatar={initialsOf(seller.name)} eyebrow={`Seller / ${seller.code}`} behind={behind} onClose={onClose} footer={<><div className="admin-stage-footer"><span>Seller stage</span><AdminSelectField label="Seller stage" labelHidden variant="v2" value={seller.status} options={sellerStages} onChange={event => { if (event.target.value !== seller.status) onStatus(event.target.value as SellerStage) }} /></div><AccountButton onClick={onEdit}><Pencil size={15} />Edit seller</AccountButton><AccountButton kind="primary" onClick={onAddBoat}><Plus size={16} />Add boat</AccountButton></>}>
    <section className="inventory-detail-section"><h3>Contact information</h3><dl className="inventory-contact-details"><ContactRow icon={Mail} label="Email address" value={seller.email} kind="email" /><ContactRow icon={Phone} label="Phone number" value={seller.phone} kind="phone" /><ContactRow icon={MapPin} label="Location" value={seller.location} /></dl></section>
    <p className="inventory-muted">Joined {date(seller.joined)}</p>
    <section className="inventory-detail-section"><div className="inventory-section-heading"><h3>Boats</h3><span>{boats.length}</span></div>{boats.length ? <div>{boats.map(boat => <BoatPreview key={boat.id} boat={boat} onClick={() => onBoat(boat.id)} />)}</div> : <p className="inventory-muted">No boats listed yet.</p>}</section>
  </AdminRecordOverlay>
}

function BoatGallery({ photos, boat, expanded = false, initialActive = 0 }: { photos: InventoryPhoto[]; boat: InventoryBoat; expanded?: boolean; initialActive?: number }) {
  const [active, setActive] = useState(initialActive)
  const [direction, setDirection] = useState(1)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const dragStart = useRef<{ x: number; y: number } | null>(null)
  const reduced = useReducedMotion()
  const current = photos[active] || photos[0]
  function select(index: number, nextDirection = index > active ? 1 : -1) { setDirection(nextDirection); setActive(index) }
  function step(delta: number) { if (photos.length > 1) select((active + delta + photos.length) % photos.length, delta) }
  return <div className="inventory-gallery" role="group" aria-label="Boat photo gallery">
    <div className="inventory-gallery-main" tabIndex={photos.length > 1 ? 0 : undefined} aria-label="Boat photos. Use left and right arrow keys or swipe to browse."
      onKeyDown={event => { if (event.target === event.currentTarget && ['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); step(event.key === 'ArrowRight' ? 1 : -1) } }}
      onPointerDown={event => { if (photos.length < 2 || event.button !== 0 || (event.target as Element).closest('button')) return; dragStart.current = { x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId) }}
      onPointerUp={event => { if (!dragStart.current) return; const x = event.clientX - dragStart.current.x; const y = event.clientY - dragStart.current.y; dragStart.current = null; if (Math.abs(x) > 56 && Math.abs(x) > Math.abs(y) * 1.2) step(x < 0 ? 1 : -1) }}
      onPointerCancel={() => { dragStart.current = null }}>
      <AnimatePresence initial={false} custom={direction}><motion.div className="inventory-gallery-slide" key={current?.src || 'empty'} custom={direction} initial={reduced ? false : 'enter'} animate="center" exit="exit" variants={{ enter: (delta: number) => ({ x: `${delta * 100}%` }), center: { x: '0%' }, exit: (delta: number) => ({ x: `${delta * -100}%` }) }} transition={{ duration: reduced ? 0 : .32, ease: EASE }}><Picture image={current?.src} className="inventory-hero-picture" alt={current?.name || boat.name} /></motion.div></AnimatePresence>
      {photos.length > 0 && <><span className="inventory-gallery-count" role="status">{active + 1} / {photos.length}</span>{!expanded && <motion.button className="inventory-gallery-expand" type="button" aria-label="Open photo gallery" onClick={() => setGalleryOpen(true)} whileTap={reduced ? undefined : { scale: .94 }}><Expand size={20} strokeWidth={1.5} /></motion.button>}</>}
      {photos.length > 1 && <div className="inventory-gallery-navigation">{[-1, 1].map(delta => <motion.button key={delta} type="button" aria-label={delta < 0 ? 'Previous photo' : 'Next photo'} onClick={() => step(delta)} initial="rest" animate="rest" whileHover="hover" whileFocus="hover" whileTap={reduced ? undefined : { scale: .94 }}><motion.span variants={directionalArrowVariants(reduced, delta < 0 ? 'left' : 'right')} transition={inventoryMotion.interaction}>{delta < 0 ? <ChevronLeft size={19} /> : <ChevronRight size={19} />}</motion.span></motion.button>)}</div>}
    </div>
    {photos.length > 1 && <div className="inventory-gallery-thumbnails">{photos.map((photo, index) => <motion.button key={photo.src + index} type="button" aria-label={`Show photo ${index + 1}: ${photo.name || boat.name}`} aria-pressed={index === active} onClick={() => select(index)} whileTap={reduced ? undefined : { scale: .96 }} animate={{ opacity: index === active ? 1 : .7 }} whileHover={{ opacity: 1 }} whileFocus={{ opacity: 1 }} transition={inventoryMotion.interaction}><Picture image={photo.src} /></motion.button>)}</div>}
    <AnimatePresence>{galleryOpen && <AdminRecordOverlay modal title={`${boat.name} photos`} onClose={() => setGalleryOpen(false)}><BoatGallery photos={photos} boat={boat} expanded initialActive={active} /></AdminRecordOverlay>}</AnimatePresence>
  </div>
}
function BoatSpecifications({ details }: { details: Record<string, unknown> }) {
  const additional = completedAdditionalDetails(details.additionalDetails)
  const groups: [string, [string, string, string?][]][] = [...boatSpecificationGroups, ...(additional.length ? [['Additional details', additional.map((item, index): [string, string] => [`additional-${index}`, item.name])] as [string, [string, string][]]] : [])]
  const values: Record<string, unknown> = { ...details, ...Object.fromEntries(additional.map((item, index) => [`additional-${index}`, item.description])) }
  return <section className="inventory-detail-section"><h3>Specifications</h3><dl className="inventory-specs">{[['builder', 'Hull builder'], ['year', 'Year built'], ['boatType', 'Boat type']].map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{String(values[key] || '') || 'Not provided'}</dd></div>)}</dl>
    <div className="inventory-specification-groups">{groups.map(([title, fields]) => <BoatSpecificationGroup key={title} title={title} fields={fields} data={values} />)}</div>
  </section>
}
function BoatMedia({ boat }: { boat: InventoryBoat }) {
  const reduced = useReducedMotion()
  const links: Record<string, string> = { videoUrl: boat.details.videoUrl, virtualTourUrl: boat.details.virtualTourUrl, brochureUrl: boat.brochureUrl ?? '' }
  const media = [['videoUrl', 'Video walkthrough'], ['virtualTourUrl', 'Virtual tour'], ['brochureUrl', 'Boat brochure']].filter(([key]) => /^(https?:\/\/|\/)/i.test(links[key] || ''))
  return <section className="inventory-detail-section"><h3>Media &amp; documents</h3><div className="inventory-media">
    {media.map(([key, label]) => <motion.a key={key} href={links[key]} target="_blank" rel="noreferrer" initial="rest" animate="rest" whileHover="hover" whileFocus="hover" whileTap={reduced ? undefined : { scale: inventoryMotion.pressScale }}><span>{label}</span><motion.span variants={directionalArrowVariants(reduced)} transition={inventoryMotion.interaction}><ArrowUpRight size={17} aria-hidden="true" /></motion.span></motion.a>)}
    {!media.length && <p className="inventory-muted">No additional media or documents have been supplied.</p>}
  </div></section>
}

type BoatDrawerProps = {
  boat: InventoryBoat
  seller: InventorySeller
  activeSale: ApiSale | null
  hasSaleHistory: boolean
  behind?: boolean
  onClose: () => void
  onSeller: () => void
  onAction: (action: BoatAction) => void
  onAvailability: (value: Availability) => void
  onComment: (message: string) => Promise<boolean>
  onSale: (id: number) => void
  onRecordSale?: (stage: SaleStage) => void
}

export function BoatDrawer({ boat, seller, activeSale, hasSaleHistory, onClose, onSeller, onAction, onAvailability, onComment, onSale, onRecordSale, behind = false }: BoatDrawerProps) {
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const commentsRef = useRef<HTMLElement>(null)
  const details: Record<string, unknown> = { ...boat.details, boatName: boat.name, boatType: boat.type }
  const approved = boat.status === 'APPROVED'
  const canReview = canReviewListing(boat)
  const canRequestChanges = canRequestListingChanges(boat)
  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!message.trim() || sending) return
    setSending(true)
    if (await onComment(message.trim())) setMessage('')
    setSending(false)
  }
  return <AdminRecordOverlay behind={behind} title={boat.name} eyebrow={`Boat / ${boat.code}`} headerExtra={<dl className="inventory-header-statuses"><div><dt>Approval</dt><dd><Badge>{boat.approval}</Badge></dd></div><div><dt>Publication</dt><dd><Badge>{publicationStatus(boat)}</Badge></dd></div>{approved && <div><dt>Sale status</dt><dd><Badge>{boat.availability}</Badge></dd></div>}</dl>} onClose={onClose} footer={<div className="inventory-workflow-footer">
      {!boat.archived && approved && !activeSale && <div className="inventory-footer-sale"><span>Sale status</span><div className="sales-availability-actions"><AdminSelectField label="Sale status" labelHidden variant="v2" value={boat.availability} options={boat.published && boat.availability !== 'Sold' ? ['Available', 'Under offer'] : boat.availability === 'Sold' ? [] : [boat.availability]} footerAction={onRecordSale ? { label: 'Record sale', onSelect: () => onRecordSale(boat.availability === 'Sold' ? 'Completed' : 'Current') } : undefined} onChange={event => { if (event.target.value !== boat.availability) onAvailability(event.target.value as Availability) }} /></div></div>}
      <InventoryActionMenu items={[
        { label: 'Edit listing', icon: Pencil, disabled: boat.archived, onSelect: () => navigate(`/boats/new/review?draft=${boat.id}`) },
        { label: boat.archived ? 'Restore listing' : 'Archive listing', icon: boat.archived ? RotateCcw : Archive, onSelect: () => onAction(boat.archived ? 'restore' : 'archive') },
        ...(boat.archived ? [{ label: 'Delete permanently', icon: Trash2, onSelect: () => onAction('delete') }] : []),
      ]} />
      <div className="inventory-footer-main">
        {activeSale && <AccountButton onClick={() => onSale(activeSale.id)}>View sale</AccountButton>}
        {boat.archived ? <AccountButton kind="primary" onClick={() => onAction('restore')}><RotateCcw size={15} />Restore listing</AccountButton> : <>
          {canRequestChanges && <AccountButton onClick={() => onAction('request-changes')}>Request changes</AccountButton>}
          {canReview && <AccountButton kind="primary" onClick={() => onAction('approve')}><Check size={15} />Approve &amp; publish</AccountButton>}
          {boat.status === 'REJECTED' && <AccountButton onClick={() => { commentsRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' }); commentsRef.current?.focus({ preventScroll: true }) }}>View requested changes</AccountButton>}
        </>}
      </div>
    </div>}>
    <div className="inventory-drawer-overview"><BoatGallery photos={boat.photos} boat={boat} /><div className="inventory-boat-summary"><div><p>{boat.type || 'Boat'}</p><strong>{money(boat.price)}</strong></div></div></div>

    {boat.availability === 'Sold' && !hasSaleHistory && <p className="inventory-muted">This boat is marked Sold, but its transaction details have not been recorded.</p>}
    <section className="inventory-detail-section"><h3>Overview</h3><p className="inventory-overview">{String(details.overview || '') || 'An overview has not been provided for this vessel.'}</p></section>
    <BoatSpecifications details={details} />
    <BoatMedia boat={boat} />
    <section className="inventory-detail-section"><h3>Seller</h3><AdminActionButton type="button" className="inventory-seller-link" onClick={onSeller}><SellerIdentity seller={seller} email /><ArrowUpRight size={16} /></AdminActionButton><dl className="inventory-contact-details inventory-listing-contact"><ContactRow icon={Mail} label="Listing email" value={boat.details.email} kind="email" /><ContactRow icon={Phone} label="Listing phone" value={boat.details.phone} kind="phone" /></dl><dl className="inventory-specs inventory-listing-preferences">{[['contactName', 'Listing contact'], ['sellerType', 'Seller type'], ['city', 'City'], ['sellTimeline', 'Selling timeline'], ['contactTime', 'Preferred contact time'], ['notes', 'Additional notes']].map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{String(details[key] || '') || 'Not provided'}</dd></div>)}</dl></section>
    <section className="inventory-detail-section" ref={commentsRef} tabIndex={-1}><div className="inventory-comments-heading"><h3>Shared comments</h3><AdminInfoTooltip label="Who can see these comments?">Visible to all admins and this seller.</AdminInfoTooltip></div><div className="inventory-comments">{boat.comments.length ? boat.comments.map(comment => <SharedComment key={comment.id} comment={comment} seller={seller} />) : <p className="inventory-muted">No comments yet.</p>}</div><form className="inventory-comment-composer" onSubmit={send}><AccountField multiline label="Add a comment" value={message} maxLength={2000} placeholder="Write a note for the seller and team…" onChange={event => setMessage(event.target.value)} /><AccountButton kind="primary" className="inventory-comment-send" type="submit" aria-label="Send comment" disabled={!message.trim() || sending}><Send size={18} aria-hidden="true" /></AccountButton></form></section>
    <section className="inventory-detail-section"><h3>Activity</h3><p className="inventory-muted">Submitted {date(boat.submittedAt)}.</p></section>
  </AdminRecordOverlay>
}

export default function AdminInventory({ onNotice, notice, onDismissNotice }: { onNotice: (notice: Notice) => void; notice: Notice | null; onDismissNotice: () => void }) {
  const reduced = useReducedMotion()
  const { listings, loading: listingsLoading, error: listingsError, refetch: refetchListings } = useBoatListings()
  const { sellers: apiSellers, loading: sellersLoading, error: sellersError, refetch: refetchSellers } = useSellers()
  const { sales, refetch: refetchSales } = useSales()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sellerForm, setSellerForm] = useState<InventorySeller | Record<string, never> | null>(null)
  const [profileSellerId, setProfileSellerId] = useState<string | null>(null)
  const [action, setAction] = useState<BoatAction | null>(null)
  const [saleForm, setSaleForm] = useState<SaleStage | null>(null)
  const adminBoats = useMemo(() => listings.map(toInventoryBoat), [listings])
  const sellers = useMemo(() => apiSellers.map(toInventorySeller), [apiSellers])
  const view = params.get('view') === 'sellers' ? 'sellers' : 'boats'
  const loading = view === 'boats' ? listingsLoading : sellersLoading
  const loadError = view === 'boats' ? listingsError : sellersError
  const rawStatus = params.get('status') || ''
  const review = rawStatus === 'In review' ? 'Awaiting review' : rawStatus
  const status = (view === 'boats' ? approvalStatuses as string[] : sellerStages as string[]).includes(review) ? review : ''
  const publication = params.get('publication') || (rawStatus === 'Live' ? 'Published' : rawStatus === 'Archived' ? 'Archived' : 'All publications')
  const availabilityParam = params.get('availability') || ''
  const saleFilter = ['Available', 'Under offer', 'Sold'].includes(availabilityParam) ? availabilityParam : ['Under offer', 'Sold'].includes(rawStatus) ? rawStatus : ''
  const sellerFor = (boat: InventoryBoat) => sellers.find(item => item.id === boat.sellerId) ?? boat.seller
  const seller = sellers.find(item => item.id === params.get('seller'))
  const boat = adminBoats.find(item => item.id === params.get('boat'))
  const profileSeller = sellers.find(item => item.id === profileSellerId)
  const boatSeller = boat && sellerFor(boat)
  const query = search.toLowerCase().trim()
  const filteredBoats = adminBoats.filter(item => (!status || item.approval === status) && (publication === 'All publications' || publicationStatus(item) === publication) && (!saleFilter || (item.status === 'APPROVED' && item.availability === saleFilter)) && [item.name, item.type, sellerFor(item).name].some(value => value?.toLowerCase().includes(query)))
  const filteredSellers = sellers.filter(item => (!status || item.status === status) && [item.name, item.email, item.phone, item.location].some(value => value.toLowerCase().includes(query)))
  const rows = view === 'boats' ? filteredBoats : filteredSellers
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const activePage = Math.min(page, pages)
  const visibleBoats = filteredBoats.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE)
  const visibleSellers = filteredSellers.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE)
  function change(values: Record<string, string | null>) { const next = new URLSearchParams(params); for (const [key, value] of Object.entries(values)) { if (value) next.set(key, value); else next.delete(key) } setParams(next, { replace: true }) }
  function changeView(value: string) { change({ view: value === 'boats' ? null : value, status: null, seller: null, boat: null, publication: null, availability: null, sale: null }); setPage(1); setSearch('') }
  function open(key: string, id: string) { change({ [key]: id }) }
  // Overview and every other admin screen read the same module caches, so a
  // refetch after each mutation keeps them current.
  function refresh(...targets: ('listings' | 'sellers')[]) {
    if (targets.includes('listings')) refetchListings()
    if (targets.includes('sellers')) refetchSellers()
  }
  async function attempt(task: () => Promise<unknown>, success: Notice | null, ...targets: ('listings' | 'sellers')[]) {
    try {
      await task()
      refresh(...targets)
      if (success) onNotice(success)
      return true
    } catch (error) {
      onNotice({ type: 'error', title: 'Changes not saved', description: errorMessage(error) })
      return false
    }
  }
  async function saveSeller(values: SellerValues) {
    const editing = sellerForm && 'id' in sellerForm ? sellerForm as InventorySeller : null
    let id = editing?.id ?? ''
    const saved = await attempt(async () => {
      const payload = { name: values.name, email: values.email, phone: values.phone || undefined, location: values.location || undefined }
      if (editing) await updateSeller(editing.apiId, { ...payload, ...(values.password ? { password: values.password } : {}) })
      else id = String((await createSeller({ ...payload, password: values.password })).id)
    }, { type: 'success', title: editing ? 'Seller updated' : 'Seller added', description: `${values.name}’s details have been saved.` }, 'sellers', 'listings')
    if (!saved) return false
    setSellerForm(null)
    if (!profileSellerId) change({ seller: id })
    return true
  }
  function setSellerStage(target: InventorySeller, stage: SellerStage) {
    void attempt(() => updateSellerStatus(target.apiId, sellerStageValue[stage]), { type: 'success', title: 'Seller stage updated', description: `${target.name} is now ${stage.toLowerCase()}.` }, 'sellers')
  }
  async function perform(payload: { comment?: string }) {
    if (!boat || !action) return false
    const admin = getStoredAdmin()?.name || 'Admin'
    const tasks: Record<BoatAction, () => Promise<unknown>> = {
      approve: () => updateListingStatus(boat.listingId, 'APPROVED'),
      'request-changes': async () => { await updateListingStatus(boat.listingId, 'REJECTED'); await addListingComment(boat.listingId, payload.comment ?? '', admin, { fromSeller: false }) },
      archive: () => deleteBoat(boat.boatId),
      restore: () => restoreBoat(boat.boatId),
      delete: () => permanentlyDeleteBoat(boat.boatId),
    }
    const notices: Record<BoatAction, Notice> = {
      approve: { type: 'success', title: 'Listing approved', description: 'The listing is approved and published on Boats for sale.' },
      'request-changes': { type: 'success', title: 'Changes requested', description: 'Your feedback is shared with the seller and all admins.' },
      archive: { type: 'success', title: 'Listing archived', description: 'Removed from public view. Details and history are retained.' },
      restore: { type: 'success', title: 'Listing restored', description: boat.status === 'APPROVED' ? 'The last approved version is public again.' : 'Restored without publishing.' },
      delete: { type: 'success', title: 'Listing deleted', description: `${boat.name} has been permanently removed.` },
    }
    const done = await attempt(tasks[action], notices[action], 'listings')
    if (!done) return false
    if (action === 'delete') change({ boat: null })
    setAction(null)
    return true
  }
  function toggleFeatured(item: InventoryBoat) {
    const refusal = featuredRefusal(item, adminBoats)
    if (refusal) { onNotice({ type: 'warning', title: 'Not marked as featured', description: refusal }); return }
    void attempt(() => updateBoatFeatured(item.boatId, !item.featured), { type: 'success', title: item.featured ? 'Removed from featured' : 'Marked as featured', description: item.name }, 'listings')
  }
  function setAvailability(target: InventoryBoat, value: Availability) {
    void attempt(() => updateBoatSaleStatus(target.boatId, { isSold: false, isUnderOffer: value === 'Under offer' }), { type: 'success', title: 'Sale status updated', description: `${target.name} is now ${value.toLowerCase()}. Publication is unchanged.` }, 'listings')
  }
  function comment(target: InventoryBoat, message: string) {
    return attempt(() => addListingComment(target.listingId, message, getStoredAdmin()?.name || 'Admin', { fromSeller: false }), null, 'listings')
  }
  const countLoading = view === 'boats' ? listingsLoading && !listings.length : sellersLoading && !apiSellers.length
  const filterItems = ['', ...(view === 'boats' ? approvalStatuses : sellerStages)].map(value => ({ value, label: value || (view === 'boats' ? 'All boats' : 'All sellers'), count: countLoading ? '—' : view === 'boats' ? adminBoats.filter(item => !value || item.approval === value).length : sellers.filter(item => !value || item.status === value).length }))
  return <InventoryNoticeContext.Provider value={{ notice, onClose: onDismissNotice }}>
    <div className="leads-heading"><h1>Boats &amp; Sellers</h1>{view === 'sellers' && <AccountButton kind="primary" onClick={() => setSellerForm({})}><Plus size={16} />Add seller</AccountButton>}</div>
    <AdminCollectionStats label={view === 'boats' ? 'Boat statistics' : 'Seller statistics'} items={filterItems} value={status} onChange={value => { change({ status: value }); setPage(1) }} />
    <LayoutGroup id="inventory-view-switch"><div className="inventory-view-switch" role="tablist" aria-label="View records by" onKeyDown={event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
      event.preventDefault()
      const nextView = event.key === 'Home' ? 'boats' : event.key === 'End' ? 'sellers' : view === 'boats' ? 'sellers' : 'boats'
      changeView(nextView)
      event.currentTarget.querySelector<HTMLElement>(`#inventory-tab-${nextView}`)?.focus()
    }}>
      {['boats', 'sellers'].map(value => <motion.button key={value} id={`inventory-tab-${value}`} type="button" role="tab" aria-selected={view === value} aria-controls="inventory-records" tabIndex={view === value ? 0 : -1} onClick={() => changeView(value)} whileTap={reduced ? undefined : { scale: .98 }} transition={{ ...inventoryMotion.interaction, duration: reduced ? 0 : inventoryMotion.interaction.duration }}>{view === value && <motion.span className="inventory-tab-selection" aria-hidden="true" layoutId={reduced ? undefined : 'inventory-folder-selection'} initial={false} transition={{ ...inventoryMotion.indicator, duration: reduced ? 0 : inventoryMotion.indicator.duration }} />}{value === 'boats' ? <Sailboat size={17} aria-hidden="true" /> : <Users size={17} aria-hidden="true" />}{value === 'boats' ? 'Boats' : 'Sellers'}</motion.button>)}
    </div></LayoutGroup>

    <section id="inventory-records" className="leads-list inventory-list" role="tabpanel" aria-labelledby={`inventory-tab-${view}`}>
      <div className="leads-toolbar">
        <div className="inventory-search-row">
          <div className="leads-search inventory-search"><Search size={16} aria-hidden="true" /><input type="search" aria-label={`Search ${view}`} placeholder={view === 'boats' ? 'Search boats or sellers…' : 'Search name, email or location…'} value={search} onChange={event => { setSearch(event.target.value); setPage(1) }} />{search && <AdminActionButton type="button" aria-label="Clear search" onClick={() => setSearch('')}><X size={15} /></AdminActionButton>}</div>
          <AdminCollectionFilters active={Boolean(status || saleFilter || (view === 'boats' && publication !== 'All publications'))} fields={[{ label: view === 'boats' ? 'Approval status' : 'Seller stage', value: status || 'All stages', options: ['All stages', ...(view === 'boats' ? approvalStatuses : sellerStages)], onChange: value => { change({ status: value === 'All stages' ? null : value }); setPage(1) } }, ...(view === 'boats' ? [{ label: 'Publication', value: publication, options: ['All publications', 'Published', 'Not published', 'Archived'], onChange: (value: string) => { change({ publication: value === 'All publications' ? null : value, ...(['Live', 'Archived'].includes(rawStatus) ? { status: null } : {}) }); setPage(1) } }, { label: 'Sale status', value: saleFilter || 'All sale statuses', options: ['All sale statuses', 'Available', 'Under offer', 'Sold'], onChange: (value: string) => { change({ availability: value === 'All sale statuses' ? null : value, ...(['Under offer', 'Sold'].includes(rawStatus) ? { status: null } : {}) }); setPage(1) } }] : [])]} onClear={() => { change({ status: null, publication: null, availability: null, sale: null }); setPage(1) }} />
        </div>
      </div>

      <div className="inventory-table-scroll" role="region" aria-label={`${view} results`} tabIndex={0}>
        <table className={`inventory-table is-${view}`}>
          <thead><tr>{(view === 'boats' ? ['Boat', 'Seller', 'Asking price', 'Approval', 'Publication', 'Sale status'] : ['Seller', 'Boats', 'Stage']).map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead>
          <AdminResultsBody identity={JSON.stringify([view, status, publication, saleFilter, search, activePage, loading])}>{view === 'boats' ? visibleBoats.map(item => <motion.tr key={item.id} whileHover={{ backgroundColor: '#f1f6fa' }} transition={{ ...inventoryMotion.row, duration: reduced ? 0 : inventoryMotion.row.duration }} onClick={event => { if (!(event.target as Element).closest('[data-sale-status]')) open('boat', item.id) }}>
            <td><div className="inventory-row-boat"><AdminInfoTooltip className="inventory-feature-tooltip" icon={Star} label={(item.featured ? 'Remove featured: ' : 'Mark as featured: ') + item.name} pressed={item.featured} action={event => { event.stopPropagation(); toggleFeatured(item) }}>{item.featured ? 'Remove from featured boats.' : 'Mark this boat as featured.'}</AdminInfoTooltip><Picture image={item.photos[0]?.src} /><div><AdminActionButton type="button" aria-label={`View boat ${item.name}`} onClick={event => { event.stopPropagation(); open('boat', item.id) }}>{item.name}</AdminActionButton><span>{item.type}</span></div></div></td>
            <td><SellerIdentity seller={sellerFor(item)} /></td>
            <td className="inventory-price">{money(item.price)}</td>
            <td><Badge>{item.approval}</Badge></td>
            <td><Badge>{publicationStatus(item)}</Badge></td><td data-sale-status style={{ cursor: 'default' }}><Badge>{item.status === 'APPROVED' ? item.availability : 'Not available'}</Badge></td>
          </motion.tr>) : visibleSellers.map(item => <motion.tr key={item.id} whileHover={{ backgroundColor: '#f1f6fa' }} transition={{ ...inventoryMotion.row, duration: reduced ? 0 : inventoryMotion.row.duration }} onClick={() => open('seller', item.id)}>
            <td><SellerIdentity seller={item} email><AdminActionButton type="button" className="inventory-seller-name" aria-label={`View seller ${item.name}`} onClick={event => { event.stopPropagation(); open('seller', item.id) }}>{item.name}</AdminActionButton></SellerIdentity></td>
            <td>{adminBoats.filter(boat => boat.sellerId === item.id).length}</td><td><Badge>{item.status}</Badge></td>
          </motion.tr>)}</AdminResultsBody>
        </table>
      </div>
      {!rows.length && (loading || loadError ? <motion.div className="leads-empty" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : .3 }}>{view === 'boats' ? <Sailboat size={25} /> : <Users size={25} />}<h2>{loading ? `Loading ${view}…` : `Couldn’t load ${view}`}</h2>{loadError && !loading && <><p>{loadError}</p><AccountButton onClick={() => refresh(view === 'boats' ? 'listings' : 'sellers')}>Try again</AccountButton></>}</motion.div> : <motion.div className="leads-empty" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : .3 }}><Search size={25} /><h2>No {view} found</h2><p>Try another search or filter.</p><AccountButton onClick={() => { setSearch(''); change({ status: null, publication: null, availability: null, sale: null }) }}>Clear filters</AccountButton></motion.div>)}
      <footer className="leads-pagination"><p role="status">{rows.length ? `${(activePage - 1) * PAGE_SIZE + 1}–${Math.min(activePage * PAGE_SIZE, rows.length)} of ${rows.length} ${view}` : `0 ${view}`}</p><div><AdminActionButton type="button" aria-label="Previous page" disabled={activePage === 1} onClick={() => setPage(activePage - 1)}><ChevronLeft size={16} /></AdminActionButton><span>{activePage} / {pages}</span><AdminActionButton type="button" aria-label="Next page" disabled={activePage === pages} onClick={() => setPage(activePage + 1)}><ChevronRight size={16} /></AdminActionButton></div></footer>
    </section>
    <AnimatePresence>{seller && <SellerDrawer key={`seller-${seller.id}`} seller={seller} boats={adminBoats.filter(item => item.sellerId === seller.id)} behind={Boolean(boat)} onClose={() => change({ seller: null, boat: null })} onBoat={id => change({ boat: id })} onEdit={() => setSellerForm(seller)} onAddBoat={() => navigate(`/boats/new/basic?seller=${encodeURIComponent(seller.id)}`)} onStatus={stage => setSellerStage(seller, stage)} />}{boat && boatSeller && <BoatDrawer key={`boat-${boat.id}`} behind={Boolean(profileSeller)} boat={boat} seller={boatSeller} activeSale={activeSaleFor(boat, sales)} hasSaleHistory={sales.some(sale => sale.boat.id === boat.boatId)} onClose={() => change({ boat: null })} onSeller={() => setProfileSellerId(boatSeller.id)} onAction={setAction} onAvailability={value => setAvailability(boat, value)} onComment={message => comment(boat, message)} onSale={id => navigate(`/sales?sale=${id}`)} onRecordSale={setSaleForm} />}</AnimatePresence>
    <AnimatePresence>{boat && profileSeller && <SellerDrawer key={'profile-' + profileSeller.id} seller={profileSeller} boats={adminBoats.filter(item => item.sellerId === profileSeller.id)} onClose={() => setProfileSellerId(null)} onBoat={id => { setProfileSellerId(null); change({ boat: id }) }} onEdit={() => setSellerForm(profileSeller)} onAddBoat={() => navigate('/boats/new/basic?seller=' + encodeURIComponent(profileSeller.id))} onStatus={stage => setSellerStage(profileSeller, stage)} />}</AnimatePresence>
    <AnimatePresence>{sellerForm && <SellerForm key="seller-form" seller={'id' in sellerForm ? sellerForm as InventorySeller : null} onClose={() => setSellerForm(null)} onSave={saveSeller} />}{action && boat && <BoatActionModal key={action} boat={boat} action={action} onClose={() => setAction(null)} onConfirm={perform} />}{boat && boatSeller && saleForm && <SaleRecordModal key="sale-form" boat={boat} seller={boatSeller} initialStage={saleForm} onClose={() => setSaleForm(null)} onNotice={onNotice} onSaved={record => { setSaleForm(null); invalidateSalesCache(); refetchSales(); refresh('listings'); onNotice({ type: 'success', title: record.status === 'Current' ? 'Sale started' : 'Sale recorded', description: 'The boat and Sales list have been updated together. Publication is unchanged.' }) }} />}</AnimatePresence>
  </InventoryNoticeContext.Provider>
}
