import { useContext, useEffect, useRef, useState, type Dispatch, type DragEvent, type ReactNode, type SetStateAction } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, CloudUpload, Expand, FileText, ImagePlus, Info, Menu, Save, X } from 'lucide-react'
import { Field, RadioCards, SectionCard, SelectField, TextAreaField, ValidationMessage } from '../components/WizardFields'
import ToastNotice, { type Notice } from '../components/ToastNotice'
import AdditionalDetailsFields from '../components/AdditionalDetailsFields'
import { getAdditionalDetails, hasIncompleteAdditionalDetails, type AdditionalDetail } from '../lib/additionalDetails'
import { initialData, type ClientListing, type ClientPhoto, type WizardData } from '../lib/listingAdapter'
import { useListings } from '../context/useListings'
import { EASE } from '../lib/motion'
import WizardReview from '../components/WizardReview'
import V2WizardRail from '../components/V2WizardRail'
import { AccountButton } from '../components/V2AccountSettings'
import { WizardThemeContext } from '../context/WizardTheme'
import './dashboard-v2.css'
import './v2-wizard.css'

// Matches the backend's multer limits (Backend/src/lib/upload.ts).
const MAX_PHOTOS = 20
const MAX_PHOTO_BYTES = 20 * 1024 * 1024
const STERN_OPTIONS = ['Cruiser Stern', 'Semi-Cruiser', 'Semi-traditional', 'Traditional']

type WizardChange = { target: { name: string; value: string | AdditionalDetail[] } }
type StepProps = { data: WizardData; onChange: (event: WizardChange) => void; showValidation: boolean }

const steps = [
  {
    slug: 'basic',
    title: 'Basic information',
    short: 'The essentials',
    description: 'Give your vessel a clear identity and a few details buyers need first.',
  },
  {
    slug: 'specifications',
    title: 'Specifications',
    short: 'The finer details',
    description: 'Build confidence with an accurate picture of the boat and its history.',
  },
  {
    slug: 'media',
    title: 'Media',
    short: 'Show it beautifully',
    description: 'Help buyers imagine the boat with photography and supporting material.',
  },
  {
    slug: 'details',
    title: 'Key details',
    short: 'How to reach you',
    description: 'Tell us who is listing the vessel and how you prefer to be contacted.',
  },
  {
    slug: 'review',
    title: 'Review',
    short: 'One final look',
    description: 'Check the story of your listing before it is ready to share.',
  },
]
const specSections = [
  { key: 'history', title: 'History' },
  { key: 'dimensions', title: 'Dimensions' },
  { key: 'engine', title: 'Engine' },
  { key: 'heating', title: 'Water & Heating' },
  { key: 'electrical', title: 'Electrical' },
  { key: 'interior', title: 'Interior' },
  { key: 'additional', title: 'Additional details' },
]
function initialListingData(listing: ClientListing | undefined): WizardData {
  if (!listing) return { ...initialData, additionalDetails: [] }
  return {
    ...initialData,
    ...listing.details,
    boatName: listing.name,
    boatType: listing.type,
    askingPrice: listing.price == null ? '' : String(listing.price),
    additionalDetails: getAdditionalDetails(listing.details.additionalDetails),
  }
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())
}

function getBasicErrors(data: WizardData): Record<string, string> {
  return {
    boatName: data.boatName.trim() ? '' : 'Enter the name buyers will see for your boat.',
    builder: data.builder.trim() ? '' : 'Enter the boat’s manufacturer or builder.',
    boatType: data.boatType.trim() ? '' : 'Choose the type that best describes your boat.',
  }
}

function getDetailsErrors(data: WizardData): Record<string, string> {
  return {
    contactName: data.contactName.trim() ? '' : 'Enter your name so the team knows who to contact.',
    email: !data.email.trim()
      ? 'Add an email address so the team can contact you.'
      : isValidEmail(data.email)
        ? ''
        : 'Enter a valid email address, such as name@example.com.',
    phone: data.phone.trim() ? '' : 'Add a phone number so the team can reach you.',
    city: data.city.trim() ? '' : 'Enter the city you’re based in.',
  }
}

function hasErrors(errors: Record<string, string>) {
  return Object.values(errors).some(Boolean)
}

function focusFirstInvalidField(reducedMotion: boolean | null) {
  window.requestAnimationFrame(() => {
    const field = document.querySelector<HTMLElement>('[aria-invalid="true"]')
    if (!field) return
    field.focus({ preventScroll: true })
    field.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'center' })
  })
}

function BasicStep({ data, onChange, showValidation }: StepProps) {
  const errors = showValidation ? getBasicErrors(data) : {}
  return (
    <div className="space-y-4">
      <SectionCard number="01" title="Vessel identity" description="Start with the details that make this boat unmistakably yours.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Boat name"
            name="boatName"
            value={data.boatName}
            onChange={onChange}
            placeholder="e.g. Blue Meridian"
            required
            error={errors.boatName}
          />
          <Field
            label="Hull builder"
            name="builder"
            value={data.builder}
            onChange={onChange}
            placeholder="e.g. Sea Ray"
            required
            error={errors.builder}
          />
          <SelectField
            label="Vessel type"
            name="boatType"
            value={data.boatType}
            onChange={onChange}
            options={['Motor yacht', 'Sailing yacht', 'Cruiser', 'Narrowboat', 'Catamaran', 'Other']}
            required
            error={errors.boatType}
          />
          <Field label="Year built" name="year" value={data.year} onChange={onChange} placeholder="e.g. 2020" type="number" min="1900" />
        </div>
      </SectionCard>
      <SectionCard number="02" title="At a glance" description="The key figures buyers look for when browsing.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Length"
            name="length"
            value={data.length}
            onChange={onChange}
            placeholder="e.g. 78"
            type="number"
            min="0"
            suffix="ft"
          />
          <Field
            label="Asking price"
            name="askingPrice"
            value={data.askingPrice}
            onChange={onChange}
            placeholder="e.g. 325,000"
            type="number"
            min="0"
            suffix="GBP"
          />
        </div>
      </SectionCard>
      <SectionCard number="03" title="Tell its story" description="A useful introduction is more compelling than a long list of features.">
        <TextAreaField
          label="Boat overview"
          name="overview"
          value={data.overview}
          onChange={onChange}
          rows={5}
          placeholder="Describe the vessel's character, condition, standout features, and any recent upgrades..."
        />
      </SectionCard>
    </div>
  )
}

