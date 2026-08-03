import type { QuotationDraft, TourPlanRow } from "@/lib/quotation-schema";
import type { AppConfig } from "@/lib/config-service";
import { formatCurrency } from "@/lib/format/currency";
import { totalPassengers, payingPassengers, formatPackageDescription } from "@/lib/quotation-schema";
import { totalRooms, formatRoomsDescription } from "@/lib/room-allocation";

export interface ExportDocumentData {
  title: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  termsAndConditions: string;
  customerName: string;
  nights: number;
  days: number;
  durationLabel: string;
  places: string[];
  stayingLocations: { location: string; nights: number }[];
  passengers: QuotationDraft["passengers"];
  totalPax: number;
  payingPax: number;
  guestsNeedingBeds: number;
  currencyCode: string;
  formattedPrice: string;
  formattedTotalPrice: string;
  pricePerPerson: number;
  totalPrice: number;
  roomAllocations: QuotationDraft["roomAllocations"];
  roomsQty: number;
  roomsDescription: string;
  transportDescription: string;
  transport: QuotationDraft["transport"];
  hotels: QuotationDraft["hotels"];
  tourPlanRows: TourPlanRow[];
  quotationDate: string;
  expirationDate: string;
  packageDescription: string;
  defaultRoomCategory: string;
  tourPeriod: string;
  inclusions: string[];
  exclusions: string[];
  generatedAt: string;
}

function buildTransportDescription(transport: QuotationDraft["transport"]): string {
  if (transport.length === 0) return "";
  return transport.map((t) => `${t.count}x ${t.vehicleName}`).join(", ");
}

function buildTourPeriod(draft: QuotationDraft): string {
  if (draft.stayingLocations.length === 0) {
    return `${draft.nights}N ${draft.days}D`;
  }
  return draft.stayingLocations.map((s) => `${s.location} (${s.nights}N)`).join(" / ");
}

export function buildExportDocumentData(
  draft: QuotationDraft,
  config: AppConfig
): ExportDocumentData {
  const currency = config.currencies.find((c) => c.code === draft.currencyCode);
  const payingPax = payingPassengers(draft.passengers);
  const totalPrice = draft.pricePerPerson * payingPax;
  const roomsQty = totalRooms(draft.roomAllocations);
  const roomsDescription = formatRoomsDescription(draft.roomAllocations);

  return {
    title: config.template?.quotationTitle ?? "TOUR QUOTA",
    companyName: config.company?.name ?? "Pumpkin Tours & Travels",
    companyAddress: config.company?.address ?? "",
    companyPhone: config.company?.phone ?? "",
    companyEmail: config.company?.email ?? "",
    companyWebsite: "www.pumpkintours.com",
    termsAndConditions: config.company?.termsAndConditions ?? "",
    customerName: draft.customerName,
    nights: draft.nights,
    days: draft.days,
    durationLabel: `${draft.nights}N ${draft.days}D`,
    places: draft.stayingLocations.map((s) => s.location),
    stayingLocations: draft.stayingLocations,
    passengers: draft.passengers,
    totalPax: totalPassengers(draft.passengers),
    payingPax,
    guestsNeedingBeds: payingPax,
    currencyCode: draft.currencyCode,
    formattedPrice: formatCurrency(draft.pricePerPerson, draft.currencyCode, currency?.locale, currency?.symbol),
    formattedTotalPrice: formatCurrency(totalPrice, draft.currencyCode, currency?.locale, currency?.symbol),
    pricePerPerson: draft.pricePerPerson,
    totalPrice,
    roomAllocations: draft.roomAllocations,
    roomsQty,
    roomsDescription,
    transportDescription: buildTransportDescription(draft.transport),
    transport: draft.transport,
    hotels: draft.hotels,
    tourPlanRows: draft.tourPlan,
    quotationDate: draft.quotationDate,
    expirationDate: draft.expirationDate,
    packageDescription: formatPackageDescription(draft.nights, draft.days, draft.meals),
    defaultRoomCategory: draft.defaultRoomCategory,
    tourPeriod: buildTourPeriod(draft),
    inclusions: draft.inclusions,
    exclusions: draft.exclusions,
    generatedAt: new Date().toISOString(),
  };
}
