/** Production site origin used for canonical URLs, Open Graph, and sitemap. */
export const SITE_ORIGIN = 'https://theboatbrokers.co.uk'

export const SITE_NAME = 'The Boat Brokers'

export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/favicon.png`

/** Resolve a path or absolute URL against the production origin. */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  if (pathOrUrl.startsWith('//')) return `https:${pathOrUrl}`
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${SITE_ORIGIN}${path}`
}
