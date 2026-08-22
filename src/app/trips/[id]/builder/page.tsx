"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { trips as initialTrips, cities as fallbackCities, activities as availableActivities, formatCurrency, Stop, TripActivity, Trip, City } from "@/lib/data"
import {
  apiGetTripById,
  apiAddStop,
  apiDeleteStop,
  apiMoveStop,
  apiAddItem,
  apiDeleteItem,
  apiMoveItem,
  apiGetCities,
  apiGetCityActivities,
} from "@/lib/api-client"
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
  ArrowUp,
  ArrowDown,
} from "lucide-react"

import { useUserSession } from "@/lib/user-session"
import { findUserTripById } from "@/lib/user-trips"

export default function ItineraryBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const tripId = resolvedParams.id
  const { user } = useUserSession()

  const [trip, setTrip] = useState<Trip>(initialTrips[0])
  const [cityCatalog, setCityCatalog] = useState<City[]>(fallbackCities)
  const [addStopOpen, setAddStopOpen] = useState(false)
  const [selectedCityId, setSelectedCityId] = useState(fallbackCities[0].id)
  const [arrivalDate, setArrivalDate] = useState("2026-09-10")
  const [departureDate, setDepartureDate] = useState("2026-09-14")

  const [addActivityOpen, setAddActivityOpen] = useState(false)
  const [activeStopId, setActiveStopId] = useState<string | null>(null)
  const [cityActivities, setCityActivities] = useState<typeof availableActivities>(availableActivities)
  const [customTitle, setCustomTitle] = useState("")
  const [customCost, setCustomCost] = useState("30")

  const loadTripData = async () => {
    const foundTrip = await findUserTripById(user.id, tripId)
    if (foundTrip) {
      setTrip(foundTrip)
    }
  }

  useEffect(() => {
    loadTripData()
    async function loadCities() {
      const data = await apiGetCities()
      if (data && data.items.length > 0) {
        setCityCatalog(data.items)
        setSelectedCityId(data.items[0].id)
      }
    }
    loadCities()
  }, [tripId])

  // Calculate live total cost
  const totalCostCents = trip.stops.reduce(
    (stopAcc, stop) => stopAcc + stop.activities.reduce((actAcc, act) => actAcc + act.costCents, 0),
    0
  )

  const handleAddStop = async () => {
    await apiAddStop(trip.id, {
      cityId: selectedCityId,
      arrivalDate,
      departureDate,
    })
    await loadTripData()
    setAddStopOpen(false)
  }

  const handleDeleteStop = async (stopId: string) => {
    await apiDeleteStop(stopId)
    await loadTripData()
  }

  const handleMoveStop = async (stopId: string, direction: "up" | "down") => {
    await apiMoveStop(stopId, direction)
    await loadTripData()
  }

  const handleOpenAddActivity = async (stop: Stop) => {
    setActiveStopId(stop.id)
    const data = await apiGetCityActivities(stop.cityId)
    if (data && data.items.length > 0) {
      setCityActivities(data.items)
    } else {
      setCityActivities(availableActivities)
    }
    setAddActivityOpen(true)
  }

  const handleAttachCatalogActivity = async (act: typeof availableActivities[0]) => {
    if (!activeStopId) return
    const currentStop = trip.stops.find((s) => s.id === activeStopId)
    const activityDate = currentStop ? currentStop.arrivalDate : trip.startDate

    await apiAddItem(activeStopId, {
      activityId: act.id,
      date: activityDate,
      startTime: "10:00",
    })
    await loadTripData()
    setAddActivityOpen(false)
  }

  const handleAddCustomActivity = async () => {
    if (!activeStopId || !customTitle.trim()) return
    const currentStop = trip.stops.find((s) => s.id === activeStopId)
    const activityDate = currentStop ? currentStop.arrivalDate : trip.startDate

    await apiAddItem(activeStopId, {
      title: customTitle.trim(),
      category: "sightseeing",
      costCents: Math.round(parseFloat(customCost || "0") * 100),
      durationMins: 120,
      date: activityDate,
      startTime: "11:00",
    })
    await loadTripData()
    setCustomTitle("")
    setAddActivityOpen(false)
  }

  const handleDeleteActivity = async (itemId: string) => {
    await apiDeleteItem(itemId)
    await loadTripData()
  }

  const handleMoveItem = async (itemId: string, direction: "up" | "down") => {
    await apiMoveItem(itemId, direction)
    await loadTripData()
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
        <Card className="border-border/60 bg-card/80 backdrop-blur-xl shadow-xl rounded-2xl">
          <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400 border border-emerald-500/20">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Itinerary Financial Math</p>
                <p className="text-xl font-black text-foreground">
                  Scheduled Total: <span className="text-emerald-400">{formatCurrency(totalCostCents)}</span> / {formatCurrency(trip.budgetCents || 0)}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-muted-foreground font-semibold">Remaining Allocated Budget</p>
              <p className="text-lg font-bold text-cyan-400">
                {formatCurrency(Math.max(0, (trip.budgetCents || 0) - totalCostCents))}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stop Sections Manager */}
        <div className="space-y-6">
          {trip.stops.map((stop, index) => (
            <Card key={stop.id} className="border-border/60 shadow-xl overflow-hidden rounded-2xl">
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
                    size="icon"
                    variant="ghost"
                    onClick={() => handleMoveStop(stop.id, "up")}
                    disabled={index === 0}
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                    title="Move stop up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleMoveStop(stop.id, "down")}
                    disabled={index === trip.stops.length - 1}
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                    title="Move stop down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenAddActivity(stop)}
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
                      onClick={() => handleOpenAddActivity(stop)}
                      className="mt-2 text-xs font-bold text-cyan-400"
                    >
                      + Browse & Add Activities
                    </Button>
                  </div>
                ) : (
                  stop.activities.map((act, actIdx) => (
                    <div
                      key={act.id}
                      className="flex items-center justify-between rounded-2xl border border-border/80 bg-card p-3.5 hover:border-cyan-500/40 transition-all duration-200 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-0.5">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleMoveItem(act.id, "up")}
                            disabled={actIdx === 0}
                            className="h-5 w-5 rounded p-0 text-muted-foreground hover:text-foreground"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleMoveItem(act.id, "down")}
                            disabled={actIdx === stop.activities.length - 1}
                            className="h-5 w-5 rounded p-0 text-muted-foreground hover:text-foreground"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>
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
                        onClick={() => handleDeleteActivity(act.id)}
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
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add City Stop to Itinerary</DialogTitle>
            <DialogDescription className="text-xs">Select a city and assign arrival & departure dates.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold">Select Destination City</Label>
              <select
                value={selectedCityId}
                onChange={(e) => setSelectedCityId(e.target.value)}
                className="w-full h-11 rounded-xl border border-border bg-card px-3 text-sm font-semibold outline-none"
              >
                {cityCatalog.map((c) => (
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
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold">Departure Date</Label>
                <Input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddStopOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleAddStop} className="font-bold rounded-xl">Add Stop</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Activity Modal Dialog */}
      <Dialog open={addActivityOpen} onOpenChange={setAddActivityOpen}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Assign Activity to Stop</DialogTitle>
            <DialogDescription className="text-xs">Browse catalog experiences or create a custom entry.</DialogDescription>
          </DialogHeader>

          <div className="border-b border-border pb-3 mb-2 space-y-2">
            <Label className="text-xs font-bold">Add Custom Activity</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Activity Title (e.g. Sunset Coffee)"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="rounded-xl text-xs h-9 flex-1"
              />
              <Input
                type="number"
                placeholder="Cost ($)"
                value={customCost}
                onChange={(e) => setCustomCost(e.target.value)}
                className="rounded-xl text-xs h-9 w-24"
              />
              <Button onClick={handleAddCustomActivity} size="sm" className="rounded-xl font-bold text-xs h-9">
                + Add Custom
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 py-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Catalog Activities</p>
            {cityActivities.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between rounded-xl border border-border/60 p-3 hover:bg-accent/40 transition-colors"
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
                  onClick={() => handleAttachCatalogActivity(act)}
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

