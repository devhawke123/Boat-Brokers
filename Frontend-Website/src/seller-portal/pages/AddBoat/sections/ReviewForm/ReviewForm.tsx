import type { ReactNode } from 'react'
import type { BasicInformationValues } from '../BasicInformationForm/BasicInformationForm'
import type { SpecificationsValues } from '../SpecificationsForm/SpecificationsForm'
import type { MediaValues } from '../MediaForm/MediaForm'
import type { KeyDetailsValues } from '../KeyDetailsForm/KeyDetailsForm'
import type { AdditionalFieldsValues } from '../AdditionalFieldsForm/AdditionalFieldsForm'
import { computeListingScore } from '../../scoring'
import editChevron from '../../../../assets/AddBoat/review/edit-chevron.svg'
import videoIcon from '../../../../assets/AddBoat/review/video-icon.svg'
import pdfIcon from '../../../../assets/AddBoat/review/pdf-icon.svg'
import readyIcon from '../../../../assets/AddBoat/review/ready-icon.svg'
import checkCircle from '../../../../assets/AddBoat/review/check-circle.svg'

type ReviewFormProps = {
  basicInfo: BasicInformationValues
  specifications: SpecificationsValues
  media: MediaValues
  keyDetails: KeyDetailsValues
  customFields: AdditionalFieldsValues
  onEditStep: (step: number) => void
}

function fallback(value: string) {
  return value.trim() ? value : '—'
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[12px] font-bold tracking-[0.6px] text-[#64748b] uppercase">{label}</span>
      <span className="text-[14px] font-medium text-[#6e6e6e]">{fallback(value)}</span>
    </div>
  )
}

function FieldGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
}

