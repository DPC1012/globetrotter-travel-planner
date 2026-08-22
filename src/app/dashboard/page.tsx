"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { trips as fallbackTrips, cities as fallbackCities, formatCurrency, currentUser, Trip, City } from "@/lib/data"
import { apiGetTrips, apiGetTopCities } from "@/lib/api-client"
import { useUserSession } from "@/lib/user-session"
import {
  Plus,
  MapPin,
  Calendar,
  Wallet,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Compass,
  Globe2,
  Share2,
} from "lucide-react"

import { loadUserTrips } from "@/lib/user-trips"

export default function Dashboard() {
  const { user } = useUserSession()
  const [userTrips, setUserTrips] = useState<Trip[]>([])
  const [topCities, setTopCities] = useState<City[]>(fallbackCities.slice(0, 3))
  const [loading, setLoading] = useState(true)

  const userName = user.name ? user.name.split(" ")[0] : "Traveler"
  const isDemoUser = user.email === "demo@globetrotter.com" || user.id === "user-1"

  useEffect(() => {
    async function loadData() {
      const [tripsData, apiCities] = await Promise.all([
        loadUserTrips(user.id, isDemoUser),
        apiGetTopCities(),
      ])

      setUserTrips(tripsData)
      if (apiCities && apiCities.length > 0) {
        setTopCities(apiCities.slice(0, 3))
      }
      setLoading(false)
    }

    loadData()
  }, [user.id, isDemoUser])

  const upcomingTrips = userTrips.filter((t) => t.status === "upcoming" || t.status === "ongoing")
  const totalBudgetCents = userTrips.reduce((acc, curr) => acc + (curr.budgetCents || 0), 0)
  const totalStops = userTrips.reduce((acc, curr) => acc + (curr.stops ? curr.stops.length : 0), 0)

  return (
    <AppShell>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Welcome Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-foreground" /> Travel Command Center
            </div>
            <h1 className="mt-1 font-script text-5xl sm:text-6xl font-normal text-foreground">
              Welcome back, {userName}
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">
              You have {upcomingTrips.length} active multi-city adventures scheduled.
            </p>
          </div>

          <Link href="/trips/new">
            <Button variant="default" className="rounded-xl font-bold">
              <Plus className="mr-2 h-4 w-4" /> PLAN NEW TRIP
            </Button>
          </Link>
        </div>

        {/* Financial & Metric Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="polaroid-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Trips</p>
                <div className="rounded-sm bg-foreground/10 p-2 text-foreground">
                  <Globe2 className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-black text-foreground">{userTrips.length}</p>
              <p className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 font-bold uppercase tracking-wider">
                <TrendingUp className="h-3.5 w-3.5" /> +2 this month
              </p>
            </CardContent>
          </Card>

          <Card className="polaroid-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Allocated Budget</p>
                <div className="rounded-sm bg-emerald-500/10 p-2 text-emerald-600">
                  <Wallet className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-black text-foreground">{formatCurrency(totalBudgetCents)}</p>
              <p className="mt-2 text-[11px] text-muted-foreground font-semibold">Across all itineraries</p>
            </CardContent>
          </Card>

          <Card className="polaroid-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Cities & Stops</p>
                <div className="rounded-sm bg-foreground/10 p-2 text-foreground">
                  <MapPin className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-black text-foreground">{totalStops}</p>
              <p className="mt-2 text-[11px] text-muted-foreground font-semibold">Mapped destinations</p>
            </CardContent>
          </Card>

          <Card className="polaroid-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Countries Visited</p>
                <div className="rounded-sm bg-amber-500/10 p-2 text-amber-600">
                  <Compass className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-black text-foreground">6</p>
              <p className="mt-2 text-[11px] text-muted-foreground font-semibold">Across 2 continents</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Trips List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">ON THE HORIZON</p>
                <h2 className="font-serif text-2xl font-bold text-foreground">Upcoming Adventures</h2>
              </div>
              <Link
                href="/trips"
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-foreground hover:underline"
              >
                View all ({userTrips.length}) <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {userTrips.map((t) => (
                <Card
                  key={t.id}
                  className="polaroid-card group overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-48 h-44 sm:h-auto overflow-hidden shrink-0 rounded-sm">
                      <img
                        src={t.coverImageUrl}
                        alt={t.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <Badge className="absolute left-2.5 top-2.5 capitalize">
                        {t.status}
                      </Badge>
                    </div>

                    <CardContent className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-serif font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                            {t.name}
                          </h3>
                          {t.isPublic && (
                            <Badge variant="emerald">
                              PUBLIC
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{t.description}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-border">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1.5 font-semibold">
                            <Calendar className="h-3.5 w-3.5 text-foreground" /> {t.startDate} → {t.endDate}
                          </span>
                          <span className="flex items-center gap-1.5 font-semibold">
                            <MapPin className="h-3.5 w-3.5 text-foreground" /> {t.stops ? t.stops.length : 0} Cities
                          </span>
                          <span className="flex items-center gap-1.5 font-bold text-foreground">
                            <Wallet className="h-3.5 w-3.5 text-emerald-600" /> {formatCurrency(t.budgetCents || 0)}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/trips/${t.id}`} className="flex-1">
                            <Button size="sm" variant="secondary" className="w-full font-bold">
                              OVERVIEW
                            </Button>
                          </Link>
                          <Link href={`/trips/${t.id}/builder`} className="flex-1">
                            <Button size="sm" variant="default" className="w-full font-bold">
                              EDIT BUILDER
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Recommended Destinations Sidebar */}
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">INSPIRATION</p>
              <h2 className="font-serif text-2xl font-bold text-foreground">Recommended Cities</h2>
            </div>

            <div className="space-y-4">
              {topCities.map((city) => (
                <Card key={city.id} className="polaroid-card">
                  <div className="relative h-32 overflow-hidden rounded-sm">
                    <img src={city.image} alt={city.name} className="h-full w-full object-cover" />
                    <Badge className="absolute left-2.5 top-2.5">
                      INDEX {city.costIndex}/100
                    </Badge>
                  </div>
                  <CardContent className="p-3">
                    <p className="font-serif font-bold text-base text-foreground">{city.name}, {city.country}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{city.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-600">{city.popularity}% Rating</span>
                      <Link href={`/trips/new?destination=${encodeURIComponent(city.name)}`}>
                        <Button size="sm" variant="secondary" className="h-7 text-[10px] font-bold">
                          + ADD TO TRIP
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Public Community Banner Card — Jet Black Style */}
            <Card className="polaroid-card bg-foreground text-background">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-amber-400" />
                  <p className="font-serif font-bold text-lg text-background">Community Travel Logs</p>
                </div>
                <p className="text-xs opacity-80 leading-relaxed">
                  Browse community travel plans, clone pre-built schedules, or share your own trips.
                </p>
                <Link href="/shared/demo" className="block pt-1">
                  <Button variant="secondary" size="sm" className="w-full bg-background text-foreground font-bold hover:bg-muted">
                    BROWSE PUBLIC LOGS
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

