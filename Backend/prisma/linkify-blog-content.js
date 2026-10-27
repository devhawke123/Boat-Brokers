/**
 * Blog HTML linkify v2 — contextual links like the old WordPress site.
 *
 * Dry run (default):
 *   node prisma/linkify-blog-content.js
 *
 * Apply (strip previous anchors, then re-link):
 *   node prisma/linkify-blog-content.js --reset --confirm
 *
 * One post:
 *   node prisma/linkify-blog-content.js --slug=how-to-sell-narrowboat-quickly-midlands-a-complete-sellers-guide --reset --confirm
 */
const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const SITE = 'https://theboatbrokers.co.uk'
const CONFIRM = process.argv.includes('--confirm')
const RESET = process.argv.includes('--reset')
const SLUG_ARG = process.argv.find((a) => a.startsWith('--slug='))
const ONLY_SLUG = SLUG_ARG ? SLUG_ARG.slice('--slug='.length) : null

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'of', 'to', 'for', 'in', 'on', 'at', 'by', 'is',
  'are', 'was', 'were', 'be', 'with', 'from', 'your', 'you', 'our', 'what', 'how',
  'when', 'which', 'who', 'whom', 'this', 'that', 'it', 'its', 'as', 'vs',
])

const aliases = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'blog-link-aliases.json'), 'utf8'),
)

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function makeAnchor(href, text) {
  return `<a href="${href.replace(/"/g, '&quot;')}">${text}</a>`
}

function stripAnchors(html) {
  return html.replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, '$1')
}

function tokenizeHtml(html) {
  const tokens = []
  const re = /<a\b[^>]*>[\s\S]*?<\/a>|<[^>]+>/gi
  let last = 0
  let match
  while ((match = re.exec(html)) !== null) {
    if (match.index > last) tokens.push({ type: 'text', value: html.slice(last, match.index) })
    tokens.push({ type: 'tag', value: match[0] })
    last = match.index + match[0].length
  }
  if (last < html.length) tokens.push({ type: 'text', value: html.slice(last) })
  return tokens
}

function humanizeSlug(slug) {
  return slug.replace(/-/g, ' ').replace(/\s+/g, ' ').trim()
}

function tokensOf(phrase) {
  return phrase
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && !STOP_WORDS.has(w) && w.length > 2)
}

function scorePhraseToSlug(phrase, slug, title) {
  const pTokens = tokensOf(phrase)
  if (pTokens.length === 0) return 0
  const target = new Set([...tokensOf(humanizeSlug(slug)), ...tokensOf(title || '')])
  if (target.size === 0) return 0
  let hit = 0
  for (const t of pTokens) if (target.has(t)) hit += 1
  const recall = hit / pTokens.length
  const precision = hit / Math.max(target.size, 1)
  // Prefer strong coverage of the phrase tokens
  return recall * 0.75 + precision * 0.25
}

function buildCatalog(posts) {
  const bySlug = new Map(posts.map((p) => [p.slug, p]))
  const blogAliases = []

  // Manual soft phrases → slug (only if slug exists in DB)
  for (const [phrase, slug] of Object.entries(aliases.blogs)) {
    if (!bySlug.has(slug)) continue
    blogAliases.push({ phrase, slug, href: `${SITE}/blog/${slug}` })
  }

  // Auto aliases from humanized slug (skip very short)
  for (const post of posts) {
    const human = humanizeSlug(post.slug)
    if (human.length >= 24) {
      blogAliases.push({ phrase: human, slug: post.slug, href: `${SITE}/blog/${post.slug}` })
    }
    if (post.title && post.title.trim().length >= 20) {
      blogAliases.push({
        phrase: post.title.trim().replace(/\?$/, ''),
        slug: post.slug,
        href: `${SITE}/blog/${post.slug}`,
      })
    }
  }

  // Dedupe by lowercased phrase, keep first (manual aliases listed first above... but
  // we pushed manual then auto — sort so longer phrases win at match time)
  const seen = new Set()
  const unique = []
  for (const row of blogAliases.sort((a, b) => b.phrase.length - a.phrase.length)) {
    const key = row.phrase.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    unique.push(row)
  }

  const pageAliases = Object.entries(aliases.pages).map(([phrase, pathPart]) => ({
    phrase,
    href: pathPart.startsWith('http') ? pathPart : `${SITE}${pathPart}`,
  }))

  const externalAliases = Object.entries(aliases.external).map(([phrase, href]) => ({
    phrase,
    href,
  }))

  return { bySlug, blogAliases: unique, pageAliases, externalAliases }
}

