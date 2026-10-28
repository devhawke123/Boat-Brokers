import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronDown, FileText, ImagePlus, Pencil } from 'lucide-react'
import { EASE, quick, textActionVariants } from '../lib/motion'
import { completedAdditionalDetails } from '../lib/additionalDetails'
import { withExtraSpecGroups } from '../lib/extraSpecFields'
import type { ClientPhoto, WizardData } from '../lib/listingAdapter'

type FieldSpec = [key: Exclude<keyof WizardData, 'additionalDetails'>, label: string, unit?: string]

const populated = (value: unknown) => value !== undefined && value !== null && String(value).trim() !== ''
const baseGroups: [string, FieldSpec[]][] = [
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
      ['documentation', 'Documentation'],
      ['lastService', 'Last service'],
      ['recentSurvey', 'Recent survey'],
      ['blacking', 'Blacking'],
      ['boatSafety', 'Boat safety certificate'],
    ],
  ],
  [
    'Dimensions',
    [
      ['length', 'Length', 'ft'],
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
      ['hotWater', 'Hot water'],
      ['waterCapacity', 'Water capacity', 'L'],
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
const groups = withExtraSpecGroups(baseGroups)

function Edit({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={`Edit ${label}`}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      variants={textActionVariants}
      transition={quick}
      className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-semibold text-sp-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sp-brand"
    >
      <Pencil aria-hidden="true" size={14} strokeWidth={1.5} />
      <span>Edit</span>
    </motion.button>
  )
}

function Values({ fields, data }: { fields: FieldSpec[]; data: WizardData }) {
  return (
    <dl className="grid min-w-0 gap-x-6 gap-y-5 sm:grid-cols-2">
      {fields
        .filter(([key]) => populated(data[key]))
        .map(([key, label, unit]) => (
          <div key={key} className="min-w-0">
            <dt className="text-[11px] text-sp-body">{label}</dt>
            <dd className="mt-1 break-words whitespace-pre-line text-[13px] leading-6 text-sp-brand-deep">
              {data[key]}
              {unit ? ` ${unit}` : ''}
            </dd>
          </div>
        ))}
    </dl>
  )
}

function SpecGroup({ title, fields, data, onEdit }: { title: string; fields: FieldSpec[]; data: WizardData; onEdit: () => void }) {
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()
  const id = `review-spec-${title.toLowerCase().replaceAll(' ', '-')}`
  const count = fields.filter(([key]) => populated(data[key])).length
  return (
    <div className="border-b border-sp-hairline">
      <div className="flex items-center gap-2 py-2">
        <h3 className="min-w-0 flex-1">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={id}
            onClick={() => setOpen(!open)}
            className="flex min-h-11 w-full items-center gap-3 text-left text-sm font-semibold text-sp-brand-deep focus-visible:outline-2 focus-visible:outline-sp-brand"
          >
            <motion.span aria-hidden="true" animate={{ rotate: open ? 180 : 0 }} transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}>
              <ChevronDown size={16} />
            </motion.span>
            {title}
            <span className="ml-auto text-[11px] font-normal text-sp-body">{count ? `${count} added` : 'Not added'}</span>
          </button>
        </h3>
        <Edit label={title.toLowerCase()} onClick={onEdit} />
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.32, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-6 pt-2">
              {count ? (
                <Values fields={fields} data={data} />
              ) : (
                <p className="text-xs leading-6 text-sp-body">No {title.toLowerCase()} details added.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

type WizardReviewProps = {
  data: WizardData
  photos: ClientPhoto[]
  v2?: boolean
  onStep: (index: number) => void
  onSpecEdit: (index: number) => void
  onAdditionalEdit: () => void
}

export default function WizardReview({ data, photos, v2 = false, onStep, onSpecEdit, onAdditionalEdit }: WizardReviewProps) {
  const [active, setActive] = useState(0)
  const [slideDirection, setSlideDirection] = useState(1)
  const reduced = useReducedMotion()
  const additional = completedAdditionalDetails(data.additionalDetails)
  const photo = photos[active] || photos[0]
  function selectPhoto(index: number) {
    const forwardDistance = (index - active + photos.length) % photos.length
    setSlideDirection(forwardDistance <= photos.length / 2 ? 1 : -1)
    setActive(index)
  }
  const missing = [
    !data.boatName.trim() && 'boat name',
    !data.builder.trim() && 'hull builder',
    !data.boatType.trim() && 'vessel type',
    !data.contactName.trim() && 'contact name',
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()) && 'valid email address',
    !data.phone.trim() && 'phone number',
    !data.city.trim() && 'city',
    !photos.length && 'at least one photo',
  ].filter(Boolean)
  const initials = data.contactName
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  return (
    <div className={`space-y-9 ${v2 ? 'v2-review-content' : ''}`}>
      {missing.length > 0 && (
        <div className="v2-review-missing rounded-xl border border-[#ead29b] bg-[#fff7e5] px-5 py-4 text-[#805000]">
          <p className="text-sm font-semibold">Before you submit</p>
          <p className="mt-1 text-xs leading-6">Please add {missing.join(', ')} using the Edit actions below.</p>
        </div>
      )}
      <div className="v2-review-hero-grid grid items-start gap-7 min-[1100px]:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]">
        <section aria-label="Boat photography" className="v2-review-gallery min-w-0">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sp-surface-soft">
            {photo ? (
              <AnimatePresence initial={false} custom={slideDirection}>
                <motion.img
                  key={photo.id || photo.src}
                  custom={slideDirection}
                  src={photo.src}
                  width={800}
                  height={600}
                  alt={photo.name || `${data.boatName || 'Boat'} photo ${active + 1}`}
                  initial={reduced ? false : 'enter'}
                  animate="center"
                  exit="exit"
                  variants={{
                    enter: (direction) => ({ x: `${direction * 100}%` }),
                    center: { x: '0%' },
                    exit: (direction) => ({ x: `${direction * -100}%` }),
                  }}
                  transition={{ duration: reduced ? 0 : 0.32, ease: EASE }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-sp-body">
                <ImagePlus aria-hidden="true" size={28} strokeWidth={1.3} />
                <p className="text-xs">No photos added</p>
              </div>
            )}
            {photos.length > 0 && (
              <span className="absolute left-4 top-4 rounded-md bg-white px-3 py-2 text-[11px] font-medium text-sp-brand-deep tabular-nums">
                {String(active + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
              </span>
            )}
          </div>
          <div className="mt-2 flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 flex-wrap gap-2 py-1">
              {photos.map((item, index) => (
                <button
                  key={item.id || item.src}
                  type="button"
                  aria-label={`Show photo ${index + 1}`}
                  aria-pressed={active === index}
                  onClick={() => selectPhoto(index)}
                  className={`h-12 w-16 shrink-0 overflow-hidden rounded-md border-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sp-brand ${active === index ? 'border-sp-brand' : 'border-transparent'}`}
                >
                  <img src={item.src} width={64} height={48} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <Edit label="photos" onClick={() => onStep(2)} />
          </div>
        </section>
        <section aria-label="Boat identity" className="v2-review-identity min-w-0 pt-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sp-body">{data.boatType || 'Vessel type not added'}</p>
            <Edit label="basic information" onClick={() => onStep(0)} />
          </div>
          <h2 className="mt-3 break-words text-[clamp(1.8rem,3vw,2.7rem)] font-medium leading-tight tracking-[-0.045em] text-sp-brand-deep">
            {data.boatName || 'Boat name not added'}
          </h2>
          <p className="mt-3 text-[13px] text-sp-body">{[data.builder, data.year].filter(populated).join(' · ') || 'Builder not added'}</p>
          <p className="mt-6 text-[26px] font-medium tracking-[-0.035em] text-sp-brand-deep">
            {populated(data.askingPrice) ? (
              new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(
                Number(data.askingPrice),
              )
            ) : (
              <span className="text-sm text-sp-body">Price not added</span>
            )}
          </p>
          <div className="mt-6 border-t border-sp-hairline pt-5">
            <Values
              fields={[
                ['year', 'Built'],
                ['length', 'Length', 'ft'],
                ['beam', 'Beam', 'ft'],
                ['berths', 'Berths'],
              ]}
              data={data}
            />
          </div>
        </section>
      </div>
      <div className="v2-review-content-grid grid items-start gap-8 min-[1100px]:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]">
        <div className="v2-review-content-sections min-w-0 space-y-8">
          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-lg font-medium tracking-[-0.025em] text-sp-brand-deep">Overview</h2>
              <Edit label="overview" onClick={() => onStep(0)} />
            </div>
            <p className="break-words whitespace-pre-line text-[13px] leading-7 text-sp-body">{data.overview || 'No overview added.'}</p>
          </section>
          <section>
            <h2 className="mb-3 text-lg font-medium tracking-[-0.025em] text-sp-brand-deep">Specifications</h2>
            {groups.map(([title, fields], index) => (
              <SpecGroup key={title} title={title} fields={fields} data={data} onEdit={() => onSpecEdit(index)} />
            ))}
            {additional.length > 0 && (
              <section className="border-b border-sp-hairline pb-5">
                <div className="flex items-center justify-between py-2">
                  <h3 className="text-sm font-semibold text-sp-brand-deep">Additional details</h3>
                  <Edit label="additional details" onClick={onAdditionalEdit} />
                </div>
                <dl className="space-y-4">
                  {additional.map((item) => (
                    <div key={item.id}>
                      <dt className="text-xs font-semibold text-sp-brand-deep">{item.name}</dt>
                      <dd className="mt-1 break-words whitespace-pre-line text-[13px] leading-6 text-sp-body">{item.description}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
          </section>
          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-lg font-medium tracking-[-0.025em] text-sp-brand-deep">Media & documents</h2>
              <Edit label="media and documents" onClick={() => onStep(2)} />
            </div>
            <Values
              fields={[
                ['videoUrl', 'Video tour URL'],
                ['virtualTourUrl', 'Virtual tour URL'],
              ]}
              data={data}
            />
            {data.brochureName && (
              <p className="mt-4 flex items-start gap-2 break-all text-xs text-sp-body">
                <FileText aria-hidden="true" size={16} className="shrink-0" />
                {data.brochureName}
              </p>
            )}
            {!data.videoUrl && !data.virtualTourUrl && !data.brochureName && (
              <p className="text-xs leading-6 text-sp-body">No supporting media or documents added.</p>
            )}
          </section>
        </div>
        <section className="v2-review-seller min-w-0 rounded-xl bg-[#eaf4f8] p-5 md:p-6" aria-label="Seller information">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sp-body">Seller information</h2>
            <Edit label="seller information" onClick={() => onStep(3)} />
          </div>
          <div className="mb-6 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white bg-[#c5edfa] text-sm font-semibold text-sp-brand-deep"
            >
              {initials || '—'}
            </span>
            <div className="min-w-0">
              <p className="break-words text-lg font-medium tracking-[-0.025em] text-sp-brand-deep">
                {data.contactName || 'Contact name not added'}
              </p>
              <p className="mt-1 text-xs text-sp-body">{data.sellerType}</p>
            </div>
          </div>
          <Values
            fields={[
              ['email', 'Email'],
              ['phone', 'Phone'],
              ['city', 'City'],
            ]}
            data={data}
          />
          <div className="mt-6 border-t border-[#cedfe8] pt-5">
            <Values
              fields={[
                ['sellTimeline', 'Selling timeline'],
                ['contactTime', 'Best contact time'],
                ['notes', 'Notes for the broker'],
              ]}
              data={data}
            />
          </div>
        </section>
      </div>
    </div>
  )
}
