import { useEffect, useMemo, useState } from 'react'
import { useBoatListings, type BoatListing, type BoatStatus } from '../../../../data/boats'
import BoatListingCard from './BoatListingCard'
import Pagination from './Pagination'
import RangeSlider from './RangeSlider'
import { IconChevronDown, IconClose, IconFilter, IconMapPin, IconSearch } from './icons'

type Tab = { key: 'all' | Exclude<BoatStatus, null>; label: string }

const tabs: Tab[] = [
  { key: 'all', label: 'All Boats' },
  { key: 'featured', label: 'Featured Boats' },
  { key: 'under-offer', label: 'Under Offer' },
  { key: 'sold', label: 'Sold Boats' },
]

const BOAT_TYPES = ['Narrowboats', 'Widebeams', 'Cruisers', 'Sailing Boats']
const PRICE_MIN = 0
const PRICE_MAX = 200_000
const PRICE_STEP = 1_000
const LENGTH_MIN = 0
const LENGTH_MAX = 70
const LENGTH_STEP = 1
const BERTH_OPTIONS = [1, 2, 4, 6]
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
] as const

type SortValue = (typeof SORT_OPTIONS)[number]['value']

type Filters = {
  search: string
  boatTypes: string[]
  priceRange: [number, number]
  lengthRange: [number, number]
  minBerths: number
  location: string
  sortBy: SortValue
}

// Full range by default so nothing is filtered out until the user actually
// narrows a slider — a restrictive default (e.g. "£10k-£150k") would silently
// hide every sold/under-offer boat (they have no real price) before anyone
// touches a filter.
const DEFAULT_FILTERS: Filters = {
  search: '',
  boatTypes: ['Narrowboats'],
  priceRange: [PRICE_MIN, PRICE_MAX],
  lengthRange: [LENGTH_MIN, LENGTH_MAX],
  minBerths: 0,
  location: 'any',
  sortBy: 'newest',
}

const PAGE_SIZE = 6

function formatK(value: number) {
  return value >= 1000 ? `£${Math.round(value / 1000)}k` : `£${value}`
}

function priceRangeLabel([lo, hi]: [number, number]) {
  return `${formatK(lo)} - ${hi >= PRICE_MAX ? '£200k+' : formatK(hi)}`
}

function lengthRangeLabel([lo, hi]: [number, number]) {
  return `${lo}ft - ${hi >= LENGTH_MAX ? '70ft+' : `${hi}ft`}`
}

function applyFilters(boats: BoatListing[], filters: Filters): BoatListing[] {
  const query = filters.search.trim().toLowerCase()
  const typeSet = new Set(filters.boatTypes)
  const [priceLo, priceHi] = filters.priceRange
  const [lengthLo, lengthHi] = filters.lengthRange

  return boats.filter((boat) => {
    if (query && !boat.searchText.includes(query)) return false
    if (typeSet.size === 0 || !typeSet.has(boat.boatType)) return false

    // Sold/under-offer boats have priceValue 0, so narrowing the price range
    // above £0 correctly excludes them — same as any other real filter.
    if (boat.priceValue < priceLo) return false
    if (priceHi < PRICE_MAX && boat.priceValue > priceHi) return false

    // Only check length once the user has actually narrowed it (it defaults
    // to the full range). A boat with unparseable/missing length can't be
    // confirmed to meet an actively-requested range, so it's excluded then —
    // same reasoning as price above.
    const lengthActive = lengthLo > LENGTH_MIN || lengthHi < LENGTH_MAX
    if (lengthActive) {
      if (boat.lengthFeet === null) return false
      if (boat.lengthFeet < lengthLo) return false
      if (lengthHi < LENGTH_MAX && boat.lengthFeet > lengthHi) return false
    }

    if (filters.minBerths > 0 && (boat.berthsCount === null || boat.berthsCount < filters.minBerths)) return false

    if (filters.location !== 'any' && boat.location !== filters.location) return false

    return true
  })
}

function sortBoats(boats: BoatListing[], sortBy: SortValue): BoatListing[] {
  const withPrice = (b: BoatListing) => (b.priceValue > 0 ? b.priceValue : null)
  return [...boats].sort((a, b) => {
    if (sortBy === 'newest') return b.id - a.id

    const priceA = withPrice(a)
    const priceB = withPrice(b)
    // Boats with no real price sort to the end regardless of direction.
    if (priceA === null && priceB === null) return 0
    if (priceA === null) return 1
    if (priceB === null) return -1
    return sortBy === 'price-asc' ? priceA - priceB : priceB - priceA
  })
}

