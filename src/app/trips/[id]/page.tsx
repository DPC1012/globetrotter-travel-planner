"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { trips as fallbackTrips, formatCurrency, Trip } from "@/lib/data"
import { apiGetTripById, apiShareTrip } from "@/lib/api-client"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Wallet,
  Share2,
  Printer,
  Edit,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from "lucide-react"

import { useUserSession } from "@/lib/user-session"
import { findUserTripById } from "@/lib/user-trips"

export default function ItineraryViewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const tripId = resolvedParams.id
  const { user } = useUserSession()

  const [trip, setTrip] = useState<Trip>(fallbackTrips[0])
  const [viewMode, setViewMode] = useState<"timeline" | "cities">("timeline")
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTrip() {
      const foundTrip = await findUserTripById(user.id, tripId)
      if (foundTrip) {
        setTrip(foundTrip)
      }
      setLoading(false)
    }
    loadTrip()
  }, [tripId, user.id])

  const handleShare = async () => {
    const nextPublicState = !trip.isPublic
    const res = await apiShareTrip(trip.id, nextPublicState)
    if (res) {
      setTrip((prev) => ({ ...prev, isPublic: nextPublicState, shareSlug: res.shareSlug || prev.shareSlug }))
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  const totalCostCents = trip.stops.reduce(
    (stopAcc, stop) => stopAcc + stop.activities.reduce((actAcc, act) => actAcc + act.costCents, 0),
    0
  )

  return (
    <AppShell>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Top Actions Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/trips"
            className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to My Trips
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="rounded-xl text-xs font-bold">
              <Printer className="mr-1.5 h-4 w-4" /> Export / Print PDF
            </Button>
            <Button
              variant={trip.isPublic ? "default" : "outline"}
              size="sm"
              onClick={handleShare}
              className="rounded-xl text-xs font-bold"
            >
              <Share2 className="mr-1.5 h-4 w-4" /> {trip.isPublic ? "Public (Toggle)" : "Share Trip"}
            </Button>
            <Link href={`/trips/${trip.id}/builder`}>
              <Button size="sm" className="rounded-xl text-xs font-bold">
                <Edit className="mr-1.5 h-4 w-4" /> Edit Itinerary
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Cover Card */}
        <div className="relative overflow-hidden rounded-3xl border border-border/60 shadow-2xl">
          <div className="relative h-72 sm:h-96 w-full">
            <img src={trip.coverImageUrl} alt={trip.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <Badge className="absolute left-6 top-6 capitalize font-bold bg-slate-950/80 text-cyan-300 text-sm px-3.5 py-1">
              {trip.status}
            </Badge>

            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest">
                <Sparkles className="h-4 w-4" /> Multi-City Masterpiece
              </div>
              <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight">{trip.name}</h1>
              <p className="text-sm text-slate-300 max-w-2xl">{trip.description}</p>
            </div>
          </div>

          <div className="bg-card p-6 border-t border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Travel Dates</p>
              <p className="mt-1 font-bold text-sm text-foreground flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" /> {trip.startDate} → {trip.endDate}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground">Stops Included</p>
              <p className="mt-1 font-bold text-sm text-foreground flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" /> {trip.stops.length} Cities
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground">Scheduled Expenses</p>
              <p className="mt-1 font-bold text-sm text-emerald-500 flex items-center gap-1.5">
                <Wallet className="h-4 w-4" /> {formatCurrency(totalCostCents)}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground">Public Share Slug</p>
              <Link href={`/shared/${trip.shareSlug || trip.id}`} className="mt-1 font-bold text-xs text-primary hover:underline flex items-center gap-1">
                /t/{trip.shareSlug || trip.id} <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* View Switcher Bar */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <h2 className="text-2xl font-black tracking-tight">Structured Itinerary</h2>
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "timeline" | "cities")}>
            <TabsList className="grid grid-cols-2 w-56 h-10 p-1 bg-muted/60">
              <TabsTrigger value="timeline" className="text-xs font-semibold">Timeline View</TabsTrigger>
              <TabsTrigger value="cities" className="text-xs font-semibold">Grouped Cities</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Itinerary Schedule Output */}
        {viewMode === "timeline" ? (
          <div className="relative space-y-8 pl-6 border-l-2 border-primary/30 ml-4">
            {trip.stops.map((stop, sIdx) => (
              <div key={stop.id} className="relative space-y-4">
                {/* Stop Marker Node */}
                <div className="absolute -left-[31px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-black text-xs shadow-lg ring-4 ring-background">
                  {sIdx + 1}
                </div>

                <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-3">
                      <img src={stop.city.image} alt={stop.city.name} className="h-10 w-10 rounded-xl object-cover" />
                      <div>
                        <h3 className="font-bold text-lg text-foreground">{stop.city.name}, {stop.city.country}</h3>
                        <p className="text-xs text-muted-foreground">📅 {stop.arrivalDate} → {stop.departureDate}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs font-semibold">
                      {stop.activities.length} Activities
                    </Badge>
                  </div>

                  <div className="mt-4 space-y-3">
                    {stop.activities.map((act) => (
                      <div
                        key={act.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border/60 bg-muted/20"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          <div>
                            <p className="font-bold text-sm text-foreground">{act.title}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                              <span className="capitalize">{act.category}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {act.startTime} ({act.durationMins} mins)</span>
                            </div>
                          </div>
                        </div>

                        <span className="font-bold text-sm text-emerald-500">{formatCurrency(act.costCents)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Grouped by Cities Grid */
          <div className="grid md:grid-cols-2 gap-6">
            {trip.stops.map((stop) => (
              <Card key={stop.id} className="border-border/60 shadow-xl rounded-2xl">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center gap-3">
                    <img src={stop.city.image} alt={stop.city.name} className="h-12 w-12 rounded-xl object-cover" />
                    <div>
                      <CardTitle className="text-lg">{stop.city.name}, {stop.city.country}</CardTitle>
                      <CardDescription className="text-xs">
                        {stop.arrivalDate} → {stop.departureDate}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  {stop.activities.map((act) => (
                    <div key={act.id} className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 text-xs">
                      <div>
                        <p className="font-bold text-foreground">{act.title}</p>
                        <p className="text-muted-foreground text-[11px]">{act.startTime} • {act.durationMins} mins</p>
                      </div>
                      <span className="font-bold text-emerald-500">{formatCurrency(act.costCents)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}

