"use client"

import { useState } from "react"
import Link from "next/link"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { trips as initialTrips, cities, activities as availableActivities, formatCurrency, Stop, TripActivity } from "@/lib/data"
import {
  Plus,
  ArrowLeft,
  Calendar,
  Clock,
  Wallet,
  Trash2,
  GripVertical,
  PlusCircle,
  Sparkles,
  Eye,
} from "lucide-react"

export default function ItineraryBuilderPage() {
  const [trip, setTrip] = useState(initialTrips[0])
  const [addStopOpen, setAddStopOpen] = useState(false)
  const [selectedCityId, setSelectedCityId] = useState(cities[1].id)
  const [arrivalDate, setArrivalDate] = useState("2026-09-22")
  const [departureDate, setDepartureDate] = useState("2026-09-25")

  const [addActivityOpen, setAddActivityOpen] = useState(false)
  const [activeStopId, setActiveStopId] = useState<string | null>(null)

  // Calculate live total cost
  const totalCostCents = trip.stops.reduce(
    (stopAcc, stop) => stopAcc + stop.activities.reduce((actAcc, act) => actAcc + act.costCents, 0),
    0
  )

  const handleAddStop = () => {
    const selectedCity = cities.find((c) => c.id === selectedCityId) || cities[0]
    const newStop: Stop = {
      id: `stop-${Date.now()}`,
      tripId: trip.id,
      cityId: selectedCity.id,
      city: selectedCity,
      position: trip.stops.length * 1000,
      arrivalDate,
      departureDate,
      activities: [],
    }

    setTrip({
      ...trip,
      stops: [...trip.stops, newStop],
    })
    setAddStopOpen(false)
  }

  const handleDeleteStop = (stopId: string) => {
    setTrip({
      ...trip,
      stops: trip.stops.filter((s) => s.id !== stopId),
    })
  }

  const handleAttachActivity = (activityId: string) => {
    if (!activeStopId) return
    const act = availableActivities.find((a) => a.id === activityId)
    if (!act) return

    const newTripActivity: TripActivity = {
      id: `tact-${Math.floor(Math.random() * 100000)}`,
      stopId: activeStopId,
      activityId: act.id,
      title: act.title,
      category: act.category,
      durationMins: act.durationMins,
      costCents: act.costCents,
      date: trip.startDate,
      startTime: "10:00",
      position: 0,
    }

    setTrip({
      ...trip,
      stops: trip.stops.map((s) => (s.id === activeStopId ? { ...s, activities: [...s.activities, newTripActivity] } : s)),
    })
    setAddActivityOpen(false)
  }

  const handleDeleteActivity = (stopId: string, activityId: string) => {
    setTrip({
      ...trip,
      stops: trip.stops.map((s) =>
        s.id === stopId ? { ...s, activities: s.activities.filter((a) => a.id !== activityId) } : s
      ),
    })
  }

  return (
    <AppShell>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Header Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div>
            <Link
              href="/trips"
              className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors mb-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back to My Trips
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight">{trip.name}</h1>
              <Badge className="capitalize font-bold bg-slate-950/80 text-cyan-300 border-slate-800">{trip.status}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              📅 {trip.startDate} → {trip.endDate} • {trip.stops.length} Cities Included
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/trips/${trip.id}`}>
              <Button variant="outline" className="rounded-xl text-xs font-bold">
                <Eye className="mr-2 h-4 w-4" /> View Full Itinerary
              </Button>
            </Link>
            <Button
              onClick={() => setAddStopOpen(true)}
              className="rounded-xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-500 text-slate-950 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all"
            >
              <Plus className="mr-2 h-4 w-4" /> Add City Stop
            </Button>
          </div>
        </div>

        {/* Live Budget Counter Banner */}
        <Card className="border-border bg-card/80 backdrop-blur-xl shadow-xl glow-cyan">
          <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400 border border-emerald-500/20">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Itinerary Financial Math</p>
                <p className="text-xl font-black text-foreground">
                  Scheduled Total: <span className="text-emerald-400">{formatCurrency(totalCostCents)}</span> / {formatCurrency(trip.budgetCents)}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-muted-foreground font-semibold">Remaining Allocated Budget</p>
              <p className="text-lg font-bold text-cyan-400">
                {formatCurrency(Math.max(0, trip.budgetCents - totalCostCents))}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stop Sections Manager */}
        <div className="space-y-6">
          {trip.stops.map((stop, index) => (
            <Card key={stop.id} className="border-border shadow-xl overflow-hidden card-hover-glow">
              <div className="bg-muted/40 p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 font-black text-cyan-400 text-sm border border-cyan-500/30">
                    #{index + 1}
                  </span>
                  <img src={stop.city.image} alt={stop.city.name} className="h-12 w-12 rounded-xl object-cover shadow" />
                  <div>
                    <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                      {stop.city.name}, {stop.city.country}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-primary" /> {stop.arrivalDate} → {stop.departureDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setActiveStopId(stop.id)
                      setAddActivityOpen(true)
                    }}
                    className="rounded-xl text-xs font-bold border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10"
                  >
                    <PlusCircle className="mr-1.5 h-4 w-4" /> Add Activity
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteStop(stop.id)}
                    className="text-destructive hover:bg-destructive/10 rounded-xl"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Activity List inside Stop */}
              <CardContent className="p-4 sm:p-6 space-y-3">
                {stop.activities.length === 0 ? (
                  <div className="py-8 text-center border-dashed border-2 border-border/70 rounded-2xl p-4">
                    <p className="text-xs text-muted-foreground">No activities scheduled for {stop.city.name} yet.</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setActiveStopId(stop.id)
                        setAddActivityOpen(true)
                      }}
                      className="mt-2 text-xs font-bold text-cyan-400"
                    >
                      + Browse & Add Activities
                    </Button>
                  </div>
                ) : (
                  stop.activities.map((act) => (
                    <div
                      key={act.id}
                      className="flex items-center justify-between rounded-2xl border border-border/80 bg-card p-3.5 hover:border-cyan-500/40 transition-all duration-200 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 cursor-grab hover:text-cyan-400 transition-colors" />
                        <div>
                          <p className="font-bold text-sm text-foreground">{act.title}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span className="capitalize px-2 py-0.5 rounded-md bg-accent font-semibold">{act.category}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {act.durationMins} mins</span>
                            <span className="flex items-center gap-1 font-bold text-emerald-400">{formatCurrency(act.costCents)}</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteActivity(stop.id, act.id)}
                        className="text-muted-foreground hover:text-destructive h-8 w-8 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Stop Modal Dialog */}
      <Dialog open={addStopOpen} onOpenChange={setAddStopOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add City Stop to Itinerary</DialogTitle>
            <DialogDescription>Select a city and assign arrival & departure dates.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold">Select Destination City</Label>
              <select
                value={selectedCityId}
                onChange={(e) => setSelectedCityId(e.target.value)}
                className="w-full h-10 rounded-xl border border-border bg-card px-3 text-sm font-semibold outline-none"
              >
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}, {c.country} (Cost Index {c.costIndex}/100)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-bold">Arrival Date</Label>
                <Input
                  type="date"
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold">Departure Date</Label>
                <Input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddStopOpen(false)}>Cancel</Button>
            <Button onClick={handleAddStop} className="font-bold rounded-xl">Add Stop</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Activity Modal Dialog */}
      <Dialog open={addActivityOpen} onOpenChange={setAddActivityOpen}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Assign Activity to Stop</DialogTitle>
            <DialogDescription>Browse available experiences and add them to your itinerary.</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-3 py-2">
            {availableActivities.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between rounded-xl border border-border p-3 hover:bg-accent/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img src={act.image} alt={act.title} className="h-12 w-12 rounded-xl object-cover shrink-0" />
                  <div>
                    <p className="font-bold text-sm">{act.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{act.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1">
                      <span className="font-semibold text-emerald-400">{formatCurrency(act.costCents)}</span>
                      <span>{act.durationMins} mins</span>
                      <span>⭐ {act.rating}</span>
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => handleAttachActivity(act.id)}
                  className="rounded-xl font-bold text-xs shrink-0"
                >
                  + Add
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
