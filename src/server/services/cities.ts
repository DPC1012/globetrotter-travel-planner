import { and, asc, count, desc, eq, ilike, lte, or, type SQL } from "drizzle-orm";
import { db } from "@/lib/db";
import { activities as dbActivities, cities as dbCities } from "@/lib/db/schema";
import { cities as fallbackCities, activities as fallbackActivities } from "@/lib/data";
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
): Promise<Page<typeof dbCities.$inferSelect>> {
  const query = citySearchQuerySchema.parse(Object.fromEntries(rawQuery));
  try {
    const filters: SQL[] = [];

    if (query.q) {
      const pattern = `%${escapeLike(query.q)}%`;
      const cond = or(ilike(dbCities.name, pattern), ilike(dbCities.country, pattern));
      if (cond) filters.push(cond);
    }
    if (query.country) filters.push(ilike(dbCities.country, query.country));
    if (query.region) filters.push(ilike(dbCities.region, query.region));

    const where = filters.length ? and(...filters) : undefined;

    const [{ total }] = await db.select({ total: count() }).from(dbCities).where(where);

    const items = await db
      .select()
      .from(dbCities)
      .where(where)
      .orderBy(desc(dbCities.popularity), asc(dbCities.name))
      .limit(CITY_PAGE_SIZE)
      .offset((query.page - 1) * CITY_PAGE_SIZE);

    return { items, total: Number(total), page: query.page };
  } catch (err) {
    console.warn("DB offline in searchCities, using fallback catalog");
    const filtered = fallbackCities.filter(c => {
      if (query.q && !c.name.toLowerCase().includes(query.q.toLowerCase())) return false;
      if (query.region && query.region !== "all" && c.region.toLowerCase() !== query.region.toLowerCase()) return false;
      return true;
    });
    return { items: filtered as any, total: filtered.length, page: query.page };
  }
}

export async function topCities(limit: number) {
  try {
    return await db
      .select()
      .from(dbCities)
      .orderBy(desc(dbCities.popularity), desc(dbCities.costIndex))
      .limit(limit);
  } catch (err) {
    console.warn("DB offline in topCities, using fallback catalog");
    return fallbackCities.slice(0, limit) as any;
  }
}

export async function searchActivities(
  cityId: string,
  rawQuery: URLSearchParams,
): Promise<Page<typeof dbActivities.$inferSelect>> {
  const query = activitySearchQuerySchema.parse(Object.fromEntries(rawQuery));

  try {
    const [city] = await db
      .select({ id: dbCities.id })
      .from(dbCities)
      .where(eq(dbCities.id, cityId));

    const filters: SQL[] = [eq(dbActivities.cityId, cityId)];
    if (query.q) {
      const pattern = `%${escapeLike(query.q)}%`;
      const cond = or(ilike(dbActivities.title, pattern), ilike(dbActivities.description, pattern));
      if (cond) filters.push(cond);
    }
    if (query.category) filters.push(eq(dbActivities.category, query.category));
    if (query.maxCost !== undefined) filters.push(lte(dbActivities.costCents, query.maxCost));
    if (query.maxDuration !== undefined) {
      filters.push(lte(dbActivities.durationMins, query.maxDuration));
    }

    const where = and(...filters);

    const [{ total }] = await db.select({ total: count() }).from(dbActivities).where(where);

    const items = await db
      .select()
      .from(dbActivities)
      .where(where)
      .orderBy(asc(dbActivities.costCents), asc(dbActivities.title))
      .limit(ACTIVITY_PAGE_SIZE)
      .offset((query.page - 1) * ACTIVITY_PAGE_SIZE);

    return { items, total: Number(total), page: query.page };
  } catch (err) {
    console.warn("DB offline in searchActivities, using fallback catalog");
    const filtered = fallbackActivities.filter(a => {
      if (a.cityId !== cityId && cityId !== "all") return false;
      if (query.q && !a.title.toLowerCase().includes(query.q.toLowerCase())) return false;
      return true;
    });
    return { items: filtered as any, total: filtered.length, page: query.page };
  }
}