function linkifyUrls(text) {
  return text.replace(
    /(?:https?:\/\/)?(?:www\.)?theboatbrokers\.co\.uk(\/[^\s<"']*)?/gi,
    (full, pathPart = '') => {
      const href = `${SITE}${pathPart || ''}`
      const label = full.replace(/^https?:\/\//i, '').replace(/^www\./i, '')
      return makeAnchor(href, label)
    },
  )
}

function linkifyPhones(text) {
  return text.replace(/\b07960\s*768724\b/g, (full) => makeAnchor('tel:07960768724', full))
}

function linkifyFirstPhrase(text, phrase, href, alreadyLinked) {
  const key = phrase.toLowerCase()
  if (alreadyLinked.has(key)) return text
  const re = new RegExp(`\\b(${escapeRegExp(phrase)})\\b`, 'i')
  if (!re.test(text)) return text
  alreadyLinked.add(key)
  return text.replace(re, (full) => makeAnchor(href, full))
}

function linkifyBrandOnce(text, alreadyLinked) {
  const key = 'the boat brokers'
  if (alreadyLinked.has(key)) return text
  const re = /\bThe\s+Boat\s+Brokers\b/i
  if (!re.test(text)) return text
  alreadyLinked.add(key)
  return text.replace(re, (full) => makeAnchor(`${SITE}/about`, full))
}

/**
 * "Our blog on X" / "as noted in our blog on X" — extract X and fuzzy-match a slug.
 */
function linkifyOurBlogOn(text, posts, linkedSlugs, currentSlug) {
  const re =
    /\b((?:as noted in\s+)?our blog on\s+)([^.,;:<]{8,120}?)(?=(\s+(covers|explains|covers the|in detail|in full|from start)|[.!?,;:<]|$))/gi

  return text.replace(re, (full, prefix, rawPhrase) => {
    const phrase = rawPhrase.trim().replace(/\s+/g, ' ')
    if (phrase.length < 8) return full

    let best = null
    let bestScore = 0
    for (const post of posts) {
      if (post.slug === currentSlug) continue
      if (linkedSlugs.has(post.slug)) continue
      const score = scorePhraseToSlug(phrase, post.slug, post.title)
      if (score > bestScore) {
        bestScore = score
        best = post
      }
    }

    // Require strong overlap (e.g. most content words of the phrase appear in slug/title)
    if (!best || bestScore < 0.55) return full

    linkedSlugs.add(best.slug)
    const href = `${SITE}/blog/${best.slug}`
    return `${prefix}${makeAnchor(href, phrase)}`
  })
}

function linkifyAliasList(text, list, alreadyLinked, linkedSlugs, currentSlug) {
  let out = text
  const sorted = [...list].sort((a, b) => b.phrase.length - a.phrase.length)
  for (const row of sorted) {
    if (row.slug && (row.slug === currentSlug || linkedSlugs.has(row.slug))) continue
    const before = out
    out = linkifyFirstPhrase(out, row.phrase, row.href, alreadyLinked)
    if (out !== before && row.slug) linkedSlugs.add(row.slug)
  }
  return out
}

function seedAlreadyLinked(html) {
  const alreadyLinked = new Set()
  const linkedSlugs = new Set()
  const anchorRe = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi
  let match
  while ((match = anchorRe.exec(html)) !== null) {
    const attrs = match[1]
    const text = match[2].replace(/<[^>]+>/g, '').trim().toLowerCase()
    if (text) alreadyLinked.add(text)
    if (/the boat brokers/i.test(text)) alreadyLinked.add('the boat brokers')
    const href = attrs.match(/\bhref\s*=\s*"([^"]+)"/i)?.[1]
    if (href) {
      const blogMatch = href.match(/\/blog\/([^/?#"]+)/i)
      if (blogMatch) linkedSlugs.add(blogMatch[1])
    }
  }
  return { alreadyLinked, linkedSlugs }
}

/** Run a text transform only on non-anchor text nodes (prevents nested <a>). */
function mapTextNodes(html, fn) {
  return tokenizeHtml(html)
    .map((t) => (t.type === 'text' ? fn(t.value) : t.value))
    .join('')
}

function linkifyHtml(html, posts, catalog, currentSlug) {
  const { alreadyLinked, linkedSlugs } = seedAlreadyLinked(html)
  const others = posts.filter((p) => p.slug !== currentSlug)

  let out = html
  out = mapTextNodes(out, (text) => linkifyUrls(text))
  out = mapTextNodes(out, (text) => linkifyPhones(text))
  out = mapTextNodes(out, (text) => linkifyOurBlogOn(text, others, linkedSlugs, currentSlug))
  out = mapTextNodes(out, (text) => linkifyBrandOnce(text, alreadyLinked))
  out = mapTextNodes(out, (text) =>
    linkifyAliasList(text, catalog.blogAliases, alreadyLinked, linkedSlugs, currentSlug),
  )
  out = mapTextNodes(out, (text) =>
    linkifyAliasList(text, catalog.pageAliases, alreadyLinked, linkedSlugs, currentSlug),
  )
  out = mapTextNodes(out, (text) =>
    linkifyAliasList(text, catalog.externalAliases, alreadyLinked, linkedSlugs, currentSlug),
  )
  return out
}

function countAnchors(html) {
  return (html.match(/<a\s/gi) || []).length
}

function sampleDiff(before, after, max = 8) {
  const beforeAnchors = before.match(/<a\b[^>]*>[\s\S]*?<\/a>/gi) || []
  const afterAnchors = after.match(/<a\b[^>]*>[\s\S]*?<\/a>/gi) || []
  const beforeSet = new Set(beforeAnchors.map((a) => a.toLowerCase()))
  return afterAnchors.filter((a) => !beforeSet.has(a.toLowerCase())).slice(0, max)
}

async function main() {
  // Always load every post for the alias/fuzzy catalog, even when filtering with --slug.
  const allPosts = await prisma.blogPost.findMany({
    select: { id: true, slug: true, title: true, content: true },
    orderBy: { id: 'asc' },
  })
  const posts = ONLY_SLUG ? allPosts.filter((p) => p.slug === ONLY_SLUG) : allPosts

  if (posts.length === 0) {
    console.log(ONLY_SLUG ? `No post found for slug "${ONLY_SLUG}".` : 'No blog posts found.')
    return
  }

  const catalog = buildCatalog(allPosts)
  const report = []
  let changedCount = 0
  let totalNewAnchors = 0

  for (const post of posts) {
    const source = RESET ? stripAnchors(post.content) : post.content
    const next = linkifyHtml(source, allPosts, catalog, post.slug)
    if (next === post.content) {
      report.push({ id: post.id, slug: post.slug, changed: false, before: countAnchors(post.content), after: countAnchors(post.content), samples: [] })
      continue
    }

    const before = countAnchors(post.content)
    const after = countAnchors(next)
    const samples = sampleDiff(RESET ? stripAnchors(post.content) : post.content, next)
    changedCount += 1
    totalNewAnchors += Math.max(0, after - (RESET ? 0 : before))
    report.push({
      id: post.id,
      slug: post.slug,
      title: post.title,
      changed: true,
      before,
      after,
      samples,
    })

    if (CONFIRM) {
      await prisma.blogPost.update({ where: { id: post.id }, data: { content: next } })
    }
  }

  const reportPath = path.resolve(__dirname, 'linkify-blog-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8')

  console.log(`Posts scanned: ${posts.length}`)
  console.log(`Reset before linkify: ${RESET ? 'yes' : 'no'}`)
  console.log(`Posts that would change: ${changedCount}`)
  console.log(`New <a> tags (approx): ${totalNewAnchors}`)
  console.log(`Blog aliases loaded: ${catalog.blogAliases.length}`)
  console.log(`Report: ${reportPath}`)

  for (const row of report.filter((r) => r.changed).slice(0, 4)) {
    console.log(`\n--- #${row.id} ${row.slug} (${row.before} → ${row.after} anchors) ---`)
    for (const a of row.samples) console.log('  +', a)
  }

  if (!CONFIRM) {
    console.log('\nDry run only — re-run with --reset --confirm to write changes to the DB.')
  } else {
    console.log('\nApplied updates to the database.')
  }
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