function SectionCard({
  title,
  onEdit,
  children,
}: {
  title: string
  onEdit: () => void
  children: ReactNode
}) {
  return (
    <div className="flex flex-col rounded-xl border border-[#e4eef2] bg-white">
      <div className="flex items-center justify-between border-b border-[#e4eef2] px-5 py-4">
        <h3 className="text-[14px] font-semibold text-[#0f2a3d]">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1 text-[12px] font-semibold text-[#2e9fd6]"
        >
          Edit
          <img src={editChevron} alt="" aria-hidden="true" className="h-2.5 w-1.5" />
        </button>
      </div>
      <div className="flex flex-col gap-5 px-5 py-5">{children}</div>
    </div>
  )
}

const BASIC_INFO_FIELDS: { key: keyof BasicInformationValues; label: string }[] = [
  { key: 'berths', label: 'Berths' },
  { key: 'stern', label: 'Stern' },
  { key: 'engine', label: 'Engine' },
  { key: 'hullBuilder', label: 'Hull builder' },
  { key: 'lastService', label: 'Last service' },
  { key: 'fitOut', label: 'Fit out' },
  { key: 'blacking', label: 'Blacking' },
  { key: 'year', label: 'Year' },
  { key: 'boatSafety', label: 'Boat safety' },
  { key: 'recentSurvey', label: 'Recent survey' },
  { key: 'steel', label: 'Steel' },
  { key: 'length', label: 'Length' },
  { key: 'price', label: 'Price' },
]

const SPEC_GROUPS: { title: string; fields: { key: keyof SpecificationsValues; label: string }[] }[] = [
  {
    title: 'History',
    fields: [
      { key: 'cinNumber', label: 'CIN number' },
      { key: 'crtNumber', label: 'CRT number' },
      { key: 'licenseNumber', label: 'License number' },
      { key: 'previousOwners', label: 'Previous owners' },
      { key: 'engineServiceHistory', label: 'Engine service history' },
      { key: 'boilerServiceHistory', label: 'Boiler service history' },
      { key: 'blacking', label: 'Blacking' },
      { key: 'anodes', label: 'Anodes' },
      { key: 'survey', label: 'Survey' },
      { key: 'documentationAvailable', label: 'Documentation available' },
    ],
  },
  {
    title: 'Dimensions',
    fields: [
      { key: 'draft', label: 'Draft' },
      { key: 'internalHeadroom', label: 'Internal headroom' },
      { key: 'saloonLength', label: 'Saloon length' },
      { key: 'galleyLength', label: 'Galley length' },
      { key: 'bathroomLength', label: 'Bathroom length' },
      { key: 'bedroomLength', label: 'Bedroom length' },
    ],
  },
  {
    title: 'Engine',
    fields: [
      { key: 'engine', label: 'Engine' },
      { key: 'hours', label: 'Hours' },
      { key: 'gearbox', label: 'Gearbox' },
      { key: 'bowthruster', label: 'Bowthruster' },
      { key: 'weedhatch', label: 'Weedhatch' },
      { key: 'dieselTankCapacity', label: 'Diesel tank capacity' },
      { key: 'engineExtraNotes', label: 'Notes' },
    ],
  },
  {
    title: 'Heating',
    fields: [
      { key: 'centralHeating', label: 'Central heating' },
      { key: 'solidFuelStove', label: 'Solid fuel stove' },
      { key: 'sourceOfHotWater', label: 'Source of hot water' },
      { key: 'waterTank', label: 'Water tank' },
      { key: 'waterTankCapacity', label: 'Water tank capacity' },
      { key: 'heatingExtraNotes', label: 'Notes' },
    ],
  },
  {
    title: 'Electrical',
    fields: [
      { key: 'alternator', label: 'Alternator' },
      { key: 'batteries', label: 'Batteries' },
      { key: 'lighting', label: 'Lighting' },
      { key: 'inverterCharger', label: 'Inverter/charger' },
      { key: 'landlineSocket', label: 'Landline socket' },
      { key: 'galvanicIsolator', label: 'Galvanic isolator' },
      { key: 'electricalExtraNotes', label: 'Notes' },
    ],
  },
  {
    title: 'Gas',
    fields: [
      { key: 'gasBottles', label: 'Gas bottles' },
      { key: 'appliances', label: 'Appliances' },
      { key: 'gasExtraNotes', label: 'Notes' },
    ],
  },
  {
    title: 'Interior',
    fields: [
      { key: 'insulation', label: 'Insulation' },
      { key: 'ballast', label: 'Ballast' },
      { key: 'ceiling', label: 'Ceiling' },
      { key: 'cabinSides', label: 'Cabin sides' },
      { key: 'hullSides', label: 'Hull sides' },
      { key: 'flooring', label: 'Flooring' },
      { key: 'sideDoors', label: 'Side doors' },
      { key: 'windows', label: 'Windows' },
      { key: 'saloonSeating', label: 'Saloon seating' },
      { key: 'saloonDinette', label: 'Saloon dinette' },
      { key: 'galleyCooker', label: 'Galley cooker' },
      { key: 'galleyFridgeFreezer', label: 'Galley fridge/freezer' },
      { key: 'galleyMicrowave', label: 'Galley microwave' },
      { key: 'galleyWashingMachine', label: 'Galley washing machine' },
      { key: 'bathroomToilet', label: 'Bathroom toilet' },
      { key: 'bathroomWasteTankCapacity', label: 'Bathroom waste tank capacity' },
      { key: 'bathroomBathShower', label: 'Bathroom bath/shower' },
      { key: 'bathroomVanityBasin', label: 'Bathroom vanity basin' },
      { key: 'bedroomBed', label: 'Bedroom bed' },
      { key: 'bedroomDinette', label: 'Bedroom dinette' },
      { key: 'interiorExtraNotes', label: 'Notes' },
    ],
  },
  {
    title: 'Other',
    fields: [
      { key: 'tv', label: 'TV' },
      { key: 'covers', label: 'Covers' },
      { key: 'navigationEquipment', label: 'Navigation equipment' },
    ],
  },
]

export default function ReviewForm({
  basicInfo,
  specifications,
  media,
  keyDetails,
  customFields,
  onEditStep,
}: ReviewFormProps) {
  const {
    percentComplete,
    strengthLabel,
    readyToSubmit,
    identityVerified,
    mandatoryFieldsFilled,
    photosCount,
    photosMinMet,
    completedCustomFields,
  } = computeListingScore({ basicInfo, specifications, media, keyDetails, customFields })

  const ringCircumference = 2 * Math.PI * 34
  const ringOffset = ringCircumference * (1 - percentComplete / 100)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-7 rounded-xl border border-[#e4eef2] bg-white p-7">
        <div className="relative flex size-[83px] shrink-0 items-center justify-center">
          <svg width="83" height="83" viewBox="0 0 83 83" className="-rotate-90">
            <circle cx="41.5" cy="41.5" r="34" fill="none" stroke="#e4eef2" strokeWidth="7" />
            <circle
              cx="41.5"
              cy="41.5"
              r="34"
              fill="none"
              stroke="#2e9fd6"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={ringCircumference}
              strokeDashoffset={ringOffset}
            />
          </svg>
          <span className="absolute text-[17px] font-bold text-[#0f2a3d]">{percentComplete}%</span>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <h2 className="font-display text-[24px] text-[#0f2a3d]">Review your vessel listing</h2>
          <p className="text-[14px] text-[#64748b]">
            Give everything one final check before submitting your listing for review. High quality listings sell 40% faster.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="rounded-full bg-[#2e9e6d]/10 px-2.5 py-1 text-[10px] font-bold text-[#2e9e6d]">{strengthLabel}</span>
            <span className="text-[10px] text-[#5c7080]">{readyToSubmit ? '• Ready to submit' : '• Still missing details'}</span>
          </div>
        </div>
      </div>

      <SectionCard title="Listing Identity" onEdit={() => onEditStep(1)}>
        <div className="flex items-start gap-5">
          <div className="h-[111px] w-[166px] shrink-0 overflow-hidden rounded-lg bg-[#f5f8fa]">
            {media.photos[0] ? (
              <img src={media.photos[0].url} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[11px] text-[#94a3b8]">No photo</div>
            )}
          </div>
          <div className="flex flex-col justify-center gap-2">
            <h4 className="font-display text-[20px] text-[#0f2a3d]">{basicInfo.boatName.trim() || 'Untitled Vessel'}</h4>
            <div className="flex items-center gap-3 text-[12px] text-[#5c7080]">
              <span>{fallback(basicInfo.year)}</span>
              <span>•</span>
              <span>{basicInfo.length.trim() ? `${basicInfo.length}ft` : '—'}</span>
              <span>•</span>
              <span>{fallback(basicInfo.steel)}</span>
            </div>
            <span className="text-[16px] font-bold text-[#2e9fd6]">{basicInfo.price.trim() ? `$${basicInfo.price}` : '—'}</span>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Basic Information" onEdit={() => onEditStep(1)}>
        <FieldGrid>
          {BASIC_INFO_FIELDS.map(({ key, label }) => (
            <Field key={key} label={label} value={basicInfo[key]} />
          ))}
        </FieldGrid>
        <Field label="Overview" value={basicInfo.overview} />
      </SectionCard>

      <SectionCard title="Specification" onEdit={() => onEditStep(2)}>
        {SPEC_GROUPS.map((group) => (
          <div key={group.title} className="flex flex-col gap-4">
            <h4 className="text-[13px] font-semibold text-[#0f2a3d]">{group.title}</h4>
            <FieldGrid>
              {group.fields.map(({ key, label }) => (
                <Field key={key} label={label} value={specifications[key]} />
              ))}
            </FieldGrid>
          </div>
        ))}

        {completedCustomFields.length > 0 && (
          <div className="flex flex-col gap-4">
            <h4 className="text-[13px] font-semibold text-[#0f2a3d]">Additional Fields</h4>
            <FieldGrid>
              {completedCustomFields.map((field) => (
                <Field key={field.id} label={field.label} value={field.value} />
              ))}
            </FieldGrid>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Photos & Video" onEdit={() => onEditStep(3)}>
        {media.photos.length > 0 ? (
          <div className="flex flex-wrap gap-2.5">
            {media.photos.slice(0, 7).map((photo) => (
              <div key={photo.id} className="size-[69px] shrink-0 overflow-hidden rounded-lg">
                <img src={photo.url} alt={photo.name} className="h-full w-full object-cover" />
              </div>
            ))}
            {media.photos.length > 7 && (
              <div className="flex size-[69px] shrink-0 flex-col items-center justify-center rounded-lg border border-dashed border-[#e4eef2] bg-[#0f2a3d]/5 text-[#0f2a3d]">
                <span className="text-[14px] font-bold">+{media.photos.length - 7}</span>
                <span className="text-[9px] text-[#5c7080]">more</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-[13px] text-[#94a3b8]">No photos uploaded yet.</p>
        )}

        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5 rounded-lg border border-[#e4eef2] bg-[#fcfeff] p-3.5">
            <span className="flex size-[35px] shrink-0 items-center justify-center rounded-full bg-[#2e9fd6]/10">
              <img src={videoIcon} alt="" aria-hidden="true" className="size-3.5" />
            </span>
            <div className="flex flex-col">
              <span className="text-[12px] font-semibold text-[#0f2a3d]">Video Tour</span>
              <span className="text-[10px] text-[#5c7080]">{fallback(media.videoUrl)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-lg border border-[#e4eef2] bg-[#fcfeff] p-3.5">
            <span className="flex size-[35px] shrink-0 items-center justify-center rounded-full bg-[#ef4444]/[0.08]">
              <img src={pdfIcon} alt="" aria-hidden="true" className="h-[18px] w-[15px]" />
            </span>
            <div className="flex flex-col">
              <span className="text-[12px] font-semibold text-[#0f2a3d]">Boat Brochure</span>
              <span className="text-[10px] text-[#5c7080]">{media.brochure ? media.brochure.name : 'Not uploaded'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-lg border border-[#e4eef2] bg-[#fcfeff] p-3.5">
            <span className="flex size-[35px] shrink-0 items-center justify-center rounded-full bg-[#2e9fd6]/10">
              <img src={videoIcon} alt="" aria-hidden="true" className="size-3.5" />
            </span>
            <div className="flex flex-col">
              <span className="text-[12px] font-semibold text-[#0f2a3d]">Virtual Tour</span>
              <span className="text-[10px] text-[#5c7080]">{fallback(media.virtualTourUrl)}</span>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Key Details" onEdit={() => onEditStep(4)}>
        <FieldGrid>
          <Field label="Full name" value={keyDetails.fullName} />
          <Field label="Email address" value={keyDetails.email} />
          <Field label="Phone number" value={keyDetails.phone.trim() ? `${keyDetails.countryCode} ${keyDetails.phone}` : ''} />
          <Field label="Country" value={keyDetails.country} />
          <Field label="How soon do you want to sell?" value={keyDetails.sellTimeline} />
          <Field label="When's the best time to reach you?" value={keyDetails.contactTime} />
          <Field label="Who's listing this boat?" value={keyDetails.listerType} />
        </FieldGrid>
        <Field label="Additional notes" value={keyDetails.additionalNotes} />
      </SectionCard>

      <div className="flex flex-col gap-5 rounded-xl border border-[#8fd2ee]/20 bg-[#f5f8fa] p-7">
        <div className="flex items-center gap-2.5">
          <img src={readyIcon} alt="" aria-hidden="true" className="h-[17px] w-3.5" />
          <h4 className="text-[14px] font-bold text-[#2e9fd6]">Ready to Submit</h4>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2.5">
            <img
              src={checkCircle}
              alt=""
              aria-hidden="true"
              className={`size-[17px] shrink-0 ${identityVerified ? '' : 'opacity-30 grayscale'}`}
            />
            <span className="text-[12px] font-medium text-[#5c7080]">Identity verified</span>
          </div>
          <div className="flex items-center gap-2.5">
            <img
              src={checkCircle}
              alt=""
              aria-hidden="true"
              className={`size-[17px] shrink-0 ${mandatoryFieldsFilled ? '' : 'opacity-30 grayscale'}`}
            />
            <span className="text-[12px] font-medium text-[#5c7080]">All mandatory fields filled</span>
          </div>
          <div className="flex items-center gap-2.5">
            <img
              src={checkCircle}
              alt=""
              aria-hidden="true"
              className={`size-[17px] shrink-0 ${photosMinMet ? '' : 'opacity-30 grayscale'}`}
            />
            <span className="text-[12px] font-medium text-[#5c7080]">Photos uploaded ({photosCount}/5 min)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <img src={checkCircle} alt="" aria-hidden="true" className="size-[17px] shrink-0" />
            <span className="text-[12px] font-medium text-[#5c7080]">Listing score: {strengthLabel.replace(' Strength', '')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
