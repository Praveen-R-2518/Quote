import type { RoomAllocationItem } from "./quotation-schema";

export interface RoomType {
  id: number;
  name: string;
  capacity: number;
}

export function suggestRoomAllocation(
  guestsNeedingBeds: number,
  roomTypes: RoomType[]
): RoomAllocationItem[] {
  if (guestsNeedingBeds <= 0 || roomTypes.length === 0) return [];

  const sorted = [...roomTypes].sort((a, b) => b.capacity - a.capacity);
  const result: RoomAllocationItem[] = sorted.map((rt) => ({
    roomTypeId: rt.id,
    roomTypeName: rt.name,
    count: 0,
    capacity: rt.capacity,
  }));

  let remaining = guestsNeedingBeds;

  for (const rt of sorted) {
    if (remaining <= 0) break;
    const count = Math.floor(remaining / rt.capacity);
    if (count > 0) {
      const idx = result.findIndex((r) => r.roomTypeId === rt.id);
      result[idx].count = count;
      remaining -= count * rt.capacity;
    }
  }

  if (remaining > 0) {
    const smallest = sorted[sorted.length - 1];
    const idx = result.findIndex((r) => r.roomTypeId === smallest.id);
    result[idx].count += 1;
  }

  return result.filter((r) => r.count > 0);
}

export function totalRoomCapacity(allocations: RoomAllocationItem[]): number {
  return allocations.reduce((sum, a) => sum + a.count * a.capacity, 0);
}

export function totalRooms(allocations: RoomAllocationItem[]): number {
  return allocations.reduce((sum, a) => sum + a.count, 0);
}

function simplifyRoomTypeLabel(name: string): string {
  return name.replace(/\s*room\s*$/i, "").trim();
}

/** e.g. "1 Double", "2 Double, 1 Single" */
export function formatRoomsDescription(allocations: RoomAllocationItem[]): string {
  const active = allocations.filter((a) => a.count > 0);
  if (active.length === 0) return "";
  return active
    .map((a) => `${a.count} ${simplifyRoomTypeLabel(a.roomTypeName)}`)
    .join(", ");
}
