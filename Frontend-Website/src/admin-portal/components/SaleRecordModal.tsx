import { useRef, useState, type FormEvent } from 'react'
import { AnimatePresence } from 'framer-motion'
import type { Notice } from '../../seller-portal/components/ToastNotice'
import { createBuyer, createSale, updateSale, updateSaleStatus } from '../lib/api'
import { updateBoatSaleStatus } from '../../lib/api'
import { buyerName, validateBuyer } from '../lib/buyerRecords'
import type { BuyerFormValues } from '../lib/buyerRecords'
import {
  saleAmountsForApi,
  saleBalance,
  saleMoney,
  saleStatusLabel,
  saleStatusValue,
  validateSale,
} from '../lib/saleRecords'
import type { AdminSale, SaleFormValues, SaleStage } from '../lib/saleRecords'
import type { Availability, InventoryBoat, InventorySeller } from '../lib/inventory'
import { useBuyers, invalidateBuyersCache } from '../data/useBuyers'
import { invalidateSalesCache } from '../data/useSales'
import { invalidateListingsCache } from '../../seller-portal/data/useBoatListings'
import { AccountButton, AccountField } from './AdminAccountSettings'
import AdminSelectField from './AdminSelectField'
import AdminRecordOverlay from './AdminRecordOverlay'
import { BuyerEditor } from './AdminBuyers'
import '../styles/admin-sales.css'

const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'Please try again.'

async function applyBoatAvailability(boatId: number, availability: Availability) {
  await updateBoatSaleStatus(boatId, {
    isSold: availability === 'Sold',
    isUnderOffer: availability === 'Under offer',
  })
}

