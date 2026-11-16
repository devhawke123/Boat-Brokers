import { useRef, useState, type FormEvent, type ReactNode, type RefObject } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, Pencil } from 'lucide-react'
import type { Notice } from '../../seller-portal/components/ToastNotice'
import { updateSaleStatus } from '../lib/api'
import { invalidateSalesCache } from '../data/useSales'
import { invalidateListingsCache } from '../../seller-portal/data/useBoatListings'
import {
  saleBalance,
  saleMoney,
  saleStatusLabel,
} from '../lib/saleRecords'
import type { AdminSale, SaleActivity } from '../lib/saleRecords'
import { publicationStatus } from '../lib/inventory'
import type { Availability, InventoryBoat, InventorySeller } from '../lib/inventory'
import { AccountButton, AccountField } from './AdminAccountSettings'
import AdminInfoTooltip from './AdminInfoTooltip'
import AdminSelectField from './AdminSelectField'
import AdminRecordOverlay from './AdminRecordOverlay'
import { AdminActionButton } from './AdminInteraction'
import { BoatPicture } from './BoatPicture'
import SaleRecordModal, { applyBoatAvailability } from './SaleRecordModal'
import '../styles/admin-sales.css'

const date = (value: string) => new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'Please try again.'
const initialsOf = (name: string) => name.replace(/^The\s+/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join('')

export function SaleBadge({ status }: { status: AdminSale['status'] }) {
  return <span className={'inventory-badge sale-stage is-' + status.toLowerCase()}>{saleStatusLabel(status)}</span>
}

function PartyIdentity({ name = 'Not recorded', email, children }: { name?: string; email?: string; children?: ReactNode }) {
  return <div className="inventory-person"><span className="lead-avatar" aria-hidden="true">{initialsOf(name)}</span><div>{children || <strong>{name}</strong>}{email && <span>{email}</span>}</div></div>
}

const money = (value: number | null) => value == null ? 'Price not set' : new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(value)

function BoatPreview({ boat, onClick }: { boat: InventoryBoat; onClick: () => void }) {
  const publication = publicationStatus(boat)
  return (
    <div className="inventory-seller-boats">
      <AdminActionButton type="button" aria-label={'View boat ' + boat.name} onClick={onClick}>
        <BoatPicture image={boat.photos[0]?.src} />
        <span><strong>{boat.name}</strong><span>{money(boat.price)} · Approval: {boat.approval}</span></span>
        <span className={'inventory-badge is-' + publication.toLowerCase().replaceAll(' ', '-')}>{publication}</span>
        <ChevronRight size={15} aria-hidden="true" />
      </AdminActionButton>
    </div>
  )
}

function SaleConfirmation({
  sale,
  onClose,
  onConfirm,
  cancelling,
  busy,
}: {
  sale: AdminSale
  onClose: () => void
  onConfirm: (payload: { reason: string; availability: Availability }) => void
  cancelling: boolean
  busy: boolean
}) {
  const [reason, setReason] = useState('')
  const [availability, setAvailability] = useState<Availability>('Available')
  const [error, setError] = useState('')
  const keep = useRef<HTMLButtonElement>(null)
  const reasonRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  function confirm(event: FormEvent) {
    event.preventDefault()
    if (busy) return
    if (cancelling && !reason.trim()) {
      setError('Explain why this sale is being cancelled.')
      requestAnimationFrame(() => reasonRef.current?.focus())
      return
    }
    onConfirm({ reason, availability })
  }

  return (
    <AdminRecordOverlay
      modal
      noClose
      title={cancelling ? 'Cancel sale?' : 'Complete sale?'}
      subject={sale.boatName}
      info={cancelling
        ? 'Keeps the cancelled sale in history. Choose the boat’s sale status below. No refunds are issued.'
        : 'Marks the boat Sold and locks this sale. Publication is unchanged; payment is not confirmed.'}
      onClose={() => { if (!busy) onClose() }}
      initialFocusRef={keep}
      footer={
        <>
          <AccountButton ref={keep} onClick={onClose} disabled={busy}>Go back</AccountButton>
          <AccountButton kind="primary" type="submit" form="sale-confirmation" disabled={busy}>
            {cancelling ? 'Cancel sale' : 'Complete sale'}
          </AccountButton>
        </>
      }
    >
      <form id="sale-confirmation" className="sales-confirmation-form" onSubmit={confirm} noValidate>
        {cancelling && (
          <>
            <AccountField
              ref={reasonRef}
              label="Cancellation reason"
              placeholder="e.g. The buyer withdrew their offer"
              maxLength={2000}
              name="reason"
              multiline
              rows={3}
              required
              value={reason}
              error={error}
              onChange={event => { setReason(event.target.value); setError('') }}
            />
            <div className="v2-settings-select">
              <AdminSelectField
                label="Return boat to"
                variant="v2"
                value={availability}
                options={['Available', 'Under offer']}
                onChange={event => setAvailability(event.target.value as Availability)}
              />
            </div>
          </>
        )}
        {!cancelling && error && <p role="alert" className="v2-settings-error">{error}</p>}
      </form>
    </AdminRecordOverlay>
  )
}

export default function SaleRecordDrawer({
  boat,
  seller,
  sale,
  onClose,
  onNotice,
  onSaleUpdated,
  embedded = false,
  returnRef,
  onBoat,
  behind = false,
}: {
  boat: InventoryBoat
  seller: InventorySeller
  sale: AdminSale
  onClose: () => void
  onNotice: (notice: Notice) => void
  onSaleUpdated: (sale: AdminSale, activity?: SaleActivity) => void
  embedded?: boolean
  returnRef?: RefObject<HTMLElement | null>
  onBoat?: () => void
  behind?: boolean
}) {
  const [action, setAction] = useState<'edit' | 'complete' | 'cancel' | null>(null)
  const [busy, setBusy] = useState(false)
  const outcome = useRef<HTMLHeadingElement>(null)
  const restoreOutcomeFocus = useRef(false)

  async function commit(payload: { reason: string; availability: Availability }) {
    if (busy || !action || action === 'edit') return
    setBusy(true)
    try {
      if (action === 'cancel') {
        await updateSaleStatus(sale.numericId, 'CANCELLED')
        await applyBoatAvailability(boat.boatId, payload.availability)
        invalidateSalesCache()
        invalidateListingsCache()
        onSaleUpdated({
          ...sale,
          status: 'Cancelled',
          cancelledAt: new Date().toISOString(),
          reason: payload.reason.trim(),
        }, { id: `${sale.id}-cancel`, title: 'Sale cancelled', at: new Date().toISOString() })
        onNotice({ type: 'success', title: 'Sale cancelled', description: 'The boat and sales list have been updated together. Publication is unchanged.' })
      } else {
        await updateSaleStatus(sale.numericId, 'COMPLETED')
        await applyBoatAvailability(boat.boatId, 'Sold')
        invalidateSalesCache()
        invalidateListingsCache()
        onSaleUpdated({
          ...sale,
          status: 'Completed',
          completedAt: new Date().toISOString(),
        }, { id: `${sale.id}-complete`, title: 'Sale completed', at: new Date().toISOString() })
        onNotice({ type: 'success', title: 'Sale completed', description: 'The boat and sales list have been updated together. Publication is unchanged.' })
      }
      restoreOutcomeFocus.current = true
      setAction(null)
    } catch (err) {
      onNotice({ type: 'error', title: 'Sale not updated', description: errorMessage(err) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <AdminRecordOverlay
      behind={behind}
      title={sale.boatName}
      eyebrow="Sale details"
      onClose={onClose}
      returnFocusRef={returnRef}
      headerExtra={<div className="sales-drawer-status"><SaleBadge status={sale.status} /></div>}
      footer={sale.status === 'Current' ? (
        <div className="sales-footer-actions">
          <AccountButton onClick={() => setAction('cancel')} disabled={busy}>Cancel sale</AccountButton>
          <AccountButton onClick={() => setAction('edit')} disabled={busy}><Pencil size={15} />Edit sale</AccountButton>
          <AccountButton kind="primary" onClick={() => setAction('complete')} disabled={busy}><Check size={15} />Complete sale</AccountButton>
        </div>
      ) : null}
    >
      <section className="inventory-detail-section">
        <h3 ref={outcome} tabIndex={-1}>Transaction</h3>
        <div className="sales-parties">
          <div><p>Seller</p><PartyIdentity name={sale.sellerName} /></div>
          <div><p>Buyer</p><PartyIdentity name={sale.buyer} email={sale.buyerEmail} /></div>
        </div>
        <dl className="inventory-specs">
          {([['Recorded', date(sale.createdAt)], ...(sale.completedAt ? [['Completed', date(sale.completedAt)] as const] : []), ...(sale.cancelledAt ? [['Cancelled', date(sale.cancelledAt)] as const] : [])] as [string, string][]).map(([label, value]) => (
            <div key={label}><dt>{label}</dt><dd>{value || 'Not recorded'}</dd></div>
          ))}
        </dl>
      </section>
      <section className="inventory-detail-section">
        <div className="inventory-comments-heading">
          <h3>Amounts</h3>
          <AdminInfoTooltip label="About sale amounts">Balance = sale price − deposit. Payments and refunds are not tracked.</AdminInfoTooltip>
        </div>
        <dl className="inventory-specs">
          {([['Sale price', sale.price], ['Deposit', sale.deposit], ['Balance after deposit', saleBalance(sale)], ['Commission', sale.commission]] as const).map(([label, value]) => (
            <div key={label}><dt>{label}</dt><dd>{saleMoney(value)}</dd></div>
          ))}
        </dl>
      </section>
      {sale.reason && (
        <section className="inventory-detail-section">
          <h3>Cancellation reason</h3>
          <p className="inventory-overview">{sale.reason}</p>
        </section>
      )}
      {!embedded && onBoat && (
        <section className="inventory-detail-section">
          <h3>Boat listing</h3>
          <BoatPreview boat={boat} onClick={onBoat} />
        </section>
      )}
      <section className="inventory-detail-section">
        <h3>Activity</h3>
        <ol className="inventory-activity">
          {[...sale.activity].reverse().map((item, index) => (
            <li key={item.id || item.at + index}><span>{item.title}</span><time dateTime={item.at}>{date(item.at)}</time></li>
          ))}
        </ol>
      </section>
      <AnimatePresence onExitComplete={() => {
        if (restoreOutcomeFocus.current) {
          outcome.current?.focus({ preventScroll: true })
          restoreOutcomeFocus.current = false
        }
      }}>
        {action === 'edit' && (
          <SaleRecordModal
            boat={boat}
            seller={seller}
            sale={sale}
            onClose={() => setAction(null)}
            onNotice={onNotice}
            onSaved={updated => {
              setAction(null)
              onSaleUpdated(updated, { id: `${sale.id}-edit`, title: 'Sale details updated', at: new Date().toISOString() })
              onNotice({ type: 'success', title: 'Sale updated', description: 'The transaction details have been saved.' })
            }}
          />
        )}
        {['complete', 'cancel'].includes(action || '') && (
          <SaleConfirmation
            sale={sale}
            cancelling={action === 'cancel'}
            busy={busy}
            onClose={() => setAction(null)}
            onConfirm={commit}
          />
        )}
      </AnimatePresence>
    </AdminRecordOverlay>
  )
}
