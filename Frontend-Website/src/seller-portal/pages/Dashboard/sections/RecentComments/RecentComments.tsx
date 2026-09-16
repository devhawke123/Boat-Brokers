import type { ApiBoatListing } from '../../../../lib/api'
import { formatDate } from '../../../../lib/formatDate'

type RecentCommentsProps = {
  listings: ApiBoatListing[]
}

type FlatComment = {
  id: number
  author: string
  listingName: string
  date: string
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function RecentComments({ listings }: RecentCommentsProps) {
  const comments: FlatComment[] = listings
    .flatMap((listing) =>
      listing.comments.map((comment) => ({
        id: comment.id,
        author: comment.author ?? 'Anonymous',
        listingName: listing.boat.name,
        date: comment.createdAt,
      })),
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <div className="w-full overflow-hidden rounded-lg border border-[#e2e8f0] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="border-b border-[#f1f5f9] px-6 py-6">
        <h2 className="font-display text-lg text-[#0f172a] capitalize">Recent Comments</h2>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#f8fafc]">
            <th className="px-6 py-4 text-left text-[10px] font-bold tracking-[0.05em] text-[#64748b] uppercase">
              Admin Name
            </th>
            <th className="px-6 py-4 text-left text-[10px] font-bold tracking-[0.05em] text-[#64748b] uppercase">
              Boat Listing
            </th>
            <th className="px-6 py-4 text-left text-[10px] font-bold tracking-[0.05em] text-[#64748b] uppercase">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment) => (
            <tr key={comment.id} className="border-t border-[#f1f5f9]">
              <td className="py-3 pr-6 pl-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#eff6ff] text-[11px] font-bold text-[#0b3a58]">
                    {initials(comment.author)}
                  </span>
                  <span className="text-sm font-medium text-[#0f172a]">{comment.author}</span>
                </div>
              </td>
              <td className="px-6 py-3 text-sm text-[#0f172a]">{comment.listingName}</td>
              <td className="px-6 py-3 text-xs text-[#64748b]">{formatDate(comment.date)}</td>
            </tr>
          ))}

          {comments.length === 0 && (
            <tr>
              <td colSpan={3} className="px-6 py-6 text-center text-sm text-[#64748b]">
                No comments yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