function SpecificationStep({
  data,
  onChange,
  specIndex,
  showAdditionalValidation,
}: Omit<StepProps, 'showValidation'> & { specIndex: number; showAdditionalValidation: boolean }) {
  const section = specSections[specIndex]
  if (section.key === 'additional')
    return <AdditionalDetailsFields value={data.additionalDetails} onChange={onChange} showValidation={showAdditionalValidation} />
  const groups: Record<string, ReactNode> = {
    history: (
      <>
        <SectionCard number="01" title="Boat identification" description="Numbers and registration details that help establish trust.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="CIN / hull identification number"
              name="cin"
              value={data.cin}
              onChange={onChange}
              placeholder="e.g. GB-ABC12345A626"
            />
            <Field label="CRT number" name="crt" value={data.crt} onChange={onChange} placeholder="e.g. 123456" />
            <Field label="Boat licence number" name="licence" value={data.licence} onChange={onChange} placeholder="e.g. ABC123456" />
          </div>
        </SectionCard>
        <SectionCard number="02" title="Ownership history" description="Share what you know about the people and care behind this vessel.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Previous owners"
              name="previousOwners"
              value={data.previousOwners}
              onChange={onChange}
              placeholder="e.g. 2"
              type="number"
              min="0"
            />
            <Field
              label="Ownership history"
              name="ownershipHistory"
              value={data.ownershipHistory}
              onChange={onChange}
              placeholder="e.g. Privately owned from new"
            />
          </div>
        </SectionCard>
        <SectionCard number="03" title="Care & maintenance" description="A well-documented history gives buyers confidence.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Engine service history"
              name="engineService"
              value={data.engineService}
              onChange={onChange}
              placeholder="e.g. Serviced in March 2025"
            />
            <Field
              label="Boiler service history"
              name="boilerService"
              value={data.boilerService}
              onChange={onChange}
              placeholder="e.g. Annual service completed"
            />
            <Field
              label="Hull maintenance"
              name="hullMaintenance"
              value={data.hullMaintenance}
              onChange={onChange}
              placeholder="e.g. Blacked in June 2024"
            />
            <Field
              label="Anode maintenance"
              name="anodes"
              value={data.anodes}
              onChange={onChange}
              placeholder="e.g. Replaced in June 2024"
            />
            <Field label="Last service" name="lastService" value={data.lastService} onChange={onChange} placeholder="e.g. 2024" />
            <Field label="Recent survey" name="recentSurvey" value={data.recentSurvey} onChange={onChange} placeholder="e.g. March 2025" />
            <Field label="Blacking" name="blacking" value={data.blacking} onChange={onChange} placeholder="e.g. 2023" />
            <Field
              label="Boat safety certificate"
              name="boatSafety"
              value={data.boatSafety}
              onChange={onChange}
              placeholder="e.g. Valid to 2026"
            />
            <TextAreaField
              label="Available documentation"
              name="documentation"
              value={data.documentation}
              onChange={onChange}
              placeholder="Service records, survey reports, maintenance receipts..."
              className="sm:col-span-2"
              rows={3}
            />
          </div>
        </SectionCard>
      </>
    ),
    dimensions: (
      <>
        <SectionCard
          number="01"
          title="Hull & dimensions"
          description="Add measurements as accurately as you can. Buyers can always ask for more detail."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Length overall"
              name="length"
              value={data.length}
              onChange={onChange}
              placeholder="e.g. 78"
              suffix="ft"
              type="number"
            />
            <Field label="Beam" name="beam" value={data.beam} onChange={onChange} placeholder="e.g. 16" suffix="ft" type="number" />
            <Field label="Draft" name="draft" value={data.draft} onChange={onChange} placeholder="e.g. 3.2" suffix="ft" type="number" />
            <Field
              label="Internal headroom"
              name="internalHeadroom"
              value={data.internalHeadroom}
              onChange={onChange}
              placeholder="e.g. 6.5"
              suffix="ft"
              type="number"
            />
            <SelectField label="Stern type" name="sternType" value={data.sternType} onChange={onChange} options={STERN_OPTIONS} />
            <Field
              label="Steel specification"
              name="steelSpec"
              value={data.steelSpec}
              onChange={onChange}
              placeholder="e.g. 6mm / 4mm / 3mm"
            />
          </div>
        </SectionCard>
        <SectionCard number="02" title="Living spaces" description="A sense of proportion helps buyers understand the layout.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Saloon length"
              name="saloonLength"
              value={data.saloonLength}
              onChange={onChange}
              placeholder="e.g. 18"
              suffix="ft"
              type="number"
            />
            <Field
              label="Galley length"
              name="galleyLength"
              value={data.galleyLength}
              onChange={onChange}
              placeholder="e.g. 10"
              suffix="ft"
              type="number"
            />
          </div>
        </SectionCard>
      </>
    ),
    engine: (
      <>
        <SectionCard number="01" title="Power & propulsion" description="Give buyers a practical picture of the engine and running hours.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Engine / model"
              name="engineModel"
              value={data.engineModel}
              onChange={onChange}
              placeholder="e.g. BMC 1.5 Diesel"
            />
            <Field
              label="Engine hours"
              name="engineHours"
              value={data.engineHours}
              onChange={onChange}
              placeholder="e.g. 1,250"
              suffix="hrs"
              type="number"
            />
            <Field label="Gearbox" name="gearbox" value={data.gearbox} onChange={onChange} placeholder="e.g. PRM 150" />
            <Field
              label="Fuel capacity"
              name="fuelCapacity"
              value={data.fuelCapacity}
              onChange={onChange}
              placeholder="e.g. 500"
              suffix="L"
              type="number"
            />
          </div>
        </SectionCard>
      </>
    ),
    heating: (
      <>
        <SectionCard number="01" title="Comfort on board" description="Heating and hot water details make the vessel easier to evaluate.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Central heating"
              name="centralHeating"
              value={data.centralHeating}
              onChange={onChange}
              placeholder="e.g. Webasto diesel heating"
            />
            <Field
              label="Hot water source"
              name="hotWater"
              value={data.hotWater}
              onChange={onChange}
              placeholder="e.g. Calorifier and immersion"
            />
            <Field
              label="Water tank capacity"
              name="waterCapacity"
              value={data.waterCapacity}
              onChange={onChange}
              placeholder="e.g. 700"
              suffix="L"
              type="number"
            />
          </div>
        </SectionCard>
      </>
    ),
    electrical: (
      <>
        <SectionCard number="01" title="Electrical systems" description="Help buyers understand power at sea and on shore.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Battery bank" name="batteries" value={data.batteries} onChange={onChange} placeholder="e.g. 4 × 110Ah leisure" />
            <Field
              label="Inverter / charger"
              name="inverter"
              value={data.inverter}
              onChange={onChange}
              placeholder="e.g. Victron MultiPlus"
            />
            <Field label="Solar panels" name="solarPanels" value={data.solarPanels} onChange={onChange} placeholder="e.g. 400W array" />
            <Field label="Shore power" name="shorePower" value={data.shorePower} onChange={onChange} placeholder="e.g. 16A connection" />
          </div>
        </SectionCard>
      </>
    ),
    interior: (
      <>
        <SectionCard number="01" title="Inside the boat" description="Share the details that give the interior its character.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Berths" name="berths" value={data.berths} onChange={onChange} placeholder="e.g. 4" type="number" />
            <Field
              label="Saloon seating"
              name="saloonSeating"
              value={data.saloonSeating}
              onChange={onChange}
              placeholder="e.g. U-shaped sofa"
            />
            <Field label="Insulation" name="insulation" value={data.insulation} onChange={onChange} placeholder="e.g. Spray foam" />
            <Field
              label="Galley equipment"
              name="galleyEquipment"
              value={data.galleyEquipment}
              onChange={onChange}
              placeholder="e.g. Oven, hob, fridge"
            />
            <Field label="Fit-out" name="fitOut" value={data.fitOut} onChange={onChange} placeholder="e.g. Liveaboard" />
            <TextAreaField
              label="Interior notes"
              name="interiorNotes"
              value={data.interiorNotes}
              onChange={onChange}
              placeholder="Finishes, storage, recent updates..."
              className="sm:col-span-2"
              rows={4}
            />
          </div>
        </SectionCard>
      </>
    ),
  }
  return (
    <div>
      <div className="space-y-4">{groups[section.key]}</div>
    </div>
  )
}

