import { useState } from 'react'
import type { BlogPostDetail } from '../../../../data/blogPostDetail'
import { IconArrowRight, IconChevronDown, IconChevronRight, IconMapPin, IconPhone } from '../../icons'

type BlogDetailContentProps = {
  post: BlogPostDetail
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="w-full border-b border-[#e2e8f0] py-4 sm:rounded-lg sm:border sm:border-[#e5e7eb] sm:bg-white sm:p-6 sm:py-6 last:border-b-0 sm:last:border-b">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="font-display text-lg leading-[1.3] text-[#0a1f44] capitalize sm:text-xl">{question}</span>
        <IconChevronDown className={`size-4 shrink-0 text-[#6b7280] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="pt-4 text-sm leading-[24px] text-[#6e6e6e] sm:text-base sm:leading-[26px]">{answer}</p>}
    </div>
  )
}

export default function BlogDetailContent({ post }: BlogDetailContentProps) {
  return (
    <section className="flex justify-center bg-white px-6 py-12 sm:px-12 sm:py-20 lg:px-12">
      <div className="flex w-full max-w-[87.5rem] flex-col items-center gap-10 sm:gap-16">
        <div className="aspect-square w-full max-w-[87.5rem] overflow-hidden rounded-lg shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] sm:aspect-[1440/600]">
          <img src={post.heroImage} alt={post.title} className="size-full object-cover" />
        </div>

        <div className="flex w-full max-w-[73.5rem] flex-col gap-10 sm:gap-16 lg:flex-row lg:items-start">
          <aside className="hidden w-full flex-col gap-8 lg:flex lg:w-[18.75rem] lg:shrink-0">
            <div className="flex flex-col gap-6 rounded-lg border border-[#f3f4f6] bg-white p-8 shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
              <h3 className="border-b border-[#f3f4f6] pb-4 font-display text-2xl leading-[1.3] text-[#0a1f44] capitalize">
                Contents
              </h3>
              <ul className="flex flex-col gap-4">
                {post.toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="flex items-center gap-2 text-sm font-medium text-[#4b5563] transition-colors duration-150 hover:text-navy-dark"
                    >
                      <IconChevronRight className="size-2.5 shrink-0" />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2 rounded-lg bg-navy-darkest p-8">
              <h3 className="font-display text-2xl text-white">Quick Contact</h3>
              <p className="pt-1 text-sm leading-[22.75px] text-[#d1d5db]">
                Need immediate advice on a survey you&rsquo;ve received?
              </p>
              <a href="tel:07960768724" className="pt-4 font-bold text-xl leading-[28px] text-blue">
                07960 768724
              </a>
              <p className="pt-3 text-xs tracking-[1.2px] text-[#9ca3af] uppercase">Available 7 days a week</p>
            </div>
          </aside>

          <article className="flex w-full max-w-[50rem] flex-col gap-10 sm:gap-16">
            <div className="flex flex-col gap-6">
              <blockquote className="border-l-4 border-navy-dark pl-6 font-accent text-base leading-[28px] text-[#374151] italic sm:pl-8 sm:text-lg sm:leading-[32.4px]">
                {post.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </blockquote>

              <div className="hidden flex-col items-start justify-between gap-6 rounded-lg border-2 border-navy-dark bg-white p-10 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] sm:flex sm:flex-row sm:items-center">
                <div className="flex flex-col gap-2">
                  <h4 className="font-display text-2xl text-[#0a1f44] capitalize">{post.midCta.heading}</h4>
                  <p className="text-lg leading-[32.4px] text-[#374151]">{post.midCta.description}</p>
                </div>
                <div className="flex shrink-0 flex-col items-start gap-1.5 sm:items-end">
                  <a href={`tel:${post.midCta.phone.replace(/\s/g, '')}`} className="text-right text-xl font-bold tracking-[-0.33px] text-[#0a1f44]">
                    {post.midCta.phone}
                  </a>
                  <a href="/buying" className="text-right text-sm font-semibold tracking-[1.4px] text-navy-dark uppercase">
                    {post.midCta.linkLabel}
                  </a>
                </div>
              </div>

              {post.sections.map((section) => (
                <div key={section.id} id={section.id} className="flex scroll-mt-28 flex-col gap-4 pt-4">
                  <h2 className="font-display text-[20px] leading-[1.3] tracking-[-1px] text-black capitalize sm:text-[34px] sm:tracking-[-2px]">
                    {section.heading}
                  </h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-[26px] text-text-body sm:text-lg sm:leading-[32.4px]">
                      {paragraph}
                    </p>
                  ))}
                  {section.image && (
                    <div className="mt-2 aspect-square w-full overflow-hidden rounded-lg sm:aspect-[704/408]">
                      <img
                        src={section.image}
                        alt={section.heading}
                        className="size-full object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-3 rounded-xl bg-[#f1f5f9] px-6 py-8 text-center sm:gap-4 sm:bg-[#f5f8fa] sm:px-12 sm:py-16">
              <h3 className="font-display text-2xl leading-[1.3] tracking-[-2px] text-black capitalize sm:text-[2.375rem]">
                {post.closingCta.heading}
              </h3>
              <p className="max-w-[36rem] text-sm leading-[22px] text-text-body sm:text-lg sm:leading-[28px]">{post.closingCta.description}</p>
              <div className="flex w-full flex-col items-center gap-3 pt-2 sm:w-auto sm:gap-4 sm:pt-4">
                <a
                  href={`tel:${post.closingCta.phone.replace(/\s/g, '')}`}
                  className="inline-flex w-full items-center justify-center gap-3 rounded-lg bg-navy-darkest px-10 py-4 text-base font-bold text-white sm:w-auto sm:text-lg"
                >
                  <IconPhone className="size-[18px]" />
                  {post.closingCta.phone}
                </a>
                <a href="/buying" className="text-xs font-semibold tracking-[1.4px] text-[#6b7280] uppercase sm:text-sm">
                  {post.closingCta.linkLabel}
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-6 sm:gap-10">
              <h3 className="font-display text-2xl leading-[1.3] tracking-[-2px] text-black capitalize sm:text-[3.375rem]">
                Frequently Asked Questions
              </h3>
              <div className="flex flex-col sm:gap-4">
                {post.faqs.map((faq) => (
                  <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#e5e7eb] bg-white px-5 py-2 text-xs font-semibold tracking-[1.2px] text-[#6b7280] uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-col items-start gap-6 border-y border-[#e5e7eb] bg-[#fafcff] px-6 py-8 sm:flex-row sm:gap-8 sm:px-10 sm:py-10">
              <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-navy-dark bg-[#f3f4f6]">
                <img src={post.authorBio.avatar} alt={post.authorBio.name} className="size-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col items-start gap-2 text-left">
                <h4 className="font-display text-[2.125rem] leading-[1.3] tracking-[-2px] text-[#0a1f44] capitalize">
                  {post.authorBio.name}
                </h4>
                <p className="text-sm leading-[22px] text-text-body sm:text-base sm:leading-[24px]">{post.authorBio.description}</p>
                <div className="flex flex-wrap items-center gap-4 pt-2 sm:gap-6">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#0a1f44]">
                    <IconMapPin className="size-3.5" />
                    {post.authorBio.location}
                  </span>
                  <a href={`tel:${post.authorBio.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#0a1f44]">
                    <IconPhone className="size-3.5" />
                    {post.authorBio.phone}
                  </a>
                  <span className="text-sm font-semibold text-[#0a1f44]">{post.authorBio.availability}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 sm:gap-8">
              <h3 className="font-display text-2xl leading-[1.3] tracking-[-2px] text-black capitalize sm:text-[2.375rem]">
                This Post Has {post.commentsCount} {post.commentsCount === 1 ? 'Comment' : 'Comments'}
              </h3>
              <div className="flex flex-col gap-2 rounded-lg border border-[#f3f4f6] bg-white p-6 sm:p-8">
                <p className="text-sm text-[#6b7280]">Pingback:</p>
                <a href={post.pingback.href} className="font-display text-lg text-[#0a1f44] capitalize">
                  {post.pingback.title}
                </a>
              </div>

              <div className="flex flex-col gap-6 rounded-lg bg-[#f9fafb] px-6 py-10 sm:gap-8 sm:px-12 sm:py-16">
                <h4 className="font-display text-2xl leading-[1.3] tracking-[-2px] text-black capitalize sm:text-[2.375rem]">
                  Leave a Reply
                </h4>
                <form className="flex flex-col gap-4 sm:gap-6" onSubmit={(event) => event.preventDefault()}>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium tracking-[0.55px] text-[#94a3b8] uppercase sm:hidden">
                      Comment
                    </span>
                    <textarea
                      placeholder="Your Comment"
                      rows={5}
                      className="w-full rounded border border-[#e5e7eb] bg-white p-4 text-base text-[#1e293b] placeholder:text-[#9ca3af] sm:p-6"
                    />
                  </div>
                  <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                    <div className="flex w-full flex-col gap-1">
                      <span className="text-[11px] font-medium tracking-[0.55px] text-[#94a3b8] uppercase sm:hidden">
                        Name *
                      </span>
                      <input
                        type="text"
                        placeholder="Name"
                        className="w-full rounded border border-[#e5e7eb] bg-white px-4 py-3 text-base text-[#1e293b] placeholder:text-[#9ca3af] sm:py-[18px]"
                      />
                    </div>
                    <div className="flex w-full flex-col gap-1">
                      <span className="text-[11px] font-medium tracking-[0.55px] text-[#94a3b8] uppercase sm:hidden">
                        Email *
                      </span>
                      <input
                        type="email"
                        placeholder="Email"
                        className="w-full rounded border border-[#e5e7eb] bg-white px-4 py-3 text-base text-[#1e293b] placeholder:text-[#9ca3af] sm:py-[18px]"
                      />
                    </div>
                    <div className="flex w-full flex-col gap-1">
                      <span className="text-[11px] font-medium tracking-[0.55px] text-[#94a3b8] uppercase sm:hidden">
                        Website *
                      </span>
                      <input
                        type="text"
                        placeholder="Website"
                        className="w-full rounded border border-[#e5e7eb] bg-white px-4 py-3 text-base text-[#1e293b] placeholder:text-[#9ca3af] sm:py-[18px]"
                      />
                    </div>
                  </div>
                  <label className="flex items-start gap-3 text-sm text-[#6b7280]">
                    <input type="checkbox" className="mt-0.5 size-4 shrink-0 rounded-[2.5px] border-[#767676]" />
                    Save my name, email, and website in this browser for the next time I comment.
                  </label>
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0d5673] px-10 py-4 text-xs font-bold tracking-[1.2px] text-white uppercase sm:w-fit"
                  >
                    Post Comment
                    <IconArrowRight className="size-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
