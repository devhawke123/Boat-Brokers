import { TextareaField } from '../../../../components/FormField/FormField'
import nameIcon from '../../../../assets/AddBoat/key-details/name-icon.svg'
import emailIcon from '../../../../assets/AddBoat/key-details/email-icon.svg'
import phoneIcon from '../../../../assets/AddBoat/key-details/phone-icon.svg'
import morningIcon from '../../../../assets/AddBoat/key-details/morning-icon.svg'
import afternoonIcon from '../../../../assets/AddBoat/key-details/afternoon-icon.svg'
import eveningIcon from '../../../../assets/AddBoat/key-details/evening-icon.svg'
import privateOwnerIcon from '../../../../assets/AddBoat/key-details/private-owner-icon.svg'
import brokerIcon from '../../../../assets/AddBoat/key-details/broker-icon.svg'
import dealerIcon from '../../../../assets/AddBoat/key-details/dealer-icon.svg'
import checkIcon from '../../../../assets/AddBoat/key-details/check-icon.svg'
import checkboxCheckIcon from '../../../../assets/AddBoat/key-details/checkbox-check-icon.svg'

export type KeyDetailsValues = {
  fullName: string
  email: string
  countryCode: string
  phone: string
  country: string
  sellTimeline: string
  contactTime: string
  listerType: string
  additionalNotes: string
  agreedToContact: boolean
}

export const initialKeyDetailsValues: KeyDetailsValues = {
  fullName: '',
  email: '',
  countryCode: '+44',
  phone: '',
  country: '',
  sellTimeline: '',
  contactTime: '',
  listerType: '',
  additionalNotes: '',
  agreedToContact: true,
}

const SELL_TIMELINE_OPTIONS = ['ASAP', 'Within 1 month', '1-3 months', 'Just exploring']
const CONTACT_TIME_OPTIONS = [
  { value: 'Morning', icon: morningIcon },
  { value: 'Afternoon', icon: afternoonIcon },
  { value: 'Evening', icon: eveningIcon },
]
const LISTER_TYPE_OPTIONS = [
  { value: 'Private owner', icon: privateOwnerIcon },
  { value: 'Broker', icon: brokerIcon },
  { value: 'Dealer', icon: dealerIcon },
]

const ADDITIONAL_NOTES_MAX_LENGTH = 500

type KeyDetailsFormProps = {
  values: KeyDetailsValues
  onChange: <K extends keyof KeyDetailsValues>(field: K, value: KeyDetailsValues[K]) => void
}

