import { useEffect, useState } from 'react'
import SellerPortalShell from '../../components/SellerPortalShell/SellerPortalShell'
import { useSellerSession } from '../../data/useSellerSession'
import {
  createBoat,
  fetchListing,
  updateBoat,
  updateListingPreferences,
  type ApiBoatListing,
} from '../../lib/api'
import StepIndicator from './sections/StepIndicator/StepIndicator'
import StepFormCard from '../../components/StepFormCard/StepFormCard'
import BasicInformationForm, {
  initialBasicInformationValues,
  type BasicInformationValues,
} from './sections/BasicInformationForm/BasicInformationForm'
import SpecificationsForm, {
  initialSpecificationsValues,
  type SpecificationsValues,
  type SpecTab,
} from './sections/SpecificationsForm/SpecificationsForm'
import {
  initialAdditionalFieldsValues,
  type AdditionalFieldsValues,
} from './sections/AdditionalFieldsForm/AdditionalFieldsForm'
import MediaForm, { initialMediaValues, type MediaValues } from './sections/MediaForm/MediaForm'
import KeyDetailsForm, { initialKeyDetailsValues, type KeyDetailsValues } from './sections/KeyDetailsForm/KeyDetailsForm'
import ReviewForm from './sections/ReviewForm/ReviewForm'
import ListingPreview from './sections/ListingPreview/ListingPreview'
import WhyWeAskThis from './sections/WhyWeAskThis/WhyWeAskThis'
import { computeListingScore, isBasicInfoComplete, isKeyDetailsComplete, isMediaComplete, PHOTOS_MIN } from './scoring'

const TOTAL_STEPS = 5

// Matches the backend's real limits in Backend/src/lib/upload.ts, so a
// rejected photo is caught immediately with a specific message instead of
// only failing (generically) at final submit.
const MAX_PHOTO_SIZE_BYTES = 20 * 1024 * 1024
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// crypto.randomUUID() only exists in a secure context (HTTPS or localhost) —
// on a plain-HTTP production origin it's undefined and throws, so fall back
// to a non-cryptographic id for these client-only list keys.
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
  1: { title: 'Basic Information', subtitle: 'Provide the basic details about your boat.' },
  2: { title: 'Specifications', subtitle: 'Provide the boat specification in detail.' },
  3: { title: 'Media', subtitle: 'Upload photos and videos of your boat.' },
  4: { title: 'Key Details', subtitle: 'Add the remaining key details.' },
  5: { title: 'Review', subtitle: 'Review your listing before publishing.' },
}

function getInitialStep() {
  const step = Number(new URLSearchParams(window.location.search).get('step'))
  return Number.isInteger(step) && step >= 1 && step <= TOTAL_STEPS ? step : 1
}

