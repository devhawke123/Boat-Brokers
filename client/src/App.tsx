import Home from './pages/Home/Home'
import About from './pages/About/About'
import Buying from './pages/Buying/Buying'
import Selling from './pages/Selling/Selling'
import BoatForSale from './pages/BoatForSale/BoatForSale'
import BoatDetail from './pages/BoatDetail/BoatDetail'
import NoelCreary from './pages/NoelCreary/NoelCreary'
import Faq from './pages/Faq/Faq'

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

  return <Home />
}

export default App
