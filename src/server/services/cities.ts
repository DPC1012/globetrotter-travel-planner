import { and, asc, count, desc, eq, ilike, lte, or, type SQL } from "drizzle-orm";
import { db } from "@/lib/db";
import { activities, cities } from "@/lib/db/schema";
import { HttpError } from "@/server/http";
import {
  activitySearchQuerySchema,
  citySearchQuerySchema,
} from "@/server/schemas";
import type { Page } from "@/server/types";

export const CITY_PAGE_SIZE = 20;
export const ACTIVITY_PAGE_SIZE = 20;

function escapeLike(value: string) {
  return value.replace(/[%_\\]/g, "\\$&");
}

export async function searchCities(
  rawQuery: URLSearchParams,
): Promise<Page<typeof cities.$inferSelect>> {
  const query = citySearchQuerySchema.parse(Object.fromEntries(rawQuery));
  const filters: SQL[] = [];

  if (query.q) {
    const pattern = `%${escapeLike(query.q)}%`;
    const cond = or(ilike(cities.name, pattern), ilike(cities.country, pattern));
    if (cond) filters.push(cond);
  }
  if (query.country) filters.push(ilike(cities.country, query.country));
  if (query.region) filters.push(ilike(cities.region, query.region));

  const where = filters.length ? and(...filters) : undefined;

  const [{ total }] = await db.select({ total: count() }).from(cities).where(where);

  const items = await db
    .select()
    .from(cities)
    .where(where)
    .orderBy(desc(cities.popularity), asc(cities.name))
    .limit(CITY_PAGE_SIZE)
    .offset((query.page - 1) * CITY_PAGE_SIZE);

  return { items, total: Number(total), page: query.page };
}

export async function topCities(limit: number) {
  return db
    .select()
    .from(cities)
    .orderBy(desc(cities.popularity), desc(cities.costIndex))
    .limit(limit);
}

export async function searchActivities(
  cityId: string,
  rawQuery: URLSearchParams,
): Promise<Page<typeof activities.$inferSelect>> {
  const query = activitySearchQuerySchema.parse(Object.fromEntries(rawQuery));

  const [city] = await db
    .select({ id: cities.id })
    .from(cities)
    .where(eq(cities.id, cityId));
  if (!city) throw new HttpError(404, "City not found");

  const filters: SQL[] = [eq(activities.cityId, cityId)];
  if (query.q) {
    const pattern = `%${escapeLike(query.q)}%`;
    const cond = or(ilike(activities.title, pattern), ilike(activities.description, pattern));
    if (cond) filters.push(cond);
  }
  if (query.category) filters.push(eq(activities.category, query.category));
  if (query.maxCost !== undefined) filters.push(lte(activities.costCents, query.maxCost));
  if (query.maxDuration !== undefined) {
    filters.push(lte(activities.durationMins, query.maxDuration));
  }

  const where = and(...filters);

  const [{ total }] = await db.select({ total: count() }).from(activities).where(where);

  const items = await db
    .select()
    .from(activities)
    .where(where)
    .orderBy(asc(activities.costCents), asc(activities.title))
    .limit(ACTIVITY_PAGE_SIZE)
    .offset((query.page - 1) * ACTIVITY_PAGE_SIZE);

  return { items, total: Number(total), page: query.page };
}
