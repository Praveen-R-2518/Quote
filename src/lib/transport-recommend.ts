import type { TransportItem } from "./quotation-schema";

export interface Vehicle {
  id: number;
  name: string;
  capacity: number;
}

export interface TransportRule {
  id: number;
  minPassengers: number;
  maxPassengers: number;
  vehicleId: number;
  sortOrder?: number;
}

export function recommendTransport(
  totalPassengers: number,
  vehicles: Vehicle[],
  rules: TransportRule[]
): TransportItem[] {
  if (totalPassengers <= 0 || vehicles.length === 0) return [];

  const vehicleMap = new Map(vehicles.map((v) => [v.id, v]));
  const sortedRules = [...rules].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.minPassengers - b.minPassengers);

  const matchingRule = sortedRules.find(
    (r) => totalPassengers >= r.minPassengers && totalPassengers <= r.maxPassengers
  );

  if (matchingRule) {
    const vehicle = vehicleMap.get(matchingRule.vehicleId);
    if (vehicle) {
      return [{ vehicleId: vehicle.id, vehicleName: vehicle.name, count: 1, capacity: vehicle.capacity }];
    }
  }

  const sortedVehicles = [...vehicles].sort((a, b) => b.capacity - a.capacity);
  const result: TransportItem[] = [];
  let remaining = totalPassengers;

  for (const vehicle of sortedVehicles) {
    while (remaining > 0) {
      result.push({ vehicleId: vehicle.id, vehicleName: vehicle.name, count: 1, capacity: vehicle.capacity });
      remaining -= vehicle.capacity;
    }
    break;
  }

  return result;
}

export function totalTransportCapacity(transport: TransportItem[]): number {
  return transport.reduce((sum, t) => sum + t.count * t.capacity, 0);
}
