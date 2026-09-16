import { useEffect } from 'react'
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
  useEffect(() => {
    if (!window.location.hash) return
    const target = document.getElementById(window.location.hash.slice(1))
    target?.scrollIntoView()
  }, [])

  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-0">
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
