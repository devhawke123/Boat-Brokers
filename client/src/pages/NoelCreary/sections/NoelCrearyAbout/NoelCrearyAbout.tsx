import portrait from '../../../../assets/noel-creary-portrait.png'

export default function NoelCrearyAbout() {
  return (
    <section className="mx-auto max-w-[90rem] px-6 pt-10 pb-5 sm:px-20">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch lg:gap-12">
        <div className="h-[280px] shrink-0 overflow-hidden rounded-[20px] sm:h-[24rem] lg:h-[35.4375rem] lg:w-[35.25rem]">
          <img
            src={portrait}
            alt="Noel Creary standing beside a canal, arms crossed"
            className="size-full object-cover"
          />
        </div>

        <div className="flex flex-col items-start justify-end gap-[26px]">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e3f7fe] px-4 py-1.5 text-sm font-medium tracking-[0.7px] text-[#14b2ef] uppercase">
            <span className="size-2 rounded-full bg-blue" />
            A Few Words About Me
          </span>

          <h1 className="font-display text-[2.375rem] leading-[1.3] tracking-[-2px] text-[#020f17] capitalize sm:text-[3.375rem]">
            Noel Creary
          </h1>

          <h2 className="font-display text-[1.5rem] leading-[1.3] tracking-[-2px] text-[#020f17] capitalize sm:text-[1.75rem]">
            Managing Director at Boat Brokers
          </h2>

          <p className="max-w-[36.3125rem] text-xl leading-[30px] text-text-body">
            {'Hi, I’m Noel, '}
            <br />
            My love for canal boats began quite unexpectedly. Growing up in Birmingham, I was
            always surrounded by the gentle hum of life along the waterways, with narrowboats
            gliding past like quiet storytellers of a bygone era. They were a familiar sight, but
            it wasn’t until 1999—when I took a job selling canal boat holidays—that
            I truly discovered the passion and community behind this way of life.
          </p>
        </div>
      </div>
    </section>
  )
}
