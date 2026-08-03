import type { HotelSelection } from "./quotation-schema";

export interface Hotel {
  id: number;
  name: string;
  locations: string;
}

export function parseHotelLocations(locations: string): string[] {
  return locations.split(",").map((l) => l.trim()).filter(Boolean);
}

export function suggestHotelsForLocations(
  stayingLocations: { location: string; nights: number }[],
  hotels: Hotel[]
): HotelSelection[] {
  return stayingLocations.map(({ location, nights }) => {
    const matching = hotels.filter((h) =>
      parseHotelLocations(h.locations).some(
        (loc) => loc.toLowerCase() === location.toLowerCase()
      )
    );
    const best = matching[0];
    return {
      location,
      hotelId: best?.id ?? null,
      hotelName: best?.name ?? "",
      nights,
    };
  });
}

export function getHotelsForLocation(location: string, hotels: Hotel[]): Hotel[] {
  return hotels.filter((h) =>
    parseHotelLocations(h.locations).some(
      (loc) => loc.toLowerCase() === location.toLowerCase()
    )
  );
}
