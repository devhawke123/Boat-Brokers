import Home from './pages/Home/Home'
import About from './pages/About/About'
import BoatForSale from './pages/BoatForSale/BoatForSale'

function App() {
  if (window.location.pathname === '/about') {
    return <About />
  }

  if (window.location.pathname === '/boats-for-sale') {
    return <BoatForSale />
  }

  return <Home />
}

export default App
