import SellerPortalShell from '../../components/SellerPortalShell/SellerPortalShell'
import { useSellerSession } from '../../data/useSellerSession'
import SupportHoursCard from './sections/SupportHoursCard/SupportHoursCard'
import StillNeedHelpCard from './sections/StillNeedHelpCard/StillNeedHelpCard'

export default function HelpSupport() {
  const { checkedSession } = useSellerSession()

  // Redirecting — render nothing rather than flashing page content.
  if (!checkedSession) return null

  return (
    <SellerPortalShell mainClassName="bg-[#f8fafc]">
      <div className="flex w-full flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-h4 capitalize text-[#0f172a]">Help & Support</h1>
          <p className="text-sm text-[#6e6e6e]">Manage and respond to inquiries from potential buyers.</p>
        </div>

        <div className="flex max-w-[1200px] flex-col gap-6 sm:flex-row">
          <SupportHoursCard />
          <StillNeedHelpCard />
        </div>
      </div>
    </SellerPortalShell>
  )
}
