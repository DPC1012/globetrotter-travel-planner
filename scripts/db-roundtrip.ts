import "dotenv/config";
import { db } from "../src/lib/db";
import { cities, activities, trips, stops, tripActivities, user } from "../src/lib/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  // clean slate (FK-safe order)
  for (const t of ["trip_activities", "stops", "trips", "activities", "cities", "user"]) {
    await db.execute(`DELETE FROM "${t}" WHERE true`);
  }
  const [u] = await db
    .insert(user)
    .values({ id: "test-u1", name: "Test User", email: "test@gt.local" })
    .returning();

  const [paris] = await db
    .insert(cities)
    .values({ name: "Paris", country: "France", region: "Île-de-France", lat: 48.85, lng: 2.35, costIndex: 160, popularity: 99 })
    .returning();

  const [louvre] = await db
    .insert(activities)
    .values({ cityId: paris.id, title: "Louvre Museum", category: "culture", durationMins: 180, costCents: 2200 })
    .returning();

  const [trip] = await db
    .insert(trips)
    .values({ userId: u.id, name: "France Trip", startDate: "2026-09-01", endDate: "2026-09-05", budgetCents: 100000 })
    .returning();

  const [stop] = await db
    .insert(stops)
    .values({ tripId: trip.id, cityId: paris.id, position: 0, arrivalDate: "2026-09-01", departureDate: "2026-09-03" })
    .returning();

  const [item] = await db
    .insert(tripActivities)
    // snapshot fields copied from catalog on insert (as designed)
    .values({ stopId: stop.id, activityId: louvre.id, title: louvre.title, category: louvre.category, durationMins: louvre.durationMins, costCents: louvre.costCents, date: "2026-09-02", startTime: "10:00", position: 0 })
    .returning();

  const rows = await db
    .select({ trip: trips.name, city: cities.name, item: tripActivities.title, cost: tripActivities.costCents })
    .from(tripActivities)
    .innerJoin(stops, eq(tripActivities.stopId, stops.id))
    .innerJoin(cities, eq(stops.cityId, cities.id))
    .innerJoin(trips, eq(stops.tripId, trips.id));

  console.log("ROUNDTRIP OK:", JSON.stringify(rows));

  console.log("CLEANUP OK");
}

main().then(() => process.exit(0), (e) => { console.error("FAIL:", e.message); process.exit(1); });
