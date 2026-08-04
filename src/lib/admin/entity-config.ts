import {
  BedDouble,
  Bus,
  Building2,
  Coins,
  Landmark,
  ListChecks,
  ListX,
  type LucideIcon,
  MapPin,
  Route,
  Settings2,
} from "lucide-react";
import type { EntityName } from "@/lib/config-service";

export type AdminFieldType = "text" | "textarea" | "number" | "select" | "boolean";

export interface AdminFieldConfig {
  key: string;
  label: string;
  type: AdminFieldType;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  defaultValue?: string | number | boolean;
  /** For type "select": entity key whose items become the option list. */
  optionsFrom?: EntityName;
  /** Property on the referenced item to use as the visible label. Defaults to "name". */
  optionLabelKey?: string;
  /** Custom [true, false] labels for boolean fields, e.g. ["Default", "Optional"]. */
  booleanLabels?: [string, string];
  /** Show this field as a table column. */
  showInTable?: boolean;
}

export type AdminGroupKey = "operations" | "templates" | "settings";

export interface AdminEntityConfig {
  key: EntityName;
  label: string;
  singular: string;
  description: string;
  group: AdminGroupKey;
  icon: LucideIcon;
  /** Settings-style single-record entity, rendered as a form instead of a table. */
  singleton?: boolean;
  fields: AdminFieldConfig[];
  searchKeys?: string[];
}

export const ADMIN_GROUPS: { key: AdminGroupKey; label: string }[] = [
  { key: "operations", label: "Operations" },
  { key: "templates", label: "Templates" },
  { key: "settings", label: "Settings" },
];

