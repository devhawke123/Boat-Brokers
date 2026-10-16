import { useEffect } from 'react'
import { SITE_NAME, SITE_URL, absoluteUrl, defaultImage, type SeoMeta } from '../../lib/seo'

// Writes into the existing <head> rather than rendering <title>/<meta>, so the
// defaults in index.html are replaced instead of duplicated. Every navigation
// here is a full page load (plain <a href>), so there is nothing to clean up.

function setMeta(attr: 'name' | 'property', key: string, content: string | undefined) {
  const selector = `meta[${attr}="${key}"]`
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!content) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

function setJsonLd(data: object | object[] | undefined) {
  const id = 'seo-jsonld'
  document.getElementById(id)?.remove()
  const items = Array.isArray(data) ? data : data ? [data] : []
  if (!items.length) return
  const el = document.createElement('script')
  el.id = id
  el.type = 'application/ld+json'
  // Escape "<" so content such as "</script>" in a field can't end the tag early.
  el.textContent = JSON.stringify(items.length === 1 ? items[0] : items).replace(/</g, '\\u003c')
  document.head.appendChild(el)
}

export default function Seo({
  title,
  description,
  path,
  image,
  type = 'website',
  noindex = false,
  rawTitle = false,
  jsonLd,
}: SeoMeta) {
  const jsonLdKey = JSON.stringify(jsonLd ?? null)

  useEffect(() => {
    const fullTitle = rawTitle ? title : `${title} | ${SITE_NAME}`
    const url = `${SITE_URL}${path === '/' ? '' : path}`
    const shareImage = absoluteUrl(image) ?? defaultImage

    document.title = fullTitle
    setMeta('name', 'description', description)
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : undefined)
    if (noindex) {
      // Private/unknown pages must not advertise a canonical URL.
      document.head.querySelector('link[rel="canonical"]')?.remove()
    } else {
      setCanonical(url)
    }

    setMeta('property', 'og:site_name', SITE_NAME)
    setMeta('property', 'og:locale', 'en_GB')
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:title', noindex ? undefined : fullTitle)
    setMeta('property', 'og:description', noindex ? undefined : description)
    setMeta('property', 'og:url', noindex ? undefined : url)
    setMeta('property', 'og:image', noindex ? undefined : shareImage)
    setMeta('name', 'twitter:card', noindex ? undefined : 'summary_large_image')
    setMeta('name', 'twitter:title', noindex ? undefined : fullTitle)
    setMeta('name', 'twitter:description', noindex ? undefined : description)
    setMeta('name', 'twitter:image', noindex ? undefined : shareImage)

    setJsonLd(noindex ? undefined : jsonLd)
    // jsonLd is compared via jsonLdKey so inline objects don't re-run every render.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, path, image, type, noindex, rawTitle, jsonLdKey])

  return null
}
