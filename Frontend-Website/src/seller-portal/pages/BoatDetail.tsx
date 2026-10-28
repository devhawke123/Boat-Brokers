import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactElement,
} from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Expand,
  ImageOff,
  Mail,
  MessageCircle,
  Pencil,
  Phone,
  Send,
  X,
} from 'lucide-react'
import { useListings } from '../context/useListings'
import type { ClientListing, TextKey, WizardData } from '../lib/listingAdapter'
import type { Notice } from '../components/ToastNotice'
import { directionalArrowVariants, EASE, inventoryMotion } from '../lib/motion'
import { completedAdditionalDetails } from '../lib/additionalDetails'

const DetailTheme = createContext(false)

type FieldSpec = [key: string, label: string, unit?: string]

const groups: [string, FieldSpec[]][] = [
  [
    'History',
    [
      ['cin', 'CIN / hull ID'],
      ['crt', 'CRT number'],
      ['licence', 'Boat licence number'],
      ['previousOwners', 'Previous owners'],
      ['ownershipHistory', 'Ownership history'],
      ['engineService', 'Engine service history'],
      ['boilerService', 'Boiler service history'],
      ['hullMaintenance', 'Hull maintenance'],
      ['anodes', 'Anode maintenance'],
      ['documentation', 'Available documentation'],
      ['lastService', 'Last service'],
      ['recentSurvey', 'Recent survey'],
      ['blacking', 'Blacking'],
      ['boatSafety', 'Boat safety certificate'],
    ],
  ],
  [
    'Dimensions',
    [
      ['length', 'Length overall', 'ft'],
      ['beam', 'Beam', 'ft'],
      ['draft', 'Draft', 'ft'],
      ['internalHeadroom', 'Internal headroom', 'ft'],
      ['saloonLength', 'Saloon length', 'ft'],
      ['galleyLength', 'Galley length', 'ft'],
      ['sternType', 'Stern type'],
      ['steelSpec', 'Steel specification'],
    ],
  ],
  [
    'Engine',
    [
      ['engineModel', 'Engine / model'],
      ['engineHours', 'Engine hours', 'hrs'],
      ['gearbox', 'Gearbox'],
      ['fuelCapacity', 'Fuel capacity', 'L'],
    ],
  ],
  [
    'Water & Heating',
    [
      ['centralHeating', 'Central heating'],
      ['hotWater', 'Hot water source'],
      ['waterCapacity', 'Water tank capacity', 'L'],
    ],
  ],
  [
    'Electrical',
    [
      ['batteries', 'Battery bank'],
      ['inverter', 'Inverter / charger'],
      ['solarPanels', 'Solar panels'],
      ['shorePower', 'Shore power'],
    ],
  ],
  [
    'Interior',
    [
      ['berths', 'Berths'],
      ['insulation', 'Insulation'],
      ['saloonSeating', 'Saloon seating'],
      ['galleyEquipment', 'Galley equipment'],
      ['fitOut', 'Fit-out'],
      ['interiorNotes', 'Interior notes'],
    ],
  ],
]
const statusPanel: Record<string, string> = {
  Pending: 'border-[#ead29b] bg-[#fff7e5] text-[#805000]',
  Approved: 'border-[#b4deca] bg-[#edf9f2] text-[#086a44]',
  Rejected: 'border-[#efbcc4] bg-[#fff0f2] text-[#a51f36]',
}
const MotionLink = motion.create(Link)
const statusCopy: Record<string, string> = {
  Draft: 'Continue editing before submitting for review.',
  Pending: 'Awaiting broker review',
  Approved: 'Your listing has been approved',
  Rejected: 'Please make these changes before submitting your listing.',
}
const hasValue = (value: unknown) => value !== undefined && value !== null && String(value).trim() !== ''
const date = (value: string) =>
  value
    ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${value}T12:00:00`))
    : 'Not provided'
const money = (value: number | null) =>
  value !== null && value !== undefined
    ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(value)
    : 'Price on request'

function Reveal({ children, className = '' }: { children: ReactElement<{ className?: string }>; className?: string }) {
  const v2 = useContext(DetailTheme)
  const content =
    v2 && children.type === 'section'
      ? cloneElement(children, { className: `${children.props.className || ''} v2-detail-panel v2-glass-surface` })
      : children
  const reduced = useReducedMotion()
  return (
    <motion.div
      data-reveal
      className={className}
      initial={reduced ? false : { opacity: 0, y: 28, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', ...(v2 ? { transitionEnd: { filter: 'none' } } : {}) }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduced ? 0 : 1.05, ease: EASE }}
    >
      {content}
    </motion.div>
  )
}

function Photo({ src, alt, className = '' }: { src?: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  return src && !failed ? (
    <img src={src} alt={alt} draggable="false" onError={() => setFailed(true)} className={`h-full w-full object-cover ${className}`} />
  ) : (
    <div className="flex h-full min-h-32 w-full flex-col items-center justify-center gap-2 bg-sp-surface-soft text-sp-body">
      <ImageOff size={24} strokeWidth={1.3} />
      <span className="text-xs">Photo unavailable</span>
    </div>
  )
}

function SellerAvatar({ name }: { name?: string }) {
  const initials =
    name
      ?.trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'S'
  return (
    <span
      aria-hidden="true"
      className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-white bg-sp-blue-lighter/40 text-sm font-semibold text-sp-brand-deep"
    >
      {initials}
    </span>
  )
}

const contentSections = [
  ['overview', 'Overview'],
  ['specifications', 'Specifications'],
  ['documents', 'Media & documents'],
]

function DetailSectionNav() {
  const v2 = useContext(DetailTheme)
  const navGroupId = useId()
  const [current, setCurrent] = useState('overview')
  const reduced = useReducedMotion()
  const navRef = useRef<HTMLElement>(null)
  useEffect(() => {
    let frame = 0
    function update() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const threshold = (navRef.current?.getBoundingClientRect().bottom || 100) + 48
        let next = 'overview'
        for (const [id] of contentSections) {
          if ((document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= threshold) next = id
        }
        if (window.scrollY > 0 && document.documentElement.scrollHeight - window.innerHeight - window.scrollY <= 4) next = 'documents'
        setCurrent(next)
      })
    }
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    const observer = new ResizeObserver(update)
    contentSections.forEach(([id]) => {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    })
    update()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [reduced])
  function navigate(event: MouseEvent, id: string) {
    event.preventDefault()
    const section = document.getElementById(id)
    if (!section) return
    setCurrent(id)
    window.history.replaceState(window.history.state, '', `#${id}`)
    section.focus({ preventScroll: true })
    section.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' })
  }
  return (
    <nav
      ref={navRef}
      aria-label="Listing sections"
      className={`sticky top-[80px] z-20 -mx-1 rounded-[12px] border border-sp-hairline bg-sp-canvas p-1.5 lg:top-6 ${v2 ? 'v2-detail-section-nav v2-glass-surface' : ''}`}
    >
      <LayoutGroup id={navGroupId}>
        <div className="relative flex">
          {contentSections.map(([id, label]) => (
            <motion.a
              key={id}
              href={`#${id}`}
              onClick={(event) => navigate(event, id)}
              whileTap={reduced ? undefined : { scale: inventoryMotion.pressScale }}
              aria-current={current === id ? 'location' : undefined}
              animate={{ color: current === id ? '#0a4359' : '#536775' }}
              transition={inventoryMotion.interaction}
              className="relative isolate flex min-h-11 flex-1 items-center justify-center rounded-lg px-2 text-center text-[11px] font-semibold sm:text-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sp-brand"
            >
              {current === id && (
                <motion.span
                  aria-hidden="true"
                  layoutId="detail-section-active"
                  transition={{ ...inventoryMotion.indicator, duration: reduced ? 0 : inventoryMotion.indicator.duration }}
                  className="tactile-tab-active pointer-events-none absolute inset-0 -z-10 rounded-lg bg-[#eaf5fa]"
                />
              )}
              <span>{label}</span>
            </motion.a>
          ))}
        </div>
      </LayoutGroup>
    </nav>
  )
}

