export type Page<T> = { items: T[]; total: number; page: number };

export type TripWithStats = import("@/lib/db/schema").Trip & {
  stopCount: number;
  totalCostCents: number;
};

export type StopWithCity = import("@/lib/db/schema").Stop & {
  city: import("@/lib/db/schema").City;
};

export type FullTripPayload = {
  trip: import("@/lib/db/schema").Trip;
  stops: StopWithCity[];
  items: import("@/lib/db/schema").TripActivity[];
};

export type PublicTripCard = {
  trip: import("@/lib/db/schema").Trip;
  ownerName: string;
  ownerImage: string | null;
  stopCount: number;
};
