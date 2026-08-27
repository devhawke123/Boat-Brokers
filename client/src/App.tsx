import Home from './pages/Home/Home'
import About from './pages/About/About'

function App() {
  if (window.location.pathname === '/about') {
    return <About />
  }

  return <Home />
}

export default App
