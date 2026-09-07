import { IconChevronLeft, IconChevronRight } from './icons'

type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

function getPageItems(page: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)

  const items = new Set([1, 2, totalPages - 1, totalPages, page - 1, page, page + 1])
  const sorted = [...items].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)

  const withEllipsis: (number | 'ellipsis')[] = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) withEllipsis.push('ellipsis')
    withEllipsis.push(p)
  })
  return withEllipsis
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const items = getPageItems(page, totalPages)

  return (
    <nav aria-label="Boat listings pagination" className="flex items-center justify-center gap-2 pt-4">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="flex size-11 items-center justify-center rounded-xl border border-[#e2e8f0] text-[#1e293b] disabled:opacity-50"
      >
        <IconChevronLeft className="size-4" />
      </button>

      {items.map((item, i) =>
        item === 'ellipsis' ? (
          <span key={`ellipsis-${i}`} className="flex size-11 items-center justify-center text-[#9ca3af]">
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={item === page ? 'page' : undefined}
            className={`flex size-11 items-center justify-center rounded-xl text-base font-medium ${
              item === page
                ? 'bg-navy-dark text-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)]'
                : 'border border-[#e2e8f0] text-[#1e293b]'
            }`}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className="flex size-11 items-center justify-center rounded-xl border border-[#e2e8f0] text-[#1e293b] disabled:opacity-50"
      >
        <IconChevronRight className="size-4" />
      </button>
    </nav>
  )
}
