import { useMemo, useRef, useState, type MouseEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react'
import type { Notice } from '../../seller-portal/components/ToastNotice'
import { useBoatListings } from '../../seller-portal/data/useBoatListings'
import { useSales, invalidateSalesCache } from '../data/useSales'
import {
  saleBalance,
  saleMoney,
  saleStages,
  saleStatusLabel,
  saleStatusValue,
  toAdminSale,
} from '../lib/saleRecords'
import type { AdminSale, SaleActivity, SaleStage } from '../lib/saleRecords'
import { toInventoryBoat } from '../lib/inventory'
import type { InventoryBoat } from '../lib/inventory'
import { InventoryNoticeContext } from '../context/InventoryNoticeContext'
import { AdminCollectionStats, AdminCollectionFilters } from './AdminCollectionControls'
import { AdminActionButton, AdminResultsBody } from './AdminInteraction'
import { AccountButton } from './AdminAccountSettings'
import { BoatPicture } from './BoatPicture'
import SaleRecordDrawer, { SaleBadge } from './SaleRecordDrawer'
import AdminBoatOverlay from './AdminBoatOverlay'
import '../styles/admin-leads.css'
import '../styles/admin-inventory.css'
import '../styles/admin-sales.css'

// Ported from boat-brokers/src/components/AdminSales.jsx. Markup matches the
// prototype; records come from useSales. CURRENT displays as In progress via
// statusLabels through saleStatusLabel. Create/edit/complete/cancel hit the
// sales API; boat availability side-effects use updateBoatSaleStatus.

const date = (value: string) => new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const PAGE_SIZE = 8
const initialsOf = (name: string) => name.replace(/^The\s+/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join('')

function PartyIdentity({ name = 'Not recorded' }: { name?: string }) {
  return <div className="inventory-person"><span className="lead-avatar" aria-hidden="true">{initialsOf(name)}</span><div><strong>{name}</strong></div></div>
}

export default function AdminSales({ onNotice, notice, onDismissNotice }: {
  onNotice: (notice: Notice) => void
  notice: Notice | null
  onDismissNotice: () => void
}) {
  const { sales: apiSales, loading, error, refetch } = useSales()
  const { listings, refetch: refetchListings } = useBoatListings()
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [boatOpen, setBoatOpen] = useState(false)
  const [sessionExtras, setSessionExtras] = useState<Record<string, { reason?: string | null; activity: SaleActivity[] }>>({})
  const trigger = useRef<HTMLElement | null>(null)
  const reduced = useReducedMotion()

  const boatsByBoatId = useMemo(() => {
    const map = new Map<number, InventoryBoat>()
    for (const listing of listings) {
      const boat = toInventoryBoat(listing)
      map.set(boat.boatId, boat)
    }
    return map
  }, [listings])

  const records = useMemo(
    () => apiSales.flatMap(sale => {
      const record = toAdminSale(sale, {
        boatListingId: sale.boat?.id != null ? boatsByBoatId.get(sale.boat.id)?.id ?? null : null,
        reason: sessionExtras[String(sale.id)]?.reason,
        activity: sessionExtras[String(sale.id)]?.activity,
      })
      return record ? [record] : []
    }),
    [apiSales, boatsByBoatId, sessionExtras],
  )

  const statusParam = params.get('status') || ''
  const status = saleStages.includes(statusParam as SaleStage) ? statusParam as SaleStage : ''
  const query = search.trim().toLowerCase()
  const rows = records.filter(sale =>
    (!status || sale.status === status) &&
    [sale.boatName, sale.buyer, sale.buyerEmail, sale.sellerName].some(value => String(value || '').toLowerCase().includes(query)),
  )
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const currentPage = Math.min(page, pages)
  const visible = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const selected = records.find(sale => sale.id === params.get('sale'))
  const boat = selected ? boatsByBoatId.get(selected.boatId) : undefined
  const boatSeller = boat?.seller

  function change(values: Record<string, string | null | undefined>) {
    const next = new URLSearchParams(params)
    Object.entries(values).forEach(([key, value]) => value ? next.set(key, value) : next.delete(key))
    setParams(next, { replace: true })
  }

  function open(sale: AdminSale, event: MouseEvent<HTMLElement>) {
    trigger.current = event.currentTarget.matches('button') ? event.currentTarget : event.currentTarget.querySelector('button')
    change({ sale: sale.id })
  }

  function refresh() {
    invalidateSalesCache()
    refetch()
    refetchListings()
  }

  function onSaleUpdated(updated: AdminSale, activity?: SaleActivity) {
    setSessionExtras(current => ({
      ...current,
      [updated.id]: {
        reason: updated.reason,
        activity: [...(current[updated.id]?.activity || []), ...(activity ? [activity] : [])],
      },
    }))
    refresh()
  }

  return (
    <InventoryNoticeContext.Provider value={{ notice, onClose: onDismissNotice }}>
      <div className="leads-heading"><h1>Sales</h1></div>
      <AdminCollectionStats
        label="Sales statistics"
        value={status}
        items={['', ...saleStages].map(value => ({
          value,
          label: saleStatusLabel(value as SaleStage) || 'All sales',
          count: records.filter(sale => !value || sale.status === value).length,
        }))}
        onChange={value => { change({ status: value }); setPage(1) }}
      />
      <section className="leads-list sales-records-list" aria-label="Sales">
        <div className="leads-toolbar">
          <div className="leads-tools">
            <div className="leads-search">
              <Search size={16} aria-hidden="true" />
              <input
                type="search"
                aria-label="Search sales"
                placeholder="Search boat, seller or buyer…"
                value={search}
                onChange={event => { setSearch(event.target.value); setPage(1) }}
              />
              {search && (
                <AdminActionButton type="button" aria-label="Clear sales search" onClick={() => { setSearch(''); setPage(1) }}>
                  <X size={15} />
                </AdminActionButton>
              )}
            </div>
            <AdminCollectionFilters
              active={Boolean(status)}
              fields={[{
                label: 'Sale status',
                value: saleStatusLabel(status) || 'All statuses',
                options: ['All statuses', ...saleStages.map(saleStatusLabel)],
                onChange: value => { change({ status: value === 'All statuses' ? null : saleStatusValue(value) }); setPage(1) },
              }]}
              onClear={() => { change({ status: null }); setPage(1) }}
            />
          </div>
        </div>
        <div className="inventory-table-scroll" role="region" aria-label="Sales transactions" tabIndex={0}>
          <table className="inventory-table is-sales">
            <thead>
              <tr>
                {['Boat', 'Seller', 'Buyer', 'Sale status', 'Sale price (£)', 'Deposit (£)', 'Balance after deposit (£)', 'Commission (£)', 'Recorded'].map(label => (
                  <th scope="col" key={label}>{label}</th>
                ))}
              </tr>
            </thead>
            <AdminResultsBody identity={JSON.stringify([status, search, currentPage, loading])}>
              {visible.map(sale => (
                <motion.tr
                  key={sale.id}
                  onClick={event => open(sale, event)}
                >
                  <td>
                    <div className="inventory-row-boat">
                      <BoatPicture image={sale.boatImage || boatsByBoatId.get(sale.boatId)?.photos[0]?.src} />
                      <AdminActionButton type="button" aria-label={'View sale ' + sale.boatName} onClick={event => { event.stopPropagation(); open(sale, event) }}>
                        {sale.boatName}
                      </AdminActionButton>
                    </div>
                  </td>
                  <td><PartyIdentity name={sale.sellerName} /></td>
                  <td><PartyIdentity name={sale.buyer} /></td>
                  <td><SaleBadge status={sale.status} /></td>
                  {[sale.price, sale.deposit, saleBalance(sale), sale.commission].map((value, index) => (
                    <td key={index} className="sales-amount">{saleMoney(value)}</td>
                  ))}
                  <td><time dateTime={sale.createdAt}>{date(sale.createdAt)}</time></td>
                </motion.tr>
              ))}
            </AdminResultsBody>
          </table>
        </div>
        {!rows.length && (
          <motion.div className="leads-empty" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }}>
            <Search size={25} />
            <h2>{loading ? 'Loading sales…' : error ? 'Couldn’t load sales' : records.length ? 'No sales found' : 'No sales recorded yet'}</h2>
            {error && !loading ? (
              <><p>{error}</p><AccountButton onClick={refresh}>Try again</AccountButton></>
            ) : !loading && (
              <>
                <p>{records.length ? 'Try another boat, person or sale status.' : 'Record a sale from an approved boat’s drawer. It will appear here automatically.'}</p>
                {records.length
                  ? <AdminActionButton type="button" onClick={() => { setSearch(''); change({ status: null }); setPage(1) }}>Clear filters</AdminActionButton>
                  : <Link className="sales-boat-link" to="/boats?status=Approved">View approved boats</Link>}
              </>
            )}
          </motion.div>
        )}
        <footer className="leads-pagination">
          <p role="status">
            {rows.length ? `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, rows.length)} of ${rows.length} sales` : '0 sales'}
          </p>
          <div>
            <AdminActionButton type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft size={16} /></AdminActionButton>
            <span>{currentPage} / {pages}</span>
            <AdminActionButton type="button" aria-label="Next page" disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}><ChevronRight size={16} /></AdminActionButton>
          </div>
        </footer>
      </section>
      <AnimatePresence>
        {selected && boat && boatSeller && (
          <SaleRecordDrawer
            key={selected.id}
            boat={boat}
            seller={boatSeller}
            sale={selected}
            behind={boatOpen}
            onBoat={() => setBoatOpen(true)}
            returnRef={trigger}
            onClose={() => { setBoatOpen(false); change({ sale: null }) }}
            onNotice={onNotice}
            onSaleUpdated={onSaleUpdated}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selected && boat && boatOpen && (
          <AdminBoatOverlay
            boatId={boat.id}
            onClose={() => setBoatOpen(false)}
            onNotice={onNotice}
          />
        )}
      </AnimatePresence>
    </InventoryNoticeContext.Provider>
  )
}
