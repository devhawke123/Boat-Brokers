import contactHeroBg from '../../assets/about-hero-bg.png'
import PageHero from '../../components/PageHero/PageHero'
import ContactForm from './sections/ContactForm/ContactForm'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import Footer from '../../components/Footer/Footer'

export default function Contact() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
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
