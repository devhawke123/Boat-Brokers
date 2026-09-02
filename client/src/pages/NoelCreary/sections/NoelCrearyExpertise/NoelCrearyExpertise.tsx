import portrait from '../../../../assets/noel-creary-portrait.png'
import Button from '../../../../components/Button/Button'

export default function NoelCrearyExpertise() {
  return (
    <section className="mx-auto max-w-[90rem] px-6 pt-5 pb-20 sm:px-20">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch lg:gap-12">
        <div className="h-[280px] shrink-0 overflow-hidden rounded-[20px] sm:h-[24rem] lg:h-[35.4375rem] lg:w-[35.25rem]">
          <img
            src={portrait}
            alt="Noel Creary standing beside a canal, arms crossed"
            className="size-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center gap-9">
          <p className="max-w-[36.75rem] text-xl leading-[30px] text-text-body">
            For over two decades, I’ve been at the forefront of narrowboat sales, helping people
            find or create the perfect vessel for their adventures on the water. Whether it’s a
            first-time buyer looking to embrace a slower pace of life or an experienced boater
            seeking the next perfect fit, I take pride in guiding each journey with expertise and
            genuine passion. To me, canal boats are more than just a mode of travel—they represent
            freedom, craftsmanship, and a unique way of life. And after all these years, my love
            for them is just as strong as the day I first set foot on one.
            <br />
            <br />
            Want to Hear a Story or Need Guidance? Whether you’re looking for advice on buying or
            selling a boat or just want to learn more about this incredible industry, I’d love to
            chat.
          </p>

          <Button
            variant="dark"
            label="Buy Boats Now"
            href="/boats-for-sale"
            className="w-fit bg-navy-darkest"
          />
        </div>
      </div>
    </section>
  )
}
