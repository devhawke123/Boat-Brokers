import defaultShareImage from '../assets/test.png'
import { faqs } from '../data/faqs'

export const SITE_URL = 'https://theboatbrokers.co.uk'
export const SITE_NAME = 'The Boat Brokers'

export type SeoMeta = {
  /** Page title. Gets " | The Boat Brokers" appended unless `rawTitle` is set. */
  title: string
  description: string
  /** Pathname used for the canonical URL, e.g. `/about`. */
  path: string
  image?: string
  type?: 'website' | 'article'
  noindex?: boolean
  rawTitle?: boolean
  jsonLd?: object | object[]
}

/** Makes a site-relative or absolute image path absolute; drops inline data URIs. */
export function absoluteUrl(value?: string | null): string | undefined {
  if (!value || value.startsWith('data:')) return undefined
  if (/^https?:\/\//i.test(value)) return value
  return `${SITE_URL}${value.startsWith('/') ? value : `/${value}`}`
}

export const defaultImage = absoluteUrl(defaultShareImage)

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.png`,
  image: defaultImage,
  description:
    'Specialist narrowboat brokers helping you buy and sell narrowboats across the West Midlands, Warwickshire and Worcestershire.',
  telephone: '+447960768724',
  email: 'info@theboatbrokers.co.uk',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '10 Harbury Close',
    addressLocality: 'Redditch',
    addressRegion: 'Worcestershire',
    postalCode: 'B98 0EF',
    addressCountry: 'GB',
  },
  areaServed: ['West Midlands', 'Warwickshire', 'Worcestershire', 'Birmingham', 'Wolverhampton'],
  sameAs: [
    'https://www.youtube.com/@TheBoatBrokers',
    'https://www.instagram.com/theboatbrokersuk/',
    'https://www.facebook.com/theboatbrokersuk/',
  ],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  publisher: { '@id': `${SITE_URL}/#organization` },
}

type StaticPage = { title: string; description: string; crumb?: string; rawTitle?: boolean }

// Public pages with fixed content. Dynamic pages (/boats/:slug, /blog/:slug)
// set their own metadata from API data â€” see BoatDetail and BlogDetailView.
const staticPages: Record<string, StaticPage> = {
  '/': {
    title: 'Narrowboats for Sale | Narrowboat Brokers in the West Midlands',
    rawTitle: true,
    description:
      'Buy or sell a narrowboat with The Boat Brokers. Expert narrowboat brokerage covering the West Midlands, Warwickshire and Worcestershire, with viewings, valuations and full support.',
    crumb: 'Home',
  },
  '/about': {
    title: 'About Us',
    description:
      'Meet The Boat Brokers, a specialist narrowboat brokerage based in Redditch. Learn our story, our purpose and how we help buyers and sellers with confidence.',
    crumb: 'About',
  },
  '/buying': {
    title: 'Buying a Narrowboat',
    description:
      'Everything you need to buy a narrowboat: the buying process step by step, survey guidance and answers to common questions from our experienced brokers.',
    crumb: 'Buying',
  },
  '/selling': {
    title: 'Sell Your Narrowboat',
    description:
      'Sell your narrowboat with The Boat Brokers. See how our selling process works, where we advertise, how our fees compare and request a free valuation.',
    crumb: 'Selling',
  },
  '/boats-for-sale': {
    title: 'Narrowboats for Sale',
    description:
      'Browse narrowboats for sale across the Midlands. Filter by price, length, berths and more, then book a viewing with The Boat Brokers.',
    crumb: 'Boats for Sale',
  },
  '/jargon-buster': {
    title: 'Narrowboat Jargon Buster',
    description:
      'A plain-English A-Z glossary of narrowboat and canal terms, so you can buy, sell and cruise with confidence.',
    crumb: 'Jargon Buster',
  },
  '/noel-creary': {
    title: 'Noel Creary',
    description:
      'Meet Noel Creary, founder of The Boat Brokers. Read his story, his journey on the waterways and his expertise in buying and selling narrowboats.',
    crumb: 'Noel Creary',
  },
  '/faq': {
    title: 'Frequently Asked Questions',
    description:
      'Answers to common questions about buying and selling a narrowboat, including finance, inspections, choosing a boat and boat safety certificates.',
    crumb: 'FAQ',
  },
  '/contact': {
    title: 'Contact Us',
    description:
      'Get in touch with The Boat Brokers. Call 07960 768724, email info@theboatbrokers.co.uk or send us a message about buying or selling a narrowboat.',
    crumb: 'Contact',
  },
  '/valuation': {
    title: 'Free Narrowboat Valuation',
    description:
      'Request a free, no-obligation valuation of your narrowboat from The Boat Brokers and find out what your boat is worth.',
    crumb: 'Valuation',
  },
  '/book-a-viewing': {
    title: 'Book a Viewing',
    description:
      'Book a viewing of a narrowboat with The Boat Brokers. Choose a date and time that suits you and we will arrange the rest.',
    crumb: 'Book a Viewing',
  },
  '/areas-we-serve': {
    title: 'Areas We Serve',
    description:
      'The Boat Brokers buys and sells narrowboats across Birmingham, Wolverhampton, the West Midlands, Warwickshire and Worcestershire.',
    crumb: 'Areas We Serve',
  },
  '/areas-we-serve/west-midlands': {
    title: 'Narrowboat Brokers in the West Midlands',
    description:
      'Buy or sell a narrowboat in the West Midlands with The Boat Brokers. Local expertise, wide advertising reach and a smooth selling process.',
    crumb: 'West Midlands',
  },
  '/areas-we-serve/warwickshire': {
    title: 'Narrowboat Brokers in Warwickshire',
    description:
      'Buy or sell a narrowboat in Warwickshire with The Boat Brokers. Local expertise, wide advertising reach and a smooth selling process.',
    crumb: 'Warwickshire',
  },
  '/areas-we-serve/worcestershire': {
    title: 'Narrowboat Brokers in Worcestershire',
    description:
      'Buy or sell a narrowboat in Worcestershire with The Boat Brokers. Local expertise, wide advertising reach and a smooth selling process.',
    crumb: 'Worcestershire',
  },
  '/areas-we-serve/birmingham': {
    title: 'Narrowboat Brokers in Birmingham',
    description:
      'Buy or sell a narrowboat in Birmingham with The Boat Brokers. Local expertise, wide advertising reach and a smooth selling process.',
    crumb: 'Birmingham',
  },
  '/areas-we-serve/wolverhampton': {
    title: 'Narrowboat Brokers in Wolverhampton',
    description:
      'Buy or sell a narrowboat in Wolverhampton with The Boat Brokers. Local expertise, wide advertising reach and a smooth selling process.',
    crumb: 'Wolverhampton',
  },
  '/privacy-policy': {
    title: 'Privacy Policy',
    description: 'How The Boat Brokers collects, uses and protects your personal information.',
    crumb: 'Privacy Policy',
  },
  '/blog': {
    title: 'Narrowboat Blog',
    description:
      'Advice, guides and news for narrowboat buyers, sellers and owners from The Boat Brokers.',
    crumb: 'Blog',
  },
}

