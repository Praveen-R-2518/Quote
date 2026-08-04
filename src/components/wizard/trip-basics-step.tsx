"use client";

import { useQuotationStore } from "@/store/quotation-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert } from "@/components/ui/alert";
import {
  durationMismatch,
  guestsNeedingBeds,
  payingPassengers,
  totalPassengers,
  travellersNeedingTransport,
  TOUR_TYPES,
  TOUR_TYPE_LABELS,
  type TourType,
} from "@/lib/quotation-schema";

export function TripBasicsStep() {
  const { draft, config, setCustomerName, setTourType, setDuration, setPassengers, setPricing } = useQuotationStore();
  const requireCustomerName = config?.template?.requireCustomerName ?? false;
  const mismatch = durationMismatch(draft.nights, draft.days);
  const p = draft.passengers;

  const updatePassenger = (field: keyof typeof p, value: number) => {
    setPassengers({ ...p, [field]: Math.max(0, value) });
  };

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Customer & Duration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">
              Customer Name {requireCustomerName && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="customerName"
              value={draft.customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer or group name"
              required={requireCustomerName}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tourType">Tour type</Label>
            <Select
              id="tourType"
              value={draft.tourType}
              onChange={(e) => setTourType(e.target.value as TourType)}
            >
              {TOUR_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type} — {TOUR_TYPE_LABELS[type]}
                </option>
              ))}
            </Select>
            <p className="text-xs text-stone-500">
              Full Board (FB) automatically includes all standard and optional inclusions in the quotation.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nights">Nights</Label>
              <Input
                id="nights"
                type="number"
                min={1}
                value={draft.nights}
                onChange={(e) => setDuration(Number(e.target.value) || 1, draft.days)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="days">Days</Label>
              <Input
                id="days"
                type="number"
                min={1}
                value={draft.days}
                onChange={(e) => setDuration(draft.nights, Number(e.target.value) || 1)}
              />
            </div>
          </div>
          {mismatch && (
            <Alert variant="warning">
              Days should typically be nights + 1 (e.g., 3 nights = 4 days). Current: {draft.nights} nights / {draft.days} days.
            </Alert>
          )}
        </CardContent>
      </Card>

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
                  onChange={(e) => updatePassenger(field, Number(e.target.value) || 0)}
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
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 rounded-2xl bg-orange-50/70 px-4 py-3 text-sm text-stone-600 sm:flex sm:flex-wrap sm:gap-x-7 sm:gap-y-3">
            <span>Paying: {payingPassengers(p)}</span>
            <span>Total: {totalPassengers(p)}</span>
            <span>Beds: {guestsNeedingBeds(p)}</span>
            <span>Transport: {travellersNeedingTransport(p)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Currency & Price</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              id="currency"
              value={draft.currencyCode}
              onChange={(e) => setPricing(e.target.value, draft.pricePerPerson)}
            >
              {config?.currencies.map((c) => (
                <option key={c.id} value={c.code}>{c.code} ({c.symbol})</option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price Per Person</Label>
            <Input
              id="price"
              type="number"
              min={0}
              step="0.01"
              value={draft.pricePerPerson}
              onChange={(e) => setPricing(draft.currencyCode, Number(e.target.value) || 0)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
