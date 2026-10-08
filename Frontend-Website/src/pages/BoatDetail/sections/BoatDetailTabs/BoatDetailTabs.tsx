import { useState } from 'react'
import type { BoatListing, BoatSpec } from '../../../../data/boats'

type BoatDetailTabsProps = {
  boat: BoatListing
}

const tabs = [
  'History',
  'Dimensions',
  'Engine',
  'Water & Heating',
  'Electrical',
  'Gas',
  'Interior',
  'Additional',
] as const
type Tab = (typeof tabs)[number]

const tabDetailKey: Record<Tab, keyof BoatListing['detail']> = {
  History: 'history',
  Dimensions: 'dimensions',
  Engine: 'engineDetails',
  'Water & Heating': 'heating',
  Electrical: 'electrical',
  Gas: 'gas',
  Interior: 'interior',
  Additional: 'additional',
}

function SpecList({ rows }: { rows: BoatSpec[] }) {
  return (
    <dl className="grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
      {rows.map((row, i) => (
        <div
          // Seller-authored labels aren't guaranteed unique, so the index is
          // part of the key.
          key={`${row.label}-${i}`}
          className="flex flex-col gap-1 border-b border-[#f3f4f6] py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
        >
          <dt className="text-sm text-[#6e6e6e]">{row.label}</dt>
          <dd className="text-sm font-medium text-navy-dark sm:text-right">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}

// Rows tagged with a `group` render under a heading, in first-seen order;
// untagged rows (e.g. Notes) follow without one.
function GroupedSpecList({ rows }: { rows: BoatSpec[] }) {
  const groups: { title?: string; rows: BoatSpec[] }[] = []
  for (const row of rows) {
    const existing = groups.find((g) => g.title === row.group)
    if (existing) existing.rows.push(row)
    else groups.push({ title: row.group, rows: [row] })
  }
  groups.sort((a, b) => Number(a.title === undefined) - Number(b.title === undefined))

  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => (
        <div key={group.title ?? 'ungrouped'} className="flex flex-col gap-2">
          {group.title && (
            <h3 className="border-b-2 border-navy-dark pb-2 font-body text-base font-bold text-navy-dark">
              {group.title}
            </h3>
          )}
          <SpecList rows={group.rows} />
        </div>
      ))}
    </div>
  )
}

export default function BoatDetailTabs({ boat }: BoatDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('History')
  const rows = boat.detail[tabDetailKey[activeTab]] as BoatSpec[]
  // Every other tab falls back to "available on request", which reads as missing
  // data. Custom fields simply don't apply to most boats, so hide the tab instead.
  const visibleTabs = tabs.filter((tab) => tab !== 'Additional' || boat.detail.additional.length > 0)

  return (
    <div className="flex flex-col gap-8 rounded-[22px] border border-[#f3f4f6] bg-white p-8 shadow-[0px_10px_40px_-10px_rgba(11,58,88,0.08)]">
      <div className="flex items-center gap-2 overflow-x-auto border-b border-[#f3f4f6]">
        {visibleTabs.map((tab) => (
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

      {rows.length > 0 ? (
        rows.some((row) => row.group) ? <GroupedSpecList rows={rows} /> : <SpecList rows={rows} />
      ) : (
        <div className="flex flex-col items-center gap-2 py-10 text-center text-[#6e6e6e]">
          <p>{activeTab} details for {boat.name} are available on request.</p>
        </div>
      )}
    </div>
  )
}
