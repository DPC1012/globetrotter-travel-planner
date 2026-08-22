import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { activities, stops, tripActivities, trips } from "@/lib/db/schema";
import type { Category } from "@/lib/db/schema";
import { HttpError } from "@/server/http";
import { normalizeItem } from "@/server/serialize";

type CatalogInput = {
  activityId: string;
  date: string;
  startTime?: string;
  position?: number;
};

type CustomInput = {
  title: string;
  category?: Category;
  costCents?: number;
  durationMins?: number;
  date: string;
  startTime?: string;
  position?: number;
};

async function getOwnedStop(stopId: string, userId: string) {
  const [row] = await db
    .select({ stop: stops })
    .from(stops)
    .innerJoin(trips, eq(stops.tripId, trips.id))
    .where(and(eq(stops.id, stopId), eq(trips.userId, userId)));
  if (!row) throw new HttpError(404, "Stop not found");
  return row.stop;
}

export async function addItem(
  stopId: string,
  userId: string,
  input: CatalogInput | CustomInput,
) {
  const stop = await getOwnedStop(stopId, userId);

  let values: typeof tripActivities.$inferInsert;

  if ("activityId" in input) {
    const [activity] = await db
      .select()
      .from(activities)
      .where(eq(activities.id, input.activityId));
    if (!activity) throw new HttpError(400, "Unknown activity");
    if (activity.cityId !== stop.cityId) {
      throw new HttpError(400, "Activity is not offered in this city");
    }
    values = {
      stopId,
      activityId: activity.id,
      title: activity.title,
      category: activity.category,
      durationMins: activity.durationMins,
      costCents: activity.costCents,
      date: input.date,
      startTime: input.startTime ?? null,
      position: input.position ?? 0,
    };
  } else {
    values = {
      stopId,
      activityId: null,
      title: input.title,
      category: input.category ?? "other",
      durationMins: input.durationMins ?? 0,
      costCents: input.costCents ?? 0,
      date: input.date,
      startTime: input.startTime ?? null,
      position: input.position ?? 0,
    };
  }

  if (values.position === 0 && input.position === undefined) {
    const [last] = await db
      .select({ position: tripActivities.position })
      .from(tripActivities)
      .where(
        and(eq(tripActivities.stopId, stopId), eq(tripActivities.date, input.date)),
      )
      .orderBy(desc(tripActivities.position))
      .limit(1);
    values.position = last ? last.position + 1000 : 0;
  }

  const [item] = await db.insert(tripActivities).values(values).returning();
  return normalizeItem(item);
}

async function getOwnedItem(itemId: string, userId: string) {
  const [row] = await db
    .select({ item: tripActivities })
    .from(tripActivities)
    .innerJoin(stops, eq(tripActivities.stopId, stops.id))
    .innerJoin(trips, eq(stops.tripId, trips.id))
    .where(and(eq(tripActivities.id, itemId), eq(trips.userId, userId)));
  if (!row) throw new HttpError(404, "Item not found");
  return row.item;
}

export async function updateItem(
  itemId: string,
  userId: string,
  input: {
    date?: string;
    startTime?: string | null;
    costCents?: number;
    position?: number;
  },
) {
  await getOwnedItem(itemId, userId);
  const patch: Record<string, unknown> = {};
  if (input.date !== undefined) patch.date = input.date;
  if (input.startTime !== undefined) patch.startTime = input.startTime;
  if (input.costCents !== undefined) patch.costCents = input.costCents;
  if (input.position !== undefined) patch.position = input.position;

  const [item] = await db
    .update(tripActivities)
    .set(patch)
    .where(eq(tripActivities.id, itemId))
    .returning();
  return normalizeItem(item);
}

export async function deleteItem(itemId: string, userId: string) {
  await getOwnedItem(itemId, userId);
  await db.delete(tripActivities).where(eq(tripActivities.id, itemId));
}

export async function moveItem(
  itemId: string,
  userId: string,
  direction: "up" | "down",
) {
  const target = await getOwnedItem(itemId, userId);
  const siblings = await db
    .select()
    .from(tripActivities)
    .where(
      and(
        eq(tripActivities.stopId, target.stopId),
        eq(tripActivities.date, target.date),
      ),
    )
    .orderBy(asc(tripActivities.position));

  const index = siblings.findIndex((i) => i.id === itemId);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= siblings.length) {
    return siblings.map(normalizeItem);
  }

  const a = siblings[index];
  const b = siblings[swapIndex];
  await db.transaction(async (tx) => {
    await tx
      .update(tripActivities)
      .set({ position: b.position })
      .where(eq(tripActivities.id, a.id));
    await tx
      .update(tripActivities)
      .set({ position: a.position })
      .where(eq(tripActivities.id, b.id));
  });

  const rows = await db
    .select()
    .from(tripActivities)
    .where(
      and(
        eq(tripActivities.stopId, target.stopId),
        eq(tripActivities.date, target.date),
      ),
    )
    .orderBy(asc(tripActivities.position));
  return rows.map(normalizeItem);
}
