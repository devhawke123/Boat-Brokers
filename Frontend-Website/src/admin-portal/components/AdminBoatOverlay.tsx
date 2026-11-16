import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import type { Notice } from '../../seller-portal/components/ToastNotice'
import { useBoatListings, invalidateListingsCache } from '../../seller-portal/data/useBoatListings'
import { useSellers } from '../../seller-portal/data/useSellers'
import { addListingComment, updateListingStatus } from '../../seller-portal/lib/api'
import { deleteBoat, permanentlyDeleteBoat, restoreBoat, updateBoatSaleStatus } from '../../lib/api'
import { useSales } from '../data/useSales'
import { getStoredAdmin } from '../lib/session'
import { activeSaleFor, toInventoryBoat, toInventorySeller } from '../lib/inventory'
import type { Availability, InventoryBoat } from '../lib/inventory'
import type { SaleStage } from '../lib/saleRecords'
import { BoatDrawer, BoatActionModal, SellerDrawer, SellerForm } from './AdminInventory'
import SaleRecordModal from './SaleRecordModal'
import SaleRecordDrawer from './SaleRecordDrawer'
import { toAdminSale } from '../lib/saleRecords'

// Reuse the operational boat drawer without navigating away from a sale.
export default function AdminBoatOverlay({
  boatId,
  onClose,
  onNotice,
}: {
  boatId: string
  onClose: () => void
  onNotice: (notice: Notice) => void
}) {
  const { listings, refetch: refetchListings } = useBoatListings()
  const { sellers: apiSellers } = useSellers()
  const { sales, refetch: refetchSales } = useSales()
  const navigate = useNavigate()
  const [selectedBoat, setSelectedBoat] = useState(boatId)
  const [sellerOpen, setSellerOpen] = useState(false)
  const [sellerEditing, setSellerEditing] = useState(false)
  const [action, setAction] = useState<'archive' | 'restore' | 'approve' | 'request-changes' | 'delete' | null>(null)
  const [saleForm, setSaleForm] = useState<SaleStage | null>(null)
  const [saleView, setSaleView] = useState<number | null>(null)

  const adminBoats = useMemo(() => listings.map(toInventoryBoat), [listings])
  const sellers = useMemo(() => apiSellers.map(toInventorySeller), [apiSellers])
  const boat = adminBoats.find(item => item.id === selectedBoat)
  const seller = boat && (sellers.find(item => item.id === boat.sellerId) ?? boat.seller)
  const activeSale = boat ? activeSaleFor(boat, sales) : null
  const embeddedSale = saleView != null ? sales.find(sale => sale.id === saleView) : null
  const embeddedAdminSale = embeddedSale && boat ? toAdminSale(embeddedSale, { boatListingId: boat.id }) : null

  function refresh() {
    invalidateListingsCache()
    refetchListings()
    refetchSales()
  }

  async function setAvailability(target: InventoryBoat, value: Availability) {
    try {
      await updateBoatSaleStatus(target.boatId, { isSold: false, isUnderOffer: value === 'Under offer' })
      refresh()
      onNotice({ type: 'success', title: 'Sale status updated', description: `${target.name} is now ${value.toLowerCase()}. Publication is unchanged.` })
    } catch (err) {
      onNotice({ type: 'error', title: 'Sale status not updated', description: err instanceof Error ? err.message : 'Please try again.' })
    }
  }

  async function comment(target: InventoryBoat, message: string) {
    try {
      await addListingComment(target.listingId, message, getStoredAdmin()?.name || 'Admin', { fromSeller: false })
      refresh()
      return true
    } catch {
      return false
    }
  }

  async function perform(payload: { comment?: string }) {
    if (!boat || !action) return false
    const admin = getStoredAdmin()?.name || 'Admin'
    try {
      if (action === 'approve') await updateListingStatus(boat.listingId, 'APPROVED')
      else if (action === 'request-changes') {
        await updateListingStatus(boat.listingId, 'REJECTED')
        await addListingComment(boat.listingId, payload.comment ?? '', admin, { fromSeller: false })
      } else if (action === 'archive') await deleteBoat(boat.boatId)
      else if (action === 'restore') await restoreBoat(boat.boatId)
      else if (action === 'delete') await permanentlyDeleteBoat(boat.boatId)
      refresh()
      setAction(null)
      if (action === 'delete') onClose()
      onNotice({ type: 'success', title: 'Boat updated', description: 'The listing and its history have been updated.' })
      return true
    } catch (err) {
      onNotice({ type: 'error', title: 'Boat not updated', description: err instanceof Error ? err.message : 'Please try again.' })
      return false
    }
  }

  if (!boat || !seller) return null

  return (
    <>
      <BoatDrawer
        behind={Boolean(sellerOpen || embeddedAdminSale)}
        boat={boat}
        seller={seller}
        activeSale={activeSale}
        hasSaleHistory={sales.some(sale => sale.boat.id === boat.boatId)}
        onClose={onClose}
        onSeller={() => setSellerOpen(true)}
        onAction={setAction}
        onAvailability={value => void setAvailability(boat, value)}
        onComment={message => comment(boat, message)}
        onSale={id => setSaleView(id)}
        onRecordSale={stage => setSaleForm(stage)}
      />
      <AnimatePresence>
        {sellerOpen && (
          <SellerDrawer
            seller={seller}
            boats={adminBoats.filter(item => item.sellerId === seller.id)}
            onClose={() => setSellerOpen(false)}
            onBoat={id => { setSellerOpen(false); setSelectedBoat(id) }}
            onEdit={() => setSellerEditing(true)}
            onAddBoat={() => navigate('/boats/new/basic?seller=' + encodeURIComponent(seller.id))}
            onStatus={() => undefined}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {sellerEditing && (
          <SellerForm seller={seller} onClose={() => setSellerEditing(false)} onSave={async () => { setSellerEditing(false); return true }} />
        )}
        {action && (
          <BoatActionModal boat={boat} action={action} onClose={() => setAction(null)} onConfirm={perform} />
        )}
        {saleForm && (
          <SaleRecordModal
            boat={boat}
            seller={seller}
            initialStage={saleForm}
            onClose={() => setSaleForm(null)}
            onNotice={onNotice}
            onSaved={record => {
              setSaleForm(null)
              refresh()
              onNotice({
                type: 'success',
                title: record.status === 'Current' ? 'Sale started' : 'Sale recorded',
                description: 'The boat and Sales list have been updated together. Publication is unchanged.',
              })
            }}
          />
        )}
        {embeddedAdminSale && (
          <SaleRecordDrawer
            boat={boat}
            seller={seller}
            sale={embeddedAdminSale}
            embedded
            onClose={() => setSaleView(null)}
            onNotice={onNotice}
            onSaleUpdated={() => { setSaleView(null); refresh() }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
