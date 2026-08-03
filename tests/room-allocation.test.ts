import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { suggestRoomAllocation, totalRoomCapacity, totalRooms } from "../src/lib/room-allocation";

describe("suggestRoomAllocation", () => {
  const roomTypes = [
    { id: 1, name: "Single", capacity: 1 },
    { id: 2, name: "Double", capacity: 2 },
    { id: 3, name: "Triple", capacity: 3 },
  ];

  it("allocates double rooms for 4 guests", () => {
    const result = suggestRoomAllocation(4, roomTypes);
    assert.equal(totalRoomCapacity(result), 4);
    assert.equal(totalRooms(result), 2);
  });

  it("handles odd guest count", () => {
    const result = suggestRoomAllocation(5, roomTypes);
    assert.ok(totalRoomCapacity(result) >= 5);
  });

  it("returns empty for zero guests", () => {
    assert.deepEqual(suggestRoomAllocation(0, roomTypes), []);
  });
});