export default function SaleRecordModal({
  boat,
  seller,
  sale,
  initialStage = 'Current',
  onClose,
  onSaved,
  onNotice,
}: {
  boat: InventoryBoat
  seller: InventorySeller
  sale?: AdminSale | null
  initialStage?: SaleStage
  onClose: () => void
  onSaved: (sale: AdminSale) => void
  onNotice?: (notice: Notice) => void
}) {
  const { buyers: apiBuyers, refetch: refetchBuyers } = useBuyers()
  const [values, setValues] = useState<SaleFormValues>({
    buyerId: sale ? String(sale.buyerId) : '',
    price: sale?.price ?? '',
    deposit: sale?.deposit ?? '',
    commission: sale?.commission ?? '',
    status: sale?.status || initialStage,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof SaleFormValues, string>>>({})
  const [error, setError] = useState('')
  const [addingBuyer, setAddingBuyer] = useState(false)
  const [busy, setBusy] = useState(false)
  const form = useRef<HTMLFormElement>(null)
  const cancel = useRef<HTMLButtonElement>(null)
  const options = apiBuyers.map(buyer => ({
    id: String(buyer.id),
    label: buyerName(buyer) + ' · ' + buyer.email + (apiBuyers.some(other => other.id !== buyer.id && buyerName(other) === buyerName(buyer) && other.email === buyer.email) ? ' · ' + buyer.buyerId : ''),
  }))
  if (sale && !apiBuyers.some(buyer => buyer.id === sale.buyerId)) {
    options.push({ id: String(sale.buyerId), label: sale.buyer + ' · Contact no longer available' })
  }

  function change(key: keyof SaleFormValues, value: string) {
    setValues(current => ({ ...current, [key]: value }))
    setErrors(current => ({ ...current, [key]: '' }))
    setError('')
  }

  async function saveBuyer(contact: BuyerFormValues) {
    const next = validateBuyer(contact)
    if (Object.keys(next).length) return false
    try {
      const created = await createBuyer({
        firstName: contact.firstName,
        surname: contact.surname,
        email: contact.email,
        phone: contact.phone || undefined,
      })
      invalidateBuyersCache()
      refetchBuyers()
      change('buyerId', String(created.id))
      setAddingBuyer(false)
      return true
    } catch (err) {
      onNotice?.({ type: 'error', title: 'Buyer not added', description: errorMessage(err) })
      return false
    }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    const next = validateSale(values)
    setErrors(next)
    if (Object.keys(next).length) {
      requestAnimationFrame(() => form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    setBusy(true)
    setError('')
    try {
      const amounts = saleAmountsForApi(values)
      const buyerId = Number(values.buyerId)
      if (sale) {
        await updateSale(sale.numericId, { buyerId, ...amounts })
        invalidateSalesCache()
        onSaved({
          ...sale,
          buyerId,
          buyer: options.find(item => item.id === values.buyerId)?.label.split(' · ')[0] || sale.buyer,
          price: amounts.soldPrice,
          deposit: amounts.deposit,
          commission: amounts.commission,
        })
      } else {
        const created = await createSale({
          boatId: boat.boatId,
          sellerId: seller.apiId,
          buyerId,
          ...amounts,
        })
        if (values.status === 'Completed' && created.status !== 'COMPLETED') {
          await updateSaleStatus(created.id, 'COMPLETED')
        }
        await applyBoatAvailability(boat.boatId, values.status === 'Completed' ? 'Sold' : 'Under offer')
        invalidateSalesCache()
        invalidateListingsCache()
        const buyer = apiBuyers.find(item => item.id === buyerId)
        onSaved({
          id: String(created.id),
          numericId: created.id,
          boatId: boat.boatId,
          boatListingId: boat.id,
          boatName: boat.name,
          boatImage: boat.photos[0]?.src || null,
          sellerId: seller.apiId,
          sellerName: seller.name,
          buyerId,
          buyer: buyer ? buyerName(buyer) : 'Buyer',
          buyerEmail: buyer?.email || '',
          price: amounts.soldPrice,
          deposit: amounts.deposit,
          commission: amounts.commission,
          status: values.status,
          createdAt: created.createdAt,
          completedAt: values.status === 'Completed' ? created.createdAt : null,
          cancelledAt: null,
          reason: null,
          activity: [{ id: `${created.id}-created`, title: values.status === 'Completed' ? 'Sale completed' : 'Sale started', at: created.createdAt }],
        })
      }
    } catch (problem) {
      setError(errorMessage(problem))
      setBusy(false)
    }
  }

  return (
    <AdminRecordOverlay
      modal
      title={sale ? 'Edit sale' : 'Record sale'}
      subject={sale?.boatName || boat.name}
      info="In progress marks the boat Under offer; Completed marks it Sold. Publication is unchanged. No payments are processed."
      initialFocusRef={cancel}
      onClose={() => { if (!busy) onClose() }}
      footer={
        <>
          <AccountButton ref={cancel} onClick={onClose} disabled={busy}>Cancel</AccountButton>
          <AccountButton kind="primary" type="submit" form="admin-sale-form" disabled={busy}>
            {busy ? 'Saving…' : sale ? 'Save changes' : 'Save sale'}
          </AccountButton>
        </>
      }
    >
      <form ref={form} id="admin-sale-form" onSubmit={save} noValidate>
        <div className="v2-settings-fields">
          <AccountField label="Boat" name="boat" value={sale?.boatName || boat.name} readOnly required />
          <AccountField label="Seller" name="seller" value={sale?.sellerName || seller.name || ''} readOnly required />
          <div className="v2-settings-select sales-buyer-field">
            <AdminSelectField
              label="Buyer"
              required
              variant="v2"
              value={options.find(item => item.id === values.buyerId)?.label || ''}
              options={options.map(item => item.label)}
              placeholder="Select a buyer"
              footerAction={{ label: '+ Add buyer', onSelect: () => setAddingBuyer(true) }}
              error={errors.buyerId}
              onChange={event => change('buyerId', options.find(item => item.label === event.target.value)?.id || '')}
            />
          </div>
          {sale || boat.availability === 'Sold'
            ? <AccountField label="Sale status" name="stage" readOnly value={sale ? saleStatusLabel(sale.status) : 'Completed'} />
            : (
              <div className="v2-settings-select">
                <AdminSelectField
                  label="Sale status"
                  variant="v2"
                  value={saleStatusLabel(values.status)}
                  options={['In progress', 'Completed']}
                  error={errors.status}
                  onChange={event => change('status', saleStatusValue(event.target.value))}
                />
              </div>
            )}
          {([['price', 'Sale price (£)'], ['deposit', 'Deposit (£)'], ['commission', 'Commission (£)']] as const).map(([key, label]) => (
            <AccountField
              key={key}
              label={label}
              name={key}
              required={key === 'price'}
              type="number"
              inputMode="decimal"
              min={key === 'price' ? '.01' : '0'}
              step=".01"
              value={String(values[key])}
              placeholder="0.00"
              error={errors[key]}
              onChange={event => change(key, event.target.value)}
            />
          ))}
        </div>
        <div className="sales-balance-summary">
          <span>Balance after deposit</span>
          <strong>
            {!errors.price && !errors.deposit && Number(values.price) > 0 && Number.isFinite(saleBalance(values))
              ? saleMoney(saleBalance(values))
              : '—'}
          </strong>
        </div>
        {error && <p className="v2-settings-error" role="alert">{error}</p>}
      </form>
      <AnimatePresence>
        {addingBuyer && (
          <BuyerEditor
            buyer={null}
            onClose={() => setAddingBuyer(false)}
            onSave={async (contact) => saveBuyer(contact)}
          />
        )}
      </AnimatePresence>
    </AdminRecordOverlay>
  )
}

export { applyBoatAvailability }
