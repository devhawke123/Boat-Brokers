import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ImageOff, MessageCircle, Plus, Sailboat, Search, X } from 'lucide-react'
import { V2Sidebar, V2Header, V2Link as Link, Arrow } from '../components/V2Workspace'
import { SelectField } from '../components/WizardFields'
import ToastNotice, { type Notice } from '../components/ToastNotice'
import { useListings } from '../context/useListings'
import { filterBoats } from '../lib/boatCollection'
import type { ClientListing } from '../lib/listingAdapter'
import { inventoryMotion, quick } from '../lib/motion'
import { revealProps } from '../lib/v2Motion'
import './dashboard-v2.css'
import './v2-boats.css'

const money = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 })
const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
const PAGE_SIZE = 6
const filters = [
  { value: 'All boats', label: 'All boats' },
  { value: 'Approved', label: 'Live', tone: 'live' },
  { value: 'Pending', label: 'In review', tone: 'pending' },
  { value: 'Rejected', label: 'Needs changes', tone: 'rejected' },
  { value: 'Draft', label: 'Drafts', tone: 'draft' },
]

function BoatCard({ listing }: { listing: ClientListing }) {
  const reduced = useReducedMotion()
  const [failed, setFailed] = useState(false)
  const [focused, setFocused] = useState(false)
  const data = listing.details
  const status = filters.find((filter) => filter.value === listing.status) || filters[4]
  const href = `/boats/${encodeURIComponent(listing.id)}`
  const isDraft = listing.status === 'Draft'
  const action = isDraft ? `/boats/new/review?draft=${encodeURIComponent(listing.id)}` : href
  const image = listing.photos[0]?.src
  const comments = listing.comments
  const date = isDraft ? listing.updatedAt || listing.submittedAt : listing.submittedAt
  const formattedDate = /^\d{4}-\d{2}-\d{2}$/.test(date || '') ? dateFormat.format(new Date(`${date}T00:00:00Z`)) : null
  const facts = [data.length && `${data.length} ft`, data.berths && `${data.berths} berths`, data.city].filter(Boolean)
  return (
    <motion.li
      className="v2-boat-card v2-glass-surface"
      initial="rest"
      animate={focused ? 'hover' : 'rest'}
      whileHover="hover"
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false)
      }}
    >
      <div className="v2-boat-photo">
        <Link to={href} className="v2-boat-photo-link" aria-label={`View ${listing.name}`}>
          {image && !failed ? (
            <motion.img
              src={image}
              alt={listing.name}
              loading="lazy"
              decoding="async"
              onError={() => setFailed(true)}
              variants={{ rest: { scale: 1 }, hover: { scale: reduced ? 1 : 1.035 } }}
              transition={inventoryMotion.media}
            />
          ) : (
            <span className="v2-boat-no-photo">
              <ImageOff size={25} strokeWidth={1.3} aria-hidden="true" />
              <span>Photo unavailable</span>
            </span>
          )}
        </Link>
        <span className={`v2-boat-status ${status.tone}`}>{isDraft ? 'Draft' : status.label}</span>
      </div>
      <article className="v2-boat-body" aria-label={listing.name}>
        <div className="v2-boat-content">
          <div className="v2-boat-title-row">
            <div>
              <p className="v2-boat-type">{listing.type}</p>
              <h2>
                <Link to={href}>{listing.name}</Link>
              </h2>
            </div>
            <p className="v2-boat-price">{listing.price ? money.format(listing.price) : 'Price not set'}</p>
          </div>
          <p className="v2-boat-builder">{[data.builder, data.year].filter(Boolean).join(' · ') || 'Details in progress'}</p>
          {facts.length > 0 && (
            <ul className="v2-boat-facts" aria-label="Boat specifications">
              {facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="v2-boat-footer">
          <div className="v2-boat-meta">
            {formattedDate && (
              <p>
                {isDraft ? 'Saved' : 'Submitted'} <time dateTime={date}>{formattedDate}</time>
              </p>
            )}
            <Link
              to={`${href}#listing-comments`}
              className="v2-boat-comments"
              aria-label={`${comments.length} comment${comments.length === 1 ? '' : 's'} on ${listing.name}`}
            >
              <MessageCircle size={13} strokeWidth={1.5} aria-hidden="true" />
              {comments.length}
            </Link>
          </div>
          <Link
            to={action}
            className="v2-boat-action"
            variants={{ rest: { backgroundColor: '#e5f1f980' }, hover: { backgroundColor: '#dceef9' } }}
          >
            {isDraft ? 'Continue editing' : 'View listing'}
            <Arrow size={14} direction={isDraft ? 'right' : 'diagonal'} />
          </Link>
        </div>
      </article>
    </motion.li>
  )
}

export default function V2Boats() {
  const { listings } = useListings()
  const reduced = useReducedMotion()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [today] = useState(() => new Date())
  const [notice, setNotice] = useState<Notice | null>(location.state?.notice || null)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('Newest first')
  const [page, setPage] = useState(1)
  const searchRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLElement>(null)
  const filterId = useId()
  const status = filters.find((filter) => filter.value.toLowerCase() === searchParams.get('status')?.toLowerCase())?.value || 'All boats'
  const filtered = useMemo(() => filterBoats(listings, { query, sort, status }), [listings, query, sort, status])
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const first = filtered.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0
  const last = Math.min(currentPage * PAGE_SIZE, filtered.length)
  const visible = filtered.slice(first ? first - 1 : 0, last)
  useEffect(() => {
    document.title = 'My boats · The Boat Brokers'
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])
  useEffect(() => {
    if (location.state?.notice) navigate(`${location.pathname}${location.search}`, { replace: true, state: null })
  }, [location.pathname, location.search, location.state, navigate])
  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(() => setNotice(null), 6500)
    return () => window.clearTimeout(timer)
  }, [notice])
  function setStatus(value: string) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      if (value === 'All boats') next.delete('status')
      else next.set('status', value.toLowerCase())
      return next
    })
    setPage(1)
  }
  function clearFilters() {
    setQuery('')
    setStatus('All boats')
    searchRef.current?.focus()
  }
  function goToPage(value: number) {
    setPage(value)
    resultsRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
    resultsRef.current?.focus({ preventScroll: true })
  }
  return (
    <div className="dashboard-v2 v2-collection-page">
      <div className="v2-backdrop" aria-hidden="true" />
      <a href="#v2-boats-main" className="v2-skip">
        Skip to boat collection
      </a>
      <div className="v2-workspace">
        <V2Sidebar onNotice={setNotice} />
        <main id="v2-boats-main" className="v2-main" tabIndex={-1}>
          <V2Header title="My boats" today={today} onSearch={() => searchRef.current?.focus()} />
          <motion.header className="v2-collection-heading" {...revealProps(reduced)}>
            <div>
              <h1>My boats.</h1>
            </div>
            <Link
              to="/boats/new/basic"
              className="v2-create"
              variants={{ rest: { backgroundColor: '#ffffffb0' }, hover: { backgroundColor: '#ffffff' } }}
            >
              <Plus size={15} strokeWidth={1.6} aria-hidden="true" />
              New listing
            </Link>
          </motion.header>
          <motion.section
            className="v2-collection-controls v2-glass-surface"
            aria-label="Find and filter boats"
            {...revealProps(reduced, 0.06)}
          >
            <LayoutGroup id={filterId}>
              <div className="v2-collection-tabs" role="group" aria-label="Filter boats by status">
                {filters.map((filter) => (
                  <motion.button
                    type="button"
                    key={filter.value}
                    aria-pressed={status === filter.value}
                    onClick={() => setStatus(filter.value)}
                    whileTap={reduced ? undefined : { scale: 0.98 }}
                    className={status === filter.value ? 'is-active' : ''}
                  >
                    {status === filter.value && (
                      <motion.span
                        className="v2-collection-tab-active"
                        layoutId="collection-filter"
                        transition={{ ...inventoryMotion.indicator, duration: reduced ? 0 : inventoryMotion.indicator.duration }}
                      />
                    )}
                    <span>{filter.label}</span>
                    <span className="v2-collection-tab-count">
                      {filter.value === 'All boats'
                        ? listings.length
                        : listings.filter((listing) => listing.status === filter.value).length}
                    </span>
                  </motion.button>
                ))}
              </div>
            </LayoutGroup>
            <div className="v2-collection-search-row">
              <label className="v2-collection-search">
                <span className="sr-only">Search boats by name, type, builder or year</span>
                <Search size={16} strokeWidth={1.6} aria-hidden="true" />
                <input
                  ref={searchRef}
                  aria-label="Search boats by name, type, builder or year"
                  type="search"
                  placeholder="Search by boat, builder or year…"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value)
                    setPage(1)
                  }}
                />
                {query && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => {
                      setQuery('')
                      setPage(1)
                      searchRef.current?.focus()
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </label>
              <div className="v2-collection-sort">
                <SelectField
                  label="Sort boats"
                  labelHidden
                  name="boat-sort"
                  variant="v2"
                  menuWidth={195}
                  value={sort}
                  options={['Newest first', 'Oldest first', 'Price: high to low', 'Price: low to high', 'Name A–Z']}
                  onChange={(event) => {
                    setSort(event.target.value)
                    setPage(1)
                  }}
                />
              </div>
            </div>
          </motion.section>
          <motion.section
            ref={resultsRef}
            className="v2-collection-results"
            tabIndex={-1}
            aria-label="Boat inventory"
            {...revealProps(reduced, 0.12)}
          >
            <div className="v2-collection-results-heading">
              <h2>{status === 'All boats' ? 'Your collection' : filters.find((filter) => filter.value === status)?.label}</h2>
              <p role="status">{filtered.length ? `${first}–${last} of ${filtered.length} boats` : '0 boats'}</p>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${query.trim()}|${status}|${sort}|${currentPage}`}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ ...inventoryMotion.row, duration: reduced ? 0 : 0.3 }}
              >
                {visible.length ? (
                  <ul className="v2-boat-grid">
                    {visible.map((listing) => (
                      <BoatCard key={listing.id} listing={listing} />
                    ))}
                  </ul>
                ) : (
                  <div className="v2-collection-empty v2-glass-surface">
                    <span aria-hidden="true">
                      <Sailboat size={25} strokeWidth={1.3} />
                    </span>
                    <h2>{listings.length ? 'No boats found' : 'Your collection starts here'}</h2>
                    <p>
                      {listings.length
                        ? 'Try another search or status to find your boat.'
                        : 'Add your first boat and follow its progress here.'}
                    </p>
                    {listings.length ? (
                      <motion.button type="button" onClick={clearFilters} whileHover={{ backgroundColor: '#dceef9' }} transition={quick}>
                        Reset filters
                      </motion.button>
                    ) : (
                      <Link to="/boats/new/basic" className="v2-boat-action">
                        Create your first listing
                        <Arrow direction="right" />
                      </Link>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            {pageCount > 1 && (
              <nav className="v2-collection-pagination" aria-label="Boat listing pages">
                <motion.button
                  type="button"
                  aria-label="Previous page"
                  disabled={currentPage === 1}
                  onClick={() => goToPage(currentPage - 1)}
                  whileHover={{ backgroundColor: '#ffffff' }}
                  transition={quick}
                >
                  <ChevronLeft size={15} />
                  Previous
                </motion.button>
                <span>
                  {currentPage} <span>/ {pageCount}</span>
                </span>
                <motion.button
                  type="button"
                  aria-label="Next page"
                  disabled={currentPage === pageCount}
                  onClick={() => goToPage(currentPage + 1)}
                  whileHover={{ backgroundColor: '#ffffff' }}
                  transition={quick}
                >
                  Next
                  <ChevronRight size={15} />
                </motion.button>
              </nav>
            )}
          </motion.section>
        </main>
      </div>
      <ToastNotice notice={notice} onClose={() => setNotice(null)} />
    </div>
  )
}
