type Step = {
  label: string
}

const STEPS: Step[] = [
  { label: 'Basic Information' },
  { label: 'Specifications' },
  { label: 'Media' },
  { label: 'Key Details' },
  { label: 'Review' },
]

type StepIndicatorProps = {
  currentStep: number
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex w-full min-w-[26rem] items-center">
        {STEPS.map((step, index) => {
          const stepNumber = index + 1
          const isComplete = stepNumber < currentStep
          const isActive = stepNumber === currentStep
          const isLast = stepNumber === STEPS.length

          return (
            <div key={step.label} className={isLast ? 'flex shrink-0 items-center' : 'flex flex-1 items-center'}>
              <div className="flex shrink-0 items-center">
                <div
                  className={
                    isActive || isComplete
                      ? 'flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0b3a58] text-sm font-bold text-white'
                      : 'flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-[#e2e8f0] bg-white text-sm font-bold text-[#94a3b8]'
                  }
                >
                  {stepNumber}
                </div>
                <span
                  className={
                    isActive || isComplete
                      ? 'hidden pl-3 text-sm font-semibold whitespace-nowrap text-[#0f172a] sm:inline'
                      : 'hidden pl-3 text-sm font-medium whitespace-nowrap text-[#94a3b8] sm:inline'
                  }
                >
                  {step.label}
                </span>
              </div>

              {!isLast && <div className="mx-4 h-px min-w-6 flex-1 bg-[#e2e8f0]" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
