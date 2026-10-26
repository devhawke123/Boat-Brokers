import Seo from '../../components/Seo/Seo'
import Navbar from '../../components/Navbar/Navbar'
import Button from '../../components/Button/Button'
import Footer from '../../components/Footer/Footer'

export default function NotFound() {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/404'

  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <Seo
        title="Page Not Found"
        description="Sorry, we couldn't find that page. Browse boats for sale, learn about buying and selling, or contact The Boat Brokers."
        path={path}
        noindex
      />
      <section className="relative flex min-h-[min(24rem,60vh)] flex-col items-center justify-center gap-6 overflow-hidden rounded-3xl bg-navy-darkest p-8 text-center">
        <Navbar />
        <p className="text-label font-medium tracking-[2px] text-blue uppercase">404</p>
        <h1 className="font-accent text-4xl text-white sm:text-5xl">Page not found</h1>
        <p className="max-w-md text-base text-[#ededed]">
          The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved. Try one of the
          links below, or head back home.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="light" label="Back Home" href="/" />
          <Button variant="outline-white" label="Boats for Sale" href="/boats-for-sale" />
        </div>
      </section>
      <Footer />
    </main>
  )
}
