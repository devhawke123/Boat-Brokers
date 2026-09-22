import SellerPortalShell from '../../components/SellerPortalShell/SellerPortalShell'
import Button from '../../../components/Button/Button'

export default function NotFound() {
  return (
    <SellerPortalShell mainClassName="bg-[#f8fafc]">
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <h1 className="font-display text-h4 text-[#0f172a]">Page not found</h1>
        <p className="text-[16px] text-[#64748b]">This page isn&rsquo;t available yet.</p>
        <Button variant="dark" label="Back to Dashboard" icon="none" href="/seller-portal/dashboard" />
      </div>
    </SellerPortalShell>
  )
}
