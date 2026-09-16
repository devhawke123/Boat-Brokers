export type JargonTerm = {
  term: string
  definition: string
}

// Source: Figma "Jargon Buster" design (node 646:471). A few entries in the
// source had swapped/duplicated definitions or typos; those have been
// corrected here (see individual comments).
export const jargonTerms: JargonTerm[] = [
  { term: 'Aft', definition: 'The rear of the boat.' },
  {
    term: 'Air draft',
    definition:
      "The height of the boat taken from the waterline to the highest fixed point on the boat. (So you won't hit a low bridge)",
  },
  { term: 'Amid ships', definition: 'Central part of a boat.' },
  {
    term: 'Anode',
    definition:
      'Otherwise known as sacrificial anodes, is a large piece of magnesium often welded under the waterline at the front and rear of a narrowboat hull, which protects the hull from corrosion due to electrolysis. An inspection of the anodes is recommended when the boat is out of the water for blacking.',
  },
  {
    term: 'Anser pins',
    definition:
      'Steel pins attached, immediately before the stern counter to either or both gunwales of motors and butties to which straps from the stern dollies or studs of both boats can be tightly hooked or shackled when breasting-up, not only keeping the sterns together but also acting as springs and stopping the pair from riding forwards and backwards against each other. Tunnel hooks can also be attached here.',
  },
  {
    term: 'Anti-cavitation plate',
    definition: 'A plate fitted flush to the uxter plate to cover the weedhatch opening.',
  },
  { term: 'Beam', definition: 'The width of a vessel at the widest point.' },
  {
    term: 'Bed cupboard',
    definition: "The decorated cupboard in a boatman's cabin with a tall door that drops down to make into a small double bed.",
  },
  { term: 'Berth', definition: 'A bed or sleeping accommodation on a boat.' },
  {
    term: 'Bilge',
    definition: "The compartment at the bottom of the boat where water collects and must be pumped out of the vessel.",
  },
  { term: 'Bilge pump', definition: 'A pump for removing water that has collected in the bilges.' },
  {
    term: 'Blacking',
    definition: 'The term used for protective coats of bitumen based paints applied to steel hulls to prevent rusting.',
  },
  {
    term: "Boatman's cabin",
    definition:
      'Originally the after cabin on working boats which provided the crew’s living and bedroom accommodation. Often replicated on modern traditional style boats.',
  },
  { term: 'Boat Safety Certificate', definition: 'An MOT for narrowboats, which is valid for four years.' },
  { term: 'Bow', definition: 'The front of the boat.' },
  {
    term: 'Bow Thruster',
    definition:
      'A small propeller or water-jet at the bow, used to turn a vessel at slow speed. Often mounted in a tunnel running through the bow.',
  },
  {
    term: 'Bulkhead',
    definition: 'An upright wall within the hull of a ship or boat. Particularly a structural wall which is often watertight.',
  },
  { term: 'Bulls Eye', definition: 'A small round porthole fitted in the cabin top, has convex glass for lighting the cabin.' },
  {
    term: 'BSC Safety Scheme',
    definition: 'All boats require a safety inspection every four years by a qualified Boat Safety surveyor, covers all aspects of boat safety.',
  },
  {
    term: 'Calorifier',
    definition: 'Hot water tank heated by the running engine, immersion, central heating or connected to 240v shoreline (can be a combination).',
  },
  { term: 'Canal & River Trust Licence', definition: 'Boat licence to use the canals and rivers.' },
  { term: 'Cant', definition: 'A raised outer section of a deck normally to the fore and counter decks.' },
  {
    term: 'Cassette toilet',
    definition: 'A chemical toilet with a removable storage cassette underneath, can be electrical flushing.',
  },
  {
    term: 'Chine',
    definition:
      'An angle in the hull. There may be several chines, depending upon the hull design. A narrowboat often has a single chine where the hull wall and bottom plate meet.',
  },
  { term: 'Cockpit', definition: 'Open area usually lower than the side decks used for storage or sitting out.' },
  { term: 'Counter', definition: 'Flat area below the water line above the swim.' },
  {
    term: 'Counter Plate',
    definition: 'The stern section of the hull side plating above the waterline that wraps around the stern and corresponds to the counter swim.',
  },
  { term: 'Cratch Cover', definition: 'A canvas covering over the forward well deck.' },
  {
    term: 'Cross Bed',
    definition:
      'A double bed going across the full width of the boat, the bottom of the bed folds or slides away during the day for gangway access.',
  },
  { term: 'Draft', definition: 'The amount of the hull that is below water.' },
  { term: 'Dolly', definition: 'A round bollard used for mooring.' },
  { term: 'Fiddle', definition: 'A raised lip or rail around the edge of a shelf to prevent items from sliding off.' },
  {
    term: 'Foredeck',
    definition: 'The higher level deck in the bow of a boat, often over the gas locker in a narrowboat.',
  },
  { term: 'Fore well', definition: 'The lower deck at the front of a boat.' },
  {
    term: 'Freeboard',
    definition: 'The distance between the waterline and the lowest deck level where water can enter the inside of the boat.',
  },
  // Note: the Figma source duplicated the Bilge pump copy for "Galley" — corrected here.
  { term: 'Galley', definition: 'The kitchen area of a boat.' },
  {
    term: 'Galvanic Isolator',
    definition: "A fitting to a boat's electrical system intended to prevent corrosion to the hull.",
  },
  {
    term: 'Gunwale',
    definition: "The top edge of the hull where it joins the cabin side, literally 'gun wall' but pronounced 'gunnel' as in tunnel.",
  },
  { term: 'Hull', definition: 'The main part of the boat that sits in the water and gives a boat its buoyancy.' },
  { term: 'Holding Tank', definition: 'An on board storage tank used for toilet waste, emptied at pump-out stations.' },
  {
    term: 'Houdini hatch',
    definition: 'A skylight fitted to the roof of the cabin which can be opened for ventilation or emergency escape.',
  },
  {
    term: 'Inverter',
    definition: 'Electronic device for taking power stored in the battery bank and converting 12v DC to 240v AC.',
  },
  {
    term: 'Josher Style Bow',
    definition:
      'A bow design with a more pointed nose with a slight S shaped sweep, named after Joshua Fellows of Fellows Morton and Clayton carriers fame.',
  },
  {
    term: 'Keel cooled',
    definition:
      'A closed system, a slab tank (narrow & baffled) is welded to the inside (normally) of the swim, engine cooling water is then circulated through it (does the same job as the radiator on a car). Important: the engine and cooling system can easily have anti-freeze added to prevent frost damage.',
  },
  {
    term: 'Macerator Toilet',
    definition: "Pump-out toilet where the waste is macerated into slurry.",
  },
  {
    term: 'Mushroom Vent',
    definition: 'A vent in the roof of the boat shaped like a mushroom, which provides ventilation.',
  },
  { term: 'Overplate', definition: 'On a steel vessel, plating fitted on top of the hull plate.' },
  { term: 'Pigeon Box', definition: 'A rectangular hole in the deck head covered with a hinged roof used for ventilation.' },
  {
    term: 'Pram Canopy',
    definition:
      "Canopy fitted on folding framework which is easy to put up and down, fitted over a narrowboat's counter to protect the steerer from the elements.",
  },
  {
    term: 'Port or Port side',
    definition: 'Left-hand side when standing at the stern facing forward (towards the front end).',
  },
  {
    term: 'Pumpout Toilet',
    definition: 'Toilet where the waste is flushed into a holding tank, which is pumped out at a pump-out facility.',
  },
  {
    term: 'Raw water cooled (direct)',
    definition:
      'Canal water is drawn in via a mud box (normally a watertight container large enough to allow the incoming water time to settle) before being pumped around the engine to cool it, then returned to the canal. Important: the engine and every part of the cooling system must be completely drained during cold weather to prevent frost damage.',
  },
  {
    term: 'Raw water cooled (indirect)',
    definition:
      "Canal water is drawn in via a mud box before being pumped through a heat exchanger mounted on the engine, then returned to the canal. The engine's own coolant is also pumped through the heat exchanger but kept separate, enabling the engine to be protected with anti-freeze. Important: the raw water side of the heat exchanger and unprotected parts of the cooling system must be completely drained during cold weather to prevent frost damage.",
  },
  {
    term: 'RCD',
    definition:
      'Recreational Craft Directive. EEC mandatory standards for the construction of new boats. The RCD certificate lasts four years, after which boats must have a Boat Safety Certificate.',
  },
  {
    term: 'Remote Greaser',
    definition: 'A metal cylinder fitted close to the stern tube which acts as a reservoir to grease the stern gland.',
  },
  {
    term: 'Reverse layout',
    definition: 'An interior layout with the bedroom at the front and the galley and lounge at the rear.',
  },
  {
    term: 'Rubbing Strake',
    definition: 'A moulding fitted to the outside of the hull, usually at deck level, to protect the topsides.',
  },
  { term: 'Rudder nib', definition: 'On narrowboats, the extension to the rudder above the waterline.' },
  { term: 'Rudderstock', definition: 'The bar, tube or post connecting the rudder vane to the steering mechanism.' },
  { term: 'Rudderstock tube', definition: 'A tube in the hull through which the rudderstock passes.' },
  { term: 'Sacrificial chine', definition: 'Extension to the bottom plate to provide protection and a wear edge for the chine.' },
  { term: 'Saloon', definition: 'The living area on a boat.' },
  { term: 'Scumble', definition: 'Painted graining to make it look like wood.' },
  { term: 'Scuppers', definition: 'Holes through hull sides for draining decks & lockers.' },
  {
    term: 'Semi-Traditional',
    definition: 'Narrowboat style, a good compromise between a trad and a cruiser. The looks of a Trad, with the space of a cruiser.',
  },
  {
    term: 'Single Lever Control',
    definition: 'A hand lever combining the functions of steering and throttle control.',
  },
  { term: 'Shoreline', definition: 'A lead from the shore side connected to a 240v electricity supply.' },
  {
    term: 'Skin tank',
    definition:
      'A steel tank welded to the interior face of the hull. The skin tank forms part of the engine cooling system; coolant passes through the tank and is cooled by contact with exterior hull plating.',
  },
  {
    term: 'Skeg',
    definition:
      'A steel horizontal bar welded to the base plate (normally in channel form) protruding from the stern to carry the lower end of the rudder post and bearing; it also gives some protection to the propeller.',
  },
  { term: 'Soap Holes', definition: "Small storage slots in the bulkhead of a traditional style boatman's cabin." },
  {
    term: 'Starboard or starboard side',
    definition:
      "(From the Norse 'steerboard', the oar that was used to steer the boat) right-hand side when standing at the stern facing forward (towards the front end).",
  },
  { term: 'Stern', definition: 'The back or aft part of the vessel.' },
  {
    term: 'Sterngear',
    definition:
      'The propeller, propeller shaft, stern tube, stern tube bearing, & stuffing box or packing gland (an adjustable gland to help keep water out of the engine space bilge).',
  },
  {
    term: 'Stern gland',
    definition: 'Greased packing arrangement that is used to prevent water from entering a vessel at the point where the propeller shaft passes through the hull.',
  },
  { term: 'Stern tube', definition: 'The tube through the hull through which the propeller shaft passes.' },
  {
    term: 'Stretching',
    definition: 'The boat is lengthened by cutting through and adding a completely new section to make the boat longer.',
  },
  { term: 'Superstructure', definition: 'The structures on a vessel that project above the deck.' },
  {
    term: 'Swans neck',
    definition:
      'The S shaped steel bar welded to the rudder post to which the tiller bar is fitted (the brass shiny stick with a wooden handle on the end) on a motor boat.',
  },
  {
    term: 'Swim',
    definition: 'The after (back) underwater part of the hull that goes to a point to allow a cleaner flow of water over the propeller.',
  },
  {
    term: 'Tiller bar (or extension)',
    definition: 'Fits on the swans neck of a motor boat to give extra leverage. (The brass shiny stick with a wooden handle on the end.)',
  },
  {
    // Note: the Figma layer read "Transform" — corrected to "Transom" to match the definition.
    term: 'Transom',
    definition: 'The normally rounded after (back) part of the boat above the water where the steerer stands.',
  },
  { term: 'Tumblehome', definition: 'The amount a cabin side slopes inwards (to give more bridge clearance).' },
  {
    term: 'Traditional Style',
    definition: 'A style of narrowboat typified by a short back deck of 2-3 feet in length, giving more room inside for living.',
  },
  {
    term: 'Uxter Plate',
    definition: "The steel bottom plate of a narrowboat's stern counter deck, where it projects over the propeller and rudder.",
  },
  { term: 'Waterline', definition: "The line on the boat's hull where it floats." },
  {
    term: 'Weedhatch',
    definition: 'A hatch with a watertight lid through the counter of a narrowboat providing access to the propeller for cleaning.',
  },
  { term: 'Windlass or lock key', definition: 'A cranked handle for opening and closing lock paddles.' },
]

export function groupTermsByLetter(terms: JargonTerm[]) {
  const groups = new Map<string, JargonTerm[]>()
  for (const entry of terms) {
    const letter = entry.term.charAt(0).toUpperCase()
    const bucket = groups.get(letter)
    if (bucket) {
      bucket.push(entry)
    } else {
      groups.set(letter, [entry])
    }
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, items]) => ({
      letter,
      items: items.sort((a, b) => a.term.localeCompare(b.term)),
    }))
}