const SAVED_SEARCH_KEY = 'boatbrokers:saved-search'

type FilterPanelProps = {
  filters: Filters
  onChange: (next: Filters) => void
  onClear: () => void
  onApply: () => void
  onSave: () => void
  justSaved: boolean
  boatTypeCounts: Record<string, number>
  locationOptions: string[]
}

function FilterPanel({ filters, onChange, onClear, onApply, onSave, justSaved, boatTypeCounts, locationOptions }: FilterPanelProps) {
  function toggleBoatType(type: string) {
    const has = filters.boatTypes.includes(type)
    onChange({
      ...filters,
      boatTypes: has ? filters.boatTypes.filter((t) => t !== type) : [...filters.boatTypes, type],
    })
  }

  const allTypesSelected = filters.boatTypes.length === BOAT_TYPES.length

  function toggleAllBoatTypes() {
    onChange({ ...filters, boatTypes: allTypesSelected ? [] : [...BOAT_TYPES] })
  }

  function toggleBerths(option: number) {
    onChange({ ...filters, minBerths: filters.minBerths === option ? 0 : option })
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-4">
        <h3 className="text-lg font-bold text-[#1e293b]">Advanced Filters</h3>
        <button type="button" onClick={onClear} className="text-sm font-medium text-navy-dark hover:underline">
          Clear All
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-base font-semibold text-[#1e293b]">Boat Type</h4>
        <div className="flex flex-col gap-2">
          <label className="flex w-full items-center gap-3 border-b border-[#e2e8f0] pb-2 text-base text-[#475569]">
            <input
              type="checkbox"
              checked={allTypesSelected}
              ref={(el) => {
                if (el) el.indeterminate = !allTypesSelected && filters.boatTypes.length > 0
              }}
              onChange={toggleAllBoatTypes}
              className="size-[18px] accent-navy-dark"
            />
            <span className="font-medium text-[#1e293b]">All Types</span>
            <span className="ml-auto text-sm text-[#9ca3af]">
              ({Object.values(boatTypeCounts).reduce((sum, n) => sum + n, 0)})
            </span>
          </label>
          {BOAT_TYPES.map((type) => (
            <label key={type} className="flex w-full items-center gap-3 text-base text-[#475569]">
              <input
                type="checkbox"
                checked={filters.boatTypes.includes(type)}
                onChange={() => toggleBoatType(type)}
                className="size-[18px] accent-navy-dark"
              />
              <span className="text-[#1e293b]">{type}</span>
              <span className="ml-auto text-sm text-[#9ca3af]">({boatTypeCounts[type] ?? 0})</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between pb-2">
          <h4 className="text-base font-semibold text-[#1e293b]">Price Range</h4>
          <span className="text-sm text-navy-dark">{priceRangeLabel(filters.priceRange)}</span>
        </div>
        <RangeSlider
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={PRICE_STEP}
          value={filters.priceRange}
          onChange={(priceRange) => onChange({ ...filters, priceRange })}
        />
        <div className="flex items-center justify-between text-xs text-[#9ca3af]">
          <span>£0</span>
          <span>£200k+</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between pb-2">
          <h4 className="text-base font-semibold text-[#1e293b]">Length</h4>
          <span className="text-sm text-navy-dark">{lengthRangeLabel(filters.lengthRange)}</span>
        </div>
        <RangeSlider
          min={LENGTH_MIN}
          max={LENGTH_MAX}
          step={LENGTH_STEP}
          value={filters.lengthRange}
          onChange={(lengthRange) => onChange({ ...filters, lengthRange })}
        />
        <div className="flex items-center justify-between text-xs text-[#9ca3af]">
          <span>0ft</span>
          <span>70ft+</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-base font-semibold text-[#1e293b]">Berths</h4>
        <div className="flex items-center gap-2">
          {BERTH_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => toggleBerths(option)}
              className={`flex-1 rounded-[10px] border py-2 text-base ${
                filters.minBerths === option
                  ? 'border-navy-dark bg-[#e8f0fe] font-medium text-navy-dark'
                  : 'border-[#e2e8f0] text-[#1e293b]'
              }`}
            >
              {option}+
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-base font-semibold text-[#1e293b]">Location</h4>
        <div className="relative">
          <select
            value={filters.location}
            onChange={(e) => onChange({ ...filters, location: e.target.value })}
            className="w-full appearance-none rounded-[10px] border border-[#e2e8f0] bg-white px-4 py-2.5 text-base text-[#1e293b]"
          >
            <option value="any">Any Location</option>
            {locationOptions.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <IconChevronDown className="pointer-events-none absolute top-1/2 right-4 size-3.5 -translate-y-1/2 text-[#9ca3af]" />
        </div>
        {locationOptions.length === 0 && (
          <p className="text-xs text-[#9ca3af]">No location data yet — every listing will match.</p>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-[#e2e8f0] pt-6">
        <button
          type="button"
          onClick={onApply}
          className="w-full rounded-[10px] bg-navy-dark py-3 text-base font-medium text-white"
        >
          Apply Filters
        </button>
        <button
          type="button"
          onClick={onSave}
          className="w-full rounded-[10px] border border-navy-dark py-3 text-base font-medium text-navy-dark"
        >
          {justSaved ? 'Search Saved!' : 'Save Search'}
        </button>
      </div>
    </>
  )
}

export default function BoatsListing() {
  const { boats: boatListings, loading, error } = useBoatListings()
  const [activeTab, setActiveTab] = useState<Tab['key']>('all')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [justSaved, setJustSaved] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_SEARCH_KEY)
      if (raw) setFilters({ ...DEFAULT_FILTERS, ...JSON.parse(raw) })
    } catch {
      // ignore unavailable/corrupt localStorage
    }
  }, [])

  const tabCounts = useMemo(
    () =>
      tabs.reduce<Record<Tab['key'], number>>(
        (acc, tab) => {
          acc[tab.key] = tab.key === 'all' ? boatListings.length : boatListings.filter((b) => b.status === tab.key).length
          return acc
        },
        { all: 0, featured: 0, 'under-offer': 0, sold: 0 },
      ),
    [boatListings],
  )

  const tabFilteredBoats = useMemo(
    () => (activeTab === 'all' ? boatListings : boatListings.filter((boat) => boat.status === activeTab)),
    [activeTab, boatListings],
  )

  const boatTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const type of BOAT_TYPES) {
      counts[type] = tabFilteredBoats.filter((b) => b.boatType === type).length
    }
    return counts
  }, [tabFilteredBoats])

  const locationOptions = useMemo(
    () =>
      [...new Set(boatListings.map((b) => b.location))]
        .filter((loc) => loc !== 'Location available on request')
        .sort(),
    [boatListings],
  )

  const filteredBoats = useMemo(() => applyFilters(tabFilteredBoats, filters), [tabFilteredBoats, filters])
  const sortedBoats = useMemo(() => sortBoats(filteredBoats, filters.sortBy), [filteredBoats, filters.sortBy])

  const totalPages = Math.max(1, Math.ceil(sortedBoats.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedBoats = sortedBoats.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const isDefaultFilters = JSON.stringify(filters) === JSON.stringify(DEFAULT_FILTERS)

  type Chip = { key: string; label: string; onRemove: () => void }
  const chips: Chip[] = []
  if (filters.search.trim()) {
    chips.push({ key: 'search', label: `"${filters.search.trim()}"`, onRemove: () => updateFilters({ search: '' }) })
  }
  for (const type of filters.boatTypes) {
    chips.push({
      key: `type-${type}`,
      label: type,
      onRemove: () => updateFilters({ boatTypes: filters.boatTypes.filter((t) => t !== type) }),
    })
  }
  if (filters.priceRange[0] !== PRICE_MIN || filters.priceRange[1] !== PRICE_MAX) {
    chips.push({
      key: 'price',
      label: priceRangeLabel(filters.priceRange),
      onRemove: () => updateFilters({ priceRange: [PRICE_MIN, PRICE_MAX] }),
    })
  }
  if (filters.lengthRange[0] !== LENGTH_MIN || filters.lengthRange[1] !== LENGTH_MAX) {
    chips.push({
      key: 'length',
      label: lengthRangeLabel(filters.lengthRange),
      onRemove: () => updateFilters({ lengthRange: [LENGTH_MIN, LENGTH_MAX] }),
    })
  }
  if (filters.minBerths > 0) {
    chips.push({ key: 'berths', label: `${filters.minBerths}+ Berths`, onRemove: () => updateFilters({ minBerths: 0 }) })
  }
  if (filters.location !== 'any') {
    chips.push({ key: 'location', label: filters.location, onRemove: () => updateFilters({ location: 'any' }) })
  }

  function updateFilters(patch: Partial<Filters>) {
    setFilters((f) => ({ ...f, ...patch }))
    setPage(1)
  }

  function handleTabChange(tab: Tab['key']) {
    setActiveTab(tab)
    setPage(1)
  }

  function handlePageChange(nextPage: number) {
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleClearAll() {
    setFilters(DEFAULT_FILTERS)
    setPage(1)
  }

  function handleApplyFilters() {
    setShowMobileFilters(false)
  }

  function handleSaveSearch() {
    try {
      localStorage.setItem(SAVED_SEARCH_KEY, JSON.stringify(filters))
      setJustSaved(true)
      setTimeout(() => setJustSaved(false), 2000)
    } catch {
      // localStorage unavailable — nothing more we can do
    }
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
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            onClear={handleClearAll}
            onApply={handleApplyFilters}
            onSave={handleSaveSearch}
            justSaved={justSaved}
            boatTypeCounts={boatTypeCounts}
            locationOptions={locationOptions}
          />
        </aside>

        <div className="flex flex-1 flex-col gap-6">
          <div className="relative">
            <IconSearch className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#9ca3af]" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
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
                <FilterPanel
                  filters={filters}
                  onChange={setFilters}
                  onClear={handleClearAll}
                  onApply={handleApplyFilters}
                  onSave={handleSaveSearch}
                  justSaved={justSaved}
                  boatTypeCounts={boatTypeCounts}
                  locationOptions={locationOptions}
                />
              </div>
            )}

            {chips.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <span className="shrink-0 text-sm text-[#6b7280]">Active:</span>
                {chips.map((chip) => (
                  <span
                    key={chip.key}
                    className="flex shrink-0 items-center gap-2 rounded-full border border-[#f5f8fa] bg-[#e8f0fe] px-3 py-1.5 text-xs font-medium text-navy-darkest"
                  >
                    {chip.label}
                    <button type="button" onClick={chip.onRemove} aria-label={`Remove ${chip.label} filter`}>
                      <IconClose className="size-2.5" />
                    </button>
                  </span>
                ))}
                {!isDefaultFilters && (
                  <button type="button" onClick={handleClearAll} className="shrink-0 pl-1 text-sm font-medium text-[#6b7280]">
                    Clear All
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e2e8f0] pb-4">
            <p className="text-lg font-bold text-[#1e293b]">
              {sortedBoats.length} {sortedBoats.length === 1 ? 'boat' : 'boats'} found
            </p>
            <div className="flex items-center gap-2 text-sm text-[#6b7280]">
              <span>Sort by:</span>
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilters({ sortBy: e.target.value as SortValue })}
                  className="appearance-none rounded-[10px] border border-[#e2e8f0] bg-white py-1.5 pr-8 pl-3 text-sm text-[#1e293b]"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <IconChevronDown className="pointer-events-none absolute top-1/2 right-3 size-3 -translate-y-1/2 text-[#9ca3af]" />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-[380px] animate-pulse rounded-2xl border border-[#e2e8f0] bg-[#f8fafc]" />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#fca5a5] bg-[#fef2f2] py-16 text-center text-[#b91c1c]">
              <p>Couldn&rsquo;t load boats from the server: {error}</p>
              <p className="text-sm text-[#6b7280]">Make sure the API server is running at http://localhost:4000.</p>
            </div>
          ) : paginatedBoats.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {paginatedBoats.map((boat) => (
                <BoatListingCard key={boat.slug} boat={boat} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#e2e8f0] py-16 text-center text-[#6b7280]">
              <IconMapPin className="size-6 text-[#9ca3af]" />
              <p>No boats match these filters. Try widening your search.</p>
              {!isDefaultFilters && (
                <button type="button" onClick={handleClearAll} className="text-sm font-medium text-navy-dark hover:underline">
                  Clear all filters
                </button>
              )}
            </div>
          )}

          <Pagination page={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </div>
    </section>
  )
}
