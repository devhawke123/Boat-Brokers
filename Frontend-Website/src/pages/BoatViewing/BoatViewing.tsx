import { useBoatBySlug } from '../../data/boats'
import BoatBookViewing from './sections/BoatBookViewing/BoatBookViewing'
import Button from '../../components/Button/Button'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'

type BoatViewingProps = {
  slug: string
}

export default function BoatViewing({ slug }: BoatViewingProps) {
  const { boat, loading, error } = useBoatBySlug(slug)

  const details = boat
    ? [
        { label: 'Price', value: boat.price },
        { label: 'Location', value: boat.location },
        { label: 'Length', value: boat.length },
        { label: 'Berths', value: boat.berths },
        { label: 'Year', value: boat.yearBuilt },
      ].filter((d) => d.value && d.value !== 'N/A')
    : []

  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <section className="relative flex min-h-[min(24rem,60vh)] flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl bg-navy-darkest p-8 text-center">
        <Navbar activeLabel="Boats for Sale" />
        {loading ? (
          <p className="text-base text-[#ededed]">Loading boat details&hellip;</p>
        ) : boat ? (
          <>
            <h1 className="font-accent text-4xl text-white sm:text-5xl">Book a Viewing</h1>
            <p className="max-w-md text-base text-[#ededed]">
              Choose a time to see <strong className="capitalize">{boat.name}</strong> in person.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-accent text-4xl text-white">Boat not found</h1>
            <p className="max-w-md text-base text-[#ededed]">
              {error
                ? `Couldn't load boats from the server: ${error}`
                : `We couldn't find a listing for '${slug}'. It may have sold or the link may be out of date.`}
            </p>
            <Button variant="light" label="Back to Boats for Sale" href="/boats-for-sale" />
          </>
        )}
      </section>

      {boat && (
        <section className="flex flex-col gap-8 px-2 py-8 sm:px-8 sm:py-14 lg:flex-row lg:items-start">
          <aside className="flex flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white lg:sticky lg:top-6 lg:w-[22rem] lg:shrink-0">
            <img src={boat.image} alt={boat.name} className="aspect-[4/3] w-full object-cover" />
            <div className="flex flex-col gap-4 p-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#6e6e6e]">This viewing is for</span>
                <h2 className="font-accent text-2xl text-navy-dark capitalize">{boat.name}</h2>
              </div>
              <dl className="flex flex-col">
                {details.map((d) => (
                  <div key={d.label} className="flex items-center justify-between gap-4 border-b border-[#f3f4f6] py-2">
                    <dt className="text-sm text-[#6e6e6e]">{d.label}</dt>
                    <dd className="text-right text-sm font-medium text-navy-dark">{d.value}</dd>
                  </div>
                ))}
              </dl>
              <a href={`/boats/${boat.slug}`} className="text-sm font-medium text-navy-dark hover:underline">
                &larr; Back to listing
              </a>
            </div>
          </aside>

          <div className="flex-1">
            <BoatBookViewing boatId={boat.id} boatName={boat.name} boatSlug={boat.slug} />
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