export const ADMIN_ENTITIES: AdminEntityConfig[] = [
  {
    key: "places",
    label: "Places",
    singular: "Place",
    description: "Destinations travellers can stay in — used across itineraries and hotels.",
    group: "operations",
    icon: MapPin,
    searchKeys: ["name"],
    fields: [
      { key: "name", label: "Name", type: "text", required: true, placeholder: "e.g. Sigiriya", showInTable: true },
      { key: "sortOrder", label: "Sort order", type: "number", defaultValue: 0, helperText: "Lower numbers appear first.", showInTable: true },
    ],
  },
  {
    key: "hotels",
    label: "Hotels",
    singular: "Hotel",
    description: "Hotels available for room and itinerary allocation.",
    group: "operations",
    icon: Building2,
    searchKeys: ["name", "locations"],
    fields: [
      { key: "name", label: "Name", type: "text", required: true, placeholder: "e.g. Cinnamon Lodge", showInTable: true },
      { key: "locations", label: "Locations", type: "text", required: true, placeholder: "e.g. Sigiriya, Dambulla", helperText: "Comma-separated list of places this hotel serves.", showInTable: true },
      { key: "sortOrder", label: "Sort order", type: "number", defaultValue: 0, showInTable: true },
    ],
  },
  {
    key: "roomTypes",
    label: "Room Types",
    singular: "Room Type",
    description: "Room categories and their guest capacity, used for automatic allocation.",
    group: "operations",
    icon: BedDouble,
    searchKeys: ["name"],
    fields: [
      { key: "name", label: "Name", type: "text", required: true, placeholder: "e.g. Deluxe Double", showInTable: true },
      { key: "capacity", label: "Capacity", type: "number", required: true, defaultValue: 2, helperText: "Maximum guests per room.", showInTable: true },
      { key: "sortOrder", label: "Sort order", type: "number", defaultValue: 0, showInTable: true },
    ],
  },
  {
    key: "vehicles",
    label: "Vehicles",
    singular: "Vehicle",
    description: "Transport vehicles and seating capacity for trip planning.",
    group: "operations",
    icon: Bus,
    searchKeys: ["name"],
    fields: [
      { key: "name", label: "Name", type: "text", required: true, placeholder: "e.g. Toyota KDH Van", showInTable: true },
      { key: "capacity", label: "Capacity", type: "number", required: true, defaultValue: 4, helperText: "Maximum seats.", showInTable: true },
      { key: "sortOrder", label: "Sort order", type: "number", defaultValue: 0, showInTable: true },
    ],
  },
  {
    key: "transportRules",
    label: "Transport Rules",
    singular: "Transport Rule",
    description: "Passenger-count ranges mapped to the recommended vehicle.",
    group: "operations",
    icon: Route,
    fields: [
      { key: "minPassengers", label: "Min passengers", type: "number", required: true, defaultValue: 1, showInTable: true },
      { key: "maxPassengers", label: "Max passengers", type: "number", required: true, defaultValue: 4, showInTable: true },
      { key: "vehicleId", label: "Recommended vehicle", type: "select", required: true, optionsFrom: "vehicles", showInTable: true },
      { key: "sortOrder", label: "Sort order", type: "number", defaultValue: 0, showInTable: true },
    ],
  },
  {
    key: "currencies",
    label: "Currencies",
    singular: "Currency",
    description: "Currencies available when pricing a quotation.",
    group: "operations",
    icon: Coins,
    searchKeys: ["code", "symbol"],
    fields: [
      { key: "code", label: "Code", type: "text", required: true, placeholder: "e.g. USD", showInTable: true },
      { key: "symbol", label: "Symbol", type: "text", required: true, placeholder: "e.g. $", showInTable: true },
      { key: "locale", label: "Locale", type: "text", defaultValue: "en-US", placeholder: "e.g. en-US", showInTable: true },
      { key: "sortOrder", label: "Sort order", type: "number", defaultValue: 0, showInTable: true },
    ],
  },
  {
    key: "inclusionTemplates",
    label: "Inclusion Templates",
    singular: "Inclusion",
    description: "Reusable line items offered as standard inclusions on a quotation.",
    group: "templates",
    icon: ListChecks,
    searchKeys: ["text"],
    fields: [
      { key: "text", label: "Inclusion text", type: "textarea", required: true, placeholder: "e.g. Daily breakfast at hotel", showInTable: true },
      { key: "isDefault", label: "Include by default", type: "boolean", defaultValue: true, booleanLabels: ["Default", "Optional"], helperText: "Default inclusions are pre-selected on every new quotation.", showInTable: true },
      { key: "sortOrder", label: "Sort order", type: "number", defaultValue: 0, showInTable: true },
    ],
  },
  {
    key: "exclusionTemplates",
    label: "Exclusion Templates",
    singular: "Exclusion",
    description: "Reusable line items offered as standard exclusions on a quotation.",
    group: "templates",
    icon: ListX,
    searchKeys: ["text"],
    fields: [
      { key: "text", label: "Exclusion text", type: "textarea", required: true, placeholder: "e.g. International airfare", showInTable: true },
      { key: "isDefault", label: "Include by default", type: "boolean", defaultValue: true, booleanLabels: ["Default", "Optional"], helperText: "Default exclusions are pre-selected on every new quotation.", showInTable: true },
      { key: "sortOrder", label: "Sort order", type: "number", defaultValue: 0, showInTable: true },
    ],
  },
  {
    key: "companySettings",
    label: "Company Details",
    singular: "Company Details",
    description: "Business information used to brand every quotation document.",
    group: "settings",
    icon: Landmark,
    singleton: true,
    fields: [
      { key: "name", label: "Company name", type: "text", required: true, placeholder: "e.g. Pumpkin Tours & Travels" },
      { key: "address", label: "Address", type: "textarea", placeholder: "Street, city, country" },
      { key: "phone", label: "Phone", type: "text", placeholder: "+94 71 234 5678" },
      { key: "email", label: "Email", type: "text", placeholder: "hello@pumpkintours.com" },
      { key: "logoPath", label: "Logo path", type: "text", placeholder: "/brand/pumpkin-logo.png", helperText: "Relative path under /public used for branding on exports." },
      { key: "termsAndConditions", label: "Terms & conditions", type: "textarea", placeholder: "Printed on every exported quotation." },
    ],
  },
  {
    key: "templateSettings",
    label: "Quotation Defaults",
    singular: "Quotation Defaults",
    description: "Default behaviour applied to every new quotation.",
    group: "settings",
    icon: Settings2,
    singleton: true,
    fields: [
      { key: "quotationTitle", label: "Quotation title", type: "text", required: true, placeholder: "e.g. Travel Quotation" },
      { key: "requireCustomerName", label: "Require customer name", type: "boolean", defaultValue: false, helperText: "Block quotation creation until a customer name is entered." },
    ],
  },
];

export function getEntityConfig(key: string): AdminEntityConfig | undefined {
  return ADMIN_ENTITIES.find((e) => e.key === key);
}

export function getTableColumns(entity: AdminEntityConfig): AdminFieldConfig[] {
  return entity.fields.filter((f) => f.showInTable);
}

type RefData = Record<string, Record<string, unknown>[]>;

export function formatCellValue(
  field: AdminFieldConfig,
  value: unknown,
  refData: RefData
): { text: string; muted: boolean } {
  if (field.type === "boolean") {
    const [t, f] = field.booleanLabels ?? ["Yes", "No"];
    return { text: value ? t : f, muted: false };
  }
  if (field.type === "select" && field.optionsFrom) {
    const list = refData[field.optionsFrom] ?? [];
    const labelKey = field.optionLabelKey ?? "name";
    const match = list.find((r) => Number(r.id) === Number(value));
    return match ? { text: String(match[labelKey]), muted: false } : { text: `#${String(value)}`, muted: true };
  }
  if (value === "" || value === null || value === undefined) {
    return { text: "—", muted: true };
  }
  return { text: String(value), muted: false };
}
