import { z } from "zod";

// Every optional free-text field on the Boat model (History / Dimensions /
// Engine / Heating / Electrical / Gas / Interior / Other / Key details) —
// keep this in sync with prisma/schema.prisma's Boat model.
const OPTIONAL_STRING_FIELDS = [
  // History
  "cinNumber",
  "crtNumber",
  "licenseNumber",
  "previousOwners",
  "engineServiceHistory",
  "boilerServiceHistory",
  "survey",
  "blacking",
  "anodes",
  "documentationAvailable",
  // Dimensions
  "draft",
  "internalHeadroom",
  "saloonLength",
  "galleyLength",
  "bathroomLength",
  "bedroomLength",
  // Engine
  "engine",
  "hours",
  "gearbox",
  "bowthruster",
  "weedhatch",
  "dieselTankCapacity",
  "engineExtraNotes",
  // Heating
  "centralHeating",
  "solidFuelStove",
  "sourceOfHotWater",
  "waterTank",
  "waterTankCapacity",
  "heatingExtraNotes",
  // Electrical
  "alternator",
  "batteries",
  "lighting",
  "inverterCharger",
  "landlineSocket",
  "galvanicIsolator",
  "electricalExtraNotes",
  // Gas
  "gasBottles",
  "appliances",
  "gasExtraNotes",
  // Interior - general
  "insulation",
  "ballast",
  "ceiling",
  "cabinSides",
  "hullSides",
  "flooring",
  "sideDoors",
  "windows",
  "interiorExtraNotes",
  // Interior - Saloon
  "saloonSeating",
  "saloonDinette",
  // Interior - Galley
  "galleyCooker",
  "galleyFridgeFreezer",
  "galleyMicrowave",
  "galleyWashingMachine",
  "galleyExtraNotes",
  // Interior - Bathroom
  "bathroomToilet",
  "bathroomWasteTankCapacity",
  "bathroomBathShower",
  "bathroomVanityBasin",
  "bathroomExtraNotes",
  // Interior - Bedroom
  "bedroomBed",
  "bedroomDinette",
  "bedroomExtraNotes",
  // Other
  "tv",
  "covers",
  "navigationEquipment",
  "hullBuilder",
  "fitOut",
  "year",
  "steelSpec",
  "lastService",
  "boatSafety",
  "recentSurvey",
  // Key details
  "location",
  "lengthBeam",
  "noOfBerths",
  "sternType",
  "yearBuilt",
  "builder",
  "boatType",
  "overview",
  // Media (brochureUrl is derived from the uploaded file, not user text — see boat.controller.ts)
  "videoUrl",
  "virtualTourUrl",
] as const;

// multipart/form-data fields arrive as strings; treat a blank string as
// "not provided" instead of storing empty strings for every unfilled field.
const optionalTrimmed = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().optional(),
);

const optionalPrice = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : value;
}, z.number().int().positive().optional());

// multipart/form-data has no boolean type — "true"/"1" (string, from FormData)
// or an actual boolean (JSON callers) both count as true.
const optionalBoolean = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value === "true" || value === "1";
  return value;
}, z.boolean().optional());

const shape = Object.fromEntries(OPTIONAL_STRING_FIELDS.map((field) => [field, optionalTrimmed])) as Record<
  (typeof OPTIONAL_STRING_FIELDS)[number],
  typeof optionalTrimmed
>;

export const createBoatSchema = z.object({
  sellerId: z.coerce.number().int().positive(),
  name: z.string().trim().min(1, "Boat name is required"),
  price: optionalPrice,
  // Seller preferences captured on the Key Details step — these persist to
  // the BoatListing row created alongside this Boat, not to the Boat itself.
  sellTimeline: optionalTrimmed,
  contactTime: optionalTrimmed,
  listerType: optionalTrimmed,
  additionalNotes: optionalTrimmed,
  agreedToContact: optionalBoolean,
  ...shape,
});

export type CreateBoatInput = z.infer<typeof createBoatSchema>;
