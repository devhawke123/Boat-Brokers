import { getBoatBySlug } from '../../data/boats'
import BoatDetailHero from './sections/BoatDetailHero/BoatDetailHero'
import BoatDetailContent from './sections/BoatDetailContent/BoatDetailContent'
import BoatDetailTabs from './sections/BoatDetailTabs/BoatDetailTabs'
import Button from '../../components/Button/Button'
import Navbar from '../../components/Navbar/Navbar'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import Footer from '../../components/Footer/Footer'

type BoatDetailProps = {
  slug: string
}

export default function BoatDetail({ slug }: BoatDetailProps) {
  const boat = getBoatBySlug(slug)

  if (!boat) {
    return (
      <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
        <section className="relative flex min-h-[min(24rem,60vh)] flex-col items-center justify-center gap-6 overflow-hidden rounded-3xl bg-navy-darkest p-8 text-center">
          <Navbar activeLabel="Boats for Sale" />
          <h1 className="font-accent text-4xl text-white">Boat not found</h1>
          <p className="max-w-md text-base text-[#ededed]">
            We couldn&rsquo;t find a listing for &lsquo;{slug}&rsquo;. It may have sold or the link may be
            out of date.
          </p>
          <Button variant="light" label="Back to Boats for Sale" href="/boats-for-sale" />
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <BoatDetailHero boat={boat} />

      <section className="flex flex-col gap-8 px-2 py-8 sm:px-8 sm:py-14">
        <BoatDetailContent boat={boat} />
        <BoatDetailTabs boat={boat} />
      </section>

      <section className="flex flex-col items-center gap-6 px-6 py-4 text-center">
        <Button variant="dark" label="Back to Boats for Sale" href="/boats-for-sale" />
        <p className="max-w-2xl text-xs leading-[1.6] text-[#6e6e6e]">
          Disclaimer: The details provided are intended to give a fair description of the vessel but
          their accuracy cannot be guaranteed. These details do not constitute part of any contract. A
          prospective buyer is strongly advised to check the particulars and have the vessel fully
          surveyed by a qualified marine surveyor.
        </p>
      </section>

      <CtaBanner />
      <Footer />
    </main>
  )
}
