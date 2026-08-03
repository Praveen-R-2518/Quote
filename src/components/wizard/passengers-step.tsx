"use client";

import { useQuotationStore } from "@/store/quotation-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { totalPassengers, guestsNeedingBeds, payingPassengers, travellersNeedingTransport } from "@/lib/quotation-schema";
import { Checkbox } from "@/components/ui/checkbox";

export function PassengersStep() {
  const { draft, setPassengers } = useQuotationStore();
  const p = draft.passengers;

  const update = (field: keyof typeof p, value: number) => {
    setPassengers({ ...p, [field]: Math.max(0, value) });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Passengers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {(["adults", "children", "infants", "focs"] as const).map((field) => (
            <div key={field} className="space-y-2">
              <Label htmlFor={field} className="capitalize">{field === "focs" ? "FOCs" : field}</Label>
              <Input
                id={field}
                type="number"
                min={0}
                value={p[field]}
                onChange={(e) => update(field, Number(e.target.value) || 0)}
              />
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={p.focRequiresAccommodation} onChange={(e) => setPassengers({ ...p, focRequiresAccommodation: e.target.checked })} />
            FOCs require accommodation
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={p.focRequiresTransport} onChange={(e) => setPassengers({ ...p, focRequiresTransport: e.target.checked })} />
            FOCs require transport
          </label>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Paying passengers: {payingPassengers(p)} | Total travellers: {totalPassengers(p)} | Beds needed: {guestsNeedingBeds(p)} | Transport seats: {travellersNeedingTransport(p)}
        </div>
      </CardContent>
    </Card>
  );
}