type MediaStepProps = StepProps & {
  photos: ClientPhoto[]
  setPhotos: Dispatch<SetStateAction<ClientPhoto[]>>
  setBrochure: (file: File | null) => void
  setToast: (notice: Notice) => void
}

function MediaStep({ data, onChange, photos, setPhotos, setBrochure, setToast, showValidation }: MediaStepProps) {
  const v2 = useContext(WizardThemeContext)
  const photoError = showValidation && photos.length < 1 ? 'Add at least one photo of your boat to continue.' : ''
  const inputRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLDialogElement>(null)
  const draggedPhotoRef = useRef<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [draggedPhoto, setDraggedPhoto] = useState<string | null>(null)
  const [previewIndex, setPreviewIndex] = useState(0)
  const [previewDirection, setPreviewDirection] = useState(1)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [supportsHover] = useState(() => typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches)
  const reducedMotion = useReducedMotion()
  function openPreview(index: number) {
    setPreviewDirection(1)
    setPreviewIndex(index)
    setGalleryOpen(true)
    galleryRef.current?.showModal()
  }
  function changePreview(direction: number) {
    setPreviewDirection(direction)
    setPreviewIndex((current) => (current + direction + photos.length) % photos.length)
  }
  function movePhotoToIndex(photoId: string, targetIndex: number) {
    setPhotos((current) => {
      const sourceIndex = current.findIndex((photo) => photo.id === photoId)
      if (sourceIndex < 0 || sourceIndex === targetIndex) return current
      const next = [...current]
      const [photo] = next.splice(sourceIndex, 1)
      next.splice(targetIndex, 0, photo)
      return next
    })
  }
  function handlePhotoDrop(event: DragEvent, targetIndex: number) {
    event.preventDefault()
    event.stopPropagation()
    const draggedId = draggedPhotoRef.current
    draggedPhotoRef.current = null
    setDraggedPhoto(null)
    if (draggedId) movePhotoToIndex(draggedId, targetIndex)
    else if (event.dataTransfer.files.length) addFiles(event.dataTransfer.files)
  }
  function addFiles(fileList: FileList | null) {
    const files = Array.from(fileList || []).filter((file) => file.type.startsWith('image/'))
    const remaining = Math.max(0, MAX_PHOTOS - photos.length)
    if (files.length > remaining)
      setToast({
        type: 'warning',
        title: 'Photo limit reached',
        description: `You can add up to ${MAX_PHOTOS} photos.`,
      })
    const accepted = files.slice(0, remaining).filter((file) => {
      if (file.size <= MAX_PHOTO_BYTES) return true
      setToast({
        type: 'warning',
        title: 'Photo is too large',
        description: 'Choose a file under 20 MB.',
      })
      return false
    })
    setPhotos((current) => [
      ...current,
      ...accepted.map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        src: URL.createObjectURL(file),
        file,
      })),
    ])
  }
  return (
    <div className="space-y-4">
      <SectionCard number="01" title="Photography" description="Lead with a strong exterior image, then show the spaces that matter.">
        <motion.div
          animate={{
            borderColor: dragging ? (v2 ? '#68a6c9' : '#0D5673') : v2 ? '#c3dbe9' : '#b9cfdd',
            backgroundColor: dragging ? (v2 ? '#e0eef9' : '#eaf3fa') : v2 ? '#f2f8fc' : '#f8fbfd',
          }}
          transition={{ duration: reducedMotion ? 0 : v2 ? 0.35 : 0.24, ease: EASE }}
          className="wizard-upload-zone rounded-[11px] border border-dashed p-6 text-center"
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            addFiles(event.dataTransfer.files)
          }}
        >
          <motion.div
            animate={{ scale: dragging && !reducedMotion ? 1.08 : 1 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#e7f1f7] text-sp-brand-deep"
          >
            <CloudUpload size={21} />
          </motion.div>
          <p className="mt-4 text-[14px] font-semibold text-sp-ink">Drop your photos here</p>
          <p className="mt-1 text-[12px] text-[#718694]">JPG, PNG or WEBP · 1–20 photos · 20 MB each</p>
          <input
            ref={inputRef}
            className="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(event) => {
              addFiles(event.target.files)
              event.target.value = ''
            }}
          />
          <motion.button
            type="button"
            onClick={() => inputRef.current?.click()}
            aria-required="true"
            aria-invalid={photoError ? true : undefined}
            aria-describedby={photoError ? 'wizard-photos-error' : undefined}
            whileTap={reducedMotion ? undefined : { scale: 0.96 }}
            whileHover={reducedMotion ? undefined : { backgroundColor: '#f3f7fa' }}
            transition={{ duration: reducedMotion ? 0 : 0.2, ease: EASE }}
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-[8px] border border-[#cbdce6] bg-white px-4 text-[12px] font-bold text-sp-brand-deep"
          >
            <ImagePlus size={15} /> Browse photos
          </motion.button>
        </motion.div>
        <ValidationMessage id="wizard-photos-error">{photoError}</ValidationMessage>
        {photos.length > 0 && (
          <div className="mt-5 grid grid-cols-3 gap-3">
            <AnimatePresence initial={false}>
              {photos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  layout={reducedMotion ? false : 'position'}
                  initial={reducedMotion ? false : { opacity: 0, y: 12, scale: 0.97 }}
                  animate="rest"
                  exit={reducedMotion ? undefined : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: reducedMotion ? 0 : 0.26, ease: EASE, delay: reducedMotion ? 0 : Math.min(index * 0.035, 0.18) }}
                  variants={{
                    rest: { opacity: draggedPhoto === photo.id ? 0.45 : 1, y: 0, scale: 1 },
                    hover: { opacity: draggedPhoto === photo.id ? 0.45 : 1, y: 0, scale: reducedMotion ? 1 : 1.015 },
                  }}
                  whileHover={reducedMotion ? undefined : 'hover'}
                  draggable
                  // Capture variants: on a motion element onDragStart/onDragEnd are
                  // framer-motion gesture props, not the native HTML5 drag events.
                  onDragStartCapture={(event) => {
                    draggedPhotoRef.current = photo.id
                    setDraggedPhoto(photo.id)
                    event.dataTransfer.effectAllowed = 'move'
                    event.dataTransfer.setData('text/plain', photo.id)
                  }}
                  onDragEndCapture={() => {
                    draggedPhotoRef.current = null
                    setDraggedPhoto(null)
                  }}
                  onDragOver={(event) => {
                    if (draggedPhotoRef.current) event.preventDefault()
                  }}
                  onDrop={(event) => handlePhotoDrop(event, index)}
                  className="group relative aspect-[4/3] cursor-grab overflow-hidden rounded-[8px] bg-sp-surface-soft active:cursor-grabbing"
                >
                  <img src={photo.src} alt={photo.name} draggable="false" className="pointer-events-none h-full w-full object-cover" />
                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 rounded bg-sp-brand px-2 py-1 text-[10px] font-bold text-white">
                      Cover photo
                    </span>
                  )}
                  {index > 0 && (
                    <motion.button
                      type="button"
                      onClick={() => movePhotoToIndex(photo.id, 0)}
                      aria-label={`Set ${photo.name} as cover photo`}
                      variants={{ rest: { opacity: supportsHover ? 0 : 1 }, hover: { opacity: 1 } }}
                      whileFocus={{ opacity: 1 }}
                      whileTap={reducedMotion ? undefined : { scale: 0.96 }}
                      transition={{ duration: reducedMotion ? 0 : 0.18 }}
                      className="absolute bottom-2 left-2 rounded bg-white/95 px-2 py-1 text-[10px] font-bold text-sp-brand-deep shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sp-brand"
                    >
                      Set as cover
                    </motion.button>
                  )}
                  <motion.button
                    type="button"
                    onClick={() => openPreview(index)}
                    aria-label={`Enlarge ${photo.name}`}
                    title="View larger"
                    variants={{ rest: { opacity: supportsHover ? 0 : 1 }, hover: { opacity: 1 } }}
                    whileFocus={{ opacity: 1 }}
                    whileTap={reducedMotion ? undefined : { scale: 0.92 }}
                    transition={{ duration: reducedMotion ? 0 : 0.18 }}
                    className="absolute bottom-2 right-2 grid h-9 w-9 place-items-center rounded-lg bg-white text-sp-brand-deep shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sp-brand"
                  >
                    <Expand size={16} />
                  </motion.button>
                  {!photo.imageId && (
                    <motion.button
                      aria-label={`Remove ${photo.name}`}
                      type="button"
                      onClick={() => setPhotos((current) => current.filter((item) => item.id !== photo.id))}
                      whileTap={reducedMotion ? undefined : { scale: 0.92 }}
                      className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white text-sp-brand-deep shadow-sm"
                    >
                      <X size={14} />
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
        {photos.length > 1 && (
          <p className="mt-4 flex gap-2 text-[11px] leading-4 text-[#718694]">
            <Info size={14} className="shrink-0" />
            Drag photos to reorder them and choose a cover photo. The first photo is used as your cover.
          </p>
        )}
        {photos.some((photo) => photo.imageId) && (
          <p className="mt-2 flex gap-2 text-[11px] leading-4 text-[#718694]">
            <Info size={14} className="shrink-0" />
            Photos already on your listing can’t be removed here. Ask your broker if one needs to come down.
          </p>
        )}
      </SectionCard>
      <SectionCard
        number="02"
        title="Extra ways to explore"
        description="A walkthrough or brochure can answer questions before the first enquiry."
      >
        <div className="space-y-5">
          <Field
            label="Video tour URL"
            name="videoUrl"
            value={data.videoUrl}
            onChange={onChange}
            placeholder="https://youtube.com/watch?v=..."
            hint="YouTube or Vimeo links work best."
          />
          <Field
            label="Virtual tour URL"
            name="virtualTourUrl"
            value={data.virtualTourUrl}
            onChange={onChange}
            placeholder="https://my.360tour.com/..."
          />
          <label className="block">
            <span className="mb-2 block text-[12px] font-bold text-[#425a69]">Boat brochure</span>
            <span className="wizard-file-picker flex min-h-12 items-center justify-between gap-4 rounded-[8px] border border-sp-hairline bg-[#f9fbfc] px-3.5">
              <span className="flex items-center gap-2 text-[12px] text-sp-body">
                <FileText size={16} className="text-sp-brand-deep" />
                {data.brochureName || 'Choose a PDF brochure'}
              </span>
              <span className="rounded-[6px] border border-sp-hairline bg-white px-3 py-1.5 text-[11px] font-bold text-sp-brand-deep">
                Browse
              </span>
            </span>
            <input
              className="sr-only"
              type="file"
              accept="application/pdf"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null
                if (file && file.type !== 'application/pdf') {
                  setToast({ type: 'warning', title: 'Brochure must be a PDF', description: 'Choose a PDF file for the boat brochure.' })
                  event.target.value = ''
                  return
                }
                setBrochure(file)
                onChange({ target: { name: 'brochureName', value: file?.name || '' } })
              }}
            />
          </label>
        </div>
      </SectionCard>
      <dialog
        ref={galleryRef}
        aria-label="Photo preview"
        onClose={() => setGalleryOpen(false)}
        className="fixed inset-0 m-auto h-[min(800px,95dvh)] max-h-[95dvh] w-[min(1200px,95vw)] max-w-[95vw] overflow-hidden rounded-2xl border border-sp-hairline bg-white p-0 text-sp-brand-deep backdrop:bg-[#061e2e]/80 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center justify-between border-b border-sp-hairline p-4">
          <p className="text-sm font-semibold">
            {photos[previewIndex]?.name} · {previewIndex + 1} / {photos.length}
          </p>
          <motion.button
            type="button"
            aria-label="Close photo preview"
            onClick={() => galleryRef.current?.close()}
            whileTap={reducedMotion ? undefined : { scale: 0.94 }}
            className="grid h-10 w-10 place-items-center rounded-lg text-sp-brand-deep hover:bg-sp-surface-soft"
          >
            <X size={20} />
          </motion.button>
        </div>
        <div className="relative h-[calc(100%-73px)] bg-sp-surface-soft">
          <AnimatePresence initial={false} custom={previewDirection}>
            {photos[previewIndex] && (
              <motion.img
                key={`${galleryOpen ? 'open' : 'closed'}-${photos[previewIndex].id}`}
                src={photos[previewIndex].src}
                alt={photos[previewIndex].name || 'Boat photo'}
                custom={previewDirection}
                initial={reducedMotion ? false : galleryOpen ? { opacity: 0, scale: 0.985, x: `${previewDirection * 100}%` } : 'enter'}
                animate="center"
                exit="exit"
                variants={{
                  enter: (direction: number) => ({ x: `${direction * 100}%` }),
                  center: { opacity: 1, scale: 1, x: '0%' },
                  exit: (direction: number) => ({ opacity: 0, x: `${direction * -100}%` }),
                }}
                transition={{ duration: reducedMotion ? 0 : 0.32, ease: EASE }}
                className="absolute inset-0 h-full w-full object-contain"
              />
            )}
          </AnimatePresence>
          {photos.length > 1 && (
            <>
              <motion.button
                type="button"
                aria-label="Previous photo"
                onClick={() => changePreview(-1)}
                whileTap={reducedMotion ? undefined : { scale: 0.94 }}
                className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-sp-brand-deep"
              >
                <ChevronLeft size={20} />
              </motion.button>
              <motion.button
                type="button"
                aria-label="Next photo"
                onClick={() => changePreview(1)}
                whileTap={reducedMotion ? undefined : { scale: 0.94 }}
                className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-sp-brand-deep"
              >
                <ChevronRight size={20} />
              </motion.button>
            </>
          )}
        </div>
      </dialog>
    </div>
  )
}

