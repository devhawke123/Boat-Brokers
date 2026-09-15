import { useBlogPostBySlug } from '../../data/blogPostDetail'
import Navbar from '../../components/Navbar/Navbar'
import Button from '../../components/Button/Button'
import Footer from '../../components/Footer/Footer'
import BlogDetailView from '../../components/BlogDetailView/BlogDetailView'

type BlogDetailProps = {
  slug: string
}

export default function BlogDetail({ slug }: BlogDetailProps) {
  const { post, loading, error } = useBlogPostBySlug(slug)

  if (loading) {
    return (
      <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
        <section className="relative flex min-h-[min(24rem,60vh)] flex-col items-center justify-center gap-6 overflow-hidden rounded-3xl bg-navy-darkest p-8 text-center">
          <Navbar activeLabel="" />
          <p className="text-base text-[#ededed]">Loading post&hellip;</p>
        </section>
        <Footer />
      </main>
    )
  }

  if (!post) {
    return (
      <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
        <section className="relative flex min-h-[min(24rem,60vh)] flex-col items-center justify-center gap-6 overflow-hidden rounded-3xl bg-navy-darkest p-8 text-center">
          <Navbar activeLabel="" />
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

  return <BlogDetailView post={post} />
}
