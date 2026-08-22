import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cities } from "@/lib/data"
import { Search, MapPin, TrendingUp, DollarSign, Plus } from "lucide-react"

export default function CitiesPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold">City Search</h1><p className="text-muted-foreground">Discover destinations — filter by region, cost & popularity</p></div>
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search Paris, Tokyo, New York..." className="pl-9" /></div>
          <div className="flex gap-2"><Button variant="outline" className="rounded-full">Europe</Button><Button variant="outline" className="rounded-full">Asia</Button><Button variant="outline" className="rounded-full">All regions</Button></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map(c => (
            <Card key={c.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative h-48 overflow-hidden"><img src={c.image} alt={c.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" /><Badge className="absolute top-3 left-3">{c.region}</Badge></div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2"><div><h3 className="font-semibold flex items-center gap-1"><MapPin className="h-4 w-4 text-primary" />{c.name}</h3><p className="text-xs text-muted-foreground">{c.country} • {c.description}</p></div><span className="text-xs font-medium flex items-center gap-1"><TrendingUp className="h-3 w-3" />{c.popularity}%</span></div>
                <div className="mt-3 flex items-center gap-2 text-xs"><Badge variant="secondary" className="flex items-center gap-1"><DollarSign className="h-3 w-3" />Cost {c.costIndex}/100</Badge><span className="text-muted-foreground">Popularity {c.popularity}</span></div>
                <Button className="w-full mt-4 rounded-full"><Plus className="h-4 w-4" />Add to Trip</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
