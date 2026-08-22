import Link from "next/link"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { trips, cities } from "@/lib/data"
import { Plus, MapPin, Calendar, Wallet, TrendingUp, ArrowRight } from "lucide-react"

export default function Dashboard() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div><h1 className="text-2xl font-bold tracking-tight">Welcome back, Alex ✈️</h1><p className="text-muted-foreground">Here&apos;s what&apos;s happening with your trips</p></div>
          <Link href="/trips/new"><Button className="rounded-full"><Plus className="h-4 w-4" />Plan New Trip</Button></Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Total Trips</p><p className="text-2xl font-bold mt-1">12</p><p className="text-xs text-emerald-600 flex items-center gap-1 mt-2"><TrendingUp className="h-3 w-3" />+2 this month</p></CardContent></Card>
          <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Total Budget</p><p className="text-2xl font-bold mt-1">$7,510</p><p className="text-xs text-muted-foreground mt-2">Avg $232 / day</p></CardContent></Card>
          <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Countries Explored</p><p className="text-2xl font-bold mt-1">18</p><p className="text-xs text-muted-foreground mt-2">3 continents</p></CardContent></Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between"><h2 className="font-semibold">Upcoming Trips</h2><Link href="/trips" className="text-sm text-primary flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></Link></div>
            <div className="grid gap-4">
              {trips.slice(0, 2).map(t => (
                <Card key={t.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex">
                    <img src={t.cover} alt="" className="w-36 object-cover hidden sm:block" />
                    <CardContent className="p-4 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div><p className="font-semibold">{t.name}</p><p className="text-sm text-muted-foreground line-clamp-1">{t.description}</p></div>
                        <Badge variant={t.status === "upcoming" ? "default" : "secondary"} className="capitalize">{t.status}</Badge>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground"><span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{t.startDate} → {t.endDate}</span><span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{t.stops} stops</span><span className="flex items-center gap-1"><Wallet className="h-3 w-3" />${t.budget}</span></div>
                      <div className="mt-3 flex gap-2"><Link href={`/trips/${t.id}`}><Button size="sm" variant="outline" className="rounded-full">View</Button></Link><Link href={`/trips/${t.id}/builder`}><Button size="sm" className="rounded-full">Edit Itinerary</Button></Link></div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="font-semibold">Recommended Destinations</h2>
            <div className="grid gap-3">
              {cities.slice(0, 3).map(c => (
                <Card key={c.id} className="overflow-hidden">
                  <img src={c.image} alt={c.name} className="h-32 w-full object-cover" />
                  <CardContent className="p-3">
                    <p className="font-medium text-sm">{c.name}, {c.country}</p>
                    <p className="text-xs text-muted-foreground">{c.description}</p>
                    <div className="mt-2 flex items-center justify-between"><Badge variant="secondary" className="text-xs">Cost {c.costIndex}/100</Badge><Link href="/explore/cities"><Button size="sm" variant="ghost" className="h-7 text-xs">Add</Button></Link></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <Card className="bg-gradient-to-r from-primary to-indigo-600 text-primary-foreground border-0">
          <CardContent className="p-6 flex flex-col lg:flex-row items-center justify-between gap-4">
            <div><CardTitle className="text-white">Need inspiration?</CardTitle><CardDescription className="text-white/80">Discover popular itineraries from the community</CardDescription></div>
            <Link href="/shared/demo"><Button variant="secondary" className="rounded-full">Browse Public Trips</Button></Link>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
