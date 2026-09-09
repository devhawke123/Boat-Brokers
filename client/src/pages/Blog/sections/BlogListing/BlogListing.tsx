import { useMemo, useState } from 'react'
import { blogPosts } from '../../../../data/blogPosts'
import BlogCard from './BlogCard'
import { IconChevronDown, IconGrid, IconList, IconSearch } from './icons'

type SortOption = 'newest' | 'oldest' | 'title'

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'title', label: 'Title A-Z' },
]

const PAGE_SIZE = 6

export default function BlogListing() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('newest')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase()
    const results = query
      ? blogPosts.filter(
          (post) =>
            post.title.toLowerCase().includes(query) ||
            post.category.toLowerCase().includes(query) ||
            post.excerpt.toLowerCase().includes(query),
        )
      : [...blogPosts]

    if (sort === 'title') {
      results.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sort === 'oldest') {
      results.reverse()
    }

    return results
  }, [search, sort])

  const visiblePosts = filteredPosts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredPosts.length

  function handleSearchChange(value: string) {
    setSearch(value)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <section className="flex flex-col items-center gap-8 bg-white px-6 py-12 sm:gap-12 sm:px-16 sm:py-24 lg:px-20">
      <div className="flex max-w-[38.125rem] flex-col items-center gap-3 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#e3f7fe] px-4 py-1.5 text-[10px] font-medium tracking-[0.7px] text-[#14b2ef] uppercase sm:text-sm">
          <span className="size-2 rounded-full bg-blue" />
          Blog
        </span>
        <h2 className="font-display text-[34px] leading-[1.2] tracking-[-2px] text-black capitalize sm:leading-[1.3] sm:text-[3.375rem]">
          Insights from The Boat Brokers
        </h2>
        <p className="max-w-[51.5rem] text-sm leading-[26px] text-[#6e6e6e] sm:text-base">
          Discover expert advice, practical guides and helpful insights from The Boat Brokers to
          make buying, selling and owning a narrowboat simpler and more confident.
        </p>
      </div>

      <div className="flex w-full max-w-[80rem] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-[26.75rem]">
          <IconSearch className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#9ca3af]" />
          <input
            type="text"
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search by Category, or keywords..."
            className="w-full rounded-[10px] border border-[#e2e8f0] bg-white py-3.5 pr-4 pl-11 text-sm text-[#1e293b] placeholder:text-[#9ca3af] sm:text-base"
          />
        </div>

        <div className="flex items-center justify-end gap-4 sm:justify-start sm:gap-8">
          <div className="flex items-center gap-2 text-sm text-[#6b7280]">
            <span className="whitespace-nowrap">Sort by:</span>
            <div className="relative">
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOption)}
                className="appearance-none rounded-[10px] border border-[#e2e8f0] bg-white py-1.5 pr-8 pl-3 text-sm text-[#1e293b]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <IconChevronDown className="pointer-events-none absolute top-1/2 right-3 size-3 -translate-y-1/2 text-[#9ca3af]" />
            </div>
          </div>

          <div className="hidden overflow-hidden rounded-xl border border-[#e2e8f0] sm:flex">
            <button
              type="button"
              onClick={() => setView('grid')}
              aria-pressed={view === 'grid'}
              aria-label="Grid view"
              className={`flex size-10 items-center justify-center border-r border-[#e2e8f0] ${
                view === 'grid' ? 'bg-[#ededed] text-[#1e293b]' : 'bg-white text-[#9ca3af]'
              }`}
            >
              <IconGrid className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setView('list')}
              aria-pressed={view === 'list'}
              aria-label="List view"
              className={`flex size-10 items-center justify-center ${
                view === 'list' ? 'bg-[#ededed] text-[#1e293b]' : 'bg-white text-[#9ca3af]'
              }`}
            >
              <IconList className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {visiblePosts.length > 0 ? (
        <div
          className={`grid w-full max-w-[80rem] gap-6 ${
            view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
          }`}
        >
          {visiblePosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex w-full max-w-[80rem] flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#e2e8f0] py-16 text-center text-[#6b7280]">
          <p>No articles match your search yet. Try a different keyword.</p>
        </div>
      )}

      {hasMore && (
        <button
          type="button"
          onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0d5673] px-6 py-3 text-base font-semibold text-white shadow-btn transition-[transform,opacity] duration-150 ease-out hover:opacity-90 active:scale-[0.98]"
        >
          Load More
        </button>
      )}
    </section>
  )
}
