import { db } from "@/db";
import {
  companySettings, templateSettings, currencies, places, roomTypes,
  vehicles, transportRules, hotels, inclusionTemplates, exclusionTemplates,
} from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function getFullConfig() {
  const [company] = await db.select().from(companySettings).where(eq(companySettings.id, 1));
  const [template] = await db.select().from(templateSettings).where(eq(templateSettings.id, 1));
  const currencyList = await db.select().from(currencies).orderBy(asc(currencies.sortOrder));
  const placeList = await db.select().from(places).orderBy(asc(places.sortOrder));
  const roomTypeList = await db.select().from(roomTypes).orderBy(asc(roomTypes.sortOrder));
  const vehicleList = await db.select().from(vehicles).orderBy(asc(vehicles.sortOrder));
  const ruleList = await db.select().from(transportRules).orderBy(asc(transportRules.sortOrder));
  const hotelList = await db.select().from(hotels).orderBy(asc(hotels.sortOrder));
  const inclusionList = await db.select().from(inclusionTemplates).orderBy(asc(inclusionTemplates.sortOrder));
  const exclusionList = await db.select().from(exclusionTemplates).orderBy(asc(exclusionTemplates.sortOrder));

  return {
    company: company ?? null,
    template: template ?? null,
    currencies: currencyList,
    places: placeList,
    roomTypes: roomTypeList,
    vehicles: vehicleList,
    transportRules: ruleList,
    hotels: hotelList,
    inclusionTemplates: inclusionList,
    exclusionTemplates: exclusionList,
  };
}

export type AppConfig = Awaited<ReturnType<typeof getFullConfig>>;

export type EntityName =
  | "currencies" | "places" | "roomTypes" | "vehicles" | "transportRules"
  | "hotels" | "inclusionTemplates" | "exclusionTemplates"
  | "companySettings" | "templateSettings";

const VALID_ENTITIES = new Set<string>([
  "currencies", "places", "roomTypes", "vehicles", "transportRules",
  "hotels", "inclusionTemplates", "exclusionTemplates", "companySettings", "templateSettings",
]);

export function isValidEntity(name: string): name is EntityName {
  return VALID_ENTITIES.has(name);
}

export async function listEntities(entity: EntityName) {
  switch (entity) {
    case "currencies": return db.select().from(currencies).orderBy(asc(currencies.sortOrder));
    case "places": return db.select().from(places).orderBy(asc(places.sortOrder));
    case "roomTypes": return db.select().from(roomTypes).orderBy(asc(roomTypes.sortOrder));
    case "vehicles": return db.select().from(vehicles).orderBy(asc(vehicles.sortOrder));
    case "transportRules": return db.select().from(transportRules).orderBy(asc(transportRules.sortOrder));
    case "hotels": return db.select().from(hotels).orderBy(asc(hotels.sortOrder));
    case "inclusionTemplates": return db.select().from(inclusionTemplates).orderBy(asc(inclusionTemplates.sortOrder));
    case "exclusionTemplates": return db.select().from(exclusionTemplates).orderBy(asc(exclusionTemplates.sortOrder));
    case "companySettings": return db.select().from(companySettings);
    case "templateSettings": return db.select().from(templateSettings);
  }
}

export async function createEntity(entity: EntityName, data: Record<string, unknown>) {
  switch (entity) {
    case "currencies": return (await db.insert(currencies).values(data as typeof currencies.$inferInsert).returning())[0];
    case "places": return (await db.insert(places).values(data as typeof places.$inferInsert).returning())[0];
    case "roomTypes": return (await db.insert(roomTypes).values(data as typeof roomTypes.$inferInsert).returning())[0];
    case "vehicles": return (await db.insert(vehicles).values(data as typeof vehicles.$inferInsert).returning())[0];
    case "transportRules": return (await db.insert(transportRules).values(data as typeof transportRules.$inferInsert).returning())[0];
    case "hotels": return (await db.insert(hotels).values(data as typeof hotels.$inferInsert).returning())[0];
    case "inclusionTemplates": return (await db.insert(inclusionTemplates).values(data as typeof inclusionTemplates.$inferInsert).returning())[0];
    case "exclusionTemplates": return (await db.insert(exclusionTemplates).values(data as typeof exclusionTemplates.$inferInsert).returning())[0];
    case "companySettings": return (await db.insert(companySettings).values(data as typeof companySettings.$inferInsert).returning())[0];
    case "templateSettings": return (await db.insert(templateSettings).values(data as typeof templateSettings.$inferInsert).returning())[0];
  }
}

export async function updateEntity(entity: EntityName, id: number, data: Record<string, unknown>) {
  switch (entity) {
    case "currencies": return (await db.update(currencies).set(data as Partial<typeof currencies.$inferInsert>).where(eq(currencies.id, id)).returning())[0];
    case "places": return (await db.update(places).set(data as Partial<typeof places.$inferInsert>).where(eq(places.id, id)).returning())[0];
    case "roomTypes": return (await db.update(roomTypes).set(data as Partial<typeof roomTypes.$inferInsert>).where(eq(roomTypes.id, id)).returning())[0];
    case "vehicles": return (await db.update(vehicles).set(data as Partial<typeof vehicles.$inferInsert>).where(eq(vehicles.id, id)).returning())[0];
    case "transportRules": return (await db.update(transportRules).set(data as Partial<typeof transportRules.$inferInsert>).where(eq(transportRules.id, id)).returning())[0];
    case "hotels": return (await db.update(hotels).set(data as Partial<typeof hotels.$inferInsert>).where(eq(hotels.id, id)).returning())[0];
    case "inclusionTemplates": return (await db.update(inclusionTemplates).set(data as Partial<typeof inclusionTemplates.$inferInsert>).where(eq(inclusionTemplates.id, id)).returning())[0];
    case "exclusionTemplates": return (await db.update(exclusionTemplates).set(data as Partial<typeof exclusionTemplates.$inferInsert>).where(eq(exclusionTemplates.id, id)).returning())[0];
    case "companySettings": return (await db.update(companySettings).set(data as Partial<typeof companySettings.$inferInsert>).where(eq(companySettings.id, id)).returning())[0];
    case "templateSettings": return (await db.update(templateSettings).set(data as Partial<typeof templateSettings.$inferInsert>).where(eq(templateSettings.id, id)).returning())[0];
  }
}

export async function deleteEntity(entity: EntityName, id: number) {
  switch (entity) {
    case "currencies": await db.delete(currencies).where(eq(currencies.id, id)); break;
    case "places": await db.delete(places).where(eq(places.id, id)); break;
    case "roomTypes": await db.delete(roomTypes).where(eq(roomTypes.id, id)); break;
    case "vehicles": await db.delete(vehicles).where(eq(vehicles.id, id)); break;
    case "transportRules": await db.delete(transportRules).where(eq(transportRules.id, id)); break;
    case "hotels": await db.delete(hotels).where(eq(hotels.id, id)); break;
    case "inclusionTemplates": await db.delete(inclusionTemplates).where(eq(inclusionTemplates.id, id)); break;
    case "exclusionTemplates": await db.delete(exclusionTemplates).where(eq(exclusionTemplates.id, id)); break;
    case "companySettings": await db.delete(companySettings).where(eq(companySettings.id, id)); break;
    case "templateSettings": await db.delete(templateSettings).where(eq(templateSettings.id, id)); break;
  }
}
