import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlaneTakeoff, MapPinned, Wallet, CalendarRange, Share2, Star } from "lucide-react"

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold"><div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground"><PlaneTakeoff className="h-4 w-4" /></div>GlobeTrotter</div>
          <div className="flex items-center gap-2"><Link href="/login"><Button variant="ghost">Login</Button></Link><Link href="/dashboard"><Button>Start Planning</Button></Link></div>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-4 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium bg-accent text-accent-foreground"><Star className="h-3 w-3" />Trusted by 12k+ travelers</div>
          <h1 className="mt-6 text-4xl lg:text-5xl font-bold tracking-tight leading-tight">Plan multi-city trips <span className="text-primary">beautifully</span></h1>
          <p className="mt-4 text-lg text-muted-foreground">Build itineraries, discover cities & activities, track budgets and share your journey — all in one elegant workspace.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link href="/dashboard"><Button size="lg" className="rounded-full px-8">Start Planning — it&apos;s free</Button></Link><Link href="/trips"><Button size="lg" variant="outline" className="rounded-full">View Demo Trip</Button></Link></div>
          <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
            <div><p className="font-semibold">50k+</p><p className="text-muted-foreground">Trips planned</p></div>
            <div><p className="font-semibold">120+</p><p className="text-muted-foreground">Countries</p></div>
            <div><p className="font-semibold">4.9/5</p><p className="text-muted-foreground">Avg rating</p></div>
          </div>
        </div>
        <div className="relative">
          <img src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800" alt="Travel" className="rounded-[2rem] shadow-2xl object-cover aspect-[4/3]" />
          <Card className="absolute -bottom-6 -left-6 w-72 shadow-xl">
            <CardContent className="p-4">
              <p className="text-sm font-semibold">European Explorer</p>
              <p className="text-xs text-muted-foreground">Paris • Rome • Barcelona • 12 days</p>
              <div className="mt-3 flex items-center justify-between text-xs"><span className="font-medium">$3,420 total</span><span className="text-emerald-600">• On track</span></div>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full w-[68%] bg-primary rounded-full" /></div>
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="bg-muted/30 border-y">
        <div className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-4 gap-6">
          {[
            { icon: MapPinned, title: "Itinerary Builder", desc: "Add stops, drag to reorder, assign activities" },
            { icon: Wallet, title: "Smart Budget", desc: "Auto cost breakdowns & daily averages" },
            { icon: CalendarRange, title: "Visual Timeline", desc: "Calendar & list views with day details" },
            { icon: Share2, title: "Share & Copy", desc: "Public links, copy trips, inspire others" },
          ].map(f => (
            <Card key={f.title} className="border-0 shadow-sm"><CardContent className="p-6"><f.icon className="h-6 w-6 text-primary" /><p className="mt-3 font-semibold">{f.title}</p><p className="text-sm text-muted-foreground mt-1">{f.desc}</p></CardContent></Card>
          ))}
        </div>
      </section>
      <footer className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">© 2026 GlobeTrotter • Built for Odoo Hackathon</footer>
    </div>
  )
}
