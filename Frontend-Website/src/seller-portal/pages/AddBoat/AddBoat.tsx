import { useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import { useSellerSession } from '../../data/useSellerSession'
import StepIndicator from './sections/StepIndicator/StepIndicator'
import StepFormCard from './sections/StepFormCard/StepFormCard'
import BasicInformationForm, {
  initialBasicInformationValues,
  type BasicInformationValues,
} from './sections/BasicInformationForm/BasicInformationForm'
import SpecificationsForm, {
  initialSpecificationsValues,
  type SpecificationsValues,
} from './sections/SpecificationsForm/SpecificationsForm'
import ListingPreview from './sections/ListingPreview/ListingPreview'
import WhyWeAskThis from './sections/WhyWeAskThis/WhyWeAskThis'

const TOTAL_STEPS = 5

const STEP_META: Record<number, { title: string; subtitle: string }> = {
  1: { title: 'Basic Information', subtitle: 'Provide the basic details about your boat.' },
  2: { title: 'Specifications', subtitle: 'Provide the boat specification in detail.' },
  3: { title: 'Media', subtitle: 'Upload photos and videos of your boat.' },
  4: { title: 'Key Details', subtitle: 'Add the remaining key details.' },
  5: { title: 'Review', subtitle: 'Review your listing before publishing.' },
}

export default function AddBoat() {
  const { checkedSession } = useSellerSession()
  const [currentStep, setCurrentStep] = useState(1)
  const [values, setValues] = useState<BasicInformationValues>(initialBasicInformationValues)
  const [specValues, setSpecValues] = useState<SpecificationsValues>(initialSpecificationsValues)

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

  function handleSaveDraft() {
    // TODO: wire up once the backend exposes a draft-save endpoint.
  }

  function handleContinue() {
    // TODO: persist the step once the backend exposes a create/update endpoint.
    setCurrentStep((step) => Math.min(step + 1, TOTAL_STEPS))
  }

  const { title, subtitle } = STEP_META[currentStep]

  return (
    <div className="flex h-svh overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
        <div className="flex w-full flex-col gap-5 p-8">
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

          <div className="flex flex-col items-start gap-8 lg:flex-row">
            <StepFormCard
              title={title}
              subtitle={subtitle}
              onCancel={handleCancel}
              onSaveDraft={handleSaveDraft}
              onContinue={handleContinue}
              continueLabel={currentStep === TOTAL_STEPS ? 'Publish Listing' : 'Save & Continue'}
              showAddField={currentStep === 1 || currentStep === 2}
            >
              {currentStep === 1 ? (
                <BasicInformationForm values={values} onChange={handleChange} />
              ) : currentStep === 2 ? (
                <SpecificationsForm values={specValues} onChange={handleSpecChange} />
              ) : (
                <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-[#e2e8f0] text-[14px] text-[#94a3b8]">
                  This step is coming soon.
                </div>
              )}
            </StepFormCard>

            <div className="flex w-full flex-col gap-5 lg:w-[360px] lg:shrink-0">
              <ListingPreview
                length={values.length}
                year={values.year}
                price={values.price}
                percentComplete={Math.round((currentStep / TOTAL_STEPS) * 100)}
              />
              <WhyWeAskThis />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
