import Button from '../../../../../components/Button/Button'
import plusIcon from '../../../../assets/Dashboard/plus-icon.svg'

export default function AddBoatCta() {
  return (
    <div className="flex w-full flex-col gap-4 rounded-lg border border-[#e2e8f0] bg-white p-8">
      <div className="flex flex-col gap-6 py-2">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-navy-darkest shadow-[0_10px_15px_-3px_#bfdbfe,0_4px_6px_-4px_#bfdbfe]">
          <img src={plusIcon} alt="" className="size-[1.875rem]" />
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-bold text-navy-darkest">Ready to list another boat?</h3>
          <p className="text-base text-[#667981]">
            Connect your new listing to thousands of potential buyers instantly.
          </p>
        </div>
      </div>

      <Button variant="dark" label="Add New Boat" icon="none" href="/seller-portal/boats/new" className="w-full" />
    </div>
  )
}
