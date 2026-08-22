import { Trip, trips as fallbackTrips, City, cities } from "@/lib/data"
import { apiGetTrips, apiGetTripById, apiCreateTrip, apiDeleteTrip, ApiTripWithStats, ApiFullTrip } from "@/lib/api-client"

function getStorageKey(userId: string) {
  return `gt_trips_v2_${userId || "default"}`
}

export async function loadUserTrips(userId: string, isDemoUser: boolean = false): Promise<Trip[]> {
  try {
    const apiData = await apiGetTrips()
    if (apiData && apiData.length > 0) {
      return apiData.map((t) => ({
        id: t.id,
        userId: t.userId,
        name: t.name,
        description: t.description || "",
        startDate: t.startDate,
        endDate: t.endDate,
        budgetCents: t.budgetCents || 0,
        isPublic: t.isPublic,
        shareSlug: t.shareSlug,
        coverImageUrl: t.coverImageUrl || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
        status: "upcoming",
        stops: [],
      }))
    }
  } catch (err) {
    console.warn("apiGetTrips network error", err)
  }

  // LocalStorage check for this specific user
  if (typeof window !== "undefined") {
    try {
      const key = getStorageKey(userId)
      const stored = localStorage.getItem(key)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      }
    } catch (e) {
      console.warn("Failed to load stored trips from localStorage", e)
    }
  }

  // If this is the demo user, show the sample trips; otherwise return empty list for new user
  if (isDemoUser || userId === "user-1" || userId.includes("demo")) {
    return fallbackTrips
  }

  return []
}

export async function saveNewUserTrip(
  userId: string,
  payload: {
    name: string
    startDate: string
    endDate: string
    description?: string
    coverImageUrl?: string
    cityIds?: string[]
  }
): Promise<Trip> {
  const newId = `trip-${Date.now()}`
  
  // Create stop objects if cityIds provided
  const stops = (payload.cityIds || []).map((cityId, index) => {
    const cityObj = cities.find((c) => c.id === cityId) || cities[0]
    return {
      id: `stop-${Date.now()}-${index}`,
      tripId: newId,
      cityId,
      city: cityObj,
      position: index + 1,
      arrivalDate: payload.startDate,
      departureDate: payload.endDate,
      activities: [],
    }
  })

  const newTrip: Trip = {
    id: newId,
    userId,
    name: payload.name,
    description: payload.description || "Custom planned journey",
    startDate: payload.startDate,
    endDate: payload.endDate,
    budgetCents: 250000,
    isPublic: false,
    shareSlug: newId,
    coverImageUrl: payload.coverImageUrl || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
    status: "upcoming",
    stops,
  }

  // Try API backend creation
  try {
    const res = await apiCreateTrip({
      name: payload.name,
      startDate: payload.startDate,
      endDate: payload.endDate,
      description: payload.description,
      coverImageUrl: payload.coverImageUrl,
    })
    if (res?.id) {
      newTrip.id = res.id
    }
  } catch (err) {
    console.warn("apiCreateTrip backend error, using local trip storage", err)
  }

  // Save to user's local storage
  if (typeof window !== "undefined") {
    try {
      const key = getStorageKey(userId)
      const currentTrips = await loadUserTrips(userId, false)
      const updated = [newTrip, ...currentTrips]
      localStorage.setItem(key, JSON.stringify(updated))
    } catch (e) {
      console.warn("Failed to save trip to localStorage", e)
    }
  }

  return newTrip
}

export async function deleteUserTrip(userId: string, tripId: string): Promise<boolean> {
  try {
    await apiDeleteTrip(tripId)
  } catch (err) {
    console.warn("apiDeleteTrip backend error", err)
  }

  if (typeof window !== "undefined") {
    try {
      const key = getStorageKey(userId)
      const currentTrips = await loadUserTrips(userId, false)
      const updated = currentTrips.filter((t) => t.id !== tripId)
      localStorage.setItem(key, JSON.stringify(updated))
      return true
    } catch (e) {
      console.warn("Failed to delete trip from localStorage", e)
    }
  }
  return true
}

export async function findUserTripById(userId: string, tripId: string): Promise<Trip | null> {
  try {
    const apiData = await apiGetTripById(tripId)
    if (apiData) {
      return {
        id: apiData.trip.id,
        userId: apiData.trip.userId,
        name: apiData.trip.name,
        description: apiData.trip.description || "",
        startDate: apiData.trip.startDate,
        endDate: apiData.trip.endDate,
        budgetCents: apiData.trip.budgetCents || 0,
        isPublic: apiData.trip.isPublic,
        shareSlug: apiData.trip.shareSlug,
        coverImageUrl: apiData.trip.coverImageUrl || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
        status: "upcoming",
        stops: apiData.stops.map((s) => ({
          id: s.id,
          tripId: s.tripId,
          cityId: s.cityId,
          city: s.city as any,
          position: s.position,
          arrivalDate: s.arrivalDate,
          departureDate: s.departureDate,
          activities: apiData.items
            .filter((item) => item.stopId === s.id)
            .map((item) => ({
              id: item.id,
              stopId: item.stopId,
              activityId: item.activityId || undefined,
              title: item.title,
              category: (item.category as any) || "sightseeing",
              durationMins: item.durationMins,
              costCents: item.costCents,
              date: item.date,
              startTime: item.startTime || "10:00",
              position: item.position,
            })),
        })),
      }
    }
  } catch (err) {
    console.warn("apiGetTripById error", err)
  }

  const userTrips = await loadUserTrips(userId, true)
  return userTrips.find((t) => t.id === tripId) || fallbackTrips[0]
}
