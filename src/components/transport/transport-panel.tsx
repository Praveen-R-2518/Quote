"use client";

import { useEffect } from "react";
import { useQuotationStore } from "@/store/quotation-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { totalPassengers } from "@/lib/quotation-schema";
import { totalTransportCapacity } from "@/lib/transport-recommend";
import { Plus, Trash2 } from "lucide-react";

export function TransportPanel() {
  const { draft, config, setTransport, applyTransportSuggestion } = useQuotationStore();
  const total = totalPassengers(draft.passengers);
  const capacity = totalTransportCapacity(draft.transport);

  useEffect(() => {
    if (draft.transport.length === 0 && config) {
      applyTransportSuggestion();
    }
  }, [config]);

  const addVehicle = () => {
    const first = config?.vehicles[0];
    if (!first) return;
    setTransport([...draft.transport, { vehicleId: first.id, vehicleName: first.name, count: 1, capacity: first.capacity }]);
  };

  const removeVehicle = (index: number) => {
    setTransport(draft.transport.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, vehicleId: number, count: number) => {
    const vehicle = config?.vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) return;
    const updated = draft.transport.map((t, i) =>
      i === index ? { vehicleId: vehicle.id, vehicleName: vehicle.name, count: Math.max(1, count), capacity: vehicle.capacity } : t
    );
    setTransport(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transport</CardTitle>
        <p className="text-sm text-stone-500">Total passengers: {total}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" className="flex-1 sm:flex-none" onClick={applyTransportSuggestion}>Apply Suggestion</Button>
          <Button type="button" variant="outline" className="flex-1 sm:flex-none" onClick={addVehicle}><Plus className="mr-1 h-4 w-4" />Add Vehicle</Button>
        </div>
        {draft.transport.map((t, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-2xl bg-orange-50/70 p-3 sm:flex-row sm:items-center sm:gap-3">
            <select
              className="w-full flex-1 rounded-2xl border border-orange-100 bg-white/80 px-3 py-2 text-sm outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200/70"
              value={t.vehicleId}
              onChange={(e) => updateItem(i, Number(e.target.value), t.count)}
            >
              {config?.vehicles.map((v) => (
                <option key={v.id} value={v.id}>{v.name} (cap. {v.capacity})</option>
              ))}
            </select>
            <Input type="number" min={1} className="w-full sm:w-20" value={t.count} onChange={(e) => updateItem(i, t.vehicleId, Number(e.target.value) || 1)} />
            <button type="button" onClick={() => removeVehicle(i)} className="self-end text-stone-400 hover:text-red-500 sm:self-auto"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        <div className="text-sm text-stone-600">Total transport capacity: {capacity}</div>
        {capacity < total && draft.transport.length > 0 && (
          <Alert variant="warning">Transport capacity ({capacity}) is less than total passengers ({total}).</Alert>
        )}
      </CardContent>
    </Card>
  );
}
