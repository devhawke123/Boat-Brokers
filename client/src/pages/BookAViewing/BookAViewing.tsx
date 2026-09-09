import BookAViewingHero from './sections/BookAViewingHero/BookAViewingHero'
import BookAViewingCalendar from './sections/BookAViewingCalendar/BookAViewingCalendar'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import Footer from '../../components/Footer/Footer'

export default function BookAViewing() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <BookAViewingHero />
      <BookAViewingCalendar />
      <CtaBanner />
      <Footer />
    </main>
  )
}
