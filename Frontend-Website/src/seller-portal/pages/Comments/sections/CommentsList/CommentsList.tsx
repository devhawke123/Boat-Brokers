import { useMemo, useState } from 'react'
import type { ApiBoatListing } from '../../../../lib/api'
import { formatDateTime } from '../../../../lib/formatDate'
import searchIcon from '../../../../assets/MyBoats/search-icon.svg'
import commentIcon from '../../../../assets/MyBoats/comment-icon.svg'
import chevronLeft from '../../../../assets/MyBoats/chevron-left.svg'
import chevronRight from '../../../../assets/MyBoats/chevron-right.svg'

type CommentsListProps = {
  listings: ApiBoatListing[]
}

const pageSizeOptions = [5, 10, 20]

function totalCommentCount(listing: ApiBoatListing) {
  return listing.comments.reduce((count, comment) => count + 1 + comment.replies.length, 0)
}

function lastActivity(listing: ApiBoatListing) {
  const all = listing.comments.flatMap((comment) => [comment, ...comment.replies])
  return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] ?? null
}

export default function CommentsList({ listings }: CommentsListProps) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (query === '') return listings
    return listings.filter((listing) => listing.boat.name.toLowerCase().includes(query))
  }, [listings, search])

  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) => {
        const aDate = lastActivity(a)?.createdAt ?? a.createdAt
        const bDate = lastActivity(b)?.createdAt ?? b.createdAt
        return new Date(bDate).getTime() - new Date(aDate).getTime()
      }),
    [filtered],
  )

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * pageSize
  const paginated = sorted.slice(pageStart, pageStart + pageSize)

  function updateSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  function updatePageSize(size: number) {
    setPageSize(size)
    setPage(1)
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f3f4f6] px-5 py-3">
        <h2 className="font-display text-lg text-[#0f172a] capitalize">Comments</h2>

        <label className="relative flex items-center">
          <img src={searchIcon} alt="" aria-hidden="true" className="absolute left-3 size-3" />
          <input
            type="search"
            value={search}
            onChange={(event) => updateSearch(event.target.value)}
            placeholder="Search listings..."
            className="h-8 w-56 rounded-md border border-[#e5e7eb] bg-[#f8fafc] pr-3 pl-8 text-xs text-ink placeholder:text-[#9ca3af] focus:border-navy-dark focus:outline-none"
          />
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[52rem] border-collapse">
          <thead>
            <tr className="bg-[#f8fafc]">
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Boat
              </th>
              <th className="px-5 py-3 text-center text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Comments
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Last Comment
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((listing) => {
              const last = lastActivity(listing)
              return (
                <tr key={listing.id} className="border-t border-[#f3f4f6]">
                  <td className="py-2 pr-5 pl-5">
                    <div className="flex items-center gap-2.5">
                      {listing.boat.imageUrl ? (
                        <img
                          src={listing.boat.imageUrl}
                          alt=""
                          className="size-11 shrink-0 rounded-[5px] object-cover"
                        />
                      ) : (
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-[5px] bg-[#f1f5f9] text-[10px] text-[#94a3b8]">
                          No photo
                        </span>
                      )}
                      <span className="font-display text-sm text-[#0a192f]">{listing.boat.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-2">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#475569]">
                      <img src={commentIcon} alt="" aria-hidden="true" className="size-3" />
                      {totalCommentCount(listing)}
                    </div>
                  </td>
                  <td className="px-5 py-2">
                    {last ? (
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#0f172a]">{last.author ?? 'Anonymous'}</span>
                          <span className="text-[10.5px] text-[#94a3b8]">{formatDateTime(last.createdAt)}</span>
                        </div>
                        <p className="max-w-[19rem] truncate text-xs text-[#64748b]">&ldquo;{last.content}&rdquo;</p>
                      </div>
                    ) : (
                      <span className="text-xs text-[#94a3b8]">—</span>
                    )}
                  </td>
                  <td className="px-5 py-2 text-right">
                    <a
                      href={`/seller-portal/comments/${listing.id}`}
                      className="inline-flex items-center justify-center rounded-md border border-[#e5e7eb] px-3 py-1 text-[9.5px] font-bold text-[#102a43] transition-colors duration-300 hover:bg-[#f8fafc]"
                    >
                      View
                    </a>
                  </td>
                </tr>
              )
            })}

            {paginated.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-sm text-[#64748b]">
                  {listings.length === 0
                    ? 'No conversations yet.'
                    : search
                      ? `No listings match "${search}".`
                      : 'No conversations in this category.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {sorted.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e5eaf0] px-6 py-4">
          <p className="text-sm text-[#64748b]">
            Showing <span className="font-semibold text-[#0f172a]">{pageStart + 1}</span> to{' '}
            <span className="font-semibold text-[#0f172a]">{Math.min(pageStart + pageSize, sorted.length)}</span> of{' '}
            <span className="font-semibold text-[#0f172a]">{sorted.length}</span> listings
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex size-9 items-center justify-center rounded-lg border border-[#e5eaf0] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous page"
            >
              <img src={chevronLeft} alt="" className="h-3 w-[0.47rem]" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNumber = i + 1
              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={
                    pageNumber === currentPage
                      ? 'flex size-9 items-center justify-center rounded-lg bg-navy-dark text-sm font-bold text-white'
                      : 'flex size-9 items-center justify-center rounded-lg text-sm font-medium text-[#0f172a] transition-colors duration-300 hover:bg-[#f8fafc]'
                  }
                >
                  {pageNumber}
                </button>
              )
            })}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex size-9 items-center justify-center rounded-lg border border-[#e5eaf0] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next page"
            >
              <img src={chevronRight} alt="" className="h-3 w-[0.47rem]" />
            </button>
          </div>

          <label className="flex items-center gap-2 text-sm text-[#64748b]">
            Show
            <select
              value={pageSize}
              onChange={(event) => updatePageSize(Number(event.target.value))}
              className="rounded-lg border border-[#e5eaf0] bg-white px-3 py-1.5 text-sm font-semibold text-[#0f172a] focus:border-navy-dark focus:outline-none"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            per page
          </label>
        </div>
      )}
    </div>
  )
}
