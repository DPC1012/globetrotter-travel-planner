import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AdminPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold">Admin / Analytics</h1><p className="text-muted-foreground">Platform usage, trips & user engagement</p></div>
        <div className="grid md:grid-cols-4 gap-4">
          <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Total Users</p><p className="text-2xl font-bold">4,281</p><p className="text-xs text-emerald-600">+12% MoM</p></CardContent></Card>
          <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Trips Created</p><p className="text-2xl font-bold">12,403</p><p className="text-xs text-emerald-600">+8% MoM</p></CardContent></Card>
          <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Avg Trip Length</p><p className="text-2xl font-bold">6.2 days</p></CardContent></Card>
          <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Revenue (Est.)</p><p className="text-2xl font-bold">$82k</p></CardContent></Card>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <Card><CardHeader><CardTitle>Top Cities</CardTitle></CardHeader><CardContent className="space-y-3">{[{ c: "Paris", v: 342 }, { c: "Tokyo", v: 298 }, { c: "Bali", v: 241 }, { c: "Rome", v: 210 }].map(i => <div key={i.c} className="flex items-center justify-between text-sm"><span>{i.c}</span><div className="flex items-center gap-2"><div className="w-24 h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: `${(i.v / 342) * 100}%` }} /></div><span className="font-medium">{i.v}</span></div></div>)}</CardContent></Card>
          <Card><CardHeader><CardTitle>Top Activities</CardTitle></CardHeader><CardContent className="space-y-3">{[{ c: "Eiffel Tour", v: 512 }, { c: "Shibuya Night", v: 389 }, { c: "Colosseum", v: 341 }].map(i => <div key={i.c} className="flex items-center justify-between text-sm"><span>{i.c}</span><Badge variant="secondary">{i.v} bookings</Badge></div>)}</CardContent></Card>
        </div>
        <Card><CardHeader><CardTitle>Recent Users</CardTitle></CardHeader><CardContent className="text-sm"><div className="space-y-2"><div className="flex justify-between border-b py-2"><span>alex@globetrotter.com</span><span className="text-muted-foreground">12 trips</span></div><div className="flex justify-between border-b py-2"><span>sara@example.com</span><span className="text-muted-foreground">5 trips</span></div><div className="flex justify-between py-2"><span>demo@globetrotter.com</span><span className="text-muted-foreground">3 trips</span></div></div></CardContent></Card>
      </div>
    </AppShell>
  )
}