function DetailsStep({ data, onChange, showValidation }: StepProps) {
  const errors = showValidation ? getDetailsErrors(data) : {}
  return (
    <div className="space-y-4">
      <SectionCard number="01" title="Contact information" description="We will use these details to reach you about your listing.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Full name"
            name="contactName"
            value={data.contactName}
            onChange={onChange}
            placeholder="e.g. Alex Morgan"
            required
            error={errors.contactName}
          />
          <Field
            label="Email address"
            name="email"
            value={data.email}
            onChange={onChange}
            placeholder="alex@example.com"
            type="email"
            required
            error={errors.email}
          />
          <Field
            label="Phone number"
            name="phone"
            value={data.phone}
            onChange={onChange}
            placeholder="e.g. +44 20 7946 0000"
            type="tel"
            required
            error={errors.phone}
          />
          <Field label="City" name="city" value={data.city} onChange={onChange} placeholder="e.g. London" required error={errors.city} />
        </div>
      </SectionCard>
      <SectionCard number="02" title="Selling preferences" description="A little context helps make the first conversation useful.">
        <div className="space-y-5">
          <RadioCards
            label="How soon do you want to sell?"
            name="sellTimeline"
            value={data.sellTimeline}
            onChange={onChange}
            options={[
              {
                value: 'As soon as possible',
                title: 'As soon as possible',
                description: 'Ready to start now',
              },
              {
                value: 'Within 1 month',
                title: 'Within 1 month',
                description: 'Planning to list shortly',
              },
              {
                value: '1–3 months',
                title: '1–3 months',
                description: 'Looking a little further ahead',
              },
              {
                value: 'Just exploring',
                title: 'Just exploring',
                description: 'No fixed timeline yet',
              },
            ]}
          />
          <RadioCards
            label="Best time to reach you"
            name="contactTime"
            value={data.contactTime}
            onChange={onChange}
            options={[
              {
                value: 'Morning',
                title: 'Morning',
                description: 'Before midday',
              },
              {
                value: 'Afternoon',
                title: 'Afternoon',
                description: 'Midday to early evening',
              },
              {
                value: 'Evening',
                title: 'Evening',
                description: 'After working hours',
              },
            ]}
          />
        </div>
      </SectionCard>
      <SectionCard
        number="03"
        title="About the listing"
        description="Let us know your relationship to the vessel and anything else worth noting."
      >
        <div className="space-y-5">
          <RadioCards
            label="Who is listing this boat?"
            name="sellerType"
            value={data.sellerType}
            onChange={onChange}
            options={[
              {
                value: 'Private owner',
                title: 'Private owner',
                description: 'I’m selling my own boat',
              },
              {
                value: 'Broker',
                title: 'Broker',
                description: 'I’m listing on behalf of an owner',
              },
              {
                value: 'Dealer',
                title: 'Dealer',
                description: 'I’m listing as a marine business',
              },
            ]}
          />
          <TextAreaField
            label="Additional notes"
            name="notes"
            value={data.notes}
            onChange={onChange}
            placeholder="Anything about the boat’s history, features, or your selling situation..."
            rows={4}
          />
        </div>
      </SectionCard>
    </div>
  )
}

