"use client";

import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type {
  QuotationDraft,
  WizardStep,
  Passengers,
  StayingLocation,
  RoomAllocationItem,
  TransportItem,
  HotelSelection,
  TourPlanRow,
  Meals,
} from "@/lib/quotation-schema";
import {
  WIZARD_STEPS,
  guestsNeedingBeds,
  travellersNeedingTransport,
  generateTourPlanRows,
  defaultQuotationDate,
  defaultExpirationDate,
  defaultMealsForDuration,
  formatPackageDescription,
} from "@/lib/quotation-schema";
import { saveDraft, loadDraft, clearDraft } from "@/lib/draft-storage";
import type { AppConfig } from "@/lib/config-service";
import { suggestRoomAllocation } from "@/lib/room-allocation";
import { recommendTransport } from "@/lib/transport-recommend";
import { suggestHotelsForLocations } from "@/lib/hotel-suggest";

function createEmptyDraft(): QuotationDraft {
  const now = new Date().toISOString();
  const nights = 3;
  const days = 4;
  const meals = defaultMealsForDuration(nights);
  return {
    id: uuidv4(),
    customerName: "",
    nights,
    days,
    stayingLocations: [],
    passengers: {
      adults: 2,
      children: 0,
      infants: 0,
      focs: 0,
      focRequiresAccommodation: true,
      focRequiresTransport: true,
    },
    currencyCode: "INR",
    pricePerPerson: 0,
    roomAllocations: [],
    transport: [],
    hotels: [],
    tourPlan: [],
    quotationDate: defaultQuotationDate(),
    expirationDate: defaultExpirationDate(),
    meals,
    packageDescription: formatPackageDescription(nights, days, meals),
    defaultRoomCategory: "DELUXE",
    inclusions: [],
    exclusions: [],
    createdAt: now,
    updatedAt: now,
  };
}

function withUpdatedPackageDescription(draft: QuotationDraft): QuotationDraft {
  return {
    ...draft,
    packageDescription: formatPackageDescription(draft.nights, draft.days, draft.meals),
  };
}

function withTourPlanRegenerated(draft: QuotationDraft): QuotationDraft {
  return { ...draft, tourPlan: generateTourPlanRows(draft) };
}

interface QuotationState {
  draft: QuotationDraft;
  currentStep: WizardStep;
  config: AppConfig | null;
  setConfig: (config: AppConfig) => void;
  setStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setCustomerName: (name: string) => void;
  setDuration: (nights: number, days: number) => void;
  setStayingLocations: (locations: StayingLocation[]) => void;
  setPassengers: (passengers: Passengers) => void;
  setPricing: (currencyCode: string, pricePerPerson: number) => void;
  setRoomAllocations: (allocations: RoomAllocationItem[]) => void;
  applyRoomSuggestion: () => void;
  setTransport: (transport: TransportItem[]) => void;
  applyTransportSuggestion: () => void;
  setHotels: (hotels: HotelSelection[]) => void;
  applyHotelSuggestions: () => void;
  setTourPlan: (rows: TourPlanRow[]) => void;
  regenerateTourPlan: () => void;
  setQuotationDate: (date: string) => void;
  setExpirationDate: (date: string) => void;
  setMeals: (meals: Meals) => void;
  setDefaultRoomCategory: (category: string) => void;
  setInclusions: (items: string[]) => void;
  setExclusions: (items: string[]) => void;
  applyDefaultInclusionsExclusions: () => void;
  persistDraft: () => void;
  loadFromStorage: () => void;
  resetDraft: () => void;
  updateDraft: (partial: Partial<QuotationDraft>) => void;
}

function stepIndex(step: WizardStep): number {
  return WIZARD_STEPS.indexOf(step);
}

function normalizeLoadedDraft(stored: QuotationDraft & { tourPlaces?: string[] }): QuotationDraft {
  let stayingLocations = stored.stayingLocations ?? [];
  if (stayingLocations.length === 0 && stored.tourPlaces?.length) {
    stayingLocations = stored.tourPlaces.map((location) => ({ location, nights: 1 }));
  }

  const meals = stored.meals ?? defaultMealsForDuration(stored.nights ?? 3);

  const merged: QuotationDraft = withUpdatedPackageDescription({
    ...createEmptyDraft(),
    ...stored,
    stayingLocations,
    meals,
    passengers: {
      ...createEmptyDraft().passengers,
      ...stored.passengers,
    },
    quotationDate: stored.quotationDate || defaultQuotationDate(),
    expirationDate: stored.expirationDate || defaultExpirationDate(),
    defaultRoomCategory: stored.defaultRoomCategory ?? "DELUXE",
    tourPlan: stored.tourPlan ?? [],
  });
  return withTourPlanRegenerated(merged);
}

