import Home from './pages/Home/Home'
import About from './pages/About/About'
import Buying from './pages/Buying/Buying'
import Selling from './pages/Selling/Selling'
import BoatForSale from './pages/BoatForSale/BoatForSale'
import BoatDetail from './pages/BoatDetail/BoatDetail'
import NoelCreary from './pages/NoelCreary/NoelCreary'
import Faq from './pages/Faq/Faq'
import AreasWeServe from './pages/AreasWeServe/AreasWeServe'
import WestMidlands from './pages/AreasWeServe/WestMidlands/WestMidlands'
import Warwickshire from './pages/AreasWeServe/Warwickshire/Warwickshire'

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

  if (pathname === '/noel-creary') {
    return <NoelCreary />
  }

  if (pathname === '/faq') {
    return <Faq />
  }

  if (pathname === '/areas-we-serve/west-midlands') {
    return <WestMidlands />
  }

  if (pathname === '/areas-we-serve/warwickshire') {
    return <Warwickshire />
  }

  if (pathname === '/areas-we-serve') {
    return <AreasWeServe />
  }

  return <Home />
}

export default App