export default function BoatWizard() {
  const { loading } = useListings()
  // Edit links seed the form from the listing, so wait until it has loaded.
  if (loading) return null
  return <BoatWizardForm />
}

function BoatWizardForm() {
  const { step: slug } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const reducedMotion = useReducedMotion()
  const { listings, saveDraft: saveListingDraft, submitListing } = useListings()
  const activeIndex = steps.findIndex((item) => item.slug === slug)
  const v2Wizard = activeIndex >= 0 && activeIndex < steps.length
  const routeDraftId = searchParams.get('draft')
  const editingListing = listings.find((item) => item.id === routeDraftId && ['Draft', 'Rejected'].includes(item.status))
  const isEditingDraft = Boolean(editingListing)
  // A listing already on the server can't also be parked as a local draft.
  const canSaveDraft = !editingListing?.listingId
  const [specIndex, setSpecIndex] = useState(0)
  const [showAdditionalValidation, setShowAdditionalValidation] = useState(false)
  const [showBasicValidation, setShowBasicValidation] = useState(false)
  const [showMediaValidation, setShowMediaValidation] = useState(false)
  const [showDetailsValidation, setShowDetailsValidation] = useState(false)
  const [data, setData] = useState(() => initialListingData(editingListing))
  const draftId = editingListing?.id || null
  const [photos, setPhotos] = useState<ClientPhoto[]>(() => editingListing?.photos ?? [])
  const [brochure, setBrochure] = useState<File | null>(() => editingListing?.brochureFile ?? null)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<Notice | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const railRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const menuTriggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.title = `${isEditingDraft ? 'Edit listing' : 'New boat listing'} · The Boat Brokers`
  }, [isEditingDraft])
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' })
  }, [slug, specIndex, reducedMotion])
  useEffect(() => {
    if (!toast) return undefined
    const id = window.setTimeout(() => setToast(null), 6500)
    return () => window.clearTimeout(id)
  }, [toast])
  useEffect(() => {
    if (!mobileOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMobileOpen(false)
        menuTriggerRef.current?.focus()
      }
      if (event.key !== 'Tab') return
      const controls = Array.from(railRef.current?.querySelectorAll<HTMLElement>('a, button') || [])
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [mobileOpen])
  if (activeIndex < 0) return <Navigate to="/boats/new/basic" replace />
  if (routeDraftId && !editingListing) return <Navigate to="/boats" replace />

  function onChange(event: WizardChange) {
    setData((current) => ({ ...current, [event.target.name]: event.target.value }) as WizardData)
  }
  function onStep(index: number) {
    if (index > activeIndex && activeIndex === 2 && photos.length < 1) {
      setShowMediaValidation(true)
      focusFirstInvalidField(reducedMotion)
      return false
    }
    if (index > activeIndex && activeIndex === 0) {
      setShowBasicValidation(true)
      if (hasErrors(getBasicErrors(data))) {
        focusFirstInvalidField(reducedMotion)
        return false
      }
    }
    if (index > activeIndex && activeIndex === 3) {
      setShowDetailsValidation(true)
      if (hasErrors(getDetailsErrors(data))) {
        focusFirstInvalidField(reducedMotion)
        return false
      }
    }
    if (
      index > activeIndex &&
      activeIndex === 1 &&
      specSections[specIndex].key === 'additional' &&
      hasIncompleteAdditionalDetails(data.additionalDetails)
    ) {
      setShowAdditionalValidation(true)
      focusFirstInvalidField(reducedMotion)
      return false
    }
    const draftQuery = draftId ? `?draft=${encodeURIComponent(draftId)}` : ''
    navigate(`/boats/new/${steps[index].slug}${draftQuery}`)
    return true
  }
  function closeMobileMenu() {
    if (mobileOpen) {
      setMobileOpen(false)
      menuTriggerRef.current?.focus()
    }
  }
  async function saveDraft() {
    setSubmitting(true)
    try {
      await saveListingDraft({ data, photos, brochure, existing: editingListing })
      navigate('/boats', {
        state: {
          notice: {
            type: 'success',
            title: 'Draft saved',
            description: 'Your draft is in My Boats on this device and ready to continue editing.',
          },
        },
      })
    } catch {
      setSubmitting(false)
      setToast({ type: 'error', title: 'Draft not saved', description: 'This browser couldn’t store the draft. Please try again.' })
    }
  }
  async function continueFlow() {
    if (activeIndex === 0) {
      setShowBasicValidation(true)
      if (hasErrors(getBasicErrors(data))) {
        focusFirstInvalidField(reducedMotion)
        return
      }
    }
    if (activeIndex === 3) {
      setShowDetailsValidation(true)
      if (hasErrors(getDetailsErrors(data))) {
        focusFirstInvalidField(reducedMotion)
        return
      }
    }
    if (
      ((activeIndex === 1 && specSections[specIndex].key === 'additional') || activeIndex === 4) &&
      hasIncompleteAdditionalDetails(data.additionalDetails)
    ) {
      setShowAdditionalValidation(true)
      setSpecIndex(specSections.length - 1)
      if (activeIndex !== 1) onStep(1)
      focusFirstInvalidField(reducedMotion)
      return
    }
    if (activeIndex === 1 && specIndex < specSections.length - 1) {
      setSpecIndex((value) => value + 1)
      return
    }
    if (activeIndex < steps.length - 1) {
      onStep(activeIndex + 1)
      return
    }
    if (hasErrors(getBasicErrors(data))) {
      setShowBasicValidation(true)
      onStep(0)
      focusFirstInvalidField(reducedMotion)
      return
    }
    if (hasErrors(getDetailsErrors(data))) {
      setShowDetailsValidation(true)
      onStep(3)
      focusFirstInvalidField(reducedMotion)
      return
    }
    if (photos.length < 1) {
      setShowMediaValidation(true)
      onStep(2)
      focusFirstInvalidField(reducedMotion)
      return
    }
    setSubmitting(true)
    try {
      await submitListing({ data, photos, brochure, existing: editingListing })
      navigate('/boats', {
        state: {
          notice: {
            type: 'success',
            title: 'Listing submitted for review',
            description: 'Your listing is in My Boats while the broker team reviews it.',
          },
        },
      })
    } catch (err) {
      setSubmitting(false)
      setToast({ type: 'error', title: 'Listing not submitted', description: err instanceof Error ? err.message : 'Please try again.' })
    }
  }
  function backFlow() {
    if (activeIndex === 1 && specIndex > 0) {
      setSpecIndex((value) => value - 1)
      return
    }
    if (activeIndex > 0) onStep(activeIndex - 1)
  }
  const step = steps[activeIndex]
  const nextLabel =
    activeIndex === 1 && specIndex < specSections.length - 1 ? 'Next section' : activeIndex === 4 ? 'Submit for review' : 'Save & continue'

  return (
    <WizardThemeContext.Provider value={v2Wizard}>
      <div className="dashboard-v2 v2-wizard flex min-h-dvh text-sp-ink">
        <div className="v2-backdrop" aria-hidden="true" />
        <AnimatePresence>
          {mobileOpen && (
            <motion.button
              type="button"
              aria-label="Close steps"
              onClick={closeMobileMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.3, ease: EASE }}
              className="fixed inset-0 z-40 bg-[#061e2e]/50 lg:hidden"
            />
          )}
        </AnimatePresence>
        <V2WizardRail
          steps={steps}
          sections={specSections}
          activeIndex={activeIndex}
          specIndex={specIndex}
          isEditingDraft={isEditingDraft}
          onStep={onStep}
          onSpec={setSpecIndex}
          mobileOpen={mobileOpen}
          onClose={closeMobileMenu}
          railRef={railRef}
          closeRef={closeRef}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <motion.main
            initial={reducedMotion ? false : { opacity: 0, y: 28, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
            transition={{ duration: reducedMotion ? 0 : 1.05, ease: EASE }}
            className="wizard-main mx-auto w-full max-w-[1070px] flex-1 px-5 pb-36 pt-8 sm:px-8 lg:pt-16 xl:px-10"
          >
            <div className="v2-wizard-context">
              <Link to="/boats">
                <ChevronLeft size={13} strokeWidth={1.5} />
                My boats
              </Link>
              <ChevronRight size={10} aria-hidden="true" />
              <span>{isEditingDraft ? 'Edit listing' : 'New listing'}</span>
            </div>
            <button
              ref={menuTriggerRef}
              type="button"
              aria-label="Open listing steps"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className="wizard-menu-trigger mb-8 inline-flex min-h-11 items-center gap-2 rounded-[8px] bg-white px-3 text-[12px] font-bold text-sp-brand-deep tactile-control lg:hidden"
            >
              <Menu size={16} /> Steps
            </button>
            <div className="wizard-page-heading mb-8">
              <h1 className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[30px] font-semibold leading-[1.15] tracking-[-0.055em] text-sp-brand-deep sm:text-[35px]">
                <span>{step.title}</span>
                {activeIndex === 1 && (
                  <>
                    <span aria-hidden="true" className="text-[22px] font-normal text-[#9ab2c3]">
                      /
                    </span>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={specSections[specIndex].key}
                        initial={reducedMotion ? false : { opacity: 0, y: 7 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
                        transition={{ duration: reducedMotion ? 0 : 0.26, ease: EASE }}
                        className="text-[18px] font-medium tracking-[-0.025em] text-[#4f7187] sm:text-[20px]"
                      >
                        {specSections[specIndex].title}
                      </motion.span>
                    </AnimatePresence>
                  </>
                )}
              </h1>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${slug}-${activeIndex === 1 ? specIndex : ''}`}
                initial={reducedMotion ? false : { opacity: 0, y: 18, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={{ duration: reducedMotion ? 0 : 0.5, ease: EASE }}
              >
                {activeIndex === 0 && <BasicStep data={data} onChange={onChange} showValidation={showBasicValidation} />}
                {activeIndex === 1 && (
                  <SpecificationStep
                    data={data}
                    onChange={onChange}
                    specIndex={specIndex}
                    showAdditionalValidation={showAdditionalValidation}
                  />
                )}
                {activeIndex === 2 && (
                  <MediaStep
                    showValidation={showMediaValidation}
                    data={data}
                    onChange={onChange}
                    photos={photos}
                    setPhotos={setPhotos}
                    setBrochure={setBrochure}
                    setToast={setToast}
                  />
                )}
                {activeIndex === 3 && <DetailsStep data={data} onChange={onChange} showValidation={showDetailsValidation} />}
                {activeIndex === 4 && (
                  <div className="v2-wizard-review">
                    <WizardReview
                      data={data}
                      photos={photos}
                      v2
                      onStep={onStep}
                      onSpecEdit={(index) => {
                        setSpecIndex(index)
                        onStep(1)
                      }}
                      onAdditionalEdit={() => {
                        setSpecIndex(specSections.length - 1)
                        onStep(1)
                      }}
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.main>
          <div className="wizard-footer fixed bottom-3 left-0 right-0 z-20 sm:bottom-4 lg:left-[284px] xl:left-[308px]">
            <div className="wizard-footer-width mx-auto w-full max-w-[1070px] px-5 sm:px-8 xl:px-10">
              <div
                className="wizard-actionbar v2-glass-surface rounded-[12px] border border-[#dfe8ec] bg-white px-3 py-3 sm:px-6"
                style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
              >
                <div className="v2-wizard-actions">
                  {canSaveDraft ? (
                    <AccountButton onClick={saveDraft} aria-label="Save as draft" disabled={submitting}>
                      <Save size={14} strokeWidth={1.5} />
                      <span className="v2-wizard-save-label">Save as draft</span>
                      <span className="v2-wizard-save-short">Save</span>
                    </AccountButton>
                  ) : (
                    <span />
                  )}
                  <div>
                    <AccountButton onClick={activeIndex === 0 ? () => navigate('/dashboard') : backFlow}>
                      {activeIndex === 0 ? 'Cancel' : 'Back'}
                    </AccountButton>
                    <AccountButton kind="primary" arrow="right" onClick={continueFlow} disabled={submitting}>
                      {submitting && activeIndex === 4 ? 'Submitting…' : nextLabel}
                    </AccountButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastNotice notice={toast} onClose={() => setToast(null)} className="bottom-20 sm:bottom-5" />
      </div>
    </WizardThemeContext.Provider>
  )
}
