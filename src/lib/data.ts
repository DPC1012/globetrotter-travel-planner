export type Category = "sightseeing" | "food" | "adventure" | "culture"

export type User = {
  id: string
  name: string
  email: string
  image: string
  city: string
  country: string
  memberSince: string
}

export type City = {
  id: string
  name: string
  country: string
  region: string
  lat: number
  lng: number
  costIndex: number // 1-100
  popularity: number // 1-100
  image: string
  description: string
}

export type Activity = {
  id: string
  cityId: string
  title: string
  description: string
  category: Category
  durationMins: number
  costCents: number
  image: string
  rating: number
}

export type TripActivity = {
  id: string
  stopId: string
  activityId?: string
  title: string
  category: Category
  durationMins: number
  costCents: number
  date: string // YYYY-MM-DD
  startTime: string // HH:mm
  position: number
}

export type Stop = {
  id: string
  tripId: string
  cityId: string
  city: City
  position: number
  arrivalDate: string
  departureDate: string
  activities: TripActivity[]
}

export type Trip = {
  id: string
  userId: string
  name: string
  description: string
  startDate: string
  endDate: string
  budgetCents: number
  isPublic: boolean
  shareSlug: string
  coverImageUrl: string
  status: "upcoming" | "ongoing" | "completed" | "draft"
  stops: Stop[]
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

export const currentUser: User = {
  id: "user-1",
  name: "Alex Rivera",
  email: "alex.rivera@globetrotter.com",
  image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
  city: "San Francisco",
  country: "United States",
  memberSince: "2025-01-15",
}

export const cities: City[] = [
  {
    id: "paris",
    name: "Paris",
    country: "France",
    region: "Europe",
    lat: 48.8566,
    lng: 2.3522,
    costIndex: 78,
    popularity: 98,
    image: "https://images.unsplash.com/photo-1499856871958-5b9627505d1a?w=800",
    description: "City of lights, world-class art, culinary magic & romance.",
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    region: "Asia",
    lat: 35.6762,
    lng: 139.6503,
    costIndex: 72,
    popularity: 96,
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
    description: "Futuristic skyscrapers, ancient shrines & world-renowned dining.",
  },
  {
    id: "rome",
    name: "Rome",
    country: "Italy",
    region: "Europe",
    lat: 41.9028,
    lng: 12.4964,
    costIndex: 65,
    popularity: 94,
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800",
    description: "Eternal city of ancient gladiators, baroque plazas & gelato.",
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    region: "Asia",
    lat: -8.4095,
    lng: 115.1889,
    costIndex: 38,
    popularity: 90,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
    description: "Tropical island sanctuary of rice terraces, beaches & temples.",
  },
  {
    id: "barcelona",
    name: "Barcelona",
    country: "Spain",
    region: "Europe",
    lat: 41.3851,
    lng: 2.1734,
    costIndex: 58,
    popularity: 92,
    image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800",
    description: "Gaudí architectural masterpieces, tapas bars & Mediterranean coastline.",
  },
  {
    id: "newyork",
    name: "New York",
    country: "United States",
    region: "North America",
    lat: 40.7128,
    lng: -74.006,
    costIndex: 85,
    popularity: 97,
    image: "https://images.unsplash.com/photo-1490644658840-3f2e3f8c5625?w=800",
    description: "The city that never sleeps: Broadway, museums & iconic skyline.",
  },
  {
    id: "kyoto",
    name: "Kyoto",
    country: "Japan",
    region: "Asia",
    lat: 35.0116,
    lng: 135.7681,
    costIndex: 64,
    popularity: 91,
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
    description: "Japan's cultural heartland: wooden teahouses, geisha & bamboo groves.",
  },
  {
    id: "santorini",
    name: "Santorini",
    country: "Greece",
    region: "Europe",
    lat: 36.3932,
    lng: 25.4615,
    costIndex: 80,
    popularity: 89,
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
    description: "Whitewashed Aegean cliffside villages & breathtaking volcanic sunsets.",
  },
]

export const activities: Activity[] = [
  {
    id: "act-1",
    cityId: "paris",
    title: "Eiffel Tower Summit & Champagne",
    description: "Guided priority access to the top floor with glass of champagne.",
    category: "sightseeing",
    durationMins: 180,
    costCents: 6500, // $65.00
    image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600",
    rating: 4.9,
  },
  {
    id: "act-2",
    cityId: "paris",
    title: "Louvre Museum Masterpieces Tour",
    description: "Skip-the-line small group tour covering Mona Lisa & Venus de Milo.",
    category: "culture",
    durationMins: 150,
    costCents: 5200, // $52.00
    image: "https://images.unsplash.com/photo-1565099824688-e93eb20fe622?w=600",
    rating: 4.8,
  },
  {
    id: "act-3",
    cityId: "paris",
    title: "Seine Gourmet Dinner Cruise",
    description: "3-course French dinner accompanied by live acoustic jazz.",
    category: "food",
    durationMins: 150,
    costCents: 11000, // $110.00
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600",
    rating: 4.7,
  },
  {
    id: "act-4",
    cityId: "rome",
    title: "Colosseum & Roman Forum Underground",
    description: "Exclusive access to gladiator arena floor and underground tunnels.",
    category: "culture",
    durationMins: 210,
    costCents: 5800, // $58.00
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600",
    rating: 4.9,
  },
  {
    id: "act-5",
    cityId: "rome",
    title: "Trastevere Authentic Street Food Walk",
    description: "Taste fresh supplì, artisanal pizza, pecorino cheese & classic gelato.",
    category: "food",
    durationMins: 180,
    costCents: 4500, // $45.00
    image: "https://images.unsplash.com/photo-1533777857889-4be7c70b31f8?w=600",
    rating: 4.9,
  },
  {
    id: "act-6",
    cityId: "barcelona",
    title: "Sagrada Família Towers Access",
    description: "Architectural masterpiece by Antoni Gaudí with elevator tower view.",
    category: "sightseeing",
    durationMins: 120,
    costCents: 3800, // $38.00
    image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600",
    rating: 4.8,
  },
  {
    id: "act-7",
    cityId: "tokyo",
    title: "Shibuya & Harajuku Hidden Alleyways",
    description: "Explore youth street culture, retro arcades & hidden matcha cafes.",
    category: "adventure",
    durationMins: 240,
    costCents: 3500, // $35.00
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600",
    rating: 4.9,
  },
  {
    id: "act-8",
    cityId: "tokyo",
    title: "Tsukiji Outer Market Omakase Tasting",
    description: "Fresh sashimi, tamagoyaki, and wagyu beef skewers from local vendors.",
    category: "food",
    durationMins: 120,
    costCents: 7500, // $75.00
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600",
    rating: 4.9,
  },
  {
    id: "act-9",
    cityId: "bali",
    title: "Ubud Jungle Swing & Rice Terrace Trek",
    description: "Soar over Tegallalang rice paddies and visit sacred monkey forest.",
    category: "adventure",
    durationMins: 180,
    costCents: 2800, // $28.00
    image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600",
    rating: 4.7,
  },
]

export const trips: Trip[] = [
  {
    id: "trip-1",
    userId: "user-1",
    name: "European Grand Tour",
    description: "Classic 12-day journey exploring Paris, Rome & Barcelona.",
    startDate: "2026-09-10",
    endDate: "2026-09-22",
    budgetCents: 350000, // $3,500.00
    isPublic: true,
    shareSlug: "european-grand-tour-2026",
    coverImageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200",
    status: "upcoming",
    stops: [
      {
        id: "stop-1",
        tripId: "trip-1",
        cityId: "paris",
        city: cities[0],
        position: 0,
        arrivalDate: "2026-09-10",
        departureDate: "2026-09-14",
        activities: [
          {
            id: "tact-1",
            stopId: "stop-1",
            activityId: "act-1",
            title: "Eiffel Tower Summit & Champagne",
            category: "sightseeing",
            durationMins: 180,
            costCents: 6500,
            date: "2026-09-11",
            startTime: "16:00",
            position: 0,
          },
          {
            id: "tact-2",
            stopId: "stop-1",
            activityId: "act-2",
            title: "Louvre Museum Masterpieces Tour",
            category: "culture",
            durationMins: 150,
            costCents: 5200,
            date: "2026-09-12",
            startTime: "10:00",
            position: 1000,
          },
          {
            id: "tact-3",
            stopId: "stop-1",
            activityId: "act-3",
            title: "Seine Gourmet Dinner Cruise",
            category: "food",
            durationMins: 150,
            costCents: 11000,
            date: "2026-09-13",
            startTime: "19:30",
            position: 2000,
          },
        ],
      },
      {
        id: "stop-2",
        tripId: "trip-1",
        cityId: "rome",
        city: cities[2],
        position: 1000,
        arrivalDate: "2026-09-14",
        departureDate: "2026-09-18",
        activities: [
          {
            id: "tact-4",
            stopId: "stop-2",
            activityId: "act-4",
            title: "Colosseum & Roman Forum Underground",
            category: "culture",
            durationMins: 210,
            costCents: 5800,
            date: "2026-09-15",
            startTime: "09:30",
            position: 0,
          },
          {
            id: "tact-5",
            stopId: "stop-2",
            activityId: "act-5",
            title: "Trastevere Authentic Street Food Walk",
            category: "food",
            durationMins: 180,
            costCents: 4500,
            date: "2026-09-16",
            startTime: "18:00",
            position: 1000,
          },
        ],
      },
      {
        id: "stop-3",
        tripId: "trip-1",
        cityId: "barcelona",
        city: cities[4],
        position: 2000,
        arrivalDate: "2026-09-18",
        departureDate: "2026-09-22",
        activities: [
          {
            id: "tact-6",
            stopId: "stop-3",
            activityId: "act-6",
            title: "Sagrada Família Towers Access",
            category: "sightseeing",
            durationMins: 120,
            costCents: 3800,
            date: "2026-09-19",
            startTime: "11:00",
            position: 0,
          },
        ],
      },
    ],
  },
  {
    id: "trip-2",
    userId: "user-1",
    name: "Japan Cherry Blossom Express",
    description: "Spring sakura season across Tokyo & Kyoto.",
    startDate: "2026-04-01",
    endDate: "2026-04-10",
    budgetCents: 280000, // $2,800.00
    isPublic: true,
    shareSlug: "japan-sakura-2026",
    coverImageUrl: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=1200",
    status: "upcoming",
    stops: [
      {
        id: "stop-4",
        tripId: "trip-2",
        cityId: "tokyo",
        city: cities[1],
        position: 0,
        arrivalDate: "2026-04-01",
        departureDate: "2026-04-06",
        activities: [
          {
            id: "tact-7",
            stopId: "stop-4",
            activityId: "act-7",
            title: "Shibuya & Harajuku Hidden Alleyways",
            category: "adventure",
            durationMins: 240,
            costCents: 3500,
            date: "2026-04-02",
            startTime: "14:00",
            position: 0,
          },
        ],
      },
      {
        id: "stop-5",
        tripId: "trip-2",
        cityId: "kyoto",
        city: cities[6],
        position: 1000,
        arrivalDate: "2026-04-06",
        departureDate: "2026-04-10",
        activities: [],
      },
    ],
  },
  {
    id: "trip-3",
    userId: "user-1",
    name: "Tropical Bali Escape",
    description: "Relaxing wellness & adventure trip to Ubud & coastal reefs.",
    startDate: "2026-02-14",
    endDate: "2026-02-20",
    budgetCents: 125000, // $1,250.00
    isPublic: false,
    shareSlug: "bali-escape-feb",
    coverImageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200",
    status: "completed",
    stops: [
      {
        id: "stop-6",
        tripId: "trip-3",
        cityId: "bali",
        city: cities[3],
        position: 0,
        arrivalDate: "2026-02-14",
        departureDate: "2026-02-20",
        activities: [
          {
            id: "tact-8",
            stopId: "stop-6",
            activityId: "act-9",
            title: "Ubud Jungle Swing & Rice Terrace Trek",
            category: "adventure",
            durationMins: 180,
            costCents: 2800,
            date: "2026-02-15",
            startTime: "09:00",
            position: 0,
          },
        ],
      },
    ],
  },
]

export const savedCityIds = ["paris", "tokyo", "santorini"]

export const adminStats = {
  totalUsers: 14280,
  activeTrips: 3892,
  publicTrips: 1840,
  totalRevenueCents: 12450000, // $124,500.00
  popularCities: [
    { name: "Paris", tripsCount: 1420 },
    { name: "Tokyo", tripsCount: 1280 },
    { name: "Rome", tripsCount: 950 },
    { name: "Barcelona", tripsCount: 880 },
    { name: "Bali", tripsCount: 760 },
  ],
  userGrowth: [
    { month: "Jan", users: 1200 },
    { month: "Feb", users: 2100 },
    { month: "Mar", users: 3400 },
    { month: "Apr", users: 5100 },
    { month: "May", users: 8900 },
    { month: "Jun", users: 14280 },
  ],
}
