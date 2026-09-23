import { useEffect, useState, type FormEvent } from 'react'
import AdminShell from '../../components/AdminShell/AdminShell'
import { useAdminSession } from '../../data/useAdminSession'
import { useSaleById, invalidateSalesCache } from '../../data/useSales'
import { useBuyers } from '../../data/useBuyers'
import { createSale, updateSale } from '../../lib/api'
import { fetchBoats, type ApiBoat } from '../../../lib/api'
import { fetchSellers, type ApiSeller } from '../../../seller-portal/lib/api'
import { TextField, FieldRow, Label } from '../../../seller-portal/components/FormField/FormField'
import Button from '../../../components/Button/Button'

type SaleFormProps = {
  saleId?: number
}

export default function SaleForm({ saleId }: SaleFormProps) {
  const { checkedSession } = useAdminSession()
  const isEdit = saleId !== undefined
  const { sale, loading } = useSaleById(saleId ?? -1)
  const { buyers, loading: buyersLoading } = useBuyers()

  const [boats, setBoats] = useState<ApiBoat[]>([])
  const [sellers, setSellers] = useState<ApiSeller[]>([])
  const [lookupsLoading, setLookupsLoading] = useState(true)
  const [lookupsError, setLookupsError] = useState<string | null>(null)

  const [boatId, setBoatId] = useState('')
  const [sellerId, setSellerId] = useState('')
  const [buyerId, setBuyerId] = useState('')
  const [soldPrice, setSoldPrice] = useState('')
  const [deposit, setDeposit] = useState('')
  const [commission, setCommission] = useState('')
  const [initialized, setInitialized] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchBoats(), fetchSellers()])
      .then(([boatsData, sellersData]) => {
        if (!cancelled) {
          setBoats(boatsData)
          setSellers(sellersData)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) setLookupsError(err instanceof Error ? err.message : 'Failed to load boats/sellers.')
      })
      .finally(() => {
        if (!cancelled) setLookupsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Populate the form once the existing sale loads (edit mode only).
  if (isEdit && sale && !initialized) {
    setBoatId(String(sale.boat.id))
    setSellerId(String(sale.seller.id))
    setBuyerId(String(sale.buyer.id))
    setSoldPrice(String(sale.soldPrice))
    setDeposit(String(sale.deposit))
    setCommission(String(sale.commission))
    setInitialized(true)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!boatId || !sellerId || !buyerId || !soldPrice) return

    setSaving(true)
    setError(null)
    const payload = {
      boatId: Number(boatId),
      sellerId: Number(sellerId),
      buyerId: Number(buyerId),
      soldPrice: Number(soldPrice),
      deposit: deposit ? Number(deposit) : undefined,
      commission: commission ? Number(commission) : undefined,
    }
    try {
      if (isEdit && saleId !== undefined) {
        await updateSale(saleId, payload)
        invalidateSalesCache()
        window.location.href = `/admin-portal/sales/${saleId}`
      } else {
        const created = await createSale(payload)
        invalidateSalesCache()
        window.location.href = `/admin-portal/sales/${created.id}`
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save sale.')
      setSaving(false)
    }
  }

  if (!checkedSession) return null
  if ((isEdit && loading) || lookupsLoading || buyersLoading) {
    return (
      <AdminShell mainClassName="bg-frost">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="h-80 w-full max-w-2xl animate-pulse rounded-lg border border-[#e2e8f0] bg-[#f8fafc]" />
        </div>
      </AdminShell>
    )
  }
  if (isEdit && !sale) {
    return (
      <AdminShell mainClassName="bg-frost">
        <div className="flex flex-col items-center gap-2 p-8 text-center text-[#64748b]">
          <p>This sale couldn&rsquo;t be found.</p>
          <a href="/admin-portal/sales" className="text-sm font-semibold text-[#2563eb]">
            Back to Sales
          </a>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell mainClassName="bg-frost">
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">{isEdit ? 'Edit Sale' : 'Add New Sale'}</h1>

        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-2xl flex-col gap-4 rounded-lg border border-[#e2e8f0] bg-white p-6"
        >
          {lookupsError && <p className="text-sm font-medium text-[#dc2626]">{lookupsError}</p>}

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Label required>Boat</Label>
            <select
              value={boatId}
              onChange={(e) => setBoatId(e.target.value)}
              required
              className="h-11 w-full rounded-lg border border-[#e2e8f0] bg-white px-4 text-[16px] text-[#0f172a] focus:outline-none"
            >
              <option value="" disabled>
                Select boat
              </option>
              {boats.map((boat) => (
                <option key={boat.id} value={boat.id}>
                  {boat.name}
                </option>
              ))}
            </select>
          </div>

          <FieldRow>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Label required>Seller</Label>
              <select
                value={sellerId}
                onChange={(e) => setSellerId(e.target.value)}
                required
                className="h-11 w-full rounded-lg border border-[#e2e8f0] bg-white px-4 text-[16px] text-[#0f172a] focus:outline-none"
              >
                <option value="" disabled>
                  Select seller
                </option>
                {sellers.map((seller) => (
                  <option key={seller.id} value={seller.id}>
                    {seller.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Label required>Buyer</Label>
              <select
                value={buyerId}
                onChange={(e) => setBuyerId(e.target.value)}
                required
                className="h-11 w-full rounded-lg border border-[#e2e8f0] bg-white px-4 text-[16px] text-[#0f172a] focus:outline-none"
              >
                <option value="" disabled>
                  Select buyer
                </option>
                {buyers.map((buyer) => (
                  <option key={buyer.id} value={buyer.id}>
                    {buyer.firstName} {buyer.surname}
                  </option>
                ))}
              </select>
            </div>
          </FieldRow>

          <FieldRow>
            <TextField
              label="Sold Price"
              required
              type="integer"
              prefix="£"
              value={soldPrice}
              onChange={setSoldPrice}
              placeholder="0"
            />
            <TextField label="Deposit" type="integer" prefix="£" value={deposit} onChange={setDeposit} placeholder="0" />
            <TextField
              label="Commission"
              type="integer"
              prefix="£"
              value={commission}
              onChange={setCommission}
              placeholder="0"
            />
          </FieldRow>

          {error && <p className="text-sm font-medium text-[#dc2626]">{error}</p>}

          <div className="flex items-center gap-3">
            <Button type="submit" variant="dark" label={saving ? 'Saving…' : 'Save Sale'} icon="none" disabled={saving} />
            <a href="/admin-portal/sales" className="text-sm font-semibold text-[#64748b] hover:text-[#0f172a]">
              Cancel
            </a>
          </div>
        </form>
      </div>
    </AdminShell>
  )
}
