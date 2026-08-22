import { z } from "zod";
import type { Category } from "@/lib/db/schema";

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD");

const timeString = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must be HH:mm");

const categoryEnum = z.enum([
  "sightseeing",
  "food",
  "adventure",
  "culture",
  "nightlife",
  "transport",
  "lodging",
  "other",
]) satisfies z.ZodType<Category>;

/* ---------- trips ---------- */

export const createTripSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(120),
    startDate: dateString,
    endDate: dateString,
    description: z.string().max(2000).optional(),
    coverImageUrl: z.string().url("Cover image must be a URL").optional(),
  })
  .refine((d) => d.startDate <= d.endDate, {
    message: "startDate must be on or before endDate",
    path: ["endDate"],
  });

export const updateTripSchema = z
  .object({
    name: z.string().min(1).max(120).optional(),
    startDate: dateString.optional(),
    endDate: dateString.optional(),
    description: z.string().max(2000).nullable().optional(),
    coverImageUrl: z.string().url().nullable().optional(),
    budgetCents: z.number().int().min(0).nullable().optional(),
  })
  .refine((d) => !d.startDate || !d.endDate || d.startDate <= d.endDate, {
    message: "startDate must be on or before endDate",
    path: ["endDate"],
  });

export const shareTripSchema = z.object({
  isPublic: z.boolean(),
});

/* ---------- stops ---------- */

export const addStopSchema = z
  .object({
    cityId: z.string().min(1, "cityId is required"),
    arrivalDate: dateString,
    departureDate: dateString,
  })
  .refine((d) => d.arrivalDate <= d.departureDate, {
    message: "arrivalDate must be on or before departureDate",
    path: ["departureDate"],
  });

export const updateStopSchema = z
  .object({
    arrivalDate: dateString.optional(),
    departureDate: dateString.optional(),
  })
  .refine(
    (d) =>
      !d.arrivalDate ||
      !d.departureDate ||
      d.arrivalDate <= d.departureDate,
    {
      message: "arrivalDate must be on or before departureDate",
      path: ["departureDate"],
    },
  );

export const moveSchema = z.object({
  direction: z.enum(["up", "down"]),
});

/* ---------- itinerary items ---------- */

export const addItemSchema = z.union([
  z.object({
    activityId: z.string().min(1, "activityId is required"),
    date: dateString,
    startTime: timeString.optional(),
    position: z.number().int().min(0).optional(),
  }),
  z.object({
    title: z.string().min(1, "Title is required").max(200),
    category: categoryEnum.optional(),
    costCents: z.number().int().min(0).max(100_000_000).optional(),
    durationMins: z.number().int().min(0).max(1440).optional(),
    date: dateString,
    startTime: timeString.optional(),
    position: z.number().int().min(0).optional(),
  }),
]);

export const updateItemSchema = z.object({
  date: dateString.optional(),
  startTime: timeString.nullable().optional(),
  costCents: z.number().int().min(0).max(100_000_000).optional(),
  position: z.number().int().min(0).optional(),
});

/* ---------- city & activity queries ---------- */

export const citySearchQuerySchema = z.object({
  q: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  region: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
});

export const activitySearchQuerySchema = z.object({
  q: z.string().max(200).optional(),
  category: categoryEnum.optional(),
  maxCost: z.coerce.number().int().min(0).optional(),
  maxDuration: z.coerce.number().int().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
});
