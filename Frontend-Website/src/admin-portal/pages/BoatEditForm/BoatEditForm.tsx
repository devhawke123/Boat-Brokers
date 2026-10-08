import { useEffect, useState } from 'react'
import AdminShell from '../../components/AdminShell/AdminShell'
import { useAdminSession } from '../../data/useAdminSession'
import {
  createBoat,
  fetchListing,
  fetchSellers,
  updateBoat,
  updateListingPreferences,
  type ApiBoatListing,
  type ApiSeller,
} from '../../../seller-portal/lib/api'
import { fetchBoat, type ApiBoat } from '../../../lib/api'
import StepIndicator from '../../../seller-portal/pages/AddBoat/sections/StepIndicator/StepIndicator'
import StepFormCard from '../../../seller-portal/components/StepFormCard/StepFormCard'
import BasicInformationForm, {
  initialBasicInformationValues,
  type BasicInformationValues,
} from '../../../seller-portal/pages/AddBoat/sections/BasicInformationForm/BasicInformationForm'
import SpecificationsForm, {
  initialSpecificationsValues,
  type SpecificationsValues,
  type SpecTab,
} from '../../../seller-portal/pages/AddBoat/sections/SpecificationsForm/SpecificationsForm'
import {
  initialAdditionalFieldsValues,
  type AdditionalFieldsValues,
} from '../../../seller-portal/pages/AddBoat/sections/AdditionalFieldsForm/AdditionalFieldsForm'
import MediaForm, {
  initialMediaValues,
  type MediaValues,
} from '../../../seller-portal/pages/AddBoat/sections/MediaForm/MediaForm'
import KeyDetailsForm, {
  initialKeyDetailsValues,
  type KeyDetailsValues,
} from '../../../seller-portal/pages/AddBoat/sections/KeyDetailsForm/KeyDetailsForm'
import ReviewForm from '../../../seller-portal/pages/AddBoat/sections/ReviewForm/ReviewForm'
import { isBasicInfoComplete } from '../../../seller-portal/pages/AddBoat/scoring'

// A boat can be edited two ways: via its listing (the seller-submission
// flow — Listings/SellerListingsTable) or directly by boat id (the Boats
// catalog, which also covers the ~49 legacy boats that were seeded straight
// onto the site with no BoatListing row at all). `create` reuses the same funnel
// to add a brand-new boat on behalf of a chosen seller.
type BoatEditFormProps = { listingId: number } | { boatId: number } | { create: true }

const TOTAL_STEPS = 5

// Admin-added boats still need a usable gallery, but not the seller flow's 5.
const MIN_PHOTOS_FOR_NEW_BOAT = 1

const MAX_PHOTO_SIZE_BYTES = 20 * 1024 * 1024
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function makeId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

// BasicInformationValues keys that don't already share their name with the
// Boat schema column they persist to (see Backend/prisma/schema.prisma).
const BASIC_INFO_TO_BOAT_FIELD: Partial<Record<keyof BasicInformationValues, string>> = {
  length: 'lengthBeam',
  berths: 'noOfBerths',
  stern: 'sternType',
  steel: 'steelSpec',
}

const STEP_META: Record<number, { title: string; subtitle: string }> = {
  1: { title: 'Basic Information', subtitle: 'Edit the basic details about this boat.' },
  2: { title: 'Specifications', subtitle: 'Edit the boat specification in detail.' },
  3: { title: 'Media', subtitle: 'Manage photos and videos of this boat.' },
  4: { title: 'Key Details', subtitle: 'Edit the remaining key details.' },
  5: { title: 'Review', subtitle: 'Review the listing before saving.' },
}

type SellerInfo = { name: string; email: string; phone: string | null }

