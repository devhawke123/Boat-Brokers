import { useState } from 'react'
import { FieldRow, TextField } from '../../../../components/FormField/FormField'
import historyIcon from '../../../../assets/AddBoat/spec-tabs/history.svg'
import dimensionsIcon from '../../../../assets/AddBoat/spec-tabs/dimensions.svg'
import engineIcon from '../../../../assets/AddBoat/spec-tabs/engine.svg'
import heatingIcon from '../../../../assets/AddBoat/spec-tabs/heating.svg'
import electricalIcon from '../../../../assets/AddBoat/spec-tabs/electrical.svg'
import gasIcon from '../../../../assets/AddBoat/spec-tabs/gas.svg'
import interiorIcon from '../../../../assets/AddBoat/spec-tabs/interior.svg'
import otherIcon from '../../../../assets/AddBoat/spec-tabs/other.svg'

export type SpecificationsValues = {
  // History
  cinNumber: string
  crtNumber: string
  licenseNumber: string
  previousOwners: string
  engineServiceHistory: string
  boilerServiceHistory: string
  blacking: string
  anodes: string
  survey: string
  documentationAvailable: string

  // Dimensions
  draft: string
  internalHeadroom: string
  saloonLength: string
  galleyLength: string
  bathroomLength: string
  bedroomLength: string

  // Engine
  engine: string
  hours: string
  gearbox: string
  bowthruster: string
  weedhatch: string
  dieselTankCapacity: string
  engineExtraNotes: string

  // Heating
  centralHeating: string
  solidFuelStove: string
  sourceOfHotWater: string
  waterTank: string
  waterTankCapacity: string
  heatingExtraNotes: string

  // Electrical
  alternator: string
  batteries: string
  lighting: string
  inverterCharger: string
  landlineSocket: string
  galvanicIsolator: string
  electricalExtraNotes: string

  // Gas
  gasBottles: string
  appliances: string
  gasExtraNotes: string

  // Interior
  insulation: string
  ballast: string
  ceiling: string
  cabinSides: string
  hullSides: string
  flooring: string
  sideDoors: string
  windows: string
  saloonSeating: string
  saloonDinette: string
  galleyCooker: string
  galleyFridgeFreezer: string
  galleyMicrowave: string
  galleyWashingMachine: string
  bathroomToilet: string
  bathroomWasteTankCapacity: string
  bathroomBathShower: string
  bathroomVanityBasin: string
  bedroomBed: string
  bedroomDinette: string
  interiorExtraNotes: string

  // Other
  tv: string
  covers: string
  navigationEquipment: string
}

export const initialSpecificationsValues: SpecificationsValues = {
  cinNumber: '',
  crtNumber: '',
  licenseNumber: '',
  previousOwners: '',
  engineServiceHistory: '',
  boilerServiceHistory: '',
  blacking: '',
  anodes: '',
  survey: '',
  documentationAvailable: '',

  draft: '',
  internalHeadroom: '',
  saloonLength: '',
  galleyLength: '',
  bathroomLength: '',
  bedroomLength: '',

  engine: '',
  hours: '',
  gearbox: '',
  bowthruster: '',
  weedhatch: '',
  dieselTankCapacity: '',
  engineExtraNotes: '',

  centralHeating: '',
  solidFuelStove: '',
  sourceOfHotWater: '',
  waterTank: '',
  waterTankCapacity: '',
  heatingExtraNotes: '',

  alternator: '',
  batteries: '',
  lighting: '',
  inverterCharger: '',
  landlineSocket: '',
  galvanicIsolator: '',
  electricalExtraNotes: '',

  gasBottles: '',
  appliances: '',
  gasExtraNotes: '',

  insulation: '',
  ballast: '',
  ceiling: '',
  cabinSides: '',
  hullSides: '',
  flooring: '',
  sideDoors: '',
  windows: '',
  saloonSeating: '',
  saloonDinette: '',
  galleyCooker: '',
  galleyFridgeFreezer: '',
  galleyMicrowave: '',
  galleyWashingMachine: '',
  bathroomToilet: '',
  bathroomWasteTankCapacity: '',
  bathroomBathShower: '',
  bathroomVanityBasin: '',
  bedroomBed: '',
  bedroomDinette: '',
  interiorExtraNotes: '',

  tv: '',
  covers: '',
  navigationEquipment: '',
}

type SpecTab = 'history' | 'dimensions' | 'engine' | 'heating' | 'electrical' | 'gas' | 'interior' | 'other'

const SPEC_TABS: { id: SpecTab; label: string; icon: string }[] = [
  { id: 'history', label: 'History', icon: historyIcon },
  { id: 'dimensions', label: 'Dimensions', icon: dimensionsIcon },
  { id: 'engine', label: 'Engine', icon: engineIcon },
  { id: 'heating', label: 'Heating', icon: heatingIcon },
  { id: 'electrical', label: 'Electrical', icon: electricalIcon },
  { id: 'gas', label: 'Gas', icon: gasIcon },
  { id: 'interior', label: 'Interior', icon: interiorIcon },
  { id: 'other', label: 'Other', icon: otherIcon },
]

