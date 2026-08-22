import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { activities } from "@/lib/data"
import { Search, Clock, Star, DollarSign, Filter } from "lucide-react"

export default function ActivitiesPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold">Activity Search</h1><p className="text-muted-foreground">Find things to do — filter by type, cost & duration</p></div>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[260px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search Eiffel, food tour..." className="pl-9" /></div>
          <Button variant="outline" className="rounded-full"><Filter className="h-4 w-4" />Filters</Button>
          <div className="flex gap-2"><Badge variant="secondary" className="cursor-pointer">Sightseeing</Badge><Badge variant="outline" className="cursor-pointer">Food</Badge><Badge variant="outline" className="cursor-pointer">Adventure</Badge><Badge variant="outline" className="cursor-pointer">Culture</Badge></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map(a => (
            <Card key={a.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <img src={a.image} alt={a.name} className="h-40 w-full object-cover" />
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2"><h3 className="font-medium text-sm leading-tight">{a.name}</h3><Badge variant={a.type === "adventure" ? "default" : "secondary"} className="text-[10px] capitalize">{a.type}</Badge></div>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground"><span className="flex items-center gap-1"><Clock className="h-3 w-3" />{a.duration}</span><span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />${a.cost}</span><span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{a.rating}</span></div>
                <div className="mt-4 flex gap-2"><Button size="sm" className="flex-1 rounded-full">Add to Trip</Button><Button size="sm" variant="outline" className="rounded-full">View</Button></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