export default function BoatEditForm(props: BoatEditFormProps) {
  const isCreating = 'create' in props
  const hasListing = 'listingId' in props
  const { checkedSession } = useAdminSession()
  const [currentStep, setCurrentStep] = useState(1)
  const [values, setValues] = useState<BasicInformationValues>(initialBasicInformationValues)
  const [specValues, setSpecValues] = useState<SpecificationsValues>(initialSpecificationsValues)
  const [mediaValues, setMediaValues] = useState<MediaValues>(initialMediaValues)
  const [keyDetailsValues, setKeyDetailsValues] = useState<KeyDetailsValues>(initialKeyDetailsValues)
  const [customFields, setCustomFields] = useState<AdditionalFieldsValues>(initialAdditionalFieldsValues)
  const [specTab, setSpecTab] = useState<SpecTab>('history')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [stepError, setStepError] = useState<string | null>(null)
  const [mediaError, setMediaError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [boatId, setBoatId] = useState<number | null>(null)
  // Existing photo the admin picked as the cover; null = unchanged.
  const [mainImageId, setMainImageId] = useState<string | null>(null)
  const [sellerName, setSellerName] = useState('')
  const [sellerId, setSellerId] = useState<number | null>(null)

  function valueOf(boat: ApiBoat | ApiBoatListing['boat'], key: string) {
    const value = (boat as Record<string, unknown>)[key]
    return typeof value === 'string' ? value : value == null ? '' : String(value)
  }

  function populateFromBoat(boat: ApiBoat | ApiBoatListing['boat'], seller: SellerInfo, listing?: ApiBoatListing) {
    setBoatId(boat.id)
    setSellerName(seller.name)
    setValues({
      boatName: boat.name,
      length: valueOf(boat, 'lengthBeam'),
      berths: valueOf(boat, 'noOfBerths'),
      engine: valueOf(boat, 'engine'),
      year: valueOf(boat, 'year'),
      stern: valueOf(boat, 'sternType'),
      steel: valueOf(boat, 'steelSpec'),
      hullBuilder: valueOf(boat, 'hullBuilder'),
      lastService: valueOf(boat, 'lastService'),
      boatSafety: valueOf(boat, 'boatSafety'),
      fitOut: valueOf(boat, 'fitOut'),
      blacking: valueOf(boat, 'blacking'),
      recentSurvey: valueOf(boat, 'recentSurvey'),
      price: boat.price == null ? '' : String(boat.price),
      overview: valueOf(boat, 'overview'),
    })
    setSpecValues(
      Object.fromEntries(Object.keys(initialSpecificationsValues).map((key) => [key, valueOf(boat, key)])) as SpecificationsValues,
    )
    setMediaValues({
      photos: boat.images.map((image) => ({
        id: String(image.id),
        url: image.path ?? '',
        name: `Photo ${image.position + 1}`,
        file: null,
      })),
      videoUrl: valueOf(boat, 'videoUrl'),
      brochure: null,
      virtualTourUrl: valueOf(boat, 'virtualTourUrl'),
    })
    setKeyDetailsValues({
      ...initialKeyDetailsValues,
      fullName: seller.name,
      email: seller.email,
      phone: seller.phone ?? '',
      sellTimeline: listing?.sellTimeline ?? '',
      contactTime: listing?.contactTime ?? '',
      listerType: listing?.listerType ?? '',
      additionalNotes: listing?.additionalNotes ?? '',
      agreedToContact: listing?.agreedToContact ?? false,
    })
    setCustomFields({
      fields: (boat.customFields ?? []).map((field) => ({ id: String(field.id), label: field.label, value: field.value })),
    })
  }

  useEffect(() => {
    let cancelled = false
    if (isCreating) {
      // Nothing to load for a new boat except who it can be listed under.
      fetchSellers()
        .then((all) => {
          if (cancelled) return
          const usable = all.filter((seller) => seller.status !== 'LOST')
          // New admin boats are always listed under the in-house seller (Noel).
          const house = usable.find((seller) => seller.name.trim().toLowerCase() === 'boat brokers')
          applySeller(house ?? usable[0] ?? null)
        })
        .catch((err: unknown) => {
          if (!cancelled) setSubmitError(err instanceof Error ? err.message : 'Failed to load sellers.')
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false)
        })
      return () => {
        cancelled = true
      }
    }
    setIsLoading(true)
    const request = hasListing
      ? fetchListing((props as { listingId: number }).listingId).then((listing) => populateFromBoat(listing.boat, listing.seller, listing))
      : fetchBoat((props as { boatId: number }).boatId, { includeDeleted: true }).then((boat) => populateFromBoat(boat, boat.seller))
    request
      .catch((err: unknown) => {
        if (!cancelled) setSubmitError(err instanceof Error ? err.message : 'Failed to load boat.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreating, hasListing, 'listingId' in props ? props.listingId : 'boatId' in props ? props.boatId : 0])

  // Contact details on Key Details come from the seller the boat is listed under.
  function applySeller(seller: ApiSeller | null) {
    setSellerId(seller?.id ?? null)
    setSellerName(seller?.name ?? '')
    setKeyDetailsValues((prev) => ({
      ...prev,
      fullName: seller?.name ?? '',
      email: seller?.email ?? '',
      phone: seller?.phone ?? '',
      city: seller?.location ?? '',
    }))
  }

  if (!checkedSession) return null

  function handleChange(field: keyof BasicInformationValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  function handleSpecChange(field: keyof SpecificationsValues, value: string) {
    setSpecValues((prev) => ({ ...prev, [field]: value }))
  }

  function handleCustomFieldAdd() {
    setCustomFields((prev) => ({ fields: [...prev.fields, { id: makeId(), label: '', value: '' }] }))
  }

  function handleCustomFieldRemove(id: string) {
    setCustomFields((prev) => ({ fields: prev.fields.filter((field) => field.id !== id) }))
  }

  function handleCustomFieldChange(id: string, key: 'label' | 'value', value: string) {
    setCustomFields((prev) => ({
      fields: prev.fields.map((field) => (field.id === id ? { ...field, [key]: value } : field)),
    }))
  }

  function handleAddFieldShortcut() {
    setSpecTab('additional')
    handleCustomFieldAdd()
  }

  function handleCancel() {
    window.location.href = hasListing ? '/admin-portal/listings' : '/admin-portal/boats'
  }

  async function handleContinue() {
    if (isCreating) {
      if (currentStep === 1 && (sellerId === null || !isBasicInfoComplete(values))) {
        setStepError(
          sellerId === null
            ? 'Choose which seller this boat is listed under.'
            : 'Please fill in all required fields (marked *) before continuing.',
        )
        return
      }
      if (currentStep === 3 && mediaValues.photos.length < MIN_PHOTOS_FOR_NEW_BOAT) {
        setStepError(`Please upload at least ${MIN_PHOTOS_FOR_NEW_BOAT} photo before continuing.`)
        return
      }
    }
    if (currentStep < TOTAL_STEPS) {
      setStepError(null)
      setMediaError(null)
      setCurrentStep((step) => Math.min(step + 1, TOTAL_STEPS))
      return
    }
    if (isCreating ? sellerId === null : boatId === null) {
      setStepError(
        isCreating ? 'Choose which seller this boat is listed under.' : 'Boat details are still loading. Please try again.',
      )
      return
    }

    setStepError(null)
    setSubmitError(null)
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      const sanitizedPrice = values.price.replace(/[^0-9]/g, '')
      // On create, empty values are omitted entirely (the backend treats absent as unset).
      if (sanitizedPrice || !isCreating) formData.set('price', sanitizedPrice)
      formData.set('name', values.boatName)
      if (isCreating) {
        formData.set('sellerId', String(sellerId))
        formData.set('adminCreated', 'true')
      }

      for (const [key, value] of Object.entries(values)) {
        if (key === 'price' || key === 'boatName') continue
        if (isCreating && !value.trim()) continue
        formData.set(BASIC_INFO_TO_BOAT_FIELD[key as keyof BasicInformationValues] ?? key, value.trim())
      }

      for (const [key, value] of Object.entries(specValues)) {
        if (isCreating && !value.trim()) continue
        formData.set(key, value.trim())
      }

      const extraFields = customFields.fields
        .map((field) => ({ label: field.label.trim(), value: field.value.trim() }))
        .filter((field) => field.label && field.value)
      if (!isCreating || extraFields.length) formData.set('customFields', JSON.stringify(extraFields))

      if (mediaValues.videoUrl.trim()) formData.set('videoUrl', mediaValues.videoUrl.trim())
      if (mediaValues.virtualTourUrl.trim()) formData.set('virtualTourUrl', mediaValues.virtualTourUrl.trim())
      if (mediaValues.brochure) formData.set('brochure', mediaValues.brochure, mediaValues.brochure.name)
      const newPhotos = mediaValues.photos.filter((photo) => photo.file)
      for (const photo of newPhotos) formData.append('photos', photo.file!, photo.name)
      if (mainImageId) {
        // An existing photo is referenced by id; a just-added one by its
        // position among the uploaded files (it has no id until saved).
        const newIndex = newPhotos.findIndex((photo) => photo.id === mainImageId)
        if (newIndex >= 0) formData.set('mainNewPhotoIndex', String(newIndex))
        else if (mediaValues.photos.some((photo) => photo.id === mainImageId)) formData.set('mainImageId', mainImageId)
      }

      if (keyDetailsValues.sellTimeline.trim()) formData.set('sellTimeline', keyDetailsValues.sellTimeline.trim())
      if (keyDetailsValues.contactTime.trim()) formData.set('contactTime', keyDetailsValues.contactTime.trim())
      if (keyDetailsValues.listerType.trim()) formData.set('listerType', keyDetailsValues.listerType.trim())
      if (keyDetailsValues.additionalNotes.trim()) formData.set('additionalNotes', keyDetailsValues.additionalNotes.trim())
      formData.set('agreedToContact', String(keyDetailsValues.agreedToContact))

      if (isCreating) {
        await createBoat(formData)
      } else {
        await updateBoat(boatId!, formData)
      }
      if (hasListing) {
        await updateListingPreferences(props.listingId, {
          sellTimeline: keyDetailsValues.sellTimeline,
          contactTime: keyDetailsValues.contactTime,
          listerType: keyDetailsValues.listerType,
          additionalNotes: keyDetailsValues.additionalNotes,
          agreedToContact: keyDetailsValues.agreedToContact,
        })
      }
      window.location.href = hasListing ? '/admin-portal/listings' : '/admin-portal/boats'
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save boat. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleBack() {
    setStepError(null)
    setMediaError(null)
    setCurrentStep((step) => Math.max(step - 1, 1))
  }

  function handlePhotosAdd(files: File[]) {
    const errors: string[] = []
    const validFiles = files.filter((file) => {
      if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
        errors.push(`${file.name}: unsupported file type (use JPG, PNG or WEBP).`)
        return false
      }
      if (file.size > MAX_PHOTO_SIZE_BYTES) {
        errors.push(`${file.name}: file is too large (max 20MB).`)
        return false
      }
      return true
    })
    setMediaError(errors.length ? errors.join(' ') : null)
    if (!validFiles.length) return

    const newPhotos = validFiles.map((file) => ({ id: makeId(), url: URL.createObjectURL(file), name: file.name, file }))
    setMediaValues((prev) => ({ ...prev, photos: [...prev.photos, ...newPhotos] }))
  }

  function handlePhotoRemove(id: string) {
    setMediaValues((prev) => {
      const removed = prev.photos.find((photo) => photo.id === id)
      if (removed) URL.revokeObjectURL(removed.url)
      return { ...prev, photos: prev.photos.filter((photo) => photo.id !== id) }
    })
  }

  function handleSetMainPhoto(id: string) {
    setMainImageId(id)
    setMediaValues((prev) => {
      const index = prev.photos.findIndex((photo) => photo.id === id)
      if (index <= 0) return prev
      const photos = [...prev.photos]
      const [photo] = photos.splice(index, 1)
      photos.unshift(photo)
      return { ...prev, photos }
    })
  }

  function handleVideoUrlChange(value: string) {
    setMediaValues((prev) => ({ ...prev, videoUrl: value }))
  }

  function handleBrochureChange(file: File | null) {
    setMediaValues((prev) => ({ ...prev, brochure: file }))
  }

  function handleVirtualTourUrlChange(value: string) {
    setMediaValues((prev) => ({ ...prev, virtualTourUrl: value }))
  }

  function handleKeyDetailsChange<K extends keyof KeyDetailsValues>(field: K, value: KeyDetailsValues[K]) {
    setKeyDetailsValues((prev) => ({ ...prev, [field]: value }))
  }

  const stepMeta = STEP_META[currentStep]
  const title = stepMeta.title
  const subtitle = isCreating
    ? stepMeta.subtitle.replace(/^Edit/, 'Add').replace(/^Manage/, 'Add').replace('this boat', 'the boat')
    : stepMeta.subtitle

  if (isLoading) {
    return (
      <AdminShell mainClassName="bg-[#f8fafc]">
        <div className="p-8 text-sm text-[#64748b]">Loading boat details...</div>
      </AdminShell>
    )
  }

  return (
    <AdminShell mainClassName="bg-[#f8fafc]">
      <div className="flex w-full flex-col gap-5 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="font-display text-h4 capitalize text-[#0f172a]">{isCreating ? 'Add Boat' : 'Edit Boat'}</h1>
            <p className="text-[16px] text-[#64748b]">
              {isCreating
                ? 'Add a boat directly to the website — it goes live immediately.'
                : sellerName
                  ? `Listed by ${sellerName}.`
                  : 'Edit any field on this listing.'}
            </p>
          </div>

          <div className="flex items-center">
            <span className="text-[14px] font-medium tracking-[-0.068px] text-[#0b3a58]">Step {currentStep}</span>
            <span className="pl-2 text-[14px] font-medium tracking-[0.26px] text-[#94a3b8]">of {TOTAL_STEPS}</span>
          </div>
        </div>

        <StepIndicator currentStep={currentStep} />

        {(submitError || stepError) && (
          <div className="rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[14px] text-[#b91c1c]">
            {submitError || stepError}
          </div>
        )}

        <div className="flex flex-col items-start gap-8 xl:flex-row">
          <StepFormCard
            title={title}
            subtitle={subtitle}
            onCancel={handleCancel}
            onBack={handleBack}
            onContinue={handleContinue}
            continueLabel={
              currentStep === TOTAL_STEPS
                ? isSubmitting
                  ? 'Saving...'
                  : isCreating
                    ? 'Add Boat'
                    : 'Save Changes'
                : 'Save & Continue'
            }
            continueDisabled={currentStep === TOTAL_STEPS && isSubmitting}
            showAddField={currentStep === 2}
            onAddField={handleAddFieldShortcut}
            showBack={currentStep > 1}
          >
            {currentStep === 1 ? (
              <div className="flex flex-col gap-6">
                <BasicInformationForm values={values} onChange={handleChange} />
              </div>
            ) : currentStep === 2 ? (
              <SpecificationsForm
                values={specValues}
                onChange={handleSpecChange}
                activeTab={specTab}
                onTabChange={setSpecTab}
                customFields={customFields}
                onCustomFieldAdd={handleCustomFieldAdd}
                onCustomFieldRemove={handleCustomFieldRemove}
                onCustomFieldChange={handleCustomFieldChange}
              />
            ) : currentStep === 3 ? (
              <MediaForm
                values={mediaValues}
                onPhotosAdd={handlePhotosAdd}
                onPhotoRemove={handlePhotoRemove}
                onSetMainPhoto={handleSetMainPhoto}
                onVideoUrlChange={handleVideoUrlChange}
                onBrochureChange={handleBrochureChange}
                onVirtualTourUrlChange={handleVirtualTourUrlChange}
                photosError={mediaError}
              />
            ) : currentStep === 4 ? (
              <div className="flex flex-col gap-3">
                {!hasListing && !isCreating && (
                  <p className="rounded-lg border border-[#fde68a] bg-[#fffbeb] px-4 py-2 text-[13px] text-[#92400e]">
                    This boat has no seller submission attached, so timeline/contact preferences below won&rsquo;t be saved.
                  </p>
                )}
                <KeyDetailsForm values={keyDetailsValues} onChange={handleKeyDetailsChange} />
              </div>
            ) : (
              <ReviewForm
                basicInfo={values}
                specifications={specValues}
                media={mediaValues}
                keyDetails={keyDetailsValues}
                customFields={customFields}
                onEditStep={(step) => {
                  setStepError(null)
                  setMediaError(null)
                  setCurrentStep(step)
                }}
              />
            )}
          </StepFormCard>
        </div>
      </div>
    </AdminShell>
  )
}
