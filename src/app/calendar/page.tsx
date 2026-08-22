import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function CalendarPage() {
  const days = Array.from({ length: 12 }, (_, i) => ({ date: `Sep ${10 + i}`, label: `Day ${i + 1}`, city: i < 4 ? "Paris" : i < 8 ? "Rome" : "Barcelona", activities: 2 }))
  return (
    <AppShell>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold">Trip Calendar / Timeline</h1><p className="text-muted-foreground">Visual timeline — expand days, drag to reorder</p></div>
        <div className="grid lg:grid-cols-7 gap-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => <div key={d} className="text-xs font-medium text-muted-foreground p-2 hidden lg:block">{d}</div>)}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {days.map(d => (
            <Card key={d.label} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between"><Badge variant="secondary" className="text-xs">{d.city}</Badge><span className="text-xs text-muted-foreground">{d.date}</span></div>
                <p className="font-semibold mt-2">{d.label}</p>
                <div className="mt-2 space-y-1.5">
                  <div className="rounded-lg bg-muted p-2 text-xs">09:00 — City tour</div>
                  <div className="rounded-lg bg-muted p-2 text-xs">14:00 — Food experience</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="relative pl-6 border-l-2 border-dashed space-y-6 ml-4">
          {["Paris", "Rome", "Barcelona"].map(c => (
            <div key={c} className="relative"><div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-primary" /><p className="font-medium">{c}</p><p className="text-sm text-muted-foreground">4 days • 4 activities • ~$850</p></div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
