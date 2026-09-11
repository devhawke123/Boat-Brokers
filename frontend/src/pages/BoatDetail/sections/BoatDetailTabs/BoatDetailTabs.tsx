import { useState } from 'react'
import type { BoatListing } from '../../../../data/boats'

type BoatDetailTabsProps = {
  boat: BoatListing
}

const tabs = ['History', 'Dimensions', 'Engine', 'Heating', 'Electrical', 'Gas', 'Interior', 'Other'] as const
type Tab = (typeof tabs)[number]

export default function BoatDetailTabs({ boat }: BoatDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('History')

  return (
    <div className="flex flex-col gap-8 rounded-[22px] border border-[#f3f4f6] bg-white p-8 shadow-[0px_10px_40px_-10px_rgba(11,58,88,0.08)]">
      <div className="flex items-center gap-2 overflow-x-auto border-b border-[#f3f4f6]">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 border-b-2 px-6 py-4 font-body text-sm font-bold tracking-[0.16px] transition-colors duration-150 ${
              activeTab === tab ? 'border-blue text-blue' : 'border-transparent text-[#6e6e6e] hover:text-navy-dark'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'History' ? (
        <dl className="grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
          {boat.detail.history.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 border-b border-[#f3f4f6] py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
              <dt className="text-sm text-[#6e6e6e]">{row.label}</dt>
              <dd className="text-sm font-medium text-navy-dark sm:text-right">{row.value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <div className="flex flex-col items-center gap-2 py-10 text-center text-[#6e6e6e]">
          <p>{activeTab} details for {boat.name} are available on request.</p>
          <a href="mailto:info@theboatbrokers.co.uk" className="text-sm font-medium text-navy-dark hover:underline">
            Contact the broker
          </a>
        </div>
      )}
    </div>
  )
}
