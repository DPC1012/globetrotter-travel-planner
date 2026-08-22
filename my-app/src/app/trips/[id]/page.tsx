import Link from "next/link"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { activities } from "@/lib/data"
import { MapPin, Clock, DollarSign, Calendar, Share2, Copy, Edit } from "lucide-react"

export default function ItineraryView() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="rounded-[1.5rem] overflow-hidden relative h-64">
          <img src="https://images.unsplash.com/photo-1499856871958-5b9627505d1a?w=1200" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 p-6 text-white">
            <Badge className="bg-white text-black">12 days • 3 cities</Badge>
            <h1 className="text-3xl font-bold mt-2">European Explorer</h1>
            <p className="text-white/80 flex items-center gap-2 text-sm mt-1"><Calendar className="h-4 w-4" />Sep 10 — Sep 22, 2026 • $3,420</p>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <Link href="/trips/1/builder"><Button size="sm" variant="secondary" className="rounded-full"><Edit className="h-4 w-4" />Edit</Button></Link>
            <Link href="/shared/demo"><Button size="sm" className="rounded-full"><Share2 className="h-4 w-4" />Share</Button></Link>
          </div>
        </div>

        <Tabs defaultValue="list">
          <TabsList><TabsTrigger value="list">List View</TabsTrigger><TabsTrigger value="calendar">Calendar View</TabsTrigger></TabsList>
          <TabsContent value="list" className="space-y-4 mt-4">
            {[
              { day: "Day 1-4", city: "Paris, France", date: "Sep 10-13", items: activities.slice(0, 2) },
              { day: "Day 5-8", city: "Rome, Italy", date: "Sep 14-17", items: activities.slice(3, 4) },
              { day: "Day 9-12", city: "Barcelona, Spain", date: "Sep 18-22", items: activities.slice(5, 6) },
            ].map(group => (
              <Card key={group.city}>
                <CardContent className="p-0">
                  <div className="bg-muted/50 px-6 py-3 flex items-center justify-between"><div className="flex items-center gap-3"><div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">{group.day.split(" ")[1]}</div><div><p className="font-semibold">{group.city}</p><p className="text-xs text-muted-foreground">{group.date}</p></div></div><Badge variant="outline" className="hidden sm:inline-flex"><MapPin className="h-3 w-3" />4 activities</Badge></div>
                  <div className="p-4 grid md:grid-cols-2 gap-4">
                    {group.items.map(a => (
                      <div key={a.id} className="flex gap-3 rounded-xl border p-3">
                        <img src={a.image} alt="" className="h-16 w-16 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{a.name}</p><p className="text-xs text-muted-foreground flex items-center gap-2 mt-1"><Clock className="h-3 w-3" />{a.duration} • <DollarSign className="h-3 w-3" />${a.cost}</p><Badge variant="secondary" className="mt-2 text-[10px]">{a.type}</Badge></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="calendar" className="mt-4">
            <Card><CardContent className="p-6 text-center text-muted-foreground">Calendar timeline — switch to <Link href="/calendar" className="text-primary underline">full calendar</Link> for drag-to-reorder.</CardContent></Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3">
          <Link href="/shared/demo"><Button variant="outline" className="rounded-full"><Copy className="h-4 w-4" />Copy Public Link</Button></Link>
          <Link href="/trips"><Button className="rounded-full">Back to My Trips</Button></Link>
        </div>
      </div>
    </AppShell>
  )
}
