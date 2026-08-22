"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { trips as initialTrips, formatCurrency, Trip, cities as fallbackCities } from "@/lib/data"
import { apiGetTrips, apiDeleteTrip } from "@/lib/api-client"
import {
  Plus,
  Search,
  Calendar,
  MapPin,
  Wallet,
  MoreVertical,
  Grid,
  List as ListIcon,
  Share2,
  Trash2,
  Edit,
  Eye,
} from "lucide-react"

export default function MyTripsPage() {
  const [trips, setTrips] = useState<Trip[]>(initialTrips)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTrips() {
      const apiTrips = await apiGetTrips()
      if (apiTrips && apiTrips.length > 0) {
        const mapped: Trip[] = apiTrips.map((t) => ({
          id: t.id,
          userId: t.userId,
          name: t.name,
          description: t.description || "",
          startDate: t.startDate,
          endDate: t.endDate,
          budgetCents: t.budgetCents || 0,
          isPublic: t.isPublic,
          shareSlug: t.shareSlug,
          coverImageUrl: t.coverImageUrl || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200",
          status: "upcoming",
          stops: Array.from({ length: t.stopCount || 0 }, (_, i) => ({
            id: `stop-${i}`,
            tripId: t.id,
            cityId: "city",
            city: fallbackCities[i % fallbackCities.length],
            position: i * 1000,
            arrivalDate: t.startDate,
            departureDate: t.endDate,
            activities: [],
          })),
        }))
        setTrips(mapped)
      }
      setLoading(false)
    }
    loadTrips()
  }, [])

  const handleDeleteTrip = async (id: string) => {
    await apiDeleteTrip(id)
    setTrips((prev) => prev.filter((t) => t.id !== id))
  }

  const filteredTrips = trips.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || t.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <AppShell>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Personal Collection</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">My Trips ({filteredTrips.length})</h1>
            <p className="text-sm text-muted-foreground">Manage and organize all your upcoming and past itineraries.</p>
          </div>
          <Link href="/trips/new">
            <Button className="rounded-xl font-bold bg-gradient-to-r from-primary to-emerald-500 text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-95 transition-all">
              <Plus className="mr-2 h-4 w-4" /> Create New Trip
            </Button>
          </Link>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search trip name, destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-auto">
              <TabsList className="grid grid-cols-4 h-10 p-1 bg-muted/60">
                <TabsTrigger value="all" className="text-xs font-semibold">All</TabsTrigger>
                <TabsTrigger value="upcoming" className="text-xs font-semibold">Upcoming</TabsTrigger>
                <TabsTrigger value="completed" className="text-xs font-semibold">Completed</TabsTrigger>
                <TabsTrigger value="draft" className="text-xs font-semibold">Drafts</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center border border-border rounded-xl p-1 bg-muted/30">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={() => setViewMode("list")}
              >
                <ListIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Trips Display Grid/List */}
        {filteredTrips.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2 rounded-2xl">
            <p className="text-lg font-bold text-muted-foreground">No trips found</p>
            <p className="text-xs text-muted-foreground mt-1">Try resetting your filters or start a new trip.</p>
            <Link href="/trips/new" className="mt-4 inline-block">
              <Button className="rounded-xl font-bold text-xs">+ Create New Trip</Button>
            </Link>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((t) => (
              <Card
                key={t.id}
                className="group overflow-hidden border-border/60 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={t.coverImageUrl}
                      alt={t.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <Badge className="absolute left-3 top-3 capitalize font-bold bg-slate-950/80 text-cyan-300">
                      {t.status}
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute right-3 top-3 h-8 w-8 rounded-xl bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 rounded-xl">
                        <DropdownMenuItem asChild>
                          <Link href={`/trips/${t.id}`} className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/trips/${t.id}/builder`} className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" /> Edit Builder
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/shared/${t.id}`} className="cursor-pointer">
                            <Share2 className="mr-2 h-4 w-4" /> Share Public
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteTrip(t.id)}
                          className="text-destructive cursor-pointer font-semibold"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Trip
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-bold text-lg leading-tight group-hover:text-cyan-300 transition-colors">
                        {t.name}
                      </h3>
                    </div>
                  </div>

                  <CardContent className="p-5 space-y-4">
                    <p className="text-xs text-muted-foreground line-clamp-2">{t.description}</p>

                    <div className="space-y-2 text-xs text-muted-foreground pt-2 border-t border-border/60">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Calendar className="h-3.5 w-3.5 text-primary" /> {t.startDate} → {t.endDate}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="flex items-center gap-1.5 font-medium">
                          <MapPin className="h-3.5 w-3.5 text-primary" /> {t.stops ? t.stops.length : 0} Stop Cities
                        </span>
                        <span className="flex items-center gap-1.5 font-bold text-foreground">
                          <Wallet className="h-3.5 w-3.5 text-emerald-500" /> {formatCurrency(t.budgetCents || 0)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </div>

                <div className="p-5 pt-0 flex gap-2">
                  <Link href={`/trips/${t.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full rounded-xl text-xs font-semibold">
                      View
                    </Button>
                  </Link>
                  <Link href={`/trips/${t.id}/builder`} className="flex-1">
                    <Button size="sm" className="w-full rounded-xl text-xs font-bold">
                      Edit Itinerary
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}

            {/* Create Card Shortcut */}
            <Link href="/trips/new">
              <Card className="h-full min-h-[300px] border-dashed border-2 border-primary/40 rounded-2xl flex flex-col items-center justify-center p-6 text-center hover:bg-accent/40 transition-colors group cursor-pointer">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Plus className="h-6 w-6" />
                </div>
                <p className="mt-4 font-bold text-base text-foreground">Create New Trip</p>
                <p className="mt-1 text-xs text-muted-foreground">Add destinations, dates, and build your schedule</p>
              </Card>
            </Link>
          </div>
        ) : (
          /* List Mode */
          <div className="space-y-3">
            {filteredTrips.map((t) => (
              <Card key={t.id} className="overflow-hidden border-border/60 rounded-2xl hover:shadow-lg transition-all p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={t.coverImageUrl} alt={t.name} className="h-16 w-20 rounded-xl object-cover shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-foreground">{t.name}</h3>
                        <Badge variant="secondary" className="text-[10px] capitalize">{t.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{t.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                        <span>📅 {t.startDate} → {t.endDate}</span>
                        <span>📍 {t.stops ? t.stops.length : 0} Cities</span>
                        <span className="font-bold text-foreground">💰 {formatCurrency(t.budgetCents || 0)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                    <Link href={`/trips/${t.id}`}>
                      <Button size="sm" variant="outline" className="rounded-xl text-xs font-semibold">View</Button>
                    </Link>
                    <Link href={`/trips/${t.id}/builder`}>
                      <Button size="sm" className="rounded-xl text-xs font-bold">Edit</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}

