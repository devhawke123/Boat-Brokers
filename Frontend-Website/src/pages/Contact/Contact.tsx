import contactHeroBg from '../../assets/about-hero-bg.png'
import Seo from '../../components/Seo/Seo'
import PageHero from '../../components/PageHero/PageHero'
import ContactForm from './sections/ContactForm/ContactForm'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import Footer from '../../components/Footer/Footer'

export default function Contact() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <Seo
        title="Contact Us"
        description="Have a question about buying or selling a boat? Contact The Boat Brokers — we're here to help with valuations, viewings, and brokerage advice."
        path="/contact"
        image={contactHeroBg}
      />
      <PageHero
        image={contactHeroBg}
        activeLabel="Contact"
        title="Contact Us"
        body="Have a question about buying or selling a boat? We're here to help."
      />
      <ContactForm />
      <CtaBanner />
      <Footer />
    </main>
  )
}
