import { Trip, City, Activity, Stop, TripActivity } from "@/lib/data"

// Response types from backend API
export type ApiTripWithStats = {
  id: string
  userId: string
  name: string
  description: string | null
  startDate: string
  endDate: string
  budgetCents: number | null
  isPublic: boolean
  shareSlug: string
  coverImageUrl: string | null
  createdAt: string
  stopCount: number
  totalCostCents: number
}

export type ApiFullTrip = {
  trip: {
    id: string
    userId: string
    name: string
    description: string | null
    startDate: string
    endDate: string
    budgetCents: number | null
    isPublic: boolean
    shareSlug: string
    coverImageUrl: string | null
    createdAt: string
  }
  stops: Array<{
    id: string
    tripId: string
    cityId: string
    position: number
    arrivalDate: string
    departureDate: string
    city: {
      id: string
      name: string
      country: string
      region: string
      lat: number
      lng: number
      costIndex: number
      popularity: number
      image: string
      description: string
    }
  }>
  items: Array<{
    id: string
    stopId: string
    activityId: string | null
    title: string
    category: "sightseeing" | "food" | "adventure" | "culture" | "nightlife" | "transport" | "lodging" | "other"
    durationMins: number
    costCents: number
    date: string
    startTime: string | null
    position: number
  }>
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })
    if (!res.ok) {
      console.warn(`API call failed [${res.status}] ${url}`)
      return null
    }
    const data = await res.json()
    return data as T
  } catch (err) {
    console.warn(`API network error on ${url}:`, err)
    return null
  }
}

// ----------------- Trips API -----------------

export async function apiGetTrips(): Promise<ApiTripWithStats[] | null> {
  return fetchJson<ApiTripWithStats[]>("/api/trips")
}

export async function apiGetTripById(tripId: string): Promise<ApiFullTrip | null> {
  return fetchJson<ApiFullTrip>(`/api/trips/${tripId}`)
}

export async function apiCreateTrip(payload: {
  name: string
  startDate: string
  endDate: string
  description?: string
  coverImageUrl?: string
}): Promise<{ id: string } | null> {
  return fetchJson<{ id: string }>("/api/trips", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function apiUpdateTrip(
  tripId: string,
  payload: {
    name?: string
    startDate?: string
    endDate?: string
    description?: string | null
    coverImageUrl?: string | null
    budgetCents?: number | null
  }
): Promise<{ success: boolean } | null> {
  return fetchJson<{ success: boolean }>(`/api/trips/${tripId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export async function apiDeleteTrip(tripId: string): Promise<{ success: boolean } | null> {
  return fetchJson<{ success: boolean }>(`/api/trips/${tripId}`, {
    method: "DELETE",
  })
}

export async function apiShareTrip(tripId: string, isPublic: boolean): Promise<{ success: boolean; shareSlug: string } | null> {
  return fetchJson<{ success: boolean; shareSlug: string }>(`/api/trips/${tripId}/share`, {
    method: "POST",
    body: JSON.stringify({ isPublic }),
  })
}

// ----------------- Stops API -----------------

export async function apiAddStop(
  tripId: string,
  payload: { cityId: string; arrivalDate: string; departureDate: string }
): Promise<{ id: string } | null> {
  return fetchJson<{ id: string }>(`/api/trips/${tripId}/stops`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function apiUpdateStop(
  stopId: string,
  payload: { arrivalDate?: string; departureDate?: string }
): Promise<{ success: boolean } | null> {
  return fetchJson<{ success: boolean }>(`/api/stops/${stopId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export async function apiDeleteStop(stopId: string): Promise<{ success: boolean } | null> {
  return fetchJson<{ success: boolean }>(`/api/stops/${stopId}`, {
    method: "DELETE",
  })
}

export async function apiMoveStop(stopId: string, direction: "up" | "down"): Promise<{ success: boolean } | null> {
  return fetchJson<{ success: boolean }>(`/api/stops/${stopId}/move`, {
    method: "POST",
    body: JSON.stringify({ direction }),
  })
}

// ----------------- Itinerary Items API -----------------

export async function apiAddItem(
  stopId: string,
  payload:
    | { activityId: string; date: string; startTime?: string; position?: number }
    | {
        title: string
        category?: "sightseeing" | "food" | "adventure" | "culture" | "nightlife" | "transport" | "lodging" | "other"
        costCents?: number
        durationMins?: number
        date: string
        startTime?: string
        position?: number
      }
): Promise<{ id: string } | null> {
  return fetchJson<{ id: string }>(`/api/stops/${stopId}/items`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function apiUpdateItem(
  itemId: string,
  payload: { date?: string; startTime?: string | null; costCents?: number; position?: number }
): Promise<{ success: boolean } | null> {
  return fetchJson<{ success: boolean }>(`/api/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export async function apiDeleteItem(itemId: string): Promise<{ success: boolean } | null> {
  return fetchJson<{ success: boolean }>(`/api/items/${itemId}`, {
    method: "DELETE",
  })
}

export async function apiMoveItem(itemId: string, direction: "up" | "down"): Promise<{ success: boolean } | null> {
  return fetchJson<{ success: boolean }>(`/api/items/${itemId}/move`, {
    method: "POST",
    body: JSON.stringify({ direction }),
  })
}

// ----------------- Cities & Activities API -----------------

export async function apiGetCities(query?: string, region?: string): Promise<{ items: City[]; total: number } | null> {
  const params = new URLSearchParams()
  if (query) params.set("q", query)
  if (region && region !== "all") params.set("region", region)
  const queryString = params.toString() ? `?${params.toString()}` : ""
  return fetchJson<{ items: City[]; total: number }>(`/api/cities${queryString}`)
}

export async function apiGetTopCities(): Promise<City[] | null> {
  return fetchJson<City[]>("/api/cities/top")
}

export async function apiGetCityActivities(
  cityId: string,
  category?: string,
  query?: string
): Promise<{ items: Activity[]; total: number } | null> {
  const params = new URLSearchParams()
  if (category && category !== "all") params.set("category", category)
  if (query) params.set("q", query)
  const queryString = params.toString() ? `?${params.toString()}` : ""
  return fetchJson<{ items: Activity[]; total: number }>(`/api/cities/${cityId}/activities${queryString}`)
}

// ----------------- Saved Cities (Wishlist) API -----------------

export async function apiGetSavedCities(): Promise<City[] | null> {
  return fetchJson<City[]>("/api/me/saved-cities")
}

export async function apiSaveCity(cityId: string): Promise<{ success: boolean } | null> {
  return fetchJson<{ success: boolean }>(`/api/me/saved-cities/${cityId}`, {
    method: "POST",
  })
}

export async function apiRemoveSavedCity(cityId: string): Promise<{ success: boolean } | null> {
  return fetchJson<{ success: boolean }>(`/api/me/saved-cities/${cityId}`, {
    method: "DELETE",
  })
}

// ----------------- Public Explore & Share API -----------------

export async function apiGetPublicTrips(): Promise<
  Array<{
    trip: {
      id: string
      userId: string
      name: string
      description: string | null
      startDate: string
      endDate: string
      budgetCents: number | null
      isPublic: boolean
      shareSlug: string
      coverImageUrl: string | null
      createdAt: string
    }
    ownerName: string
    ownerImage: string | null
    stopCount: number
  }> | null
> {
  return fetchJson("/api/public/trips")
}

export async function apiGetPublicTripBySlug(slug: string): Promise<ApiFullTrip | null> {
  return fetchJson<ApiFullTrip>(`/api/public/trips/${encodeURIComponent(slug)}`)
}
