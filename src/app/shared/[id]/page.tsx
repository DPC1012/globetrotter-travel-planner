"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlaneTakeoff, Copy, Share2, Heart, Eye, Calendar, MapPin, Wallet, ArrowLeft } from "lucide-react"
import { apiGetPublicTripBySlug, ApiFullTrip } from "@/lib/api-client"
import { trips as fallbackTrips, formatCurrency, Trip } from "@/lib/data"

export default function SharedPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const slug = resolvedParams.id

  const [trip, setTrip] = useState<Trip>(fallbackTrips[0])
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPublicTrip() {
      const data = await apiGetPublicTripBySlug(slug)
      if (data) {
        const mappedTrip: Trip = {
          id: data.trip.id,
          userId: data.trip.userId,
          name: data.trip.name,
          description: data.trip.description || "",
          startDate: data.trip.startDate,
          endDate: data.trip.endDate,
          budgetCents: data.trip.budgetCents || 0,
          isPublic: data.trip.isPublic,
          shareSlug: data.trip.shareSlug,
          coverImageUrl: data.trip.coverImageUrl || "https://images.unsplash.com/photo-1499856871958-5b9627505d1a?w=1200",
          status: "upcoming",
          stops: data.stops.map((s) => ({
            id: s.id,
            tripId: s.tripId,
            cityId: s.cityId,
            city: s.city,
            position: s.position,
            arrivalDate: s.arrivalDate,
            departureDate: s.departureDate,
            activities: data.items
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
        setTrip(mappedTrip)
      } else {
        const found = fallbackTrips.find((t) => t.id === slug || t.shareSlug === slug) || fallbackTrips[0]
        setTrip(found)
      }
      setLoading(false)
    }
    loadPublicTrip()
  }, [slug])

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const totalCostCents = trip.stops.reduce(
    (stopAcc, stop) => stopAcc + stop.activities.reduce((actAcc, act) => actAcc + act.costCents, 0),
    0
  )

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/60">
        <div className="mx-auto max-w-5xl px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow">
              <PlaneTakeoff className="h-5 w-5" />
            </div>
            <span className="font-serif text-xl">Globe<span className="text-primary">Trotter</span></span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCopyLink} className="rounded-xl text-xs font-bold">
              <Copy className="h-4 w-4 mr-1.5" /> {copied ? "Link Copied!" : "Copy Public Link"}
            </Button>
            <Link href="/dashboard">
              <Button className="rounded-xl font-bold text-xs">Clone Trip</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 space-y-8 animate-in fade-in duration-300">
        <div className="rounded-3xl overflow-hidden relative h-72 sm:h-96 border border-border/60 shadow-2xl">
          <img src={trip.coverImageUrl} alt={trip.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary text-primary-foreground font-bold text-xs">Public Log</Badge>
              <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-md border-0 text-xs">
                <Eye className="h-3 w-3 mr-1" /> Verified Itinerary
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight">{trip.name}</h1>
            <p className="text-sm text-slate-300 max-w-2xl">{trip.description}</p>
          </div>
        </div>

        <Card className="border-border/60 shadow-xl rounded-2xl">
          <CardContent className="p-6 space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold">Itinerary Overview</h2>
              <p className="text-xs text-muted-foreground mt-1">Multi-city travel schedule with cost estimates and activity lists.</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-xs font-medium border-y border-border/60 py-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" /> {trip.startDate} → {trip.endDate}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> {trip.stops.length} Cities Included
              </div>
              <div className="flex items-center gap-2 font-bold text-emerald-500">
                <Wallet className="h-4 w-4" /> Estimated Cost {formatCurrency(totalCostCents)}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {trip.stops.map((stop, sIdx) => (
                <div key={stop.id} className="rounded-2xl border border-border/60 bg-card p-4 space-y-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <img src={stop.city.image} alt={stop.city.name} className="h-10 w-10 rounded-xl object-cover" />
                    <div>
                      <p className="font-bold text-sm text-foreground">{stop.city.name}, {stop.city.country}</p>
                      <p className="text-[11px] text-muted-foreground">{stop.arrivalDate} → {stop.departureDate}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-border/40 text-xs">
                    {stop.activities.map((act) => (
                      <div key={act.id} className="flex justify-between text-muted-foreground text-[11px]">
                        <span className="truncate pr-2">• {act.title}</span>
                        <span className="font-semibold text-foreground shrink-0">{formatCurrency(act.costCents)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Link href="/dashboard" className="block pt-2">
              <Button className="w-full h-11 rounded-xl font-bold text-sm">
                Copy This Itinerary to My Account
              </Button>
            </Link>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground font-medium">Read-only public view — powered by GlobeTrotter Travel Planner</p>
      </div>
    </div>
  )
}

