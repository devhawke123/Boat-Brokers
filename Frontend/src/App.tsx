import Home from './pages/Home/Home'
import About from './pages/About/About'
import Buying from './pages/Buying/Buying'
import Selling from './pages/Selling/Selling'
import BoatForSale from './pages/BoatForSale/BoatForSale'
import BoatDetail from './pages/BoatDetail/BoatDetail'
import JargonBuster from './pages/JargonBuster/JargonBuster'
import NoelCreary from './pages/NoelCreary/NoelCreary'
import Faq from './pages/Faq/Faq'
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

function App() {
  const { pathname } = window.location

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

  return <Home />
}

export default App
