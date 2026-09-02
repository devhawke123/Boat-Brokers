import storyImage from '../../../../assets/noel-creary-story.png'

export default function NoelCrearyStory() {
  return (
    <section className="mx-auto flex max-w-[90rem] flex-col items-start gap-2.5 px-6 pt-10 pb-5 sm:px-20">
      <div className="flex w-full flex-col gap-10 lg:flex-row lg:items-center lg:gap-12">
        <div className="flex flex-col justify-center gap-9 lg:w-[39.25rem]">
          <h2 className="font-display text-[1.5rem] leading-[1.3] tracking-[-2px] text-[#020f17] capitalize sm:text-[1.75rem]">
            From Career Move to Lifelong Passion
          </h2>

          <p className="max-w-[39.25rem] text-lg leading-[1.5] font-light text-text-body">
            That job wasn’t just a career move; it was the start of a lifelong love affair with
            the waterways. I quickly became immersed in the world of canal boats, learning about
            their craftsmanship, the unique lifestyle they offered, and the people who poured
            their hearts into them.
            <br />
            <br />
            It wasn’t long before I transitioned into designing and selling bespoke new-build
            boats for one of the most prestigious builders in the country. That role allowed me
            to combine my love for design, customer service, and the heritage of
            narrowboating—turning dreams into floating homes.
          </p>
        </div>

        <div className="h-[280px] shrink-0 overflow-hidden rounded-[20px] sm:h-[24rem] lg:h-[31.625rem] lg:w-[35.375rem]">
          <img
            src={storyImage}
            alt="Noel Creary seated beside a canal, narrowboats moored behind him"
            className="size-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
