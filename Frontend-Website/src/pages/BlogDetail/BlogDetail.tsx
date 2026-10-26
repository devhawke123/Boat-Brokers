import { useBlogPostBySlug } from '../../data/blogPostDetail'
import Seo from '../../components/Seo/Seo'
import Navbar from '../../components/Navbar/Navbar'
import Button from '../../components/Button/Button'
import Footer from '../../components/Footer/Footer'
import BlogDetailView from '../../components/BlogDetailView/BlogDetailView'
import Seo from '../../components/Seo/Seo'
import { SITE_URL, absoluteUrl, organizationJsonLd } from '../../lib/seo'

type BlogDetailProps = {
  slug: string
}

export default function BlogDetail({ slug }: BlogDetailProps) {
  const { post, loading, error } = useBlogPostBySlug(slug)
  const path = `/blog/${slug}`

  if (loading) {
    return (
      <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
        <Seo title="Loading post" description="Loading blog post from The Boat Brokers." path={path} noindex />
        <section className="relative flex min-h-[min(24rem,60vh)] flex-col items-center justify-center gap-6 overflow-hidden rounded-3xl bg-navy-darkest p-8 text-center">
          <Navbar activeLabel="More" />
          <p className="text-base text-[#ededed]">Loading post&hellip;</p>
        </section>
        <Footer />
      </main>
    )
  }

  if (!post) {
    return (
      <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
        <Seo
          title="Post Not Found"
          description="This blog post could not be found. Explore more articles from The Boat Brokers."
          path={path}
          noindex
        />
        <section className="relative flex min-h-[min(24rem,60vh)] flex-col items-center justify-center gap-6 overflow-hidden rounded-3xl bg-navy-darkest p-8 text-center">
          <Navbar activeLabel="More" />
          <h1 className="font-accent text-4xl text-white">Post not found</h1>
          <p className="max-w-md text-base text-[#ededed]">
            {error
              ? `Couldn't load this post from the server: ${error}`
              : `We couldn't find a post for '${slug}'. It may have been removed or the link may be out of date.`}
          </p>
          <Button variant="light" label="Back to Blog" href="/blog" />
        </section>
        <Footer />
      </main>
    )
  }

  const path = `/blog/${post.slug}`
  const plainText = post.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const description = truncate(plainText || post.title, 155)
  const published = new Date(post.date)
  const image = absoluteUrl(post.image)

  return (
    <>
      <Seo
        title={post.title}
        description={description}
        path={path}
        image={post.image}
        type="article"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description,
            image,
            // post.date is free text from the admin; only emit it when it parses.
            // Local date parts, not toISOString(), which shifts the day for non-UTC timezones.
            ...(Number.isNaN(published.getTime())
              ? {}
              : {
                  datePublished: [
                    published.getFullYear(),
                    String(published.getMonth() + 1).padStart(2, '0'),
                    String(published.getDate()).padStart(2, '0'),
                  ].join('-'),
                }),
            author: { '@type': 'Person', name: post.author },
            publisher: { '@id': `${SITE_URL}/#organization` },
            mainEntityOfPage: `${SITE_URL}${path}`,
          },
          organizationJsonLd,
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
              { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}${path}` },
            ],
          },
        ]}
      />
      <BlogDetailView post={post} />
    </>
  )
}

function truncate(text: string, max: number) {
  if (text.length <= max) return text
  return `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…`
}
