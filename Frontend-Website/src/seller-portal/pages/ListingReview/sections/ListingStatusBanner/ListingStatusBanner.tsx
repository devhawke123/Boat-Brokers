import type { ListingStatus, ApiListingComment } from '../../../../lib/api'

type ListingStatusBannerProps = {
  status: ListingStatus
  comments: ApiListingComment[]
}

const configs = {
  APPROVED: {
    bg: 'bg-[#f0fdf4]',
    border: 'border-[#86efac]',
    dot: 'bg-[#16a34a]',
    title: 'Listing Approved',
    titleColor: 'text-[#15803d]',
    body: 'Your listing has been reviewed and approved. It is now live on the marketplace.',
    bodyColor: 'text-[#166534]',
  },
  PENDING: {
    bg: 'bg-[#fefce8]',
    border: 'border-[#fde047]',
    dot: 'bg-[#ca8a04]',
    title: 'Under Review',
    titleColor: 'text-[#a16207]',
    body: 'Your listing is pending review by the Boat Brokers team. You can still edit it while it is pending.',
    bodyColor: 'text-[#92400e]',
  },
  REJECTED: {
    bg: 'bg-[#fef2f2]',
    border: 'border-[#fca5a5]',
    dot: 'bg-[#dc2626]',
    title: 'Listing Rejected',
    titleColor: 'text-[#b91c1c]',
    body: "Your listing was not approved. Please review the broker's comments below and edit your listing.",
    bodyColor: 'text-[#991b1b]',
  },
}

export default function ListingStatusBanner({ status, comments }: ListingStatusBannerProps) {
  const cfg = configs[status]
  const brokerComments = comments.filter((c) => !c.fromSeller)

  return (
    <div className={`flex flex-col gap-3 rounded-xl border px-5 py-4 ${cfg.bg} ${cfg.border}`}>
      <div className="flex items-center gap-2.5">
        <span className={`size-2.5 shrink-0 rounded-full ${cfg.dot}`} />
        <h2 className={`text-[15px] font-bold ${cfg.titleColor}`}>{cfg.title}</h2>
      </div>
      <p className={`text-[13px] ${cfg.bodyColor}`}>{cfg.body}</p>

      {status === 'REJECTED' && brokerComments.length > 0 && (
        <div className="mt-1 flex flex-col gap-2">
          <p className="text-[11px] font-bold tracking-[0.5px] text-[#b91c1c] uppercase">
            Broker Feedback
          </p>
          {brokerComments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-lg border border-[#fca5a5] bg-white/70 px-3.5 py-2.5"
            >
              <p className="text-[12px] font-semibold text-[#7f1d1d]">
                {comment.author ?? 'Boat Brokers Team'}
              </p>
              <p className="mt-0.5 text-[12px] text-[#991b1b]">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
