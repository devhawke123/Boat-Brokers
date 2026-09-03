import onlineAdvertIcon from '../../../../assets/icons/onlineadvert.svg'
import partnershipsIcon from '../../../../assets/icons/partnerships.svg'
import sendEmailIcon from '../../../../assets/icons/Send Email.svg'
import publicationsIcon from '../../../../assets/icons/publications.svg'

export default function WhereWeAdvertise() {
  return (
    <section className="flex flex-col items-center gap-8 px-6 py-12 sm:px-16 sm:py-16">
      <div className="flex max-w-[42rem] flex-col items-center gap-3 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#e3f7fe] px-4 py-1.5 text-sm font-medium tracking-[0.7px] text-[#14b2ef] uppercase">
          <span className="size-2 rounded-full bg-blue" />
          Get Seen In All The Right Places
        </span>
        <h2 className="font-display text-[28px] leading-[1.3] tracking-[-2px] text-ink capitalize sm:text-[2.75rem]">
          Where do we advertise?
        </h2>
        <p className="text-sm leading-[22px] text-[#9d9e9f] sm:text-base sm:leading-[24px]">
          It is true that many brokers primarily focus their advertising efforts within their own
          website and database. However, at The Boat Brokers we believe in engaging in broader
          advertising strategies to reach a wider audience to effectively get better prices and
          achieve a quicker sale for you.
        </p>
      </div>

      <div className="grid w-full max-w-[78.5rem] gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
        <div className="flex flex-col items-start gap-3 rounded-[10px] border border-[#5fcaf0] bg-[#ddf6ff] p-6 sm:col-span-2 lg:col-span-1 lg:row-span-2">
          <img src={onlineAdvertIcon} alt="" aria-hidden="true" className="size-12" />
          <h3 className="font-display text-xl leading-[1.3] tracking-[-1px] text-ink capitalize">
            Online Advertising
          </h3>
          <p className="text-sm leading-[22px] text-[rgba(115,115,115,0.78)]">
            We utilise popular listing websites such as Apollo Duck, Boat Trader and more. Social
            Media advertising on platforms like Facebook &amp; Twitter allowing us to reach a
            wider audience. Boating forums or places of interest to attract potential buyers
            within the narrowboat community.
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 rounded-[10px] border border-[rgba(7,48,64,0.28)] bg-[#f5fcff] p-6">
          <img src={partnershipsIcon} alt="" aria-hidden="true" className="h-12 w-[3.25rem]" />
          <h3 className="text-lg text-ink">Partnerships and Referrals</h3>
          <p className="text-sm leading-[22px] text-[rgba(115,115,115,0.78)]">
            We collaborate with other professionals in the industry, such as surveyors and
            engineers. In addition, build relationships with individuals or businesses that
            complement our services that can help expand our reach.
          </p>
        </div>

        <div className="flex flex-col items-start justify-center gap-2 rounded-[10px] border border-[rgba(7,48,64,0.28)] bg-[#f5fcff] p-6">
          <img src={sendEmailIcon} alt="" aria-hidden="true" className="size-12" />
          <h3 className="text-lg text-ink">Email Marketing</h3>
          <p className="text-sm leading-[22px] text-[rgba(115,115,115,0.78)]">
            We send regular newsletters and updates to their existing clients and prospects to
            keep them informed about boats for sale and.
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 rounded-[10px] border border-[rgba(7,48,64,0.28)] bg-[#f5fcff] p-6 sm:col-span-2 lg:col-span-2">
          <img src={publicationsIcon} alt="" aria-hidden="true" className="size-12" />
          <h3 className="text-lg text-ink">Publications &amp; Marinas</h3>
          <p className="max-w-[43.5rem] text-sm leading-[22px] text-[rgba(115,115,115,0.78)]">
            We place adverts is national publications such as Towpath Talk as well as local
            boating magazines and distribute flyers in marinas and other boating locations.
          </p>
        </div>
      </div>
    </section>
  )
}
