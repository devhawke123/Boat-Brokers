import { formatPrice, type BoatListing } from '../../../../data/boats'
import { IconCube, IconDownload, IconPlay } from '../../icons'
import lengthIcon from '../../../../assets/icons/length.svg'
import berthIcon from '../../../../assets/icons/berth.svg'
import engineIcon from '../../../../assets/icons/engine.svg'
import yearIcon from '../../../../assets/icons/year.svg'
import sternIcon from '../../../../assets/icons/stern.svg'
import steelIcon from '../../../../assets/icons/steel.svg'

type BoatDetailContentProps = {
  boat: BoatListing
}

export default function BoatDetailContent({ boat }: BoatDetailContentProps) {
  const specChips = [
    { icon: lengthIcon, label: 'Length', value: boat.length },
    { icon: berthIcon, label: 'Berths', value: `${boat.berths}` },
    { icon: engineIcon, label: 'Engine', value: boat.detail.engineMake },
    { icon: yearIcon, label: 'Year', value: boat.yearBuilt },
    { icon: sternIcon, label: 'Stern', value: boat.detail.sternType },
    { icon: steelIcon, label: 'Steel', value: boat.detail.hullThickness },
  ].filter((chip) => chip.value && chip.value !== 'N/A')

  const viewingHref = `mailto:info@theboatbrokers.co.uk?subject=${encodeURIComponent(`Viewing enquiry: ${boat.name}`)}`

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4 sm:overflow-x-auto sm:pb-1">
        {specChips.map((chip) => (
          <div
            key={chip.label}
            className="flex items-center gap-4 rounded-2xl border border-[#f3f4f6] bg-white p-4 shadow-[0px_10px_40px_-10px_rgba(11,58,88,0.08)] sm:w-[11rem] sm:shrink-0"
          >
            <img src={chip.icon} alt="" aria-hidden="true" className="size-10 shrink-0" />
            <span className="flex flex-col gap-0.5">
              <span className="text-xs text-[#6e6e6e]">{chip.label}</span>
              <span className="font-body text-base font-bold text-navy-dark">{chip.value}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex flex-1 flex-col gap-8">
          <div className="flex flex-wrap gap-2">
            {boat.detail.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-1 text-xs font-medium text-navy-dark shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-4 rounded-[22px] border border-[#f3f4f6] bg-white p-8 shadow-[0px_10px_40px_-10px_rgba(11,58,88,0.08)]">
            <h2 className="font-accent text-2xl text-navy-dark">Overview</h2>
            <div className="flex flex-col gap-4">
              {boat.detail.overview.map((paragraph, i) => (
                <p key={i} className="text-base leading-[26px] text-[#848484]">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="flex flex-col gap-4 pt-4">
              <h3 className="font-accent text-lg text-navy-dark">Key Specifications</h3>
              <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                {boat.detail.keySpecs.map((spec) => (
                  <div key={spec.label} className="flex items-center justify-between border-b border-[#f3f4f6] py-2">
                    <dt className="text-sm text-[#6e6e6e]">{spec.label}</dt>
                    <dd className="text-sm font-medium text-navy-dark">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <aside className="flex w-full flex-col gap-6 rounded-3xl border border-[#f3f4f6] bg-white p-6 shadow-[0px_20px_50px_-15px_rgba(11,58,88,0.15)] lg:w-[22.5rem] lg:shrink-0 lg:sticky lg:top-6">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-[#6e6e6e]">Asking Price</p>
            <p className="font-body text-4xl font-bold text-navy-dark">{formatPrice(boat.priceValue)}</p>
          </div>

          <div className="flex flex-col gap-3">
            {boat.detail.brochureUrl && (
              <a
                href={boat.detail.brochureUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy-dark px-4 py-3.5 text-base font-semibold text-white"
              >
                <IconDownload className="size-4" />
                Download PDF Brochure
              </a>
            )}

            {(boat.detail.videoUrl || boat.detail.virtualTourUrl) && (
              <div className="flex gap-3">
                {boat.detail.videoUrl && (
                  <a
                    href={boat.detail.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#e5e7eb] bg-white px-4 py-3 text-sm font-semibold text-navy-dark"
                  >
                    <IconPlay className="size-3.5 text-blue" />
                    Video
                  </a>
                )}
                {boat.detail.virtualTourUrl && (
                  <a
                    href={boat.detail.virtualTourUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#e5e7eb] bg-white px-4 py-3 text-sm font-semibold text-navy-dark"
                  >
                    <IconCube className="size-3.5 text-blue" />
                    Virtual
                  </a>
                )}
              </div>
            )}

            <a
              href={viewingHref}
              className="inline-flex items-center justify-center rounded-xl bg-[rgba(28,192,255,0.1)] px-4 py-3.5 text-base font-semibold text-navy-dark"
            >
              Book A Viewing
            </a>
          </div>
        </aside>
      </div>
    </div>
  )
}