export default function AddBoat() {
  const { seller, checkedSession } = useSellerSession()
  const query = new URLSearchParams(window.location.search)
  const editListingId = Number(query.get('listingId'))
  const isEditing = Number.isInteger(editListingId) && editListingId > 0
  const [currentStep, setCurrentStep] = useState(getInitialStep)
  const [values, setValues] = useState<BasicInformationValues>(initialBasicInformationValues)
  const [specValues, setSpecValues] = useState<SpecificationsValues>(initialSpecificationsValues)
  const [mediaValues, setMediaValues] = useState<MediaValues>(initialMediaValues)
  const [keyDetailsValues, setKeyDetailsValues] = useState<KeyDetailsValues>(initialKeyDetailsValues)
  const [customFields, setCustomFields] = useState<AdditionalFieldsValues>(initialAdditionalFieldsValues)
  // Lifted out of SpecificationsForm so the card's "Add Field" button can jump
  // straight to the Additional tab.
  const [specTab, setSpecTab] = useState<SpecTab>('history')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [stepError, setStepError] = useState<string | null>(null)
  const [mediaError, setMediaError] = useState<string | null>(null)
  const [isLoadingListing, setIsLoadingListing] = useState(isEditing)
  const [editBoatId, setEditBoatId] = useState<number | null>(null)

  function valueOf(boat: ApiBoatListing['boat'], key: string) {
    const value = boat[key]
    return typeof value === 'string' ? value : value == null ? '' : String(value)
  }

  function populateFromListing(listing: ApiBoatListing) {
    const boat = listing.boat
    setEditBoatId(boat.id)
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
      Object.fromEntries(
        Object.keys(initialSpecificationsValues).map((key) => [key, valueOf(boat, key)]),
      ) as SpecificationsValues,
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
      fullName: listing.seller.name,
      email: listing.seller.email,
      phone: listing.seller.phone ?? '',
      sellTimeline: listing.sellTimeline ?? '',
      contactTime: listing.contactTime ?? '',
      listerType: listing.listerType ?? '',
      additionalNotes: listing.additionalNotes ?? '',
      agreedToContact: listing.agreedToContact,
    })
    setCustomFields({
      fields: boat.customFields.map((field) => ({ id: String(field.id), label: field.label, value: field.value })),
    })
  }

  useEffect(() => {
    if (!isEditing) return
    let cancelled = false
    setIsLoadingListing(true)
    fetchListing(editListingId)
      .then((listing) => {
        if (!cancelled) populateFromListing(listing)
      })
      .catch((err: unknown) => {
        if (!cancelled) setSubmitError(err instanceof Error ? err.message : 'Failed to load listing.')
      })
      .finally(() => {
        if (!cancelled) setIsLoadingListing(false)
      })
    return () => {
      cancelled = true
    }
  }, [editListingId, isEditing])

  // Redirecting — render nothing rather than flashing page content.
  if (!checkedSession) return null

  function handleChange(field: keyof BasicInformationValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  function handleSpecChange(field: keyof SpecificationsValues, value: string) {
    setSpecValues((prev) => ({ ...prev, [field]: value }))
  }

  function handleCustomFieldAdd() {
    setCustomFields((prev) => ({
      fields: [...prev.fields, { id: makeId(), label: '', value: '' }],
    }))
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
    window.location.href = '/seller-portal/dashboard'
  }

  async function handleContinue() {
    if (currentStep === 1 && !isBasicInfoComplete(values)) {
      setStepError('Please fill in all required fields (marked *) before continuing.')
      return
    }
    if (currentStep === 3 && !isMediaComplete(mediaValues)) {
      setStepError(`Please upload at least ${PHOTOS_MIN} photos before continuing.`)
      return
    }
    if (currentStep === 4 && !isKeyDetailsComplete(keyDetailsValues)) {
      setStepError('Please fill in all required fields (marked *) before continuing.')
      return
    }

    if (currentStep < TOTAL_STEPS) {
      setStepError(null)
      setMediaError(null)
      setCurrentStep((step) => Math.min(step + 1, TOTAL_STEPS))
      return
    }
    if (!seller) return

    const score = computeListingScore({
      basicInfo: values,
      specifications: specValues,
      media: mediaValues,
      keyDetails: keyDetailsValues,
      customFields,
    })
    if (!score.readyToSubmit) {
      setStepError(
        'Please complete all mandatory fields across Basic Information, Media and Key Details before publishing.',
      )
      return
    }

    setStepError(null)
    setSubmitError(null)
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.set('sellerId', String(seller.id))
      formData.set('name', values.boatName)
      // Price is typed with thousands separators (the field's own placeholder is
      // "e.g. 32,310"), but the backend column is numeric and rejects commas.
      const sanitizedPrice = values.price.replace(/[^0-9]/g, '')
      if (sanitizedPrice || isEditing) formData.set('price', sanitizedPrice)

      for (const [key, value] of Object.entries(values)) {
        if (key === 'boatName' || key === 'price' || (isEditing && key !== 'boatName')) {
          if (isEditing && key !== 'boatName' && key !== 'price') {
            formData.set(BASIC_INFO_TO_BOAT_FIELD[key as keyof BasicInformationValues] ?? key, value.trim())
          }
          continue
        }
        formData.set(BASIC_INFO_TO_BOAT_FIELD[key as keyof BasicInformationValues] ?? key, value)
      }

      for (const [key, value] of Object.entries(specValues)) {
        if (isEditing || value.trim()) formData.set(key, value.trim())
      }

      // Sent as one JSON part (multipart has no array type). Half-filled rows are
      // dropped here so the server's non-empty validation never trips on them.
      const extraFields = customFields.fields
        .map((field) => ({ label: field.label.trim(), value: field.value.trim() }))
        .filter((field) => field.label && field.value)
      if (isEditing || extraFields.length) formData.set('customFields', JSON.stringify(extraFields))

      if (mediaValues.videoUrl.trim()) formData.set('videoUrl', mediaValues.videoUrl.trim())
      if (mediaValues.virtualTourUrl.trim()) formData.set('virtualTourUrl', mediaValues.virtualTourUrl.trim())
      if (mediaValues.brochure) formData.set('brochure', mediaValues.brochure, mediaValues.brochure.name)
      for (const photo of mediaValues.photos) {
        if (photo.file) formData.append('photos', photo.file, photo.name)
      }

      if (keyDetailsValues.sellTimeline.trim()) formData.set('sellTimeline', keyDetailsValues.sellTimeline.trim())
      if (keyDetailsValues.contactTime.trim()) formData.set('contactTime', keyDetailsValues.contactTime.trim())
      if (keyDetailsValues.listerType.trim()) formData.set('listerType', keyDetailsValues.listerType.trim())
      if (keyDetailsValues.additionalNotes.trim())
        formData.set('additionalNotes', keyDetailsValues.additionalNotes.trim())
      formData.set('agreedToContact', String(keyDetailsValues.agreedToContact))

      if (isEditing) {
        if (editBoatId === null) {
          throw new Error('Boat details are still loading. Please try again.')
        }
        await updateBoat(editBoatId, formData)
        await updateListingPreferences(editListingId, {
          sellTimeline: keyDetailsValues.sellTimeline,
          contactTime: keyDetailsValues.contactTime,
          listerType: keyDetailsValues.listerType,
          additionalNotes: keyDetailsValues.additionalNotes,
          agreedToContact: keyDetailsValues.agreedToContact,
        })
      } else {
        await createBoat(formData)
      }
      window.location.href = '/seller-portal/dashboard'
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to publish listing. Please try again.')
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

    const newPhotos = validFiles.map((file) => ({
      id: makeId(),
      url: URL.createObjectURL(file),
      name: file.name,
      file,
    }))
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

  const { title, subtitle } = STEP_META[currentStep]

  if (isLoadingListing) {
    return (
      <SellerPortalShell mainClassName="bg-[#f8fafc]">
        <div className="p-8 text-sm text-[#64748b]">Loading listing details...</div>
      </SellerPortalShell>
    )
  }

  return (
    <SellerPortalShell mainClassName="bg-[#f8fafc]">
      <div className="flex w-full flex-col gap-5 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="font-display text-h4 capitalize text-[#0f172a]">Add New Boat</h1>
            <p className="text-[16px] text-[#64748b]">Add your boat details and publish to reach more buyers.</p>
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
              currentStep === TOTAL_STEPS ? (isSubmitting ? 'Publishing...' : 'Publish Listing') : 'Save & Continue'
            }
            continueDisabled={currentStep === TOTAL_STEPS && isSubmitting}
            showAddField={currentStep === 2}
            onAddField={handleAddFieldShortcut}
            showBack={currentStep > 1}
          >
            {currentStep === 1 ? (
              <BasicInformationForm values={values} onChange={handleChange} />
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
              <KeyDetailsForm values={keyDetailsValues} onChange={handleKeyDetailsChange} />
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

          {currentStep !== TOTAL_STEPS && (
            <div className="flex w-full flex-col gap-5 xl:w-[360px] xl:shrink-0">
              <ListingPreview
                boatName={values.boatName}
                length={values.length}
                year={values.year}
                price={values.price}
                percentComplete={Math.round((currentStep / TOTAL_STEPS) * 100)}
                mainPhotoUrl={mediaValues.photos[0]?.url}
              />
              <WhyWeAskThis />
            </div>
          )}
        </div>
      </div>
    </SellerPortalShell>
  )
}
