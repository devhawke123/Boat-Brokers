import { useState } from 'react'
import SellerPortalShell from '../../components/SellerPortalShell/SellerPortalShell'
import { useSellerSession } from '../../data/useSellerSession'
import { createBoat } from '../../lib/api'
import StepIndicator from './sections/StepIndicator/StepIndicator'
import StepFormCard from '../../components/StepFormCard/StepFormCard'
import BasicInformationForm, {
  initialBasicInformationValues,
  type BasicInformationValues,
} from './sections/BasicInformationForm/BasicInformationForm'
import SpecificationsForm, {
  initialSpecificationsValues,
  type SpecificationsValues,
} from './sections/SpecificationsForm/SpecificationsForm'
import MediaForm, { initialMediaValues, type MediaValues } from './sections/MediaForm/MediaForm'
import KeyDetailsForm, { initialKeyDetailsValues, type KeyDetailsValues } from './sections/KeyDetailsForm/KeyDetailsForm'
import ReviewForm from './sections/ReviewForm/ReviewForm'
import ListingPreview from './sections/ListingPreview/ListingPreview'
import WhyWeAskThis from './sections/WhyWeAskThis/WhyWeAskThis'

const TOTAL_STEPS = 5

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

export default function AddBoat() {
  const { seller, checkedSession } = useSellerSession()
  const [currentStep, setCurrentStep] = useState(1)
  const [values, setValues] = useState<BasicInformationValues>(initialBasicInformationValues)
  const [specValues, setSpecValues] = useState<SpecificationsValues>(initialSpecificationsValues)
  const [mediaValues, setMediaValues] = useState<MediaValues>(initialMediaValues)
  const [keyDetailsValues, setKeyDetailsValues] = useState<KeyDetailsValues>(initialKeyDetailsValues)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Redirecting — render nothing rather than flashing page content.
  if (!checkedSession) return null

  function handleChange(field: keyof BasicInformationValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  function handleSpecChange(field: keyof SpecificationsValues, value: string) {
    setSpecValues((prev) => ({ ...prev, [field]: value }))
  }

  function handleCancel() {
    window.location.href = '/seller-portal/dashboard'
  }

  async function handleContinue() {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((step) => Math.min(step + 1, TOTAL_STEPS))
      return
    }
    if (!seller) return

    setSubmitError(null)
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.set('sellerId', String(seller.id))
      formData.set('name', values.boatName)
      if (values.price.trim()) formData.set('price', values.price.trim())

      for (const [key, value] of Object.entries(values)) {
        if (key === 'boatName' || key === 'price' || !value.trim()) continue
        formData.set(BASIC_INFO_TO_BOAT_FIELD[key as keyof BasicInformationValues] ?? key, value)
      }

      for (const [key, value] of Object.entries(specValues)) {
        if (value.trim()) formData.set(key, value)
      }

      if (mediaValues.videoUrl.trim()) formData.set('videoUrl', mediaValues.videoUrl.trim())
      if (mediaValues.virtualTourUrl.trim()) formData.set('virtualTourUrl', mediaValues.virtualTourUrl.trim())
      if (mediaValues.brochure) formData.set('brochure', mediaValues.brochure, mediaValues.brochure.name)
      for (const photo of mediaValues.photos) {
        formData.append('photos', photo.file, photo.name)
      }

      if (keyDetailsValues.sellTimeline.trim()) formData.set('sellTimeline', keyDetailsValues.sellTimeline.trim())
      if (keyDetailsValues.contactTime.trim()) formData.set('contactTime', keyDetailsValues.contactTime.trim())
      if (keyDetailsValues.listerType.trim()) formData.set('listerType', keyDetailsValues.listerType.trim())
      if (keyDetailsValues.additionalNotes.trim())
        formData.set('additionalNotes', keyDetailsValues.additionalNotes.trim())
      formData.set('agreedToContact', String(keyDetailsValues.agreedToContact))

      await createBoat(formData)
      window.location.href = '/seller-portal/dashboard'
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to publish listing. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleBack() {
    setCurrentStep((step) => Math.max(step - 1, 1))
  }

  function handlePhotosAdd(files: File[]) {
    const newPhotos = files.map((file) => ({
      id: crypto.randomUUID(),
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

        {submitError && (
          <div className="rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[14px] text-[#b91c1c]">
            {submitError}
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
            showAddField={currentStep === 1 || currentStep === 2}
            showBack={currentStep > 1}
          >
            {currentStep === 1 ? (
              <BasicInformationForm values={values} onChange={handleChange} />
            ) : currentStep === 2 ? (
              <SpecificationsForm values={specValues} onChange={handleSpecChange} />
            ) : currentStep === 3 ? (
              <MediaForm
                values={mediaValues}
                onPhotosAdd={handlePhotosAdd}
                onPhotoRemove={handlePhotoRemove}
                onSetMainPhoto={handleSetMainPhoto}
                onVideoUrlChange={handleVideoUrlChange}
                onBrochureChange={handleBrochureChange}
                onVirtualTourUrlChange={handleVirtualTourUrlChange}
              />
            ) : currentStep === 4 ? (
              <KeyDetailsForm values={keyDetailsValues} onChange={handleKeyDetailsChange} />
            ) : (
              <ReviewForm
                basicInfo={values}
                specifications={specValues}
                media={mediaValues}
                keyDetails={keyDetailsValues}
                onEditStep={setCurrentStep}
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
