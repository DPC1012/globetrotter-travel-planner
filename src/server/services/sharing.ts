import { and, count, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { stops, trips, user } from "@/lib/db/schema";
import { HttpError } from "@/server/http";
import { getTripPayload } from "@/server/services/trips";
import type { Page, PublicTripCard } from "@/server/types";

export const EXPLORE_PAGE_SIZE = 12;

export async function setPublic(
  tripId: string,
  userId: string,
  isPublic: boolean,
): Promise<{ isPublic: boolean; shareSlug?: string }> {
  const [trip] = await db
    .select()
    .from(trips)
    .where(and(eq(trips.id, tripId), eq(trips.userId, userId)));
  if (!trip) throw new HttpError(404, "Trip not found");

  if (isPublic) {
    const slug = trip.shareSlug ?? crypto.randomUUID();
    await db.update(trips).set({ isPublic: true, shareSlug: slug }).where(eq(trips.id, tripId));
    return { isPublic: true, shareSlug: slug };
  }

  await db.update(trips).set({ isPublic: false }).where(eq(trips.id, tripId));
  return { isPublic: false };
}

export async function listPublicTrips(
  rawPage: string | null,
): Promise<Page<PublicTripCard>> {
  let page = rawPage === null ? 1 : Number.parseInt(rawPage, 10);
  if (!Number.isInteger(page) || page < 1) page = 1;

  const [{ total }] = await db
    .select({ total: count() })
    .from(trips)
    .where(eq(trips.isPublic, true));

  const rows = await db
    .select({
      trip: trips,
      ownerName: user.name,
      ownerImage: user.image,
      stopCount: count(stops.id),
    })
    .from(trips)
    .innerJoin(user, eq(trips.userId, user.id))
    .leftJoin(stops, eq(stops.tripId, trips.id))
    .where(eq(trips.isPublic, true))
    .groupBy(trips.id, user.name, user.image)
    .orderBy(desc(trips.createdAt))
    .limit(EXPLORE_PAGE_SIZE)
    .offset((page - 1) * EXPLORE_PAGE_SIZE);

  return {
    items: rows.map((r) => ({
      trip: r.trip,
      ownerName: r.ownerName,
      ownerImage: r.ownerImage,
      stopCount: Number(r.stopCount),
    })),
    total: Number(total),
    page,
  };
}

export async function getSharedTripPayload(slug: string) {
  const [trip] = await db
    .select({ id: trips.id })
    .from(trips)
    .where(and(eq(trips.shareSlug, slug), eq(trips.isPublic, true)));
  if (!trip) throw new HttpError(404, "Trip not found");

  return getTripPayload(trip.id);
}
