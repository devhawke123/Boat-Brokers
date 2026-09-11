import sunflowerImg from '../assets/sunflower.jpg'
import sentinelImg from '../assets/sentinel.jpg'

export type BoatStatus = 'featured' | 'under-offer' | 'sold' | null
export type FuelType = 'Diesel' | 'Petrol' | 'Electric' | 'Hybrid'

export type BoatSpec = {
  label: string
  value: string
}

export type BoatDetail = {
  subtitle: string
  registration: string
  sternType: string
  hullThickness: string
  engineMake: string
  tags: string[]
  overview: string[]
  keySpecs: BoatSpec[]
  history: BoatSpec[]
  brochureUrl?: string
  videoUrl?: string
  virtualTourUrl?: string
}

export type BoatListing = {
  slug: string
  name: string
  location: string
  price: string
  image: string
  length: string
  berths: number
  yearBuilt: string
  fuel: FuelType
  status: BoatStatus
  detail: BoatDetail
}

// TODO: replace with data from the boats API once it's available.
export const boatListings: BoatListing[] = [
  {
    slug: 'sunflower',
    name: 'Sunflower',
    location: 'Leicestershire',
    price: '£129,950',
    image: sunflowerImg,
    length: '62ft',
    berths: 6,
    yearBuilt: '2022',
    fuel: 'Diesel',
    status: 'featured',
    detail: {
      subtitle: '62ft Semi-Traditional Narrowboat',
      registration: 'Registered at Leicester №41213',
      sternType: 'Semi-Trad',
      hullThickness: '10/6/6mm',
      engineMake: 'Beta Marine',
      tags: ['Semi-Trad Stern', 'Modern Engine', 'Low Engine Hours'],
      overview: [
        'Sunflower is a beautifully presented 62ft semi-traditional narrowboat built in 2022 by Tim Tyler, offering a modern layout with the character and finish of a bespoke fit-out.',
        'Stepping aboard, you are welcomed into a bright saloon with large windows and a wood-burning stove, leading through to a well-equipped galley with a full-size cooker, fridge freezer and generous worktop space. The main bedroom features a fixed double bed with wardrobes either side, and the boat is completed by a spacious shower room with a separate cassette toilet.',
        'With low engine hours and a full service history, Sunflower is ready to cruise the waterways as soon as you are.',
      ],
      keySpecs: [
        { label: 'Hull Builder', value: 'Tim Tyler' },
        { label: 'Fit Out', value: 'Professional' },
        { label: 'Last Service', value: 'June 2025' },
        { label: 'Blacking', value: '2-Pack (2024)' },
        { label: 'Boat Safety', value: 'Valid till 2028' },
        { label: 'Recent Survey', value: 'Available on request' },
      ],
      history: [
        { label: 'CIN number', value: 'N/A' },
        { label: 'CRT number', value: '41213' },
        { label: 'License number', value: 'Valid' },
        { label: 'Previous owners', value: '1' },
        { label: 'Engine service history', value: 'Full main dealer history' },
        { label: 'Boiler service history', value: 'N/A' },
        { label: 'Blacking', value: '2024 – 2-pack epoxy, full re-black' },
        { label: 'Survey', value: '2022 – available on request' },
        { label: 'Anodes', value: '12 – replaced 2024' },
        { label: 'Documentation available', value: "Owner's manual, BSS certificate" },
      ],
    },
  },
  {
    slug: 'sentinel',
    name: 'Sentinel',
    location: 'Cheshire',
    price: '£69,950',
    image: sentinelImg,
    length: '70ft',
    berths: 4,
    yearBuilt: '1976',
    fuel: 'Diesel',
    status: 'under-offer',
    detail: {
      subtitle: '70ft Traditional Narrowboat',
      registration: 'Registered at Shardlow №70584',
      sternType: 'Trad',
      hullThickness: '10/6/6mm',
      engineMake: 'Bolinder',
      tags: ['Trad Stern', 'Historic Engine', 'Recent Survey'],
      overview: [
        'Sentinel is a characterful 70ft traditional narrowboat built in 1976, with her hull by Colecraft and fitted out by Brian Duvall, and powered by the much-admired Bolinder engine, perfectly complementing her classic lines and timeless appeal.',
        'Stepping aboard from the bow, you are welcomed into a spacious saloon, followed by a well-equipped walkthrough galley featuring a freestanding cooker, washing machine, fridge freezer and ample storage. The light and airy main bedroom offers a comfortable retreat, while the impressive engine room houses the iconic Bolinder engine and generator enabling life aboard to be completely self sufficient. Completing the accommodation is a traditional boatman’s cabin with a single berth, full of charm and surprisingly spacious.',
        'Sentinel is a rare opportunity to own a traditional narrowboat with an abundance of character and heritage.',
      ],
      keySpecs: [
        { label: 'Hull Builder', value: 'Colecraft' },
        { label: 'Fit Out', value: 'Owner / Professional' },
        { label: 'Last Service', value: 'March 2023' },
        { label: 'Blacking', value: '2-Pack (2022)' },
        { label: 'Boat Safety', value: 'Valid till 2026' },
        { label: 'Recent Survey', value: 'Available on request' },
      ],
      history: [
        { label: 'CIN number', value: 'N/A' },
        { label: 'CRT number', value: '70584' },
        { label: 'License number', value: 'TBC' },
        { label: 'Previous owners', value: '2 or More' },
        { label: 'Engine service history', value: 'January 2026 (Rebuilt in 1992)' },
        { label: 'Boiler service history', value: 'N/A' },
        { label: 'Blacking', value: 'May 2024 – needle gun preparation with 3 coats of bituminous protection' },
        { label: 'Survey', value: 'May 2024 – available on request' },
        { label: 'Anodes', value: '18 (9 down each side) – OK at last blacking' },
        { label: 'Documentation available', value: 'BSS/Various user/installation manuals' },
      ],
    },
  },
]

export function getBoatBySlug(slug: string) {
  return boatListings.find((boat) => boat.slug === slug)
}

export const boatStatusStyles: Record<Exclude<BoatStatus, null>, { label: string; className: string }> = {
  featured: { label: 'Featured', className: 'bg-navy-dark' },
  'under-offer': { label: 'Under Offer', className: 'bg-[#f59e0b]' },
  sold: { label: 'Sold', className: 'bg-[#1e293b]' },
}
