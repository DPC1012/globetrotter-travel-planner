import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { cities, stops, trips } from "@/lib/db/schema";
import { HttpError } from "@/server/http";

export async function addStop(
  tripId: string,
  userId: string,
  input: { cityId: string; arrivalDate: string; departureDate: string },
) {
  const [trip] = await db
    .select({ id: trips.id })
    .from(trips)
    .where(and(eq(trips.id, tripId), eq(trips.userId, userId)));
  if (!trip) throw new HttpError(404, "Trip not found");

  const [city] = await db
    .select({ id: cities.id })
    .from(cities)
    .where(eq(cities.id, input.cityId));
  if (!city) throw new HttpError(400, "Unknown city");

  const [last] = await db
    .select({ position: stops.position })
    .from(stops)
    .where(eq(stops.tripId, tripId))
    .orderBy(desc(stops.position))
    .limit(1);

  const [stop] = await db
    .insert(stops)
    .values({
      tripId,
      cityId: input.cityId,
      arrivalDate: input.arrivalDate,
      departureDate: input.departureDate,
      position: last ? last.position + 1000 : 0,
    })
    .returning();
  return stop;
}

async function getOwnedStop(stopId: string, userId: string) {
  const [row] = await db
    .select({ stop: stops })
    .from(stops)
    .innerJoin(trips, eq(stops.tripId, trips.id))
    .where(and(eq(stops.id, stopId), eq(trips.userId, userId)));
  if (!row) throw new HttpError(404, "Stop not found");
  return row.stop;
}

export async function updateStop(
  stopId: string,
  userId: string,
  input: { arrivalDate?: string; departureDate?: string },
) {
  const existing = await getOwnedStop(stopId, userId);
  const patch: Record<string, unknown> = {};
  if (input.arrivalDate !== undefined) patch.arrivalDate = input.arrivalDate;
  if (input.departureDate !== undefined) patch.departureDate = input.departureDate;

  const arrival = (patch.arrivalDate as string | undefined) ?? existing.arrivalDate;
  const departure =
    (patch.departureDate as string | undefined) ?? existing.departureDate;
  if (arrival > departure) {
    throw new HttpError(400, "arrivalDate must be on or before departureDate");
  }

  const [stop] = await db
    .update(stops)
    .set(patch)
    .where(eq(stops.id, stopId))
    .returning();
  return stop;
}

export async function deleteStop(stopId: string, userId: string) {
  await getOwnedStop(stopId, userId);
  await db.delete(stops).where(eq(stops.id, stopId));
}

export async function moveStop(
  stopId: string,
  userId: string,
  direction: "up" | "down",
) {
  const target = await getOwnedStop(stopId, userId);
  const siblings = await db
    .select()
    .from(stops)
    .where(eq(stops.tripId, target.tripId))
    .orderBy(asc(stops.position));

  const index = siblings.findIndex((s) => s.id === stopId);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= siblings.length) {
    return siblings;
  }

  const a = siblings[index];
  const b = siblings[swapIndex];
  await db.transaction(async (tx) => {
    await tx.update(stops).set({ position: b.position }).where(eq(stops.id, a.id));
    await tx.update(stops).set({ position: a.position }).where(eq(stops.id, b.id));
  });

  return db
    .select()
    .from(stops)
    .where(eq(stops.tripId, target.tripId))
    .orderBy(asc(stops.position));
}
