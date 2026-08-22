export type Trip = { id: string; name: string; description: string; startDate: string; endDate: string; cover: string; stops: number; budget: number; status: "upcoming" | "ongoing" | "completed" }
export type City = { id: string; name: string; country: string; region: string; costIndex: number; popularity: number; image: string; description: string }
export type Activity = { id: string; cityId: string; name: string; type: "sightseeing" | "food" | "adventure" | "culture"; cost: number; duration: string; image: string; rating: number }

export const trips: Trip[] = [
  { id: "1", name: "European Explorer", description: "Paris → Rome → Barcelona in 12 days", startDate: "2026-09-10", endDate: "2026-09-22", cover: "https://images.unsplash.com/photo-1499856871958-5b9627505d1a?w=800", stops: 3, budget: 3420, status: "upcoming" },
  { id: "2", name: "Japan Cherry Blossom", description: "Tokyo, Kyoto, Osaka sakura season", startDate: "2026-04-01", endDate: "2026-04-10", cover: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=800", stops: 3, budget: 2850, status: "upcoming" },
  { id: "3", name: "Bali Getaway", description: "Ubud, Seminyak & Nusa Penida", startDate: "2026-02-14", endDate: "2026-02-20", cover: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800", stops: 2, budget: 1240, status: "completed" },
]

export const cities: City[] = [
  { id: "paris", name: "Paris", country: "France", region: "Europe", costIndex: 78, popularity: 98, image: "https://images.unsplash.com/photo-1499856871958-5b9627505d1a?w=600", description: "City of lights, art & romance" },
  { id: "tokyo", name: "Tokyo", country: "Japan", region: "Asia", costIndex: 72, popularity: 96, image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600", description: "Neon nights & ancient temples" },
  { id: "rome", name: "Rome", country: "Italy", region: "Europe", costIndex: 65, popularity: 94, image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600", description: "Eternal city of history" },
  { id: "bali", name: "Bali", country: "Indonesia", region: "Asia", costIndex: 38, popularity: 90, image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600", description: "Tropical paradise island" },
  { id: "barcelona", name: "Barcelona", country: "Spain", region: "Europe", costIndex: 58, popularity: 92, image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600", description: "Gaudí, tapas & beaches" },
  { id: "newyork", name: "New York", country: "USA", region: "North America", costIndex: 85, popularity: 97, image: "https://images.unsplash.com/photo-1490644658840-3f2e3f8c5625?w=600", description: "The city that never sleeps" },
]

export const activities: Activity[] = [
  { id: "a1", cityId: "paris", name: "Eiffel Tower Sunset Tour", type: "sightseeing", cost: 45, duration: "3h", image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600", rating: 4.9 },
  { id: "a2", cityId: "paris", name: "Seine Food Cruise", type: "food", cost: 68, duration: "2.5h", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600", rating: 4.8 },
  { id: "a3", cityId: "tokyo", name: "Shibuya Night Adventure", type: "adventure", cost: 35, duration: "4h", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600", rating: 4.9 },
  { id: "a4", cityId: "rome", name: "Colosseum Underground", type: "culture", cost: 52, duration: "3h", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600", rating: 4.9 },
  { id: "a5", cityId: "bali", name: "Ubud Jungle Swing", type: "adventure", cost: 28, duration: "2h", image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600", rating: 4.7 },
  { id: "a6", cityId: "barcelona", name: "Sagrada Familia Skip-line", type: "sightseeing", cost: 38, duration: "2h", image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600", rating: 4.8 },
]
