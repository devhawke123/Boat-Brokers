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
import Login from './seller-portal/pages/Login/Login'
import Dashboard from './seller-portal/pages/Dashboard/Dashboard'
import MyBoats from './seller-portal/pages/MyBoats/MyBoats'
import AddBoat from './seller-portal/pages/AddBoat/AddBoat'
import Comments from './seller-portal/pages/Comments/Comments'
import CommentThread from './seller-portal/pages/CommentThread/CommentThread'
import Profile from './seller-portal/pages/Profile/Profile'
import HelpSupport from './seller-portal/pages/HelpSupport/HelpSupport'
import SellerPortalNotFound from './seller-portal/pages/NotFound/NotFound'
import AdminLogin from './admin-portal/pages/Login/Login'
import AdminDashboard from './admin-portal/pages/Dashboard/Dashboard'
import Vendors from './admin-portal/pages/Vendors/Vendors'
import VendorForm from './admin-portal/pages/VendorForm/VendorForm'
import VendorDetail from './admin-portal/pages/VendorDetail/VendorDetail'
import ListingComments from './admin-portal/pages/ListingComments/ListingComments'
import Availability from './admin-portal/pages/Availability/Availability'
import AdminPortalNotFound from './admin-portal/pages/NotFound/NotFound'

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

  if (pathname === '/seller-portal/login') {
    return <Login />
  }

  if (pathname === '/seller-portal/dashboard') {
    return <Dashboard />
  }

  if (pathname === '/seller-portal/my-boats') {
    return <MyBoats />
  }

  if (pathname === '/seller-portal/boats/new') {
    return <AddBoat />
  }

  if (pathname === '/seller-portal/comments') {
    return <Comments />
  }

  if (pathname.startsWith('/seller-portal/comments/')) {
    const listingId = Number(pathname.replace('/seller-portal/comments/', ''))
    if (Number.isInteger(listingId)) return <CommentThread listingId={listingId} />
  }

  if (pathname === '/seller-portal/profile') {
    return <Profile />
  }

  if (pathname === '/seller-portal/help') {
    return <HelpSupport />
  }

  // Scoped fallback for the seller portal specifically (e.g. unbuilt signup /
  // forgot-password links, bad listing ids) so a logged-in seller lands on a
  // recognizable shell with a way back, instead of silently on the public
  // marketing homepage. The public site's catch-all below is intentionally
  // Home — see CLAUDE.md — this doesn't change that.
  if (pathname.startsWith('/seller-portal/')) {
    return <SellerPortalNotFound />
  }

  if (pathname === '/admin-portal/login') {
    return <AdminLogin />
  }

  if (pathname === '/admin-portal/dashboard') {
    return <AdminDashboard />
  }

  if (pathname === '/admin-portal/vendors') {
    return <Vendors />
  }

  if (pathname === '/admin-portal/vendors/new') {
    return <VendorForm />
  }

  if (pathname.startsWith('/admin-portal/vendors/') && pathname.endsWith('/edit')) {
    const vendorId = Number(pathname.replace('/admin-portal/vendors/', '').replace('/edit', ''))
    if (Number.isInteger(vendorId)) return <VendorForm vendorId={vendorId} />
  }

  if (pathname.startsWith('/admin-portal/listings/')) {
    const listingId = Number(pathname.replace('/admin-portal/listings/', ''))
    if (Number.isInteger(listingId)) return <ListingComments listingId={listingId} />
  }

  if (pathname.startsWith('/admin-portal/vendors/')) {
    const vendorId = Number(pathname.replace('/admin-portal/vendors/', ''))
    if (Number.isInteger(vendorId)) return <VendorDetail vendorId={vendorId} />
  }

  if (pathname === '/admin-portal/availability') {
    return <Availability />
  }

  // Scoped fallback for the admin portal, same reasoning as the seller
  // portal one above — nav items for not-yet-built modules land here
  // instead of the public 404.
  if (pathname.startsWith('/admin-portal/')) {
    return <AdminPortalNotFound />
  }

  return <Home />
}

export default App
