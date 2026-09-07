import { useMemo, useState } from 'react'
import { boatListings, type BoatStatus } from '../../../../data/boats'
import BoatListingCard from './BoatListingCard'
import Pagination from './Pagination'
import { IconChevronDown, IconClose, IconFilter, IconMapPin, IconSearch } from './icons'

type Tab = { key: 'all' | Exclude<BoatStatus, null>; label: string }

const tabs: Tab[] = [
  { key: 'all', label: 'All Boats' },
  { key: 'featured', label: 'Featured Boats' },
  { key: 'under-offer', label: 'Under Offer' },
  { key: 'sold', label: 'Sold Boats' },
]

const boatTypes = [
  { label: 'Narrowboats', count: boatListings.length },
  { label: 'Widebeams', count: 0 },
  { label: 'Cruisers', count: 0 },
  { label: 'Sailing Boats', count: 0 },
]

const activeFilterChips = ['Narrowboats', '£10k - £150k', '40ft - 70ft']

const PAGE_SIZE = 6

function FilterPanel() {
  return (
    <>
      <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-4">
        <h3 className="text-lg font-bold text-[#1e293b]">Advanced Filters</h3>
        <button type="button" className="text-sm font-medium text-navy-dark hover:underline">
          Clear All
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-base font-semibold text-[#1e293b]">Boat Type</h4>
        <div className="flex flex-col gap-2">
          {boatTypes.map((type) => (
            <label key={type.label} className="flex w-full items-center gap-3 text-base text-[#475569]">
              <input type="checkbox" defaultChecked={type.label === 'Narrowboats'} className="size-[18px] accent-navy-dark" />
              <span className="text-[#1e293b]">{type.label}</span>
              <span className="ml-auto text-sm text-[#9ca3af]">({type.count})</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between pb-2">
          <h4 className="text-base font-semibold text-[#1e293b]">Price Range</h4>
          <span className="text-sm text-navy-dark">£10k - £150k</span>
        </div>
        <div className="relative h-1.5 w-full rounded-full bg-[#e5e7eb]">
          <div className="absolute inset-y-0 left-[10%] right-[30%] rounded-full bg-navy-dark" />
        </div>
        <div className="flex items-center justify-between text-xs text-[#9ca3af]">
          <span>£0</span>
          <span>£200k+</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between pb-2">
          <h4 className="text-base font-semibold text-[#1e293b]">Length</h4>
          <span className="text-sm text-navy-dark">40ft - 70ft</span>
        </div>
        <div className="relative h-1.5 w-full rounded-full bg-[#e5e7eb]">
          <div className="absolute inset-y-0 left-[40%] right-[20%] rounded-full bg-navy-dark" />
        </div>
        <div className="flex items-center justify-between text-xs text-[#9ca3af]">
          <span>0ft</span>
          <span>70ft+</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-base font-semibold text-[#1e293b]">Berths</h4>
        <div className="flex items-center gap-2">
          {['1+', '2+', '4+', '6+'].map((option, i) => (
            <button
              key={option}
              type="button"
              className={`flex-1 rounded-[10px] border py-2 text-base ${
                i === 1
                  ? 'border-navy-dark bg-[#e8f0fe] font-medium text-navy-dark'
                  : 'border-[#e2e8f0] text-[#1e293b]'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-base font-semibold text-[#1e293b]">Location</h4>
        <div className="relative">
          <select className="w-full appearance-none rounded-[10px] border border-[#e2e8f0] bg-white px-4 py-2.5 text-base text-[#1e293b]">
            <option>Any Location</option>
            <option>Leicestershire</option>
            <option>Cheshire</option>
          </select>
          <IconChevronDown className="pointer-events-none absolute top-1/2 right-4 size-3.5 -translate-y-1/2 text-[#9ca3af]" />
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-[#e2e8f0] pt-6">
        <button type="button" className="w-full rounded-[10px] bg-navy-dark py-3 text-base font-medium text-white">
          Apply Filters
        </button>
        <button
          type="button"
          className="w-full rounded-[10px] border border-navy-dark py-3 text-base font-medium text-navy-dark"
        >
          Save Search
        </button>
      </div>
    </>
  )
}

export default function BoatsListing() {
  const [activeTab, setActiveTab] = useState<Tab['key']>('all')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [page, setPage] = useState(1)

  const tabCounts = useMemo(
    () =>
      tabs.reduce<Record<Tab['key'], number>>(
        (acc, tab) => {
          acc[tab.key] = tab.key === 'all' ? boatListings.length : boatListings.filter((b) => b.status === tab.key).length
          return acc
        },
        { all: 0, featured: 0, 'under-offer': 0, sold: 0 },
      ),
    [],
  )

  const filteredBoats = useMemo(
    () => (activeTab === 'all' ? boatListings : boatListings.filter((boat) => boat.status === activeTab)),
    [activeTab],
  )

  const totalPages = Math.max(1, Math.ceil(filteredBoats.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedBoats = filteredBoats.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function handleTabChange(tab: Tab['key']) {
    setActiveTab(tab)
    setPage(1)
  }

  function handlePageChange(nextPage: number) {
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="flex flex-col gap-8 px-6 py-14 sm:px-16 sm:py-20">
      <div className="flex flex-col gap-6 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
        <div className="flex max-w-[36rem] flex-col gap-2">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e3f7fe] px-4 py-1.5 text-sm font-medium tracking-[0.7px] text-[#14b2ef] uppercase">
            <span className="size-2 rounded-full bg-blue" />
            Buy Your Boat
          </span>
          <h2 className="font-display text-[34px] leading-[1.2] tracking-[-2px] text-[#1e293b] capitalize sm:text-[3.375rem] sm:leading-[1.3]">
            Boats for Sale
          </h2>
          <p className="text-base leading-[26px] text-[#475569]">
            Explore our wide range of quality boats for sale. Use filters to find the perfect
            boat that suits your needs and budget.
          </p>
        </div>

        <div className="-mx-6 flex items-center gap-2 overflow-x-auto px-6 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:-mx-16 sm:px-16 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-150 ${
                activeTab === tab.key
                  ? 'bg-navy-dark text-white'
                  : 'border border-[#e2e8f0] bg-[#f8fafc] text-[#1e293b] hover:bg-[#eef2f7]'
              }`}
            >
              {tab.label} ({tabCounts[tab.key]})
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <aside className="hidden w-full flex-col gap-6 rounded-[10px] border border-[#e2e8f0] bg-white p-6 shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.06)] lg:flex lg:w-80 lg:shrink-0">
          <FilterPanel />
        </aside>

        <div className="flex flex-1 flex-col gap-6">
          <div className="relative">
            <IconSearch className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#9ca3af]" />
            <input
              type="text"
              placeholder="Search by boat name, builder, or keywords..."
              className="w-full rounded-[10px] border border-[#e2e8f0] bg-white py-3.5 pr-4 pl-11 text-base text-[#1e293b] placeholder:text-[#9ca3af]"
            />
          </div>

          <div className="flex flex-col gap-4 lg:hidden">
            <button
              type="button"
              onClick={() => setShowMobileFilters((v) => !v)}
              aria-expanded={showMobileFilters}
              className="flex items-center justify-center gap-2 rounded-[10px] border border-[#bedde9] bg-white py-3.5 text-base font-semibold text-[#1e293b]"
            >
              <IconFilter className="size-4" />
              Advanced Filters
            </button>

            {showMobileFilters && (
              <div className="flex flex-col gap-6 rounded-[10px] border border-[#e2e8f0] bg-white p-6 shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.06)]">
                <FilterPanel />
              </div>
            )}

            <div className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <span className="shrink-0 text-sm text-[#6b7280]">Active:</span>
              {activeFilterChips.map((chip) => (
                <span
                  key={chip}
                  className="flex shrink-0 items-center gap-2 rounded-full border border-[#f5f8fa] bg-[#e8f0fe] px-3 py-1.5 text-xs font-medium text-navy-darkest"
                >
                  {chip}
                  <IconClose className="size-2.5" />
                </span>
              ))}
              <button type="button" className="shrink-0 pl-1 text-sm font-medium text-[#6b7280]">
                Clear All
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e2e8f0] pb-4">
            <p className="text-lg font-bold text-[#1e293b]">
              {filteredBoats.length} {filteredBoats.length === 1 ? 'boat' : 'boats'} found
            </p>
            <div className="flex items-center gap-2 text-sm text-[#6b7280]">
              <span>Sort by:</span>
              <div className="relative">
                <select className="appearance-none rounded-[10px] border border-[#e2e8f0] bg-white py-1.5 pr-8 pl-3 text-sm text-[#1e293b]">
                  <option>Newest First</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
                <IconChevronDown className="pointer-events-none absolute top-1/2 right-3 size-3 -translate-y-1/2 text-[#9ca3af]" />
              </div>
            </div>
          </div>

          {paginatedBoats.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {paginatedBoats.map((boat) => (
                <BoatListingCard key={boat.slug} boat={boat} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#e2e8f0] py-16 text-center text-[#6b7280]">
              <IconMapPin className="size-6 text-[#9ca3af]" />
              <p>No boats match this filter yet. Check back soon.</p>
            </div>
          )}

          <Pagination page={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </div>
    </section>
  )
}
