import PrivacyPolicyHero from './sections/PrivacyPolicyHero/PrivacyPolicyHero'
import PrivacyPolicyContent from './sections/PrivacyPolicyContent/PrivacyPolicyContent'
import CtaBanner from '../../components/CtaBanner/CtaBanner'
import Footer from '../../components/Footer/Footer'

export default function PrivacyPolicy() {
  return (
    <main className="flex flex-col gap-6 px-6 pt-6 pb-20">
      <PrivacyPolicyHero />
      <PrivacyPolicyContent />
      <CtaBanner />
      <Footer />
    </main>
  )
}
