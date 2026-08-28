import sunflowerImg from '../assets/sunflower.jpg'
import sentinelImg from '../assets/sentinel.jpg'

export type BoatStatus = 'featured' | 'under-offer' | 'sold' | null
export type FuelType = 'Diesel' | 'Petrol' | 'Electric' | 'Hybrid'

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
  },
]
