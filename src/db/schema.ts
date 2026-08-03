import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const companySettings = sqliteTable("company_settings", {
  id: integer("id").primaryKey(),
  name: text("name").notNull().default("Your Travel Company"),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  logoPath: text("logo_path"),
  termsAndConditions: text("terms_and_conditions"),
});

export const templateSettings = sqliteTable("template_settings", {
  id: integer("id").primaryKey(),
  requireCustomerName: integer("require_customer_name", { mode: "boolean" }).notNull().default(false),
  quotationTitle: text("quotation_title").notNull().default("Travel Quotation"),
});

export const currencies = sqliteTable("currencies", {
  id: integer("id").primaryKey(),
  code: text("code").notNull().unique(),
  symbol: text("symbol").notNull(),
  locale: text("locale").notNull().default("en-US"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const places = sqliteTable("places", {
  id: integer("id").primaryKey(),
  name: text("name").notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const roomTypes = sqliteTable("room_types", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  capacity: integer("capacity").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const vehicles = sqliteTable("vehicles", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  capacity: integer("capacity").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const transportRules = sqliteTable("transport_rules", {
  id: integer("id").primaryKey(),
  minPassengers: integer("min_passengers").notNull(),
  maxPassengers: integer("max_passengers").notNull(),
  vehicleId: integer("vehicle_id").notNull().references(() => vehicles.id),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const hotels = sqliteTable("hotels", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  locations: text("locations").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const inclusionTemplates = sqliteTable("inclusion_templates", {
  id: integer("id").primaryKey(),
  text: text("text").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isDefault: integer("is_default", { mode: "boolean" }).notNull().default(true),
});

export const exclusionTemplates = sqliteTable("exclusion_templates", {
  id: integer("id").primaryKey(),
  text: text("text").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isDefault: integer("is_default", { mode: "boolean" }).notNull().default(true),
});