export default function KeyDetailsForm({ values, onChange }: KeyDetailsFormProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-lg bg-[#f5f8fb]/50 px-4 py-5">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex flex-1 flex-col gap-2">
            <span className="text-[12px] font-bold tracking-[0.6px] text-[#64748b] uppercase">
              Full name <span className="text-red-500">*</span>
            </span>
            <div className="relative flex h-11 items-center rounded-lg border border-[#e4eef2] bg-white">
              <img src={nameIcon} alt="" aria-hidden="true" className="ml-4 h-3 w-2.5 shrink-0" />
              <input
                type="text"
                required
                value={values.fullName}
                onChange={(e) => onChange('fullName', e.target.value)}
                placeholder="John Doe"
                className="h-full w-full rounded-lg bg-transparent px-3 text-[14px] text-[#0f172a] placeholder:text-[#c2c4c8] focus:outline-none"
              />
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <span className="text-[12px] font-bold tracking-[0.6px] text-[#64748b] uppercase">
              Email address <span className="text-red-500">*</span>
            </span>
            <div className="relative flex h-11 items-center rounded-lg border border-[#e4eef2] bg-white">
              <img src={emailIcon} alt="" aria-hidden="true" className="ml-4 size-3 shrink-0" />
              <input
                type="email"
                required
                value={values.email}
                onChange={(e) => onChange('email', e.target.value)}
                placeholder="john@example.com"
                className="h-full w-full rounded-lg bg-transparent px-3 text-[14px] text-[#0f172a] placeholder:text-[#c2c4c8] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex flex-1 flex-col gap-2">
            <span className="text-[12px] font-bold tracking-[0.6px] text-[#64748b] uppercase">
              Phone number <span className="text-red-500">*</span>
            </span>
            <div className="flex h-11 gap-2">
              <div className="relative flex h-full w-[90px] shrink-0 items-center rounded-lg border border-[#e4eef2] bg-white">
                <input
                  type="text"
                  required
                  value={values.countryCode}
                  onChange={(e) => onChange('countryCode', e.target.value)}
                  placeholder="+44"
                  className="h-full w-full rounded-lg bg-transparent px-2.5 text-[12px] text-[#64748b] placeholder:text-[#c2c4c8] focus:outline-none"
                />
              </div>
              <div className="relative flex h-full flex-1 items-center rounded-lg border border-[#e4eef2] bg-white">
                <img src={phoneIcon} alt="" aria-hidden="true" className="ml-4 size-3 shrink-0" />
                <input
                  type="tel"
                  required
                  value={values.phone}
                  onChange={(e) => onChange('phone', e.target.value)}
                  placeholder="7123 456789"
                  className="h-full w-full rounded-lg bg-transparent px-3 text-[14px] text-[#0f172a] placeholder:text-[#9ca3af] focus:outline-none"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <span className="text-[12px] font-bold tracking-[0.6px] text-[#64748b] uppercase">
              Country <span className="text-red-500">*</span>
            </span>
            <div className="relative flex h-11 items-center rounded-lg border border-[#e4eef2] bg-white">
              <input
                type="text"
                required
                value={values.country}
                onChange={(e) => onChange('country', e.target.value)}
                placeholder="United Kingdom"
                className="h-full w-full rounded-lg bg-transparent px-3 text-[14px] text-[#0f172a] placeholder:text-[#c2c4c8] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 rounded-lg bg-[#f5f8fb]/50 px-4 py-5">
        <div className="flex flex-col gap-0.5">
          <h3 className="font-display text-[17px] text-[#073040]">Your selling preferences</h3>
          <p className="text-[13px] text-[#64748b]">Helps us match you with the right buyers, at the right pace.</p>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-bold tracking-[0.6px] text-[#64748b] uppercase">How soon do you want to sell?</span>
          <div className="flex flex-wrap gap-2">
            {SELL_TIMELINE_OPTIONS.map((option) => {
              const isSelected = values.sellTimeline === option
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onChange('sellTimeline', option)}
                  className={`flex-1 rounded-lg border px-2 py-2.5 text-center text-[12px] font-medium whitespace-nowrap ${
                    isSelected ? 'border-[#073040] bg-[#073040] text-white' : 'border-[#f5f8fa] bg-[#f5f8fa] text-[#073040]'
                  }`}
                >
                  {option}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-bold tracking-[0.6px] text-[#64748b] uppercase">When&apos;s the best time to reach you?</span>
          <div className="flex flex-wrap gap-2">
            {CONTACT_TIME_OPTIONS.map(({ value, icon }) => {
              const isSelected = values.contactTime === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onChange('contactTime', value)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 py-2.5 text-[12px] font-medium whitespace-nowrap ${
                    isSelected ? 'border-[#073040] bg-[#073040] text-white' : 'border-[#f5f8fa] bg-[#f5f8fa] text-[#073040]'
                  }`}
                >
                  <img src={icon} alt="" aria-hidden="true" className={`size-2.5 ${isSelected ? 'brightness-0 invert' : ''}`} />
                  {value}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-lg bg-[#f5f8fb]/50 px-4 py-5">
        <h3 className="font-display text-[17px] text-[#073040]">Who&apos;s listing this boat?</h3>
        <div className="flex flex-wrap gap-3">
          {LISTER_TYPE_OPTIONS.map(({ value, icon }) => {
            const isSelected = values.listerType === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => onChange('listerType', value)}
                className={`relative flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border px-4 py-5 ${
                  isSelected ? 'border-[#073040] bg-[#073040]' : 'border-[#f5f8fa] bg-[#f5f8fa]'
                }`}
              >
                {isSelected && (
                  <img src={checkIcon} alt="" aria-hidden="true" className="absolute top-2.5 right-2.5 size-3" />
                )}
                <span
                  className={`flex size-7 items-center justify-center rounded-full ${
                    isSelected ? 'bg-white/10' : 'bg-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)]'
                  }`}
                >
                  <img src={icon} alt="" aria-hidden="true" className={`h-3.5 w-3.5 ${isSelected ? 'brightness-0 invert' : ''}`} />
                </span>
                <span className={`text-[13px] font-semibold ${isSelected ? 'text-white' : 'text-[#073040]'}`}>{value}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-lg bg-[#f5f8fb]/50 px-4 py-5">
        <div className="flex flex-col gap-0.5">
          <h3 className="font-display text-[17px] text-[#073040]">Anything else we should know?</h3>
          <p className="text-[13px] text-[#64748b]">A few lines now means better buyer introductions later.</p>
        </div>

        <TextareaField
          label="Additional notes (optional)"
          value={values.additionalNotes}
          onChange={(value) => onChange('additionalNotes', value)}
          placeholder="Tell us more about the boat's history, specific features, or your selling situation..."
          maxLength={ADDITIONAL_NOTES_MAX_LENGTH}
        />

        <button
          type="button"
          onClick={() => onChange('agreedToContact', !values.agreedToContact)}
          className="flex items-center gap-3 rounded-lg bg-[#f5f8fa] p-3 text-left"
        >
          <span
            className={`flex size-4 shrink-0 items-center justify-center rounded-full ${
              values.agreedToContact ? 'bg-[#073040]' : 'border border-[#c2c4c8] bg-white'
            }`}
          >
            {values.agreedToContact && <img src={checkboxCheckIcon} alt="" aria-hidden="true" className="size-2" />}
          </span>
          <span className="text-[13px] font-medium text-[#073040]">
            I&apos;m happy for Meridian Marine to contact me about my listing by my preferred method.
          </span>
        </button>
      </div>
    </div>
  )
}
