import heroBg from '../../assets/book-a-viewing-hero-bg.png'
import Seo from '../../components/Seo/Seo'
import PageHero from '../../components/PageHero/PageHero'
import BookAViewingCalendar from './sections/BookAViewingCalendar/BookAViewingCalendar'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import Footer from '../../components/Footer/Footer'

export default function BookAViewing() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <Seo
        title="Book a Viewing"
        description="Book a viewing with The Boat Brokers and see your next narrowboat or canal boat in person. Expert guidance from appointment to completion."
        path="/book-a-viewing"
        image={heroBg}
      />
      <PageHero
        image={heroBg}
        activeLabel="Book a Viewing"
        title="Book a Viewing"
        titleFont="accent"
        body="Helping at every stage of the sales process, from appointment to completion. We are passionate about boating and dedicated to providing our clients with exceptional service."
        bodyClassName="max-w-[35rem] text-base leading-[26px] tracking-[-0.32px] text-[#ededed] sm:text-base"
        overlayClassName="bg-[linear-gradient(54.6deg,rgba(102,102,102,0)_26%,rgba(0,0,0,0.2)_32%)]"
      />
      <BookAViewingCalendar />
      <CtaBanner />
      <Footer />
    </main>
  )
}
