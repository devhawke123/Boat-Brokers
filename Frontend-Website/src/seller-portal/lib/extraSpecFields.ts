// Boat columns the client's wizard didn't cover, grouped under its spec
// sections. Keys are the Boat column names, so the adapter maps them 1:1.
// Labels/placeholders come from the previous portal's SpecificationsForm.
export const EXTRA_SPEC_SECTIONS = [
  {
    section: 'history',
    title: 'Surveys',
    description: 'Let buyers know what independent checks are available.',
    fields: [['survey', 'Survey', 'e.g. Available on request']],
  },
  {
    section: 'dimensions',
    title: 'More measurements',
    description: 'Room sizes help buyers picture day-to-day life on board.',
    fields: [
      ['bathroomLength', 'Bathroom length', 'e.g. 6ft 1in'],
      ['bedroomLength', 'Bedroom length', 'e.g. 10ft'],
      ['dimensionsOther', 'Other dimensions', 'e.g. Beam 6ft 10in'],
    ],
  },
  {
    section: 'engine',
    title: 'Handling & extras',
    description: 'The details that make the boat easier to manoeuvre and maintain.',
    fields: [
      ['bowthruster', 'Bow thruster', 'e.g. Fitted with tube only'],
      ['weedhatch', 'Weed hatch', 'e.g. Quick release under rear deck'],
      ['engineExtraNotes', 'Engine notes', 'e.g. Recently rebuilt starter motor', true],
    ],
  },
  {
    section: 'heating',
    title: 'Stove & water',
    description: 'Secondary heating and water storage.',
    fields: [
      ['solidFuelStove', 'Solid fuel stove', 'e.g. Yes - Hamlet 4KW'],
      ['waterTank', 'Water tank', 'e.g. Stainless steel'],
      ['heatingExtraNotes', 'Heating notes', 'e.g. Radiators in every cabin', true],
    ],
  },
  {
    section: 'electrical',
    title: 'Charging & wiring',
    description: 'How the boat charges, lights and protects its systems.',
    fields: [
      ['alternator', 'Alternator(s)', 'e.g. Twin 75Amp & 175Amp'],
      ['lighting', 'Lighting', 'e.g. 12V LED lights throughout'],
      ['landlineSocket', 'Landline socket', 'e.g. Stern'],
      ['galvanicIsolator', 'Galvanic isolator', 'e.g. Yes - Victron'],
      ['electricalExtraNotes', 'Electrical notes', 'e.g. Recently rewired to BSS standard', true],
    ],
  },
  {
    section: 'gas',
    title: 'Gas supply',
    description: 'Bottles, appliances and anything a surveyor would ask about.',
    fields: [
      ['gasBottles', 'Gas bottles', 'e.g. 2 x 13kg stern lockers'],
      ['appliances', 'Gas appliances', 'e.g. Cooker only'],
      ['gasExtraNotes', 'Gas notes', 'e.g. Gas safety certificate 2025', true],
    ],
  },
  {
    section: 'interior',
    title: 'Build & finish',
    description: 'How the cabin is put together.',
    fields: [
      ['ballast', 'Ballast', 'e.g. Engineering bricks'],
      ['ceiling', 'Ceiling', 'e.g. White painted ply with oak trims'],
      ['cabinSides', 'Cabin sides', 'e.g. Oak faced ply'],
      ['hullSides', 'Hull sides', 'e.g. Oak faced ply'],
      ['flooring', 'Flooring', 'e.g. Oak effect vinyl'],
      ['sideDoors', 'Side doors', 'e.g. Yes - opposite dinette'],
      ['windows', 'Windows', 'e.g. Single glazed windows & port holes'],
    ],
  },
  {
    section: 'interior',
    title: 'Saloon & galley',
    description: 'Where buyers will spend most of their time.',
    fields: [
      ['saloonDinette', 'Saloon dinette', 'e.g. Yes - Pullman style'],
      ['tv', 'TV', 'e.g. 24in Smart TV - by separate negotiation'],
      ['galleyCooker', 'Galley cooker', 'e.g. 2 ring hob & eye level oven/grill'],
      ['galleyFridgeFreezer', 'Fridge / freezer', 'e.g. 12V undercounter fridge & freezer'],
      ['galleyMicrowave', 'Microwave', 'e.g. Yes - 800W'],
      ['galleyWashingMachine', 'Washing machine', 'e.g. Available via separate negotiation'],
    ],
  },
  {
    section: 'interior',
    title: 'Bathroom',
    description: 'Toilet, shower and waste.',
    fields: [
      ['bathroomToilet', 'Toilet', 'e.g. Macerating pump out toilet'],
      ['bathroomWasteTankCapacity', 'Waste tank capacity', 'e.g. 200 litres approx.'],
      ['bathroomBathShower', 'Bath / shower', 'e.g. Quadrant shower with glass screen'],
      ['bathroomVanityBasin', 'Vanity basin', 'e.g. Yes - with vanity cupboard & mirror'],
      ['bathroomExtraNotes', 'Bathroom notes', 'e.g. Heated towel rail', true],
    ],
  },
  {
    section: 'interior',
    title: 'Bedroom',
    description: 'Sleeping space and storage.',
    fields: [
      ['bedroomBed', 'Bed', 'e.g. 4ft 6in fixed double'],
      ['bedroomDinette', 'Bedroom dinette', 'e.g. Converts to a second double'],
      ['bedroomWardrobeStorage', 'Wardrobe / storage', 'e.g. Fitted wardrobe and under-bed drawers'],
      ['bedroomExtraNotes', 'Bedroom notes', 'e.g. Porthole either side', true],
    ],
  },
] as const satisfies readonly {
  section: string
  title: string
  description: string
  fields: readonly (readonly [string, string, string] | readonly [string, string, string, true])[]
}[]

export type ExtraSpecKey = (typeof EXTRA_SPEC_SECTIONS)[number]['fields'][number][0]

export const EXTRA_SPEC_KEYS = EXTRA_SPEC_SECTIONS.flatMap((group) => group.fields.map((field) => field[0])) as ExtraSpecKey[]

const GROUP_SECTION: Record<string, string> = {
  History: 'history',
  Dimensions: 'dimensions',
  Engine: 'engine',
  'Water & Heating': 'heating',
  Electrical: 'electrical',
  Interior: 'interior',
}

type SpecGroup = [title: string, fields: [key: string, label: string, unit?: string][]]

// Appends the extra fields to the review/detail spec groups and inserts the
// Gas group after Electrical — the same order as the wizard's spec sections.
export function withExtraSpecGroups<G extends SpecGroup>(groups: G[]): G[] {
  const extras = (section: string) => EXTRA_SPEC_SECTIONS.filter((group) => group.section === section).flatMap((group) => group.fields.map(([key, label]) => [key, label]))
  return groups.flatMap((group) => {
    const merged = [group[0], [...group[1], ...extras(GROUP_SECTION[group[0]] ?? '')]] as G
    return group[0] === 'Electrical' ? [merged, ['Gas', extras('gas')] as G] : [merged]
  })
}
