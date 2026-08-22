import Link from "next/link"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { trips } from "@/lib/data"
import { Plus, Search, Calendar, MapPin, Wallet, MoreHorizontal } from "lucide-react"

export default function TripsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div><h1 className="text-2xl font-bold">My Trips</h1><p className="text-muted-foreground">Manage your itineraries — {trips.length} trips</p></div>
          <Link href="/trips/new"><Button className="rounded-full"><Plus className="h-4 w-4" />Create Trip</Button></Link>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search trips..." className="pl-9" /></div>
          <Button variant="outline">Filter</Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map(t => (
            <Card key={t.id} className="overflow-hidden group hover:shadow-lg transition-all">
              <div className="relative h-44 overflow-hidden">
                <img src={t.cover} alt={t.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <Badge className="absolute top-3 left-3 capitalize">{t.status}</Badge>
                <Button variant="secondary" size="icon" className="absolute top-3 right-3 h-7 w-7 rounded-full"><MoreHorizontal className="h-4 w-4" /></Button>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">{t.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{t.description}</p>
                <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{t.startDate} — {t.endDate}</div>
                  <div className="flex items-center gap-4"><span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{t.stops} cities</span><span className="flex items-center gap-1"><Wallet className="h-3.5 w-3.5" />${t.budget}</span></div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link href={`/trips/${t.id}`} className="flex-1"><Button variant="outline" className="w-full rounded-full" size="sm">View</Button></Link>
                  <Link href={`/trips/${t.id}/builder`} className="flex-1"><Button className="w-full rounded-full" size="sm">Edit</Button></Link>
                </div>
              </CardContent>
            </Card>
          ))}
          <Link href="/trips/new">
            <Card className="h-full min-h-[300px] border-dashed flex flex-col items-center justify-center p-6 hover:bg-accent/50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Plus className="h-6 w-6" /></div>
              <p className="mt-3 font-medium">Create New Trip</p>
              <p className="text-sm text-muted-foreground text-center">Start planning your next adventure</p>
            </Card>
          </Link>
        </div>
      </div>
    </AppShell>
  )
}