export const useQuotationStore = create<QuotationState>((set, get) => ({
  draft: createEmptyDraft(),
  currentStep: "tripBasics",
  config: null,

  setConfig: (config) => set({ config }),

  setStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const idx = stepIndex(get().currentStep);
    if (idx < WIZARD_STEPS.length - 1) {
      set({ currentStep: WIZARD_STEPS[idx + 1] });
      get().persistDraft();
    }
  },

  prevStep: () => {
    const idx = stepIndex(get().currentStep);
    if (idx > 0) set({ currentStep: WIZARD_STEPS[idx - 1] });
  },

  setCustomerName: (name) => {
    set((s) => ({ draft: { ...s.draft, customerName: name, updatedAt: new Date().toISOString() } }));
  },

  setDuration: (nights, days) => {
    set((s) => {
      const meals = defaultMealsForDuration(nights);
      const draft = withTourPlanRegenerated(
        withUpdatedPackageDescription({
          ...s.draft,
          nights,
          days,
          meals,
          updatedAt: new Date().toISOString(),
        })
      );
      return { draft };
    });
  },

  setStayingLocations: (locations) => {
    set((s) => {
      const draft = withTourPlanRegenerated({ ...s.draft, stayingLocations: locations, updatedAt: new Date().toISOString() });
      return { draft };
    });
  },

  setPassengers: (passengers) => {
    set((s) => ({ draft: { ...s.draft, passengers, updatedAt: new Date().toISOString() } }));
  },

  setPricing: (currencyCode, pricePerPerson) => {
    set((s) => ({ draft: { ...s.draft, currencyCode, pricePerPerson, updatedAt: new Date().toISOString() } }));
  },

  setRoomAllocations: (allocations) => {
    set((s) => ({ draft: { ...s.draft, roomAllocations: allocations, updatedAt: new Date().toISOString() } }));
  },

  applyRoomSuggestion: () => {
    const { draft, config } = get();
    if (!config) return;
    const guests = guestsNeedingBeds(draft.passengers);
    const suggestion = suggestRoomAllocation(guests, config.roomTypes);
    get().setRoomAllocations(suggestion);
  },

  setTransport: (transport) => {
    set((s) => ({ draft: { ...s.draft, transport, updatedAt: new Date().toISOString() } }));
  },

  applyTransportSuggestion: () => {
    const { draft, config } = get();
    if (!config) return;
    const total = travellersNeedingTransport(draft.passengers);
    const suggestion = recommendTransport(total, config.vehicles, config.transportRules);
    get().setTransport(suggestion);
  },

  setHotels: (hotels) => {
    set((s) => {
      const draft = withTourPlanRegenerated({ ...s.draft, hotels, updatedAt: new Date().toISOString() });
      return { draft };
    });
  },

  applyHotelSuggestions: () => {
    const { draft, config } = get();
    if (!config) return;
    const suggestion = suggestHotelsForLocations(draft.stayingLocations, config.hotels);
    get().setHotels(suggestion);
  },

  setTourPlan: (rows) => {
    set((s) => ({ draft: { ...s.draft, tourPlan: rows, updatedAt: new Date().toISOString() } }));
  },

  regenerateTourPlan: () => {
    set((s) => ({
      draft: withTourPlanRegenerated({ ...s.draft, updatedAt: new Date().toISOString() }),
    }));
  },

  setQuotationDate: (date) => {
    set((s) => ({ draft: { ...s.draft, quotationDate: date, updatedAt: new Date().toISOString() } }));
  },

  setExpirationDate: (date) => {
    set((s) => ({ draft: { ...s.draft, expirationDate: date, updatedAt: new Date().toISOString() } }));
  },

  setMeals: (meals) => {
    set((s) => ({
      draft: withUpdatedPackageDescription({
        ...s.draft,
        meals,
        updatedAt: new Date().toISOString(),
      }),
    }));
  },

  setDefaultRoomCategory: (category) => {
    set((s) => {
      const draft = withTourPlanRegenerated({ ...s.draft, defaultRoomCategory: category, updatedAt: new Date().toISOString() });
      return { draft };
    });
  },

  setInclusions: (items) => {
    set((s) => ({ draft: { ...s.draft, inclusions: items, updatedAt: new Date().toISOString() } }));
  },

  setExclusions: (items) => {
    set((s) => ({ draft: { ...s.draft, exclusions: items, updatedAt: new Date().toISOString() } }));
  },

  applyDefaultInclusionsExclusions: () => {
    const { config } = get();
    if (!config) return;
    get().setInclusions(config.inclusionTemplates.filter((t) => t.isDefault).map((t) => t.text));
    get().setExclusions(config.exclusionTemplates.filter((t) => t.isDefault).map((t) => t.text));
  },

  persistDraft: () => {
    saveDraft(get().draft);
  },

  loadFromStorage: () => {
    const stored = loadDraft();
    if (stored) set({ draft: normalizeLoadedDraft(stored) });
  },

  resetDraft: () => {
    clearDraft();
    set({ draft: createEmptyDraft(), currentStep: "tripBasics" });
  },

  updateDraft: (partial) => {
    set((s) => {
      const draft = withTourPlanRegenerated({ ...s.draft, ...partial, updatedAt: new Date().toISOString() });
      return { draft };
    });
  },
}));
