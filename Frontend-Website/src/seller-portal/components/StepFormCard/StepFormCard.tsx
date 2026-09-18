import type { ReactNode } from 'react'
import addFieldIcon from '../../assets/AddBoat/add-field-icon.svg'
import saveContinueArrow from '../../assets/AddBoat/save-continue-arrow.svg'

type StepFormCardProps = {
  title: string
  subtitle: string
  onCancel: () => void
  onBack?: () => void
  onContinue: () => void
  continueLabel?: string
  continueDisabled?: boolean
  showAddField?: boolean
  onAddField?: () => void
  showBack?: boolean
  children: ReactNode
}

export default function StepFormCard({
  title,
  subtitle,
  onCancel,
  onBack,
  onContinue,
  continueLabel = 'Save & Continue',
  continueDisabled = false,
  showAddField = true,
  onAddField,
  showBack = false,
  children,
}: StepFormCardProps) {
  return (
    <div className="flex h-fit w-full min-w-0 flex-col gap-6 rounded-xl border border-[#e2e8f0] bg-white xl:flex-1">
      <div className="flex flex-col gap-8 rounded-xl bg-white px-8 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-h6 capitalize text-[#0f172a]">{title}</h2>
            <p className="text-[14px] text-[#64748b]">{subtitle}</p>
          </div>

          {showAddField && onAddField && (
            <button
              type="button"
              onClick={onAddField}
              className="flex shrink-0 items-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
            >
              <img src={addFieldIcon} alt="" aria-hidden="true" className="h-3.5 w-3" />
              <span className="text-[14px] font-semibold tracking-[0.041px] text-[#243b53]">Add Field</span>
            </button>
          )}
        </div>

        <div className="flex flex-col gap-6">{children}</div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 px-8 pt-4 pb-8">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-[#e2e8f0] bg-white px-6 py-2.5 text-[14px] font-semibold tracking-[0.191px] text-[#475569]"
        >
          Cancel
        </button>

        <div className="flex items-center gap-3">
          {showBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-6 py-2.5 text-[14px] font-semibold tracking-[0.014px] text-[#475569]"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={onContinue}
            disabled={continueDisabled}
            className="flex items-center gap-2 rounded-lg bg-[#0b3a58] px-8 py-2.5 text-[14px] font-semibold tracking-[0.068px] text-white shadow-[0px_10px_15px_-3px_#dbeafe,0px_4px_6px_-4px_#dbeafe] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {continueLabel}
            <img src={saveContinueArrow} alt="" aria-hidden="true" className="h-3 w-2.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
