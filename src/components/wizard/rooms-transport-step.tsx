"use client";

import { RoomAllocationPanel } from "@/components/room-allocation/room-allocation-panel";
import { TransportPanel } from "@/components/transport/transport-panel";

export function RoomsTransportStep() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <RoomAllocationPanel />
      <TransportPanel />
    </div>
  );
}