type SpecificationsFormProps = {
  values: SpecificationsValues
  onChange: (field: keyof SpecificationsValues, value: string) => void
}

export default function SpecificationsForm({ values, onChange }: SpecificationsFormProps) {
  const [activeTab, setActiveTab] = useState<SpecTab>('history')

  function field(key: keyof SpecificationsValues, label: string, placeholder: string) {
    return <TextField label={label} placeholder={placeholder} value={values[key]} onChange={(v) => onChange(key, v)} />
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {SPEC_TABS.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={
                isActive
                  ? 'flex items-center gap-2 rounded-lg bg-[#0a4359] px-5 py-2.5 text-[14px] font-medium text-white shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]'
                  : 'flex items-center gap-2 rounded-lg border border-[#e4eef2] bg-white px-5 py-2.5 text-[14px] font-medium text-[#64748b]'
              }
            >
              <img src={tab.icon} alt="" aria-hidden="true" className={isActive ? 'size-3' : 'size-3 opacity-60'} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === 'history' && (
        <div className="flex flex-col gap-6">
          <FieldRow>
            {field('cinNumber', 'CIN number', 'e.g. Colecraft')}
            {field('crtNumber', 'CRT number', 'e.g. Owner fit out')}
          </FieldRow>
          <FieldRow>
            {field('licenseNumber', 'License number', 'e.g. 2005')}
            {field('previousOwners', 'Previous owners', 'e.g. Colecraft')}
          </FieldRow>
          <FieldRow>
            {field('engineServiceHistory', 'Engine service history', 'e.g. Colecraft')}
            {field('boilerServiceHistory', 'Boiler service history', 'e.g. Colecraft')}
          </FieldRow>
          <FieldRow>
            {field('blacking', 'Blacking', 'e.g. 2023')}
            {field('anodes', 'Anodes', 'e.g. Replaced 2023')}
          </FieldRow>
          <FieldRow>
            {field('survey', 'Survey', 'e.g. Available on request')}
            {field('documentationAvailable', 'Documentation available', 'e.g. Full history file')}
          </FieldRow>
        </div>
      )}

      {activeTab === 'dimensions' && (
        <div className="flex flex-col gap-6">
          <FieldRow>
            {field('draft', 'Draft', 'e.g. 24in')}
            {field('internalHeadroom', 'Internal headroom', 'e.g. 6ft 4in (centre)')}
          </FieldRow>
          <FieldRow>
            {field('saloonLength', 'Saloon length', 'e.g. 16ft - including dinette')}
            {field('galleyLength', 'Galley length', 'e.g. 10ft 1in')}
          </FieldRow>
          <FieldRow>
            {field('bathroomLength', 'Bathroom length', 'e.g. 6ft 1in')}
            {field('bedroomLength', 'Bedroom length', 'e.g. 10ft')}
          </FieldRow>
        </div>
      )}

      {activeTab === 'engine' && (
        <div className="flex flex-col gap-6">
          <FieldRow>
            {field('engine', 'Engine', 'e.g. Canaline 38')}
            {field('hours', 'Hours', 'e.g. 2378')}
          </FieldRow>
          <FieldRow>
            {field('gearbox', 'Gearbox', 'e.g. PRM 125D2')}
            {field('bowthruster', 'Bowthruster', 'e.g. Fitted with tube only')}
          </FieldRow>
          <FieldRow>
            {field('weedhatch', 'Weedhatch', 'e.g. Quick release under rear deck')}
            {field('dieselTankCapacity', 'Diesel tank capacity', 'e.g. 180 litres approx.')}
          </FieldRow>
          <FieldRow>{field('engineExtraNotes', 'Notes', 'e.g. N/A')}</FieldRow>
        </div>
      )}

      {activeTab === 'heating' && (
        <div className="flex flex-col gap-6">
          <FieldRow>
            {field('centralHeating', 'Central heating', 'e.g. Yes - Webasto feeding 3 radiators plus towel radiator')}
            {field('solidFuelStove', 'Solid fuel stove', 'e.g. Yes - Hamlet 4KW')}
          </FieldRow>
          <FieldRow>
            {field('sourceOfHotWater', 'Source of hot water', 'e.g. Engine, Webasto & immersion heater')}
            {field('waterTank', 'Water tank', 'e.g. Stainless steel')}
          </FieldRow>
          <FieldRow>
            {field('waterTankCapacity', 'Water tank capacity', 'e.g. 240 litres approx.')}
            {field('heatingExtraNotes', 'Notes', 'e.g. N/A')}
          </FieldRow>
        </div>
      )}

      {activeTab === 'electrical' && (
        <div className="flex flex-col gap-6">
          <FieldRow>
            {field('alternator', 'Alternator', 'e.g. Twin 75Amp & 175Amp')}
            {field('batteries', 'Batteries', "e.g. 1 x starter Vetus lead acid & 4 Vetus 120Ah AGM's")}
          </FieldRow>
          <FieldRow>
            {field('lighting', 'Lighting', 'e.g. 12V LED lights throughout')}
            {field('inverterCharger', 'Inverter/charger', 'e.g. 1500W inverter & Victron 80Amp charger')}
          </FieldRow>
          <FieldRow>
            {field('landlineSocket', 'Landline socket', 'e.g. Stern')}
            {field('galvanicIsolator', 'Galvanic isolator', 'e.g. Yes - Victron')}
          </FieldRow>
          <FieldRow>
            {field('electricalExtraNotes', 'Notes', 'e.g. Victron solar panels 3 x 175W controlled by Victron MPPT controller')}
          </FieldRow>
        </div>
      )}

      {activeTab === 'gas' && (
        <div className="flex flex-col gap-6">
          <FieldRow>
            {field('gasBottles', 'Gas bottles', 'e.g. 2 x 13kg stern lockers')}
            {field('appliances', 'Appliances', 'e.g. Cooker only')}
          </FieldRow>
          <FieldRow>{field('gasExtraNotes', 'Notes', 'e.g. N/A')}</FieldRow>
        </div>
      )}

      {activeTab === 'interior' && (
        <div className="flex flex-col gap-6">
          <FieldRow>
            {field('insulation', 'Insulation', 'e.g. Sprayfoam')}
            {field('ballast', 'Ballast', 'e.g. Engineering bricks')}
          </FieldRow>
          <FieldRow>
            {field('ceiling', 'Ceiling', 'e.g. White painted ply with oak trims')}
            {field('cabinSides', 'Cabin sides', 'e.g. Oak faced ply')}
          </FieldRow>
          <FieldRow>
            {field('hullSides', 'Hull sides', 'e.g. Oak faced ply')}
            {field('flooring', 'Flooring', 'e.g. Oak effect vinyl')}
          </FieldRow>
          <FieldRow>
            {field('sideDoors', 'Side doors', 'e.g. Yes - opposite dinette')}
            {field('windows', 'Windows', 'e.g. Combination of single glazed windows & port holes')}
          </FieldRow>
          <FieldRow>
            {field('saloonSeating', 'Saloon seating', 'e.g. Pullman dinette with 2 armchairs')}
            {field('saloonDinette', 'Saloon dinette', 'e.g. yes - Pullman style')}
          </FieldRow>
          <FieldRow>
            {field('galleyCooker', 'Galley cooker', 'e.g. Domino 2 ring hob & Thetford eye level oven/grill')}
            {field('galleyFridgeFreezer', 'Galley fridge/freezer', 'e.g. 12V Shoreline undercounter fridge & 12V freezer')}
          </FieldRow>
          <FieldRow>
            {field('galleyMicrowave', 'Galley microwave', 'e.g. Yes - 800W')}
            {field('galleyWashingMachine', 'Galley washing machine', 'e.g. Yes - Available via separate negotiation')}
          </FieldRow>
          <FieldRow>
            {field('bathroomToilet', 'Bathroom toilet', 'e.g. Vetus macerating pump out toilet')}
            {field('bathroomWasteTankCapacity', 'Bathroom waste tank capacity', 'e.g. 200 litres approx.')}
          </FieldRow>
          <FieldRow>
            {field('bathroomBathShower', 'Bathroom bath/shower', 'e.g. Quadrant shower with glass screen')}
            {field('bathroomVanityBasin', 'Bathroom vanity basin', 'e.g. Yes - with vanity cupboard & mirror')}
          </FieldRow>
          <FieldRow>
            {field('bedroomBed', 'Bedroom bed', 'e.g. 4ft 6in fixed double with 6in insert extension to 5ft (kingsize)')}
            {field('bedroomDinette', 'Bedroom dinette', 'e.g. See saloon')}
          </FieldRow>
          <FieldRow>{field('interiorExtraNotes', 'Notes', 'e.g. Double glazed hatch & bow doors')}</FieldRow>
        </div>
      )}

      {activeTab === 'other' && (
        <div className="flex flex-col gap-6">
          <FieldRow>
            {field('tv', 'TV', 'e.g. Saloon 24in Smart TV - By separate negotiation')}
            {field('covers', 'Covers', 'e.g. Side hatch cover')}
          </FieldRow>
          <FieldRow>{field('navigationEquipment', 'Navigation equipment', 'e.g. Various')}</FieldRow>
        </div>
      )}
    </>
  )
}
