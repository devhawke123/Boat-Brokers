import type { BasicInformationValues } from './sections/BasicInformationForm/BasicInformationForm'
import type { SpecificationsValues } from './sections/SpecificationsForm/SpecificationsForm'
import type { MediaValues } from './sections/MediaForm/MediaForm'
import type { KeyDetailsValues } from './sections/KeyDetailsForm/KeyDetailsForm'
import type { AdditionalFieldsValues } from './sections/AdditionalFieldsForm/AdditionalFieldsForm'

export const REQUIRED_BASIC_INFO_FIELDS: (keyof BasicInformationValues)[] = [
  'boatName',
  'stern',
  'engine',
  'hullBuilder',
  'lastService',
]

export const REQUIRED_KEY_DETAILS_FIELDS: (keyof KeyDetailsValues)[] = ['fullName', 'email', 'phone', 'country']

export const PHOTOS_MIN = 5

const OPTIONAL_BASIC_INFO_FIELDS: (keyof BasicInformationValues)[] = [
  'length',
  'berths',
  'year',
  'steel',
  'boatSafety',
  'fitOut',
  'blacking',
  'recentSurvey',
  'price',
  'overview',
]

const OPTIONAL_KEY_DETAILS_FIELDS: (keyof KeyDetailsValues)[] = [
  'sellTimeline',
  'contactTime',
  'listerType',
  'additionalNotes',
]

export function isFilled(value: string) {
  return value.trim() !== ''
}

export function isBasicInfoComplete(values: BasicInformationValues) {
  return REQUIRED_BASIC_INFO_FIELDS.every((key) => isFilled(values[key]))
}

export function isKeyDetailsComplete(values: KeyDetailsValues) {
  return REQUIRED_KEY_DETAILS_FIELDS.every((key) => isFilled(values[key]))
}

export function isMediaComplete(values: MediaValues) {
  return values.photos.length >= PHOTOS_MIN
}

type ScoreInput = {
  basicInfo: BasicInformationValues
  specifications: SpecificationsValues
  media: MediaValues
  keyDetails: KeyDetailsValues
  customFields: AdditionalFieldsValues
}

// Mandatory fields (Basic Info's 5 required fields, Key Details' 4 required
// fields, and the 5-photo minimum) are worth 90% of the score between them —
// completing all of them alone guarantees "Excellent Strength" (>=90%).
// Every optional field across the whole listing shares the remaining 10%, so
// they can nudge the score from 90 up to 100 but never gate it.
const MANDATORY_WEIGHT = 90
const OPTIONAL_WEIGHT = 10

export function computeListingScore({ basicInfo, specifications, media, keyDetails, customFields }: ScoreInput) {
  const mandatoryChecks = [
    ...REQUIRED_BASIC_INFO_FIELDS.map((key) => isFilled(basicInfo[key])),
    ...REQUIRED_KEY_DETAILS_FIELDS.map((key) => isFilled(keyDetails[key])),
    isMediaComplete(media),
  ]
  const mandatoryTotal = mandatoryChecks.length
  const mandatoryFilled = mandatoryChecks.filter(Boolean).length
  const mandatoryRatio = mandatoryTotal ? mandatoryFilled / mandatoryTotal : 0

  const optionalStringFields = [
    ...OPTIONAL_BASIC_INFO_FIELDS.map((key) => basicInfo[key]),
    ...Object.values(specifications),
    ...OPTIONAL_KEY_DETAILS_FIELDS.map((key) => keyDetails[key]),
  ]
  const optionalMediaFlags = [isFilled(media.videoUrl), Boolean(media.brochure), isFilled(media.virtualTourUrl)]
  const optionalTotal = optionalStringFields.length + optionalMediaFlags.length
  const completedCustomFields = customFields.fields.filter((f) => isFilled(f.label) && isFilled(f.value))
  // Custom fields are optional extras, so they count toward the numerator only —
  // leaving blank rows out of the denominator means they can't drag the score
  // down, and the clamp below keeps the bonus from pushing the ratio past 100%.
  const optionalFilled =
    optionalStringFields.filter(isFilled).length + optionalMediaFlags.filter(Boolean).length + completedCustomFields.length
  const optionalRatio = optionalTotal ? Math.min(1, optionalFilled / optionalTotal) : 0

  const percentComplete = Math.min(
    100,
    Math.round(mandatoryRatio * MANDATORY_WEIGHT + optionalRatio * OPTIONAL_WEIGHT),
  )

  const strengthLabel =
    percentComplete >= 90
      ? 'Excellent Strength'
      : percentComplete >= 70
        ? 'Good Strength'
        : percentComplete >= 40
          ? 'Fair Strength'
          : 'Needs Work'

  const mandatoryFieldsFilled = mandatoryFilled === mandatoryTotal
  const readyToSubmit = mandatoryFieldsFilled
  const identityVerified = isFilled(keyDetails.fullName) && isFilled(keyDetails.email)
  const photosCount = media.photos.length
  const photosMinMet = photosCount >= PHOTOS_MIN

  return {
    percentComplete,
    strengthLabel,
    readyToSubmit,
    identityVerified,
    mandatoryFieldsFilled,
    photosCount,
    photosMinMet,
    completedCustomFields,
  }
}
