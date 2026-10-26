import heroBg from '../../assets/privacy-policy-hero-bg.png'
import PageHero from '../../components/PageHero/PageHero'
import PrivacyPolicyContent from './sections/PrivacyPolicyContent/PrivacyPolicyContent'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import Footer from '../../components/Footer/Footer'

export default function PrivacyPolicy() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <PageHero
        image={heroBg}
        activeLabel=""
        size="md"
        title="Privacy Policy"
        maxWidthClassName="max-w-[60.375rem]"
        gapClassName="gap-4"
        body="Learn how we collect, use, and protect your information when you visit and interact with our website. Our Privacy Policy provides clear details about your data and your rights."
        bodyClassName="max-w-[60.375rem] text-sm leading-[1.5] tracking-[-0.32px] text-[#ededed] sm:text-base"
        overlayClassName="bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.1)_35%,rgba(0,0,0,0.4)_100%)]"
      />
      <PrivacyPolicyContent />
      <CtaBanner />
      <Footer />
    </main>
  )
}
