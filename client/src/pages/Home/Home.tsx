import Hero from './sections/Hero/Hero'
import AboutUs from './sections/AboutUs/AboutUs'
import FeaturedBoats from './sections/FeaturedBoats/FeaturedBoats'
import WhyChooseUs from './sections/WhyChooseUs/WhyChooseUs'
import Faq from '../../components/Faq/Faq'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import Footer from '../../components/Footer/Footer'
import Testimonials from '../../components/Testimonials/Testimonials'
import BrandsCarousel from '../../components/BrandsCarousel/BrandsCarousel'

export default function Home() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <Hero />
      <AboutUs />
      <FeaturedBoats />
      <WhyChooseUs />
      <Testimonials />
      <BrandsCarousel />
      <Faq />
      <CtaBanner />
      <Footer />
    </main>
  )
}
