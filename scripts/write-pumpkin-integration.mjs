import fs from "fs";
import path from "path";

const root = process.cwd();

function write(rel, content) {
  const p = path.join(root, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
  console.log("wrote", rel);
}

write("src/lib/quotation-schema.ts", `import { z } from "zod";

export const stayingLocationSchema = z.object({
  location: z.string().min(1),
  nights: z.number().int().min(1),
});

export const roomAllocationItemSchema = z.object({
  roomTypeId: z.number().int(),
  roomTypeName: z.string(),
  count: z.number().int().min(0),
  capacity: z.number().int(),
});

export const transportItemSchema = z.object({
  vehicleId: z.number().int(),
  vehicleName: z.string(),
  count: z.number().int().min(1),
  capacity: z.number().int(),
});

export const hotelSelectionSchema = z.object({
  location: z.string(),
  hotelId: z.number().int().nullable(),
  hotelName: z.string(),
  nights: z.number().int().min(1),
});

export const tourPlanRowSchema = z.object({
  dayLabel: z.string(),
  from: z.string(),
  to: z.string(),
  hotelName: z.string(),
  stayLocation: z.string(),
  roomCategory: z.string(),
});

export const passengersSchema = z.object({
  adults: z.number().int().min(0).default(0),
  children: z.number().int().min(0).default(0),
  infants: z.number().int().min(0).default(0),
  focs: z.number().int().min(0).default(0),
  focRequiresAccommodation: z.boolean().default(true),
  focRequiresTransport: z.boolean().default(true),
});

export const quotationDraftSchema = z.object({
  id: z.string(),
  customerName: z.string(),
  nights: z.number().int().min(1),
  days: z.number().int().min(1),
  tourPlaces: z.array(z.string()),
  stayingLocations: z.array(stayingLocationSchema),
  passengers: passengersSchema,
  currencyCode: z.string().min(1),
  pricePerPerson: z.number().min(0),
  roomAllocations: z.array(roomAllocationItemSchema),
  transport: z.array(transportItemSchema),
  hotels: z.array(hotelSelectionSchema),
  tourPlan: z.array(tourPlanRowSchema),
  quotationDate: z.string(),
  expirationDate: z.string(),
  packageDescription: z.string(),
  defaultRoomCategory: z.string(),
  inclusions: z.array(z.string()),
  exclusions: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type StayingLocation = z.infer<typeof stayingLocationSchema>;
export type RoomAllocationItem = z.infer<typeof roomAllocationItemSchema>;
export type TransportItem = z.infer<typeof transportItemSchema>;
export type HotelSelection = z.infer<typeof hotelSelectionSchema>;
export type TourPlanRow = z.infer<typeof tourPlanRowSchema>;
export type Passengers = z.infer<typeof passengersSchema>;
export type QuotationDraft = z.infer<typeof quotationDraftSchema>;

export const WIZARD_STEPS = [
  "customer",
  "duration",
  "tourPlaces",
  "stayingLocations",
  "passengers",
  "pricing",
  "rooms",
  "transport",
  "hotels",
  "tourPlan",
  "inclusions",
  "preview",
] as const;

export type WizardStep = (typeof WIZARD_STEPS)[number];

export function totalPassengers(p: Passengers): number {
  return p.adults + p.children + p.infants + p.focs;
}

export function payingPassengers(p: Passengers): number {
  return p.adults + p.children;
}

export function guestsNeedingBeds(p: Passengers): number {
  const base = p.adults + p.children + p.infants;
  return p.focRequiresAccommodation ? base + p.focs : base;
}

export function travellersNeedingTransport(p: Passengers): number {
  const base = p.adults + p.children + p.infants;
  return p.focRequiresTransport ? base + p.focs : base;
}

export function durationMismatch(nights: number, days: number): boolean {
  return days !== nights + 1;
}

function formatDateDDMMYYYY(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return \`\${dd}.\${mm}.\${yyyy}\`;
}

export function defaultQuotationDate(): string {
  return formatDateDDMMYYYY(new Date());
}

export function defaultExpirationDate(from = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + 30);
  return formatDateDDMMYYYY(d);
}

export function generateTourPlanRows(draft: QuotationDraft): TourPlanRow[] {
  const { days, stayingLocations, hotels, tourPlaces, defaultRoomCategory = "DELUXE" } = draft;
  const rows: TourPlanRow[] = [];
  if (days <= 0) return rows;

  const locs = stayingLocations.map((s) => s.location);
  const hotelByLoc = new Map(hotels.map((h) => [h.location, h]));

  for (let d = 1; d <= days; d++) {
    const dayLabel = \`DAY \${String(d).padStart(2, "0")}\`;

    if (d === 1) {
      const dest = locs[0] ?? tourPlaces[0] ?? "";
      const hotel = hotelByLoc.get(stayingLocations[0]?.location ?? "");
      rows.push({
        dayLabel,
        from: "AIRPORT",
        to: dest.toUpperCase(),
        hotelName: hotel?.hotelName ?? "",
        stayLocation: dest.toUpperCase(),
        roomCategory: defaultRoomCategory,
      });
    } else if (d === days) {
      const from = locs[locs.length - 1] ?? tourPlaces[tourPlaces.length - 1] ?? "";
      rows.push({
        dayLabel,
        from: from.toUpperCase(),
        to: "AIRPORT",
        hotelName: "DROP AT AIRPORT",
        stayLocation: "",
        roomCategory: "",
      });
    } else {
      const fromLoc = locs[d - 2] ?? "";
      const toIndex = Math.min(d - 1, locs.length - 1);
      const toLoc = locs[toIndex] ?? fromLoc;
      const stayLoc = stayingLocations[toIndex]?.location ?? toLoc;
      const hotel = hotelByLoc.get(stayLoc);
      rows.push({
        dayLabel,
        from: fromLoc.toUpperCase(),
        to: toLoc.toUpperCase(),
        hotelName: hotel?.hotelName ?? "",
        stayLocation: toLoc.toUpperCase(),
        roomCategory: defaultRoomCategory,
      });
    }
  }

  return rows;
}
`);

console.log("Part 1 done");
