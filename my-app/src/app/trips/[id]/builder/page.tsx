import Link from "next/link"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, GripVertical, Trash2, Calendar, MapPin } from "lucide-react"

export default function BuilderPage() {
  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto">
        <Link href="/trips/1" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Back to itinerary</Link>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div><h1 className="text-2xl font-bold">Itinerary Builder</h1><p className="text-muted-foreground">Add stops, set dates, assign activities — drag to reorder</p></div>
          <Button className="rounded-full"><Plus className="h-4 w-4" />Add Stop</Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[
              { city: "Paris", country: "France", dates: "Sep 10 - Sep 13", activities: 2 },
              { city: "Rome", country: "Italy", dates: "Sep 14 - Sep 17", activities: 1 },
              { city: "Barcelona", country: "Spain", dates: "Sep 18 - Sep 22", activities: 1 },
            ].map((s, idx) => (
              <Card key={s.city} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">{idx + 1}</div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{s.city}, {s.country}</CardTitle>
                      <p className="text-xs text-muted-foreground flex items-center gap-2"><Calendar className="h-3 w-3" />{s.dates} • {s.activities} activities</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><Label className="text-xs">City</Label><Input defaultValue={s.city} className="h-8" /></div>
                    <div className="space-y-1"><Label className="text-xs">Dates</Label><Input defaultValue={s.dates} className="h-8" /></div>
                  </div>
                  <div className="rounded-xl bg-muted/50 p-3 space-y-2">
                    <p className="text-xs font-medium">Activities for this stop</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Eiffel Tower Tour — $45</Badge>
                      <Badge variant="secondary">Seine Cruise — $68</Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-accent"><Plus className="h-3 w-3" />Add activity</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/explore/activities" className="flex-1"><Button variant="outline" size="sm" className="w-full rounded-full">Browse Activities</Button></Link>
                    <Link href="/explore/cities" className="flex-1"><Button variant="outline" size="sm" className="w-full rounded-full"><MapPin className="h-3 w-3" />Change City</Button></Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="space-y-4">
            <Card className="bg-primary text-primary-foreground border-0">
              <CardContent className="p-5">
                <p className="font-semibold">Trip Summary</p>
                <div className="mt-3 space-y-2 text-sm text-primary-foreground/90">
                  <div className="flex justify-between"><span>Duration</span><span className="font-medium">12 days</span></div>
                  <div className="flex justify-between"><span>Stops</span><span className="font-medium">3 cities</span></div>
                  <div className="flex justify-between"><span>Est. Cost</span><span className="font-medium">$3,420</span></div>
                </div>
                <Link href="/trips/1"><Button variant="secondary" size="sm" className="w-full mt-4 rounded-full">Save & View Itinerary</Button></Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Tips</CardTitle></CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2">
                <p>• Drag stops to reorder — dates auto-adjust.</p>
                <p>• Assign at least 1 activity per city.</p>
                <p>• Budget updates live as you build.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
