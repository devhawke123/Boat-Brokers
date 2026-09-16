import greenTick from '../../../../assets/icons/greentick.svg'
import dataIsSafe from '../../../../assets/icons/dataissafe.svg'

const REASONS = ['Help Buyers Trust Your Listing', 'Improves Approval Speed', 'Gives Better Valuation']

export default function WhyWeAskThis() {
  return (
    <div className="w-full overflow-clip rounded-xl border border-[#0e2136]/80 bg-[#0e2136]">
      <div className="flex flex-col gap-2.5 bg-[#0e2136]/95 p-4.5">
        <h3 className="font-display text-[18px] capitalize text-white">Why We Ask this?</h3>

        <ul className="flex flex-col gap-1.5">
          {REASONS.map((reason) => (
            <li key={reason} className="flex items-center justify-between gap-2">
              <img src={greenTick} alt="" aria-hidden="true" className="h-3 w-3 shrink-0" />
              <span className="flex-1 text-[10.5px] tracking-[0.07px] text-[#8e8e8e]">{reason}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5 pt-1">
          <img src={dataIsSafe} alt="" aria-hidden="true" className="h-2.5 w-2.5 shrink-0" />
          <span className="text-[9px] font-semibold tracking-[0.02px] text-[#c9a96a]">
            Your data is safe and encrypted.
          </span>
        </div>
      </div>
    </div>
  )
}
