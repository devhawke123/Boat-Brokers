import outOfWaterImg from '../../../../assets/outofhill.jpg'
import inWaterImg from '../../../../assets/inwater.jpg'
import fullPreImg from '../../../../assets/fullpre.jpg'
import Button from '../../../../components/Button/Button'

type SurveyType = {
  title: string
  description: string
  image: string
  imageAlt: string
  imageFirst: boolean
}

const surveyTypes: SurveyType[] = [
  {
    title: 'Out of Water / Hull Survey',
    description:
      'Hull surveys are the entry level survey for the confident buyer with experience of internal systems who requires reassuring regarding the hull integrity. The boat must be out of the water to accomplish this. They will check things like steel thickness; corrosion pitting assessment; boat steel structure; paint – hull protection & cabin; anodes; damage or wear; hull fittings; steering; sterngear and lockers.',
    image: outOfWaterImg,
    imageAlt: 'Narrowboat moored on open water at sunset',
    imageFirst: false,
  },
  {
    title: 'In-Water / Internal Survey',
    description:
      'This survey is generally for people who are buying a fairly new craft and are confident the hull is in good condition. As it suggests, there is no need to take the boat out of the water. Key areas checked would be engine installation & operation; fuel systems; AC & DC electrical systems; LPG installation; ventilation; appliances operation; water systems; fire fighting equipment & CO and smoke alarms; general equipment.',
    image: inWaterImg,
    imageAlt: 'Narrowboats moored along a tree-lined canal',
    imageFirst: true,
  },
  {
    title: 'Full Pre-Purchase Survey',
    description:
      'Often the most favoured survey as it includes all points listed in the Hull and In-water surveys; a comprehensive safeguard for what is a significant investment. This is usually carried out to ensure complete peace of mind for you as the buyer whether you are new to boating or experienced alike.',
    image: fullPreImg,
    imageAlt: 'Narrowboat with covered deck moored at sunset',
    imageFirst: false,
  },
]

export default function SurveyGuide() {
  return (
    <section className="flex flex-col items-center gap-16 rounded-2xl bg-navy-darkest px-6 py-14 sm:px-16 sm:py-20">
      <div className="flex w-full max-w-[80rem] flex-col gap-16">
        <div className="flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[rgba(108,214,255,0.22)] px-4 py-1.5 text-sm font-medium tracking-[0.7px] text-blue-light uppercase">
            <span className="size-2 rounded-full bg-blue-light" />
            Built on Commitment
          </span>
          <h2 className="font-display text-[34px] leading-[1.3] tracking-[-2px] text-white capitalize sm:text-[3.375rem]">
            Our Purpose &amp; Principles
          </h2>
          <div className="flex flex-col gap-4 text-base leading-[26px] text-[#e3e3e3]">
            <p>
              Buying a used boat is a significant investment, and it typically comes without a
              warranty. To ensure your boat is structurally sound, we strongly recommend getting a
              survey done before making the purchase. This will give you peace of mind and help
              avoid costly surprises later on.
            </p>
            <p>
              If you&rsquo;re unsure where to find a reputable surveyor, don&rsquo;t worry &mdash;
              we can provide you with a list of trusted professionals. Typically, you&rsquo;ll
              receive the survey report within 3 to 5 days, detailing the surveyor&rsquo;s findings
              and recommendations.
            </p>
            <p>
              Surveys often reveal issues, some of which may be minor, but others could be more
              serious. Once you have the report, we encourage you to share it with us so we can
              discuss the findings. The survey can also be used to request repairs from the seller
              or renegotiate the price to account for repair costs.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-10">
          <h3 className="font-display text-2xl leading-[1.3] tracking-[-2px] text-[#fff6f6] capitalize sm:text-[2.375rem]">
            Three Different Types of Survey Exist
          </h3>
          <div className="h-px w-full bg-white/15" />

          <div className="flex flex-col gap-14">
            {surveyTypes.map((survey) => (
              <div
                key={survey.title}
                className={`flex flex-col items-center gap-8 lg:gap-14 ${survey.imageFirst ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
              >
                <img
                  src={survey.image}
                  alt={survey.imageAlt}
                  className="h-[13.25rem] w-full shrink-0 rounded-xl object-cover lg:w-[38.5rem]"
                />
                <div className="flex flex-col gap-3">
                  <h4 className="font-display text-[1.75rem] leading-[1.3] tracking-[-2px] text-white capitalize sm:text-[2.125rem]">
                    {survey.title}
                  </h4>
                  <p className="text-base leading-[1.5rem] text-[#b5b5b5]">{survey.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button variant="light" label="Explore All Boats" href="/boats-for-sale" />
    </section>
  )
}
