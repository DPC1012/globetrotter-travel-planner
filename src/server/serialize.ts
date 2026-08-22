import type { TripActivity } from "@/lib/db/schema";

export function normalizeItem(item: TripActivity): TripActivity {
  return {
    ...item,
    startTime: item.startTime ? item.startTime.slice(0, 5) : null,
  };
}
