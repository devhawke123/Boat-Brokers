import { useMemo, useState } from 'react'
import type { ApiBlogPostAdmin } from '../../../../lib/api'
import chevronLeft from '../../../../../seller-portal/assets/MyBoats/chevron-left.svg'
import chevronRight from '../../../../../seller-portal/assets/MyBoats/chevron-right.svg'

type BlogsTableProps = {
  posts: ApiBlogPostAdmin[]
  onDelete: (post: ApiBlogPostAdmin) => void
}

const pageSizeOptions = [5, 10, 20]

export default function BlogsTable({ posts, onDelete }: BlogsTableProps) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (query === '') return posts
    return posts.filter(
      (post) => post.title.toLowerCase().includes(query) || post.author.toLowerCase().includes(query),
    )
  }, [posts, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * pageSize
  const paginated = filtered.slice(pageStart, pageStart + pageSize)

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
        <input
          type="search"
          value={search}
          onChange={(event) => updateSearch(event.target.value)}
          placeholder="Search blog posts..."
          className="h-8 w-56 rounded-md border border-[#e5e7eb] bg-[#f8fafc] px-3 text-xs text-ink placeholder:text-[#9ca3af] focus:border-navy-dark focus:outline-none"
        />
        <a
          href="/admin-portal/blogs/new"
          className="inline-flex h-8 items-center rounded-md bg-navy-dark px-3 text-xs font-bold text-white transition-opacity duration-300 hover:opacity-90"
        >
          Add New Post
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[52rem] border-collapse">
          <thead>
            <tr className="bg-[#f8fafc]">
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Post
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Author
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Date
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Read Time
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-[0.08em] text-[#64748b] uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((post) => (
              <tr key={post.id} className="border-t border-[#f3f4f6]">
                <td className="py-2 pr-5 pl-5">
                  <div className="flex items-center gap-2.5">
                    {post.imageUrl ? (
                      <img src={post.imageUrl} alt="" className="size-11 shrink-0 rounded-[5px] object-cover" />
                    ) : (
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-[5px] bg-[#f1f5f9] text-[10px] text-[#94a3b8]">
                        No photo
                      </span>
                    )}
                    <span className="font-display text-sm text-[#0a192f]">{post.title}</span>
                  </div>
                </td>
                <td className="px-5 py-2 text-xs text-[#64748b]">{post.author}</td>
                <td className="px-5 py-2 text-xs text-[#64748b]">{post.date}</td>
                <td className="px-5 py-2 text-xs text-[#64748b]">{post.readTime}</td>
                <td className="px-5 py-2 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-md border border-[#e5e7eb] px-3 py-1 text-[9.5px] font-bold text-[#102a43] transition-colors duration-300 hover:bg-[#f8fafc]"
                    >
                      View
                    </a>
                    <a
                      href={`/admin-portal/blogs/${post.id}/edit`}
                      className="inline-flex items-center justify-center rounded-md border border-[#e5e7eb] px-3 py-1 text-[9.5px] font-bold text-[#102a43] transition-colors duration-300 hover:bg-[#f8fafc]"
                    >
                      Edit
                    </a>
                    <button
                      type="button"
                      onClick={() => onDelete(post)}
                      className="inline-flex items-center justify-center rounded-md border border-[#fecaca] px-3 py-1 text-[9.5px] font-bold text-[#dc2626] transition-colors duration-300 hover:bg-[#fef2f2]"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-[#64748b]">
                  {posts.length === 0 ? 'No blog posts yet.' : `No posts match "${search}".`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e5eaf0] px-6 py-4">
          <p className="text-sm text-[#64748b]">
            Showing <span className="font-semibold text-[#0f172a]">{pageStart + 1}</span> to{' '}
            <span className="font-semibold text-[#0f172a]">{Math.min(pageStart + pageSize, filtered.length)}</span>{' '}
            of <span className="font-semibold text-[#0f172a]">{filtered.length}</span> posts
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
