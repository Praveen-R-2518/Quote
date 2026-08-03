"use client";

import { useEffect } from "react";
import { useQuotationStore } from "@/store/quotation-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getHotelsForLocation } from "@/lib/hotel-suggest";

export function HotelsPanel() {
  const { draft, config, setHotels, applyHotelSuggestions } = useQuotationStore();

  useEffect(() => {
    if (draft.hotels.length === 0 && draft.stayingLocations.length > 0 && config) {
      applyHotelSuggestions();
    }
  }, [config, draft.stayingLocations.length]);

  const updateHotel = (index: number, hotelId: number) => {
    const hotel = config?.hotels.find((h) => h.id === hotelId);
    const updated = draft.hotels.map((h, i) =>
      i === index ? { ...h, hotelId, hotelName: hotel?.name ?? "" } : h
    );
    setHotels(updated);
  };

  if (draft.stayingLocations.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Hotels</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-gray-500">Add tour places first to assign hotels.</p></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hotels</CardTitle>
        <p className="text-sm text-gray-500">Select hotels for each tour place</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button type="button" variant="outline" onClick={applyHotelSuggestions}>Apply Suggestions</Button>
        {draft.hotels.map((h, i) => {
          const options = getHotelsForLocation(h.location, config?.hotels ?? []);
          return (
            <div key={i} className="space-y-1 rounded-md bg-gray-50 p-3">
              <Label>{h.location} ({h.nights} nights)</Label>
              <Select value={h.hotelId ?? ""} onChange={(e) => updateHotel(i, Number(e.target.value))}>
                <option value="">Select hotel...</option>
                {options.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.name}</option>
                ))}
              </Select>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
