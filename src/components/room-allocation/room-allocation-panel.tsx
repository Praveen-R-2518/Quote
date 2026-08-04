"use client";

import { useEffect } from "react";
import { useQuotationStore } from "@/store/quotation-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { guestsNeedingBeds } from "@/lib/quotation-schema";
import { totalRoomCapacity, totalRooms } from "@/lib/room-allocation";

export function RoomAllocationPanel() {
  const { draft, config, setRoomAllocations, applyRoomSuggestion } = useQuotationStore();
  const guests = guestsNeedingBeds(draft.passengers);
  const capacity = totalRoomCapacity(draft.roomAllocations);

  useEffect(() => {
    if (draft.roomAllocations.length === 0 && config) {
      applyRoomSuggestion();
    }
  }, [config]);

  const updateCount = (roomTypeId: number, count: number) => {
    const updated = (config?.roomTypes ?? []).map((rt) => {
      const existing = draft.roomAllocations.find((a) => a.roomTypeId === rt.id);
      return {
        roomTypeId: rt.id,
        roomTypeName: rt.name,
        capacity: rt.capacity,
        count: rt.id === roomTypeId ? Math.max(0, count) : (existing?.count ?? 0),
      };
    }).filter((a) => a.count > 0);
    setRoomAllocations(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Room Allocation</CardTitle>
        <p className="text-sm text-stone-500">Guests needing beds: {guests}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button type="button" variant="outline" onClick={applyRoomSuggestion}>Apply Suggestion</Button>
        <div className="space-y-3">
          {config?.roomTypes.map((rt) => {
            const alloc = draft.roomAllocations.find((a) => a.roomTypeId === rt.id);
            return (
              <div key={rt.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <Label className="min-w-0 flex-1 sm:w-32 sm:flex-none">{rt.name} (cap. {rt.capacity})</Label>
                <Input
                  type="number"
                  min={0}
                  className="w-full sm:w-24"
                  value={alloc?.count ?? 0}
                  onChange={(e) => updateCount(rt.id, Number(e.target.value) || 0)}
                />
              </div>
            );
          })}
        </div>
        <div className="text-sm text-stone-600">
          <span className="block sm:inline">Total rooms: {totalRooms(draft.roomAllocations)}</span>
          <span className="hidden sm:inline"> | </span>
          <span className="block sm:inline">Total capacity: {capacity}</span>
        </div>
        {capacity < guests && draft.roomAllocations.length > 0 && (
          <Alert variant="warning">Room capacity ({capacity}) is less than guests needing beds ({guests}).</Alert>
        )}
      </CardContent>
    </Card>
  );
}