function SpecificationGroup({
  title,
  fields,
  data,
  initiallyOpen,
}: {
  title: string
  fields: FieldSpec[]
  data: Record<string, unknown>
  initiallyOpen: boolean
}) {
  const [open, setOpen] = useState(initiallyOpen)
  const id = useId()
  const reduced = useReducedMotion()
  return (
    <div className="border-b-2 border-sp-hairline">
      <h3>
        <button
          type="button"
          id={`${id}-trigger`}
          aria-expanded={open}
          aria-controls={`${id}-content`}
          onClick={() => setOpen((value) => !value)}
          className="flex min-h-16 w-full items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-sp-brand-deep"
        >
          {title}
          <motion.svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
          >
            <path d="M4 9h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <motion.path
              d="M9 4v10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              animate={{ opacity: open ? 0 : 1, pathLength: open ? 0 : 1 }}
              transition={{ duration: reduced ? 0 : 0.2, ease: EASE }}
            />
          </motion.svg>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            id={`${id}-content`}
            role="region"
            aria-labelledby={`${id}-trigger`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.32, ease: EASE }}
            className="overflow-hidden [overflow-anchor:none]"
          >
            <dl className="grid grid-cols-1 gap-x-6 gap-y-5 pb-6 sm:grid-cols-2">
              {fields.map(([key, label, unit]) => (
                <div key={key} className="min-w-0">
                  <dt className="text-[11px] text-sp-body">{label}</dt>
                  <dd
                    className={`mt-1 break-words whitespace-pre-line text-xs leading-6 ${hasValue(data[key]) ? 'font-medium text-sp-brand-deep' : 'text-[#718694]'}`}
                  >
                    {hasValue(data[key]) ? `${data[key]}${unit ? ` ${unit}` : ''}` : 'Not provided'}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

type BoatDetailProps = { listing?: ClientListing; variant?: 'v2'; onNotice: (notice: Notice) => void }

export default function BoatDetail({ listing, variant, onNotice }: BoatDetailProps) {
  const v2 = variant === 'v2'
  const { reply } = useListings()
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)
  const [active, setActive] = useState(0)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [slideDirection, setSlideDirection] = useState(1)
  const [copiedContact, setCopiedContact] = useState('')
  const galleryRef = useRef<HTMLDialogElement>(null)
  const photoDragStart = useRef<{ x: number; y: number } | null>(null)
  const thumbnailScrollStart = useRef<{ x: number; scrollLeft: number } | null>(null)
  const thumbnailDragged = useRef(false)
  const reduced = useReducedMotion()
  if (!listing)
    return (
      <section className="py-12">
        <Link to="/boats" className="inline-flex items-center gap-2 text-sm text-sp-brand">
          <ArrowLeft size={16} /> My Boats
        </Link>
        <h1 className="mt-8 text-3xl font-semibold text-sp-brand-deep">Listing not found</h1>
        <p className="mt-3 text-sm text-sp-body">This listing is no longer available.</p>
      </section>
    )
  const data: WizardData = { ...listing.details, boatName: listing.name, boatType: listing.type }
  const additionalDetails = completedAdditionalDetails(data.additionalDetails)
  const specificationGroups: [string, FieldSpec[]][] = additionalDetails.length
    ? [...groups, ['Additional details', additionalDetails.map((item, index): FieldSpec => [`additional-${index}`, item.name])]]
    : groups
  const specificationData: Record<string, unknown> = {
    ...data,
    ...Object.fromEntries(additionalDetails.map((item, index) => [`additional-${index}`, item.description])),
  }
  const photos = listing.photos
  const canEdit = listing.status === 'Draft' || listing.status === 'Rejected'
  const comments = listing.comments
  const image = photos[active]
  const facts = (
    [
      ['year', 'Built'],
      ['length', 'Length', 'ft'],
      ['beam', 'Beam', 'ft'],
      ['berths', 'Berths'],
    ] as [TextKey, string, string?][]
  ).filter(([key]) => hasValue(data[key]))
  const media = (
    [
      ['videoUrl', 'Video walkthrough'],
      ['virtualTourUrl', 'Virtual tour'],
    ] as const
  ).filter(([key]) => /^https?:\/\//i.test(data[key] || ''))
  async function sendReply(event: FormEvent) {
    event.preventDefault()
    const text = replyText.trim()
    if (!text || !listing) return
    setSending(true)
    try {
      await reply(listing, text)
      setReplyText('')
    } catch (err) {
      onNotice({ type: 'error', title: 'Message not sent', description: err instanceof Error ? err.message : 'Please try again.' })
    } finally {
      setSending(false)
    }
  }
  async function copySellerContact(type: 'email' | 'phone', value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedContact(type)
      window.setTimeout(() => setCopiedContact((current) => (current === type ? '' : current)), 1800)
    } catch {
      setCopiedContact('')
    }
  }
  function changePhoto(direction: number) {
    setSlideDirection(direction)
    setActive((current) => (current + direction + photos.length) % photos.length)
  }
  function selectPhoto(index: number) {
    const forwardDistance = (index - active + photos.length) % photos.length
    setSlideDirection(forwardDistance <= photos.length / 2 ? 1 : -1)
    setActive(index)
  }
  function startPhotoDrag(event: PointerEvent<HTMLDivElement>) {
    if (photos.length < 2 || event.button !== 0 || (event.target as Element).closest('button')) return
    photoDragStart.current = { x: event.clientX, y: event.clientY }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  function endPhotoDrag(event: PointerEvent<HTMLDivElement>) {
    if (!photoDragStart.current) return
    const deltaX = event.clientX - photoDragStart.current.x
    const deltaY = event.clientY - photoDragStart.current.y
    photoDragStart.current = null
    if (Math.abs(deltaX) > 56 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) changePhoto(deltaX < 0 ? 1 : -1)
  }
  function cancelPhotoDrag() {
    photoDragStart.current = null
  }
  function startThumbnailScroll(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    thumbnailScrollStart.current = { x: event.clientX, scrollLeft: event.currentTarget.scrollLeft }
    thumbnailDragged.current = false
  }
  function moveThumbnailScroll(event: PointerEvent<HTMLDivElement>) {
    if (!thumbnailScrollStart.current) return
    const delta = event.clientX - thumbnailScrollStart.current.x
    if (Math.abs(delta) > 4 && !thumbnailDragged.current) {
      thumbnailDragged.current = true
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    event.currentTarget.scrollLeft = thumbnailScrollStart.current.scrollLeft - delta
  }
  function endThumbnailScroll() {
    thumbnailScrollStart.current = null
  }
  function handleThumbnailClick(event: MouseEvent, index: number) {
    if (thumbnailDragged.current) {
      event.preventDefault()
      event.stopPropagation()
      thumbnailDragged.current = false
      return
    }
    selectPhoto(index)
  }
  return (
    <DetailTheme.Provider value={v2}>
      <motion.div
        data-reveal
        initial={reduced ? false : { opacity: 0, y: 28, filter: 'blur(12px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)', ...(v2 ? { transitionEnd: { filter: 'none' } } : {}) }}
        transition={{ duration: reduced ? 0 : 1.05, ease: EASE }}
        className={v2 ? 'v2-boat-detail' : 'space-y-8 sm:space-y-10'}
      >
        {!v2 && (
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-sp-body">
              <MotionLink
                to="/boats"
                initial="rest"
                animate="rest"
                whileHover="hover"
                whileFocus="hover"
                className="inline-flex min-h-11 items-center gap-2 rounded-[8px] px-2 font-medium text-sp-brand-deep hover:bg-sp-surface-soft"
              >
                <motion.span
                  aria-hidden="true"
                  variants={directionalArrowVariants(reduced, 'left')}
                  transition={inventoryMotion.interaction}
                >
                  <ArrowLeft size={16} />
                </motion.span>{' '}
                Back to My Boats
              </MotionLink>
              {canEdit && (
                <Link
                  to={`/boats/new/review?draft=${encodeURIComponent(listing.id)}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-sp-brand px-4 text-xs font-semibold text-white hover:bg-sp-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sp-brand tactile-primary"
                >
                  <Pencil aria-hidden="true" size={14} /> {listing.status === 'Draft' ? 'Edit draft' : 'Edit listing'}
                </Link>
              )}
            </div>
          </Reveal>
        )}
        <Reveal>
          <div className="boat-detail-hero grid items-start gap-7 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,1fr)] xl:gap-10">
            <div className={v2 ? 'v2-detail-gallery v2-glass-surface min-w-0' : 'min-w-0'}>
              <div
                role="group"
                aria-label="Boat photo gallery. Drag left or right to browse photos."
                onPointerDown={startPhotoDrag}
                onPointerUp={endPhotoDrag}
                onPointerCancel={cancelPhotoDrag}
                className="relative aspect-[4/3] touch-pan-y select-none overflow-hidden rounded-[16px] bg-sp-surface-soft cursor-grab active:cursor-grabbing"
              >
                <AnimatePresence initial={false} custom={slideDirection}>
                  <motion.div
                    key={image?.src || 'empty'}
                    custom={slideDirection}
                    initial={reduced ? false : 'enter'}
                    animate="center"
                    exit="exit"
                    variants={{
                      enter: (direction) => ({ x: `${direction * 100}%` }),
                      center: { x: '0%' },
                      exit: (direction) => ({ x: `${direction * -100}%` }),
                    }}
                    transition={{ duration: reduced ? 0 : 0.32, ease: EASE }}
                    className="absolute inset-0"
                  >
                    <Photo src={image?.src} alt={image?.name || listing.name} />
                  </motion.div>
                </AnimatePresence>
                {photos.length > 0 && (
                  <>
                    <span className="absolute left-4 top-4 rounded-md bg-white/95 px-3 py-1.5 text-[11px] font-medium text-sp-brand-deep">
                      {String(active + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        galleryRef.current?.showModal()
                        setGalleryOpen(true)
                      }}
                      aria-label="Open photo gallery"
                      className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-lg bg-white text-sp-brand-deep"
                    >
                      <Expand size={v2 ? 20 : 17} />
                    </button>
                  </>
                )}
              </div>
              {photos.length > 1 && (
                <div
                  onPointerDown={startThumbnailScroll}
                  onPointerMove={moveThumbnailScroll}
                  onPointerUp={endThumbnailScroll}
                  onPointerCancel={endThumbnailScroll}
                  className="hide-scrollbar mt-3 flex gap-3 overflow-x-auto overscroll-x-contain pb-1 cursor-grab active:cursor-grabbing select-none"
                >
                  {photos.map((photo, index) => (
                    <motion.button
                      key={photo.id}
                      type="button"
                      onClick={(event) => handleThumbnailClick(event, index)}
                      aria-label={`Show photo ${index + 1}: ${photo.name}`}
                      aria-pressed={active === index}
                      whileTap={reduced ? undefined : { scale: 0.96 }}
                      className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-[3px] ${active === index ? 'border-sp-blue-normal-hover' : 'border-transparent opacity-70'}`}
                    >
                      <Photo src={photo.src} alt="" />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
            <div className={v2 ? 'v2-detail-identity v2-glass-surface min-w-0' : 'min-w-0 pt-1'}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sp-body">{listing.type}</p>
              <h1 className="mt-3 break-words text-[clamp(2rem,3.5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.055em] text-sp-brand-deep">
                {listing.name}
              </h1>
              {data.builder && (
                <p className="mt-2 text-sm text-sp-body">
                  {data.builder}
                  {data.year ? ` · ${data.year}` : ''}
                </p>
              )}
              <p className="mt-6 text-[28px] font-medium leading-tight tracking-[-0.04em] text-sp-brand-deep">{money(listing.price)}</p>
              {facts.length > 0 && (
                <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-sp-hairline pt-5">
                  {facts.map(([key, label, unit]) => (
                    <div key={key}>
                      <dt className="text-[11px] text-sp-body">{label}</dt>
                      <dd className="mt-1 text-lg font-medium leading-snug text-sp-brand-deep">
                        {data[key]}
                        {unit && <span className="ml-1 text-xs text-sp-body">{unit}</span>}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
              <section
                aria-label="Listing status"
                className={`mt-6 rounded-xl border p-4 ${v2 ? `v2-detail-status is-${listing.status.toLowerCase()}` : statusPanel[listing.status] || 'border-sp-hairline bg-sp-surface-soft text-sp-brand-deep'}`}
              >
                <h2 className="flex items-center gap-2 text-sm font-semibold">
                  <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-current" />
                  {v2
                    ? { Draft: 'Draft', Approved: 'Live', Pending: 'In review', Rejected: 'Needs changes' }[listing.status] ||
                      listing.status
                    : listing.status}
                </h2>
                {statusCopy[listing.status] && <p className="mt-2 text-xs font-medium leading-5">{statusCopy[listing.status]}</p>}
                {listing.statusReason && <p className="mt-2 text-xs leading-5">{listing.statusReason}</p>}
                <p className="mt-3 border-t border-current/15 pt-3 text-[11px]">
                  {listing.status === 'Draft' ? 'Saved' : 'Submitted'} {date(listing.submittedAt)}
                </p>
                {v2 && canEdit && (
                  <MotionLink
                    to={`/boats/new/review?draft=${encodeURIComponent(listing.id)}`}
                    initial="rest"
                    animate="rest"
                    whileHover="hover"
                    whileFocus="hover"
                    whileTap={reduced ? undefined : { scale: 0.98 }}
                    variants={{ rest: { backgroundColor: '#f7fbffb8' }, hover: { backgroundColor: '#ffffff' } }}
                    transition={inventoryMotion.interaction}
                    className="v2-detail-edit"
                  >
                    <Pencil aria-hidden="true" size={14} />
                    {listing.status === 'Draft' ? 'Continue editing draft' : 'Edit listing'}
                  </MotionLink>
                )}
              </section>
            </div>
          </div>
        </Reveal>
        <div className="boat-detail-body grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(270px,360px)] xl:gap-10">
          <div className="min-w-0 space-y-10">
            <DetailSectionNav />
            <Reveal>
              <section id="overview" tabIndex={-1} className="scroll-mt-[156px] outline-none lg:scroll-mt-[100px]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sp-body">The vessel</p>
                <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-sp-brand-deep">Life aboard {listing.name}</h2>
                <p className="mt-5 whitespace-pre-line text-sm leading-7 text-sp-body">
                  {data.overview || 'An overview has not been provided for this vessel.'}
                </p>
              </section>
            </Reveal>
            <Reveal>
              <section id="specifications" tabIndex={-1} className="scroll-mt-[156px] outline-none lg:scroll-mt-[100px]">
                <h2 className="text-2xl font-medium tracking-[-0.04em] text-sp-brand-deep">A closer look</h2>
                <p className="mt-2 text-xs text-sp-body">Specifications, systems and the details behind the vessel.</p>
                <div className="mt-6 border-t border-sp-hairline">
                  {specificationGroups.map(([title, fields], index) => (
                    <SpecificationGroup key={title} title={title} fields={fields} data={specificationData} initiallyOpen={index === 0} />
                  ))}
                </div>
              </section>
            </Reveal>
            <Reveal>
              <section id="documents" tabIndex={-1} className="scroll-mt-[156px] outline-none lg:scroll-mt-[100px]">
                <h2 className="text-2xl font-medium tracking-[-0.04em] text-sp-brand-deep">Explore further</h2>
                <div className="mt-5 space-y-3">
                  {media.map(([key, label]) => (
                    <a
                      key={key}
                      href={data[key]}
                      target="_blank"
                      rel="noreferrer"
                      className="flex min-h-14 items-center justify-between rounded-lg border border-sp-hairline bg-white px-4 text-xs font-medium text-sp-brand-deep"
                    >
                      {label}
                      <ArrowUpRight size={16} />
                    </a>
                  ))}
                  {listing.brochureUrl && (
                    <a
                      href={listing.brochureUrl}
                      target="_blank"
                      rel="noreferrer"
                      download
                      className="flex min-h-14 items-center justify-between rounded-lg border border-sp-hairline bg-white px-4 text-xs font-medium text-sp-brand-deep"
                    >
                      Boat brochure (PDF)
                      <Download size={16} />
                    </a>
                  )}
                  {!media.length && !listing.brochureUrl && (
                    <p className="text-sm text-sp-body">No additional media or documents have been supplied.</p>
                  )}
                </div>
              </section>
            </Reveal>
          </div>
          <aside
            aria-label="Listing conversation and seller information"
            className="min-w-0 space-y-6 xl:sticky xl:top-6 xl:max-h-[calc(100dvh-48px)] xl:overflow-y-auto xl:overscroll-contain xl:pr-1"
          >
            <Reveal>
              <section id="seller" className="scroll-mt-24 w-full rounded-[14px] bg-[#eaf4f8] p-5 xl:max-w-[360px]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sp-body">Seller information</p>
                <div className="mt-3 flex items-center gap-3">
                  <SellerAvatar name={data.contactName} />
                  <div className="min-w-0">
                    <h2 className="text-xl font-medium tracking-[-0.03em] text-sp-brand-deep">
                      {data.contactName || 'Contact not provided'}
                    </h2>
                    {data.sellerType && <p className="mt-1 text-xs text-sp-body">{data.sellerType}</p>}
                  </div>
                </div>
                <div className="mt-5 space-y-3 text-xs text-sp-brand-deep">
                  {data.email && (
                    <div className="flex min-h-8 items-center gap-2">
                      <Mail size={15} className="shrink-0" />
                      <a href={`mailto:${data.email}`} className="min-w-0 break-all">
                        {data.email}
                      </a>
                      <motion.button
                        type="button"
                        aria-label={copiedContact === 'email' ? 'Email copied' : 'Copy seller email'}
                        onClick={() => copySellerContact('email', data.email)}
                        whileTap={reduced ? undefined : { scale: 0.88 }}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-[7px] text-sp-body hover:bg-white/70 hover:text-sp-brand-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sp-brand"
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.span
                            key={copiedContact === 'email' ? 'email-copied' : 'email-copy'}
                            initial={reduced ? false : { opacity: 0, scale: 0.7, y: 2 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.7, y: -2 }}
                            transition={{ duration: reduced ? 0 : 0.16, ease: EASE }}
                          >
                            {copiedContact === 'email' ? (
                              <Check aria-hidden="true" size={15} className="text-[#26735b]" />
                            ) : (
                              <Copy aria-hidden="true" size={15} />
                            )}
                          </motion.span>
                        </AnimatePresence>
                      </motion.button>
                    </div>
                  )}
                  {data.phone && (
                    <div className="flex min-h-8 items-center gap-2">
                      <Phone size={15} className="shrink-0" />
                      <a href={`tel:${data.phone.replace(/[^+\d]/g, '')}`} className="min-w-0">
                        {data.phone}
                      </a>
                      <motion.button
                        type="button"
                        aria-label={copiedContact === 'phone' ? 'Phone number copied' : 'Copy seller phone number'}
                        onClick={() => copySellerContact('phone', data.phone)}
                        whileTap={reduced ? undefined : { scale: 0.88 }}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-[7px] text-sp-body hover:bg-white/70 hover:text-sp-brand-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sp-brand"
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.span
                            key={copiedContact === 'phone' ? 'phone-copied' : 'phone-copy'}
                            initial={reduced ? false : { opacity: 0, scale: 0.7, y: 2 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.7, y: -2 }}
                            transition={{ duration: reduced ? 0 : 0.16, ease: EASE }}
                          >
                            {copiedContact === 'phone' ? (
                              <Check aria-hidden="true" size={15} className="text-[#26735b]" />
                            ) : (
                              <Copy aria-hidden="true" size={15} />
                            )}
                          </motion.span>
                        </AnimatePresence>
                      </motion.button>
                    </div>
                  )}
                </div>
                <dl className="mt-5 space-y-4 border-t border-sp-brand/15 pt-5">
                  {(
                    [
                      ['city', 'City'],
                      ['sellTimeline', 'Selling timeline'],
                      ['contactTime', 'Preferred contact time'],
                      ['notes', 'Additional notes'],
                    ] as [TextKey, string][]
                  ).map(([key, label]) => (
                    <div key={key}>
                      <dt className="text-[11px] text-sp-body">{label}</dt>
                      <dd className="mt-1 whitespace-pre-line break-words text-xs font-medium leading-6 text-sp-brand-deep">
                        {hasValue(data[key]) ? data[key] : 'Not provided'}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            </Reveal>
          </aside>
        </div>
        <Reveal>
          <section
            id="listing-comments"
            tabIndex={-1}
            className="scroll-mt-24 w-full overflow-hidden rounded-[14px] border border-sp-hairline bg-white"
          >
            <header className="flex items-center gap-2 border-b border-sp-hairline px-5 py-4">
              <MessageCircle size={17} className="text-sp-brand" />
              <h2 className="text-sm font-semibold text-sp-brand-deep">Listing conversation</h2>
            </header>
            <div className="max-h-[min(420px,55dvh)] divide-y divide-sp-hairline overflow-y-auto overscroll-contain">
              {comments.length ? (
                comments.map((comment) => (
                  <article key={comment.id} className="px-5 py-5">
                    <div className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sp-blue-lighter/30 text-xs font-semibold text-sp-brand-deep"
                      >
                        {comment.author
                          .split(' ')
                          .map((word) => word[0])
                          .join('')
                          .slice(0, 2)}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-sp-brand-deep">{comment.fromSeller ? 'You' : comment.author}</p>
                        <p className="mt-0.5 text-[10px] text-sp-body">{comment.date}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs leading-6 text-sp-body">{comment.text}</p>
                  </article>
                ))
              ) : (
                <div className="px-5 py-8 text-center">
                  <MessageCircle size={24} strokeWidth={1.3} className="mx-auto text-sp-brand" />
                  <p className="mt-3 text-xs font-semibold text-sp-brand-deep">No comments yet</p>
                  <p className="mt-1 text-xs leading-5 text-sp-body">Feedback from the broker team will appear here.</p>
                </div>
              )}
            </div>
            {listing.listingId && (
              <form onSubmit={sendReply} className="flex items-end gap-2 border-t border-sp-hairline px-5 py-4">
                <label className="min-w-0 flex-1">
                  <span className="sr-only">Reply to the broker team</span>
                  <textarea
                    value={replyText}
                    onChange={(event) => setReplyText(event.target.value)}
                    rows={2}
                    placeholder="Reply to the broker team…"
                    className="block w-full resize-y rounded-[8px] border border-sp-hairline bg-white px-3.5 py-2.5 text-[13px] leading-relaxed text-sp-ink outline-none placeholder:text-[#8797a1] focus:border-[#428eb0] focus:ring-[3px] focus:ring-[#dceef5]"
                  />
                </label>
                <motion.button
                  type="submit"
                  disabled={sending || !replyText.trim()}
                  aria-label="Send reply"
                  whileTap={reduced ? undefined : { scale: 0.94 }}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sp-brand text-white disabled:opacity-50"
                >
                  <Send aria-hidden="true" size={16} />
                </motion.button>
              </form>
            )}
          </section>
        </Reveal>
        <motion.dialog
          initial={false}
          animate={
            v2
              ? { opacity: galleryOpen ? 1 : 0, scale: reduced || !galleryOpen ? 1 : [0.965, 1], y: reduced || !galleryOpen ? 0 : [16, 0] }
              : undefined
          }
          transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
          onClose={() => setGalleryOpen(false)}
          ref={galleryRef}
          aria-label={`${listing.name} photo gallery`}
          className="fixed inset-0 m-auto h-[min(800px,95dvh)] max-h-[95dvh] w-[min(1200px,95vw)] max-w-[95vw] overflow-hidden rounded-2xl border border-sp-hairline bg-white p-0 text-sp-brand-deep backdrop:bg-[#061e2e]/80 backdrop:backdrop-blur-sm"
        >
          <div className="flex items-center justify-between border-b border-sp-hairline p-4">
            <p className="text-sm font-semibold">
              {listing.name} · {active + 1} / {photos.length}
            </p>
            <button
              type="button"
              aria-label="Close gallery"
              onClick={() => galleryRef.current?.close()}
              className="grid h-10 w-10 place-items-center rounded-lg hover:bg-sp-surface-soft"
            >
              <X size={20} />
            </button>
          </div>
          <div
            onPointerDown={startPhotoDrag}
            onPointerUp={endPhotoDrag}
            onPointerCancel={cancelPhotoDrag}
            className="relative h-[calc(100%-73px)] touch-pan-y select-none bg-sp-surface-soft cursor-grab active:cursor-grabbing"
          >
            <AnimatePresence initial={false} custom={slideDirection}>
              <motion.div
                key={'expanded-' + image?.src}
                custom={slideDirection}
                initial={reduced ? false : 'enter'}
                animate="center"
                exit="exit"
                variants={{
                  enter: (direction) => ({ x: `${direction * 100}%` }),
                  center: { x: '0%' },
                  exit: (direction) => ({ x: `${direction * -100}%` }),
                }}
                transition={{ duration: reduced ? 0 : 0.32, ease: EASE }}
                className="absolute inset-0"
              >
                <Photo src={image?.src} alt={image?.name || listing.name} className="!object-contain" />
              </motion.div>
            </AnimatePresence>
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={() => changePhoto(-1)}
                  className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={() => changePhoto(1)}
                  className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        </motion.dialog>
      </motion.div>
    </DetailTheme.Provider>
  )
}