function breadcrumbJsonLd(path: string) {
  const segments = path.split('/').filter(Boolean)
  const trail = [{ path: '/', name: 'Home' }]
  segments.forEach((_, i) => {
    const prefix = `/${segments.slice(0, i + 1).join('/')}`
    const page = staticPages[prefix]
    if (page?.crumb) trail.push({ path: prefix, name: page.crumb })
  })
  if (trail.length < 2) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === '/' ? '' : item.path}`,
    })),
  }
}

/**
 * Metadata for a pathname handled by App.tsx, or null when the page sets its own
 * (/boats/:slug, /blog/:slug). Private portals and unknown paths are noindex â€”
 * App's catch-all renders Home for unknown URLs, which must not become duplicates.
 */
export function seoForPath(pathname: string): SeoMeta | null {
  const isPortal = pathname.startsWith('/seller-portal') || pathname.startsWith('/admin-portal')
  if (isPortal) {
    return { title: 'Portal', description: '', path: pathname, noindex: true }
  }

  if (pathname.startsWith('/boats/') || pathname.startsWith('/blog/')) {
    // /boats/:slug and /blog/:slug set their own metadata once data loads;
    // the booking sub-page is a thin form, so keep it out of the index.
    if (pathname.endsWith('/book-viewing')) {
      return { title: 'Book a Viewing', description: '', path: pathname, noindex: true }
    }
    return null
  }

  const page = staticPages[pathname]
  if (!page) {
    return { title: 'Page not found', description: '', path: pathname, noindex: true }
  }

  const jsonLd: object[] = []
  if (pathname === '/') jsonLd.push(organizationJsonLd, websiteJsonLd)
  if (pathname === '/contact') jsonLd.push(organizationJsonLd)
  const breadcrumbs = breadcrumbJsonLd(pathname)
  if (breadcrumbs) jsonLd.push(breadcrumbs)
  if (pathname === '/faq') {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    })
  }

  return {
    title: page.title,
    rawTitle: page.rawTitle,
    description: page.description,
    path: pathname,
    jsonLd,
  }
}
