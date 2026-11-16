import { lazy, Suspense } from 'react'
import Seo from './components/Seo/Seo'
import { seoForPath } from './lib/seo'
import Home from './pages/Home/Home'
import NotFound from './pages/NotFound/NotFound'
import About from './pages/About/About'
import Buying from './pages/Buying/Buying'
import Selling from './pages/Selling/Selling'
import BoatForSale from './pages/BoatForSale/BoatForSale'
import BoatDetail from './pages/BoatDetail/BoatDetail'
import BoatViewing from './pages/BoatViewing/BoatViewing'
import JargonBuster from './pages/JargonBuster/JargonBuster'
import NoelCreary from './pages/NoelCreary/NoelCreary'
import Faq from './pages/Faq/Faq'
import Contact from './pages/Contact/Contact'
import Valuation from './pages/Valuation/Valuation'
import BookAViewing from './pages/BookAViewing/BookAViewing'
import AreasWeServe from './pages/AreasWeServe/AreasWeServe'
import WestMidlands from './pages/AreasWeServe/WestMidlands/WestMidlands'
import Warwickshire from './pages/AreasWeServe/Warwickshire/Warwickshire'
import Worcestershire from './pages/AreasWeServe/Worcestershire/Worcestershire'
import Birmingham from './pages/AreasWeServe/Birmingham/Birmingham'
import Wolverhampton from './pages/AreasWeServe/Wolverhampton/Wolverhampton'
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy'
import Blog from './pages/Blog/Blog'
import BlogDetail from './pages/BlogDetail/BlogDetail'

const SellerPortalApp = lazy(() => import('./seller-portal/SellerPortalApp'))
const AdminPortalApp = lazy(() => import('./admin-portal/AdminPortalApp'))

function renderRoute(pathname: string) {
  if (pathname === '/about') {
    return <About />
  }

  if (pathname === '/buying') {
    return <Buying />
  }

  if (pathname === '/selling') {
    return <Selling />
  }

  if (pathname === '/boats-for-sale') {
    return <BoatForSale />
  }

  if (pathname.startsWith('/boats/') && pathname.endsWith('/book-viewing')) {
    return <BoatViewing slug={pathname.replace('/boats/', '').replace('/book-viewing', '')} />
  }

  if (pathname.startsWith('/boats/')) {
    return <BoatDetail slug={pathname.replace('/boats/', '')} />
  }

  if (pathname === '/jargon-buster') {
    return <JargonBuster />
  }

  if (pathname === '/noel-creary') {
    return <NoelCreary />
  }

  if (pathname === '/faq') {
    return <Faq />
  }

  if (pathname === '/contact') {
    return <Contact />
  }

  if (pathname === '/valuation') {
    return <Valuation />
  }

  if (pathname === '/book-a-viewing') {
    return <BookAViewing />
  }

  if (pathname === '/areas-we-serve/west-midlands') {
    return <WestMidlands />
  }

  if (pathname === '/areas-we-serve/warwickshire') {
    return <Warwickshire />
  }

  if (pathname === '/areas-we-serve/worcestershire') {
    return <Worcestershire />
  }

  if (pathname === '/areas-we-serve/birmingham') {
    return <Birmingham />
  }

  if (pathname === '/areas-we-serve/wolverhampton') {
    return <Wolverhampton />
  }

  if (pathname === '/areas-we-serve') {
    return <AreasWeServe />
  }

  if (pathname === '/privacy-policy') {
    return <PrivacyPolicy />
  }

  if (pathname.startsWith('/blog/')) {
    return <BlogDetail slug={pathname.replace('/blog/', '')} />
  }

  if (pathname === '/blog') {
    return <Blog />
  }

  // The seller portal runs its own react-router app (see SellerPortalApp.tsx),
  // loaded on demand so public pages don't ship its router and animation libraries.
  if (pathname === '/seller-portal' || pathname.startsWith('/seller-portal/')) {
    return (
      <Suspense fallback={null}>
        <SellerPortalApp />
      </Suspense>
    )
  }

  // The admin portal is a nested react-router app too (see AdminPortalApp.tsx).
  if (pathname === '/admin-portal' || pathname.startsWith('/admin-portal/')) {
    return (
      <Suspense fallback={null}>
        <AdminPortalApp />
      </Suspense>
    )
  }

  if (pathname === '/' || pathname === '') {
    return <Home />
  }

  return <NotFound />
}

function App() {
  const { pathname } = window.location
  const seo = seoForPath(pathname)

  return (
    <>
      {seo && <Seo {...seo} />}
      {renderRoute(pathname)}
    </>
  )
}

export default App
