"use client";

import { useState } from "react";
import { useQuotationStore } from "@/store/quotation-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

export function PlacesStep() {
  const { draft, setStayingLocations, config } = useQuotationStore();
  const [location, setLocation] = useState("");
  const [nights, setNights] = useState(1);

  const addPlace = () => {
    if (location) {
      setStayingLocations([...draft.stayingLocations, { location, nights }]);
      setLocation("");
      setNights(1);
    }
  };

  const removePlace = (index: number) => {
    setStayingLocations(draft.stayingLocations.filter((_, i) => i !== index));
  };

  const totalNights = draft.stayingLocations.reduce((s, l) => s + l.nights, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tour Places</CardTitle>
        <p className="text-sm text-stone-500">
          Places included in the tour and where guests stay overnight
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2 space-y-1">
            <Label>Place</Label>
            <Select value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="">Select place...</option>
              {config?.places.map((p) => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Nights</Label>
            <Input
              type="number"
              min={1}
              value={nights}
              onChange={(e) => setNights(Number(e.target.value) || 1)}
            />
          </div>
        </div>
        <Button type="button" onClick={addPlace} disabled={!location}>
          Add place
        </Button>
        <ul className="space-y-2">
          {draft.stayingLocations.map((loc, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-2xl bg-orange-50/70 px-4 py-3"
            >
              <span>
                {loc.location} — {loc.nights} night{loc.nights !== 1 ? "s" : ""}
              </span>
              <button
                type="button"
                onClick={() => removePlace(i)}
                className="text-stone-400 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
          {draft.stayingLocations.length === 0 && (
            <p className="text-sm text-stone-400">No places added yet.</p>
          )}
        </ul>
        {totalNights !== draft.nights && draft.stayingLocations.length > 0 && (
          <p className="text-sm text-amber-600">
            Total nights across places ({totalNights}) differs from trip nights ({draft.nights}).
          </p>
        )}
      </CardContent>
    </Card>
  );
}
