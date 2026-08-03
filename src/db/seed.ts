import { db } from "./index";
import {
  companySettings, templateSettings, currencies, places, roomTypes,
  vehicles, transportRules, hotels, inclusionTemplates, exclusionTemplates,
} from "./schema";

async function seed() {
  console.log("Seeding database...");

  await db.delete(transportRules);
  await db.delete(hotels);
  await db.delete(inclusionTemplates);
  await db.delete(exclusionTemplates);
  await db.delete(vehicles);
  await db.delete(roomTypes);
  await db.delete(places);
  await db.delete(currencies);
  await db.delete(templateSettings);
  await db.delete(companySettings);

  await db.insert(companySettings).values({
    id: 1,
    name: "Pumpkin Tours & Travels",
    address: "NO.03 Glencloch, Katukitula.",
    phone: "+94764292094",
    email: "info@pumpkintours.com",
    termsAndConditions: "Rates are subject to availability. Quotation valid for 30 days from issue date.",
  });

  await db.insert(templateSettings).values({
    id: 1,
    requireCustomerName: true,
    quotationTitle: "TOUR QUOTA",
  });

  await db.insert(currencies).values([
    { id: 1, code: "INR", symbol: "₹", locale: "en-IN", sortOrder: 1 },
    { id: 2, code: "USD", symbol: "$", locale: "en-US", sortOrder: 2 },
    { id: 3, code: "LKR", symbol: "Rs.", locale: "en-LK", sortOrder: 3 },
    { id: 4, code: "EUR", symbol: "EUR", locale: "de-DE", sortOrder: 4 },
    { id: 5, code: "GBP", symbol: "GBP", locale: "en-GB", sortOrder: 5 },
  ]);

  const placeNames = [
    "Colombo", "Kandy", "Sigiriya", "Dambulla", "Anuradhapura",
    "Polonnaruwa", "Nuwara Eliya", "Ella", "Yala", "Galle",
    "Mirissa", "Trincomalee", "Negombo", "Bentota", "Hikkaduwa",
    "Maravila", "Katukitula",
  ];
  await db.insert(places).values(placeNames.map((name, i) => ({ id: i + 1, name, sortOrder: i + 1 })));

  await db.insert(roomTypes).values([
    { id: 1, name: "Single", capacity: 1, sortOrder: 1 },
    { id: 2, name: "Double", capacity: 2, sortOrder: 2 },
    { id: 3, name: "Triple", capacity: 3, sortOrder: 3 },
    { id: 4, name: "Family Suite", capacity: 4, sortOrder: 4 },
  ]);

  await db.insert(vehicles).values([
    { id: 1, name: "Car (Sedan)", capacity: 3, sortOrder: 1 },
    { id: 2, name: "Van", capacity: 7, sortOrder: 2 },
    { id: 3, name: "Mini Coach", capacity: 15, sortOrder: 3 },
    { id: 4, name: "Coach", capacity: 30, sortOrder: 4 },
  ]);

  await db.insert(transportRules).values([
    { id: 1, minPassengers: 1, maxPassengers: 3, vehicleId: 1, sortOrder: 1 },
    { id: 2, minPassengers: 4, maxPassengers: 7, vehicleId: 2, sortOrder: 2 },
    { id: 3, minPassengers: 8, maxPassengers: 15, vehicleId: 3, sortOrder: 3 },
    { id: 4, minPassengers: 16, maxPassengers: 30, vehicleId: 4, sortOrder: 4 },
  ]);

  await db.insert(hotels).values([
    { id: 1, name: "Pelwehera Village", locations: "Sigiriya,Dambulla", sortOrder: 1 },
    { id: 2, name: "Anantamaa Resort", locations: "Trincomalee", sortOrder: 2 },
    { id: 3, name: "Club Palm Maravila", locations: "Maravila", sortOrder: 3 },
    { id: 4, name: "Cinnamon Grand Colombo", locations: "Colombo", sortOrder: 4 },
    { id: 5, name: "Earl's Regency Kandy", locations: "Kandy", sortOrder: 5 },
    { id: 6, name: "Jetwing Vil Uyana", locations: "Sigiriya,Dambulla", sortOrder: 6 },
    { id: 7, name: "Grand Hotel Nuwara Eliya", locations: "Nuwara Eliya", sortOrder: 7 },
    { id: 8, name: "Jetwing Lighthouse Galle", locations: "Galle", sortOrder: 8 },
  ]);

  await db.insert(inclusionTemplates).values([
    { id: 1, text: "Hanuman temple tuktuk charges", sortOrder: 1, isDefault: true },
    { id: 2, text: "Spice garden entry ticket", sortOrder: 2, isDefault: true },
    { id: 3, text: "Tea factory entry tickets", sortOrder: 3, isDefault: true },
    { id: 4, text: "Gem factory entry ticket", sortOrder: 4, isDefault: true },
    { id: 5, text: "Accommodation on bed & breakfast basis", sortOrder: 5, isDefault: false },
    { id: 6, text: "Private air-conditioned transport with English-speaking chauffeur guide", sortOrder: 6, isDefault: false },
  ]);

  await db.insert(exclusionTemplates).values([
    { id: 1, text: "International airfare", sortOrder: 1, isDefault: true },
    { id: 2, text: "Visa fees", sortOrder: 2, isDefault: true },
    { id: 3, text: "Personal expenses and tips", sortOrder: 3, isDefault: true },
    { id: 4, text: "Lunch and dinner unless specified", sortOrder: 4, isDefault: true },
    { id: 5, text: "Camera and video permits at sites", sortOrder: 5, isDefault: false },
  ]);

  console.log("Seed completed successfully.");
}

seed().catch((e) => { console.error(e); process.exit(1); });
