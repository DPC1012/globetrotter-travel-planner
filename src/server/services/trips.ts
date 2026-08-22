import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { cities, stops, tripActivities, trips } from "@/lib/db/schema";
import { HttpError } from "@/server/http";
import type { FullTripPayload, TripWithStats } from "@/server/types";

export async function listTrips(userId: string): Promise<TripWithStats[]> {
  const rows = await db
    .select({
      trip: trips,
      stopCount: sql<number>`count(distinct ${stops.id})`.mapWith(Number),
      totalCostCents: sql<number>`coalesce(sum(${tripActivities.costCents}), 0)`.mapWith(Number),
    })
    .from(trips)
    .leftJoin(stops, eq(stops.tripId, trips.id))
    .leftJoin(tripActivities, eq(tripActivities.stopId, stops.id))
    .where(eq(trips.userId, userId))
    .groupBy(trips.id)
    .orderBy(asc(trips.startDate));

  return rows.map((r) => ({
    ...r.trip,
    stopCount: r.stopCount,
    totalCostCents: r.totalCostCents,
  }));
}

export async function createTrip(
  userId: string,
  input: {
    name: string;
    startDate: string;
    endDate: string;
    description?: string;
    coverImageUrl?: string;
  },
) {
  const [trip] = await db
    .insert(trips)
    .values({
      userId,
      name: input.name,
      startDate: input.startDate,
      endDate: input.endDate,
      description: input.description ?? "",
      coverImageUrl: input.coverImageUrl ?? null,
    })
    .returning();
  return trip;
}

export async function getOwnedTrip(tripId: string, userId: string) {
  const [trip] = await db
    .select()
    .from(trips)
    .where(and(eq(trips.id, tripId), eq(trips.userId, userId)));
  if (!trip) throw new HttpError(404, "Trip not found");
  return trip;
}

export async function getTripPayload(
  tripId: string,
  userId?: string,
): Promise<FullTripPayload> {
  let where = eq(trips.id, tripId);
  if (userId) where = and(where, eq(trips.userId, userId))!;
  const [trip] = await db.select().from(trips).where(where);
  if (!trip) throw new HttpError(404, "Trip not found");

  const stopRows = await db
    .select({ stop: stops, city: cities })
    .from(stops)
    .innerJoin(cities, eq(stops.cityId, cities.id))
    .where(eq(stops.tripId, tripId))
    .orderBy(asc(stops.position));

  const stopIds = stopRows.map((r) => r.stop.id);
  const items = stopIds.length
    ? await db
        .select()
        .from(tripActivities)
        .where(inArray(tripActivities.stopId, stopIds))
        .orderBy(asc(tripActivities.date), asc(tripActivities.position))
    : [];

  return {
    trip,
    stops: stopRows.map((r) => ({ ...r.stop, city: r.city })),
    items,
  };
}

export async function updateTrip(
  tripId: string,
  userId: string,
  input: {
    name?: string;
    startDate?: string;
    endDate?: string;
    description?: string | null;
    coverImageUrl?: string | null;
    budgetCents?: number | null;
  },
) {
  await getOwnedTrip(tripId, userId);
  const patch: Record<string, unknown> = { updatedAt: new Date() };
  for (const key of [
    "name",
    "startDate",
    "endDate",
    "description",
    "coverImageUrl",
    "budgetCents",
  ] as const) {
    if (input[key] !== undefined) patch[key] = input[key];
  }
  const [trip] = await db
    .update(trips)
    .set(patch)
    .where(eq(trips.id, tripId))
    .returning();
  return trip;
}

export async function deleteTrip(tripId: string, userId: string) {
  await getOwnedTrip(tripId, userId);
  await db.delete(trips).where(eq(trips.id, tripId));
}
