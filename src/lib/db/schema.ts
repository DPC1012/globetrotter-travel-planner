import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/* ---------- Better Auth tables ---------- */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  phone: text("phone"),
  city: text("city"),
  country: text("country"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
);

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/* ---------- App tables ---------- */

export const activityCategory = pgEnum("activity_category", [
  "sightseeing",
  "food",
  "adventure",
  "culture",
  "nightlife",
  "transport",
  "lodging",
  "meals",
  "other",
]);

export const cities = pgTable(
  "cities",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()::text`),
    name: text("name").notNull(),
    country: text("country").notNull(),
    region: text("region").notNull(),
    lat: real("lat").notNull(),
    lng: real("lng").notNull(),
    costIndex: integer("cost_index").notNull().default(100),
    popularity: integer("popularity").notNull().default(50),
    imageUrl: text("image_url").notNull().default(""),
  },
  (t) => [
    index("cities_country_region_idx").on(t.country, t.region),
    index("cities_name_idx").on(t.name),
  ],
);

export const activities = pgTable(
  "activities",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()::text`),
    cityId: text("city_id")
      .notNull()
      .references(() => cities.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    category: activityCategory("category").notNull().default("other"),
    durationMins: integer("duration_mins").notNull().default(60),
    costCents: integer("cost_cents").notNull().default(0),
    imageUrl: text("image_url").notNull().default(""),
  },
  (t) => [index("activities_city_category_idx").on(t.cityId, t.category)],
);

export const trips = pgTable(
  "trips",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()::text`),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    startDate: date("start_date", { mode: "string" }).notNull(),
    endDate: date("end_date", { mode: "string" }).notNull(),
    coverImageUrl: text("cover_image_url"),
    budgetCents: integer("budget_cents"),
    isPublic: boolean("is_public").notNull().default(false),
    shareSlug: text("share_slug"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("trips_share_slug_uq").on(t.shareSlug).where(sql`${t.shareSlug} IS NOT NULL`),
    index("trips_user_idx").on(t.userId, t.startDate),
    check("trip_dates_check", sql`${t.startDate} <= ${t.endDate}`),
  ],
);

export const stops = pgTable(
  "stops",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()::text`),
    tripId: text("trip_id")
      .notNull()
      .references(() => trips.id, { onDelete: "cascade" }),
    cityId: text("city_id")
      .notNull()
      .references(() => cities.id, { onDelete: "restrict" }),
    position: integer("position").notNull().default(0),
    arrivalDate: date("arrival_date", { mode: "string" }).notNull(),
    departureDate: date("departure_date", { mode: "string" }).notNull(),
  },
  (t) => [
    index("stops_trip_idx").on(t.tripId, t.position),
    index("stops_city_idx").on(t.cityId),
    check("stop_dates_check", sql`${t.arrivalDate} <= ${t.departureDate}`),
  ],
);

export const tripActivities = pgTable(
  "trip_activities",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()::text`),
    stopId: text("stop_id")
      .notNull()
      .references(() => stops.id, { onDelete: "cascade" }),
    activityId: text("activity_id").references(() => activities.id, {
      onDelete: "set null",
    }),
    // Snapshot fields — copied from catalog activity on insert, or typed by user
    title: text("title").notNull(),
    category: activityCategory("category").notNull().default("other"),
    durationMins: integer("duration_mins").notNull().default(0),
    costCents: integer("cost_cents").notNull().default(0),
    date: date("date", { mode: "string" }).notNull(),
    startTime: text("start_time"),
    position: integer("position").notNull().default(0),
  },
  (t) => [
    index("trip_activities_stop_date_idx").on(t.stopId, t.date, t.position),
  ],
);

export const userSavedCities = pgTable(
  "user_saved_cities",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    cityId: text("city_id")
      .notNull()
      .references(() => cities.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.cityId] })],
);

/* ---------- Relations ---------- */

export const tripsRelations = relations(trips, ({ many, one }) => ({
  stops: many(stops),
  owner: one(user, { fields: [trips.userId], references: [user.id] }),
}));

export const stopsRelations = relations(stops, ({ one, many }) => ({
  trip: one(trips, { fields: [stops.tripId], references: [trips.id] }),
  city: one(cities, { fields: [stops.cityId], references: [cities.id] }),
  items: many(tripActivities),
}));

export const tripActivitiesRelations = relations(tripActivities, ({ one }) => ({
  stop: one(stops, { fields: [tripActivities.stopId], references: [stops.id] }),
  activity: one(activities, {
    fields: [tripActivities.activityId],
    references: [activities.id],
  }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  city: one(cities, { fields: [activities.cityId], references: [cities.id] }),
}));

export const citiesRelations = relations(cities, ({ many }) => ({
  activities: many(activities),
}));

/* ---------- Inferred types ---------- */

export type User = typeof user.$inferSelect;
export type City = typeof cities.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type Trip = typeof trips.$inferSelect;
export type Stop = typeof stops.$inferSelect;
export type TripActivity = typeof tripActivities.$inferSelect;
export type Category = (typeof activityCategory.enumValues)[number];
