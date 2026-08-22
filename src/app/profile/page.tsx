"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useUserSession } from "@/lib/user-session"
import { apiGetSavedCities, apiRemoveSavedCity } from "@/lib/api-client"
import { City } from "@/lib/data"
import { LogOut, Heart, MapPin, UserCheck, Trash2 } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, isAuthenticated } = useUserSession()
  const [savedCities, setSavedCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)

  const userInitials = user.name ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "GT"

  useEffect(() => {
    async function loadSavedCities() {
      const data = await apiGetSavedCities()
      if (data) setSavedCities(data)
      setLoading(false)
    }
    loadSavedCities()
  }, [])

  async function handleRemoveSavedCity(cityId: string) {
    await apiRemoveSavedCity(cityId)
    setSavedCities((prev) => prev.filter((c) => c.id !== cityId))
  }

  return (
    <AppShell>
      <div className="max-w-4xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile & Preferences</h1>
            <p className="text-muted-foreground text-sm">Manage your account credentials and saved wishlist destinations.</p>
          </div>
          <Button
            onClick={async () => {
              await logout()
              router.push("/login")
            }}
            variant="destructive"
            className="rounded-xl font-bold gap-2"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>

        <Card className="border-border/60 shadow-md rounded-2xl">
          <CardHeader className="border-b border-border/40 pb-4">
            <div className="flex items-center gap-3">
              <UserCheck className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-xl">Account Profile</CardTitle>
                <CardDescription className="text-xs">Your registered personal information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-primary/40 shadow">
                <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                <AvatarFallback className="text-lg font-black bg-primary/20 text-primary">{userInitials}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-lg">{user.name || "Traveler"}</h3>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <Badge variant="outline" className="mt-2 text-[10px] font-bold border-primary/30 text-primary">
                  {isAuthenticated ? "Authenticated Session" : "Guest Mode"}
                </Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input defaultValue={user.name || ""} readOnly className="rounded-xl bg-muted/30" />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input defaultValue={user.email || ""} readOnly className="rounded-xl bg-muted/30" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-md rounded-2xl">
          <CardHeader className="border-b border-border/40 pb-4">
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-red-500 fill-red-500/20" />
              <div>
                <CardTitle className="text-xl">Saved Wishlist Cities</CardTitle>
                <CardDescription className="text-xs">Destinations you have bookmarked while exploring</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {savedCities.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No saved cities yet. Visit <span className="font-bold text-primary">Explore Cities</span> to bookmark your favorite destinations!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {savedCities.map((city) => (
                  <div key={city.id} className="relative group rounded-xl overflow-hidden border border-border/60 bg-card shadow-sm hover:shadow-md transition-all">
                    <img src={city.image} alt={city.name} className="h-28 w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="p-3 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm leading-none">{city.name}</h4>
                        <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-primary" /> {city.country}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemoveSavedCity(city.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-lg"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}

