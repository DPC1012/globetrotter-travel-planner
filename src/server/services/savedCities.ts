import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { cities, userSavedCities } from "@/lib/db/schema";
import { HttpError } from "@/server/http";

export async function listSavedCities(userId: string) {
  return db
    .select({ city: cities })
    .from(userSavedCities)
    .innerJoin(cities, eq(userSavedCities.cityId, cities.id))
    .where(eq(userSavedCities.userId, userId))
    .orderBy(desc(userSavedCities.createdAt))
    .then((rows) => rows.map((r) => r.city));
}

export async function saveCity(userId: string, cityId: string) {
  const [city] = await db.select({ id: cities.id }).from(cities).where(eq(cities.id, cityId));
  if (!city) throw new HttpError(400, "Unknown city");

  await db
    .insert(userSavedCities)
    .values({ userId, cityId })
    .onConflictDoNothing();
  return { ok: true };
}

export async function unsaveCity(userId: string, cityId: string) {
  await db
    .delete(userSavedCities)
    .where(and(eq(userSavedCities.userId, userId), eq(userSavedCities.cityId, cityId)));
  return { ok: true };
}
