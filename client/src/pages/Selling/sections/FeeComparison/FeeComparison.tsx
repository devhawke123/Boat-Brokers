import checkBlueIcon from '../../../../assets/icons/check-blue.svg'
import minimumFeeIcon from '../../../../assets/icons/minimumfee.svg'
import anchorIcon from '../../../../assets/icons/anchor.svg'
import industryAvgIcon from '../../../../assets/icons/industryavg.svg'
import Button from '../../../../components/Button/Button'

export default function FeeComparison() {
  return (
    <section id="fees" className="flex justify-center px-6 py-16 sm:px-16 sm:py-20 scroll-mt-28">
      <div className="flex w-full max-w-[80rem] flex-col items-center gap-14 lg:flex-row lg:items-center lg:gap-[3.75rem]">
        <div className="flex flex-1 flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#e3f7fe] px-4 py-1.5 text-sm font-medium tracking-[0.7px] text-[#14b2ef] uppercase">
            <span className="size-2 rounded-full bg-blue" />
            Transparent Pricing
          </span>

          <h2 className="font-display text-[34px] leading-[1.3] tracking-[-2px] text-navy-darkest capitalize sm:text-[3.375rem]">
            What do we charge?
          </h2>

          <div className="flex flex-col items-start gap-4">
            <h3 className="text-xl font-bold text-navy-darkest">
              It&rsquo;s simple — just 5%. That&rsquo;s it.
            </h3>
            <p className="max-w-[33.875rem] text-lg leading-[31.729px] text-text-body">
              Say goodbye to hidden fees and unexpected charges. With our straightforward{' '}
              <span className="font-bold text-navy-darkest">5% brokerage fee*</span>, you can
              calculate exactly what you&rsquo;ll pay before you even list — complete transparency
              in every sale.
            </p>
          </div>

          <div className="flex w-full items-center gap-6">
            <Button variant="dark" label="Book a Free Valuation" href="mailto:info@theboatbrokers.co.uk" />
            <span className="text-sm text-text-body italic">*Based on final sale price</span>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <span className="inline-flex items-center gap-2 self-stretch rounded-full border border-[rgba(11,58,88,0.09)] bg-white px-4 py-2 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
              <img src={checkBlueIcon} alt="" aria-hidden="true" className="h-3 w-[10.5px]" />
              <span className="text-sm font-medium text-navy-darkest">No Sale, No Fee</span>
            </span>
            <span className="inline-flex items-center gap-2 self-stretch rounded-full border border-[rgba(11,58,88,0.09)] bg-white px-4 py-2 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
              <img src={minimumFeeIcon} alt="" aria-hidden="true" className="h-3 w-[9px]" />
              <span className="text-sm font-medium text-navy-darkest">£2,000 Minimum Fee</span>
            </span>
          </div>
        </div>

        <div className="w-full flex-1 overflow-hidden rounded-3xl border border-[rgba(11,58,88,0.05)] bg-[#fbfeff] shadow-[0px_40px_80px_-20px_rgba(11,58,88,0.12)]">
          <div className="flex flex-col gap-1 border-b border-[rgba(11,58,88,0.09)] p-5 sm:p-8">
            <span className="text-[10px] font-bold tracking-[1px] text-text-body uppercase">
              Fee Comparison
            </span>
            <h4 className="text-xl font-bold text-navy-darkest sm:text-2xl">Save money vs. the industry</h4>
          </div>

          <div className="flex flex-col gap-5 p-5 sm:gap-6 sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue">
                  <img src={anchorIcon} alt="" aria-hidden="true" className="h-[18px] w-[13px]" />
                </span>
                <div className="flex min-w-0 flex-col">
                  <span className="text-base font-bold text-navy-darkest sm:text-lg">
                    The Boat Brokers
                  </span>
                  <span className="text-xs text-text-body">
                    Minimum brokerage fee £2,000
                  </span>
                </div>
              </div>
              <span className="font-body shrink-0 text-3xl font-bold tracking-[1px] text-[#0ea8e0] sm:text-[42px]">
                5%
              </span>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-[#e5e7eb] from-50% to-transparent to-50%" />

            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#e5e7eb]">
                  <img src={industryAvgIcon} alt="" aria-hidden="true" className="h-[18px] w-[14px]" />
                </span>
                <div className="flex min-w-0 flex-col">
                  <span className="text-base font-bold text-text-body sm:text-lg">
                    Industry Average
                  </span>
                  <span className="text-xs text-text-body">
                    Typical nationwide rate
                  </span>
                </div>
              </div>
              <span className="font-body shrink-0 text-xl font-bold whitespace-nowrap text-[#d1d5db] sm:text-3xl">
                6% +VAT
              </span>
            </div>

            <div className="flex flex-col items-start gap-3 rounded-xl border border-[rgba(11,58,88,0.05)] bg-[#edf2f5] p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5">
              <span className="max-w-[16rem] text-sm font-medium text-text-body">
                Example: selling a boat for £60,000
              </span>
              <div className="flex flex-col items-start sm:items-end">
                <span className="text-sm text-text-body line-through">£4,320 elsewhere</span>
                <span className="text-base font-bold text-navy-darkest sm:text-lg sm:whitespace-nowrap">
                  £3,000 with us
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 bg-navy-darkest px-5 py-4 sm:px-8 sm:py-5">
            <span className="text-[10px] font-bold tracking-[1px] text-white/60 uppercase">
              No Sale, No Fee
            </span>
            <span className="text-lg font-bold text-blue sm:text-xl">Save nearly £2,000</span>
          </div>
        </div>
      </div>
    </section>
  )
}
