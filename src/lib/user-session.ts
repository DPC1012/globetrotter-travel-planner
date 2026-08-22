import { useEffect, useState } from "react"
import { useSession, signOut as betterSignOut } from "@/lib/auth/client"
import { currentUser, User } from "@/lib/data"

const STORAGE_KEY = "gt_custom_user_session"

export function useUserSession() {
  const { data: betterSession, isPending } = useSession()
  const [customUser, setCustomUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          setCustomUser(JSON.parse(stored))
        }
      } catch (e) {
        console.warn("Failed to parse custom user session from localStorage", e)
      }
    }
    setLoading(false)
  }, [])

  // Priority: 1. Better Auth session -> 2. Local custom signed-up user -> 3. Fallback Alex Rivera
  const user: User = betterSession?.user
    ? {
        id: betterSession.user.id,
        name: betterSession.user.name || "Traveler",
        email: betterSession.user.email || "",
        image: betterSession.user.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
        city: "San Francisco",
        country: "United States",
        memberSince: "2026-01-01",
      }
    : customUser || currentUser

  const isAuthenticated = Boolean(betterSession || customUser)

  const saveLocalSession = (name: string, email: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
      city: "Global Explorer",
      country: "Worldwide",
      memberSince: new Date().toISOString().split("T")[0],
    }
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
    }
    setCustomUser(newUser)
    return newUser
  }

  const logout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY)
    }
    setCustomUser(null)
    try {
      await betterSignOut()
    } catch {
      // Ignore auth logout errors if server unreachable
    }
  }

  return {
    user,
    isAuthenticated,
    isPending: isPending && loading,
    saveLocalSession,
    logout,
  }
}
