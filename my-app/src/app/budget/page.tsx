import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Plane, Hotel, Utensils, Ticket, AlertTriangle } from "lucide-react"

export default function BudgetPage() {
  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl">
        <div><h1 className="text-2xl font-bold">Trip Budget & Cost Breakdown</h1><p className="text-muted-foreground">European Explorer • Sep 10-22 • 12 days</p></div>
        <div className="grid md:grid-cols-4 gap-4">
          <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Total Estimate</p><p className="text-2xl font-bold">$3,420</p><Badge className="mt-2 bg-emerald-500">On budget</Badge></CardContent></Card>
          <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Per Day</p><p className="text-2xl font-bold">$285</p><p className="text-xs text-muted-foreground mt-1">Avg across 12 days</p></CardContent></Card>
          <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Highest Day</p><p className="text-2xl font-bold">$420</p><p className="text-xs text-amber-600 flex items-center gap-1 mt-1"><AlertTriangle className="h-3 w-3" />Day 5 (Rome)</p></CardContent></Card>
          <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Savings</p><p className="text-2xl font-bold">$180</p><p className="text-xs text-emerald-600 mt-1">vs. initial plan</p></CardContent></Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Wallet className="h-4 w-4" />Breakdown by Category</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Transport", icon: Plane, value: 1100, pct: 32, color: "bg-primary" },
                { label: "Stay", icon: Hotel, value: 1240, pct: 36, color: "bg-emerald-500" },
                { label: "Activities", icon: Ticket, value: 620, pct: 18, color: "bg-amber-500" },
                { label: "Meals", icon: Utensils, value: 460, pct: 14, color: "bg-sky-500" },
              ].map(r => (
                <div key={r.label} className="space-y-1">
                  <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2"><r.icon className="h-4 w-4 text-muted-foreground" />{r.label}</span><span className="font-medium">${r.value} • {r.pct}%</span></div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden"><div className={`h-full ${r.color} rounded-full`} style={{ width: `${r.pct}%` }} /></div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Daily Cost Trend</CardTitle></CardHeader>
            <CardContent>
              <div className="h-48 flex items-end gap-1">
                {[180, 220, 310, 260, 420, 300, 280, 260, 310, 290, 240, 200].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className={`w-full rounded-t-lg ${v > 350 ? "bg-amber-500" : "bg-primary"}`} style={{ height: `${v / 5}px` }} />
                    <span className="text-[10px] text-muted-foreground">D{i + 1}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1"><AlertTriangle className="h-3 w-3 text-amber-500" />Day 5 exceeds daily average by 47% — consider cheaper stay.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
