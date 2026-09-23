import type { ApiSeller, SellerStatus } from '../../../../../seller-portal/lib/api'
import { formatDate } from '../../../../../seller-portal/lib/formatDate'

type SellerInfoCardProps = {
  seller: ApiSeller
  onStatusChange: (status: SellerStatus) => void
  onDelete: () => void
  updatingStatus: boolean
}

const statusOptions: { value: SellerStatus; label: string }[] = [
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'LISTED', label: 'Listed' },
  { value: 'LOST', label: 'Lost' },
]

export default function SellerInfoCard({ seller, onStatusChange, onDelete, updatingStatus }: SellerInfoCardProps) {
  return (
    <div className="flex flex-col gap-5 rounded-lg border border-[#e2e8f0] bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-h5 text-[#0a192f]">{seller.name}</h2>
          <p className="text-sm text-[#64748b]">{seller.sellerId}</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/admin-portal/sellers/${seller.id}/edit`}
            className="rounded-md border border-[#e2e8f0] px-3 py-1.5 text-xs font-bold text-[#102a43] transition-colors duration-300 hover:bg-[#f8fafc]"
          >
            Edit
          </a>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-md border border-[#fecaca] px-3 py-1.5 text-xs font-bold text-[#dc2626] transition-colors duration-300 hover:bg-[#fef2f2]"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-[#64748b]">Email</span>
          <span className="text-sm text-[#0f172a]">{seller.email}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-[#64748b]">Phone</span>
          <span className="text-sm text-[#0f172a]">{seller.phone ?? '—'}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-[#64748b]">Location</span>
          <span className="text-sm text-[#0f172a]">{seller.location ?? '—'}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-[#64748b]">Joined</span>
          <span className="text-sm text-[#0f172a]">{formatDate(seller.joiningDate)}</span>
        </div>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-[#64748b]">Status</span>
        <select
          value={seller.status}
          disabled={updatingStatus}
          onChange={(event) => onStatusChange(event.target.value as SellerStatus)}
          className="h-10 w-fit min-w-[10rem] rounded-md border border-[#e2e8f0] bg-white px-3 text-sm font-medium text-[#0f172a] focus:border-navy-dark focus:outline-none disabled:opacity-60"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
