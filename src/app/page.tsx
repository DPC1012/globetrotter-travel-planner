"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  MapPin,
  Sparkles,
  PlaneTakeoff,
  Compass,
  Wallet,
  Share2,
  Star,
  Sun,
  Moon,
  Calendar,
  CheckCircle2,
  Globe2,
  Clock,
  Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cities, trips, formatCurrency } from "@/lib/data"

export default function Home() {
  const router = useRouter()
  const [destinationQuery, setDestinationQuery] = useState("")
  const [isDark, setIsDark] = useState(true)

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark")
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (destinationQuery.trim()) {
      router.push(`/trips/new?destination=${encodeURIComponent(destinationQuery)}`)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-foreground selection:text-background transition-colors flight-path-bg relative overflow-x-hidden">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-foreground text-background shadow-md transition-transform duration-300 group-hover:scale-105">
              <PlaneTakeoff className="h-5 w-5" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
                Globe<span className="text-muted-foreground font-light">Trotter</span>
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-xs font-bold uppercase tracking-widest text-muted-foreground md:flex">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="/explore/cities" className="hover:text-foreground transition-colors">Explore Cities</Link>
            <Link href="/explore/activities" className="hover:text-foreground transition-colors">Experiences</Link>
            <Link href="/shared/demo" className="hover:text-foreground transition-colors">Community Logs</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground rounded-sm"
              title="Toggle Light/Dark Theme"
            >
              {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
            </Button>

            <Link href="/login">
              <Button variant="ghost" className="text-xs font-bold tracking-widest uppercase">
                Sign In
              </Button>
            </Link>

            <Link href="/dashboard">
              <Button variant="default">
                LAUNCH DESK
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 overflow-hidden">
        {/* Subtle Background SVG Paths */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 50,180 Q 400,20 900,220 T 1600,120"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="6,6"
            />
          </svg>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Main Hero Header Title */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
              Plan Unforgettable <br />
              <span className="font-script font-normal text-muted-foreground text-5xl sm:text-7xl block mt-1">
                Multi-City Adventures
              </span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
              Design multi-city itineraries, manage budget math in cents, organize day-by-day schedules, and share your travel logs with the world.
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg">
                  START PLANNING NOW <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/explore/cities">
                <Button variant="secondary" size="lg">
                  EXPLORE DESTINATIONS
                </Button>
              </Link>
            </div>
          </div>

          {/* Interactive Search Widget */}
          <div className="mt-12 max-w-2xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 bg-card p-3 rounded-sm border border-border shadow-xl"
            >
              <MapPin className="ml-2 h-5 w-5 text-foreground shrink-0" />
              <input
                type="text"
                value={destinationQuery}
                onChange={(e) => setDestinationQuery(e.target.value)}
                placeholder="Where do you want to travel next? (e.g. Paris, Tokyo, Rome)..."
                className="flex-1 h-10 px-2 text-sm text-foreground placeholder:text-muted-foreground outline-none font-medium bg-transparent"
              />
              <Button type="submit" variant="default" className="rounded-sm">
                PLAN TRIP
              </Button>
            </form>
          </div>

          {/* Featured Trip Polaroid Cards */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            {trips.map((t, idx) => (
              <Link key={t.id} href={`/trips/${t.id}`}>
                <div
                  className={`polaroid-card ${
                    idx === 0
                      ? "-rotate-2"
                      : idx === 1
                      ? "rotate-2"
                      : idx === 2
                      ? "-rotate-1"
                      : "rotate-3"
                  } hover:rotate-0 transition-transform bg-card cursor-pointer`}
                >
                  <div className="relative h-60 overflow-hidden rounded-sm">
                    <img
                      src={t.coverImageUrl}
                      alt={t.name}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <Badge className="absolute top-2 left-2">
                      {t.stops.length} CITIES
                    </Badge>
                  </div>
                  <div className="p-3 text-center space-y-1">
                    <p className="font-serif font-bold text-lg text-foreground line-clamp-1">{t.name}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {t.startDate} → {t.endDate} • {formatCurrency(t.budgetCents)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Product Metrics Grid */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl mx-auto">
            <Card className="polaroid-card">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-black text-foreground">14k+</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Active Explorers</p>
              </CardContent>
            </Card>

            <Card className="polaroid-card">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-black text-foreground">150+</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Destinations</p>
              </CardContent>
            </Card>

            <Card className="polaroid-card">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-black text-foreground">100%</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Cents Budget Math</p>
              </CardContent>
            </Card>

            <Card className="polaroid-card">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-black text-amber-500">4.9/5</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Community Rating</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section id="features" className="py-20 bg-card border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">WHY GLOBETROTTER</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              Everything You Need for Multi-City Journeys
            </h2>
            <p className="text-sm text-muted-foreground">
              Built to make complex trip planning effortless, transparent, and beautiful.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="polaroid-card p-6 space-y-3">
              <div className="h-10 w-10 rounded-sm bg-foreground/10 flex items-center justify-center text-foreground font-bold">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground">Ordered City Stops</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Add multiple destination stops in sequence with arrival and departure dates. Reorder stops seamlessly.
              </p>
            </Card>

            <Card className="polaroid-card p-6 space-y-3">
              <div className="h-10 w-10 rounded-sm bg-foreground/10 flex items-center justify-center text-foreground font-bold">
                <Wallet className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground">Integer Cents Budget Math</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All financial calculations run with strict integer cents formatting. Get daily average expenses and overbudget alerts.
              </p>
            </Card>

            <Card className="polaroid-card p-6 space-y-3">
              <div className="h-10 w-10 rounded-sm bg-foreground/10 flex items-center justify-center text-foreground font-bold">
                <Share2 className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground">Public Share & Clone</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Generate clean shareable public links (`/t/slug`). Fellow travelers can view and clone your itinerary into their account.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Cities Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">POPULAR DESTINATIONS</p>
              <h2 className="font-serif text-3xl font-bold text-foreground mt-1">Explore Global Cities</h2>
            </div>
            <Link href="/explore/cities">
              <Button variant="outline">
                VIEW ALL CITIES ({cities.length}) <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.slice(0, 3).map((c) => (
              <Card key={c.id} className="polaroid-card group">
                <div className="relative h-56 overflow-hidden rounded-sm">
                  <img src={c.image} alt={c.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <Badge className="absolute top-2 left-2">
                    COST INDEX {c.costIndex}/100
                  </Badge>
                </div>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-foreground">{c.name}, {c.country}</h3>
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-500" /> {c.popularity}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{c.description}</p>
                  <div className="pt-2">
                    <Link href={`/trips/new?destination=${encodeURIComponent(c.name)}`}>
                      <Button size="sm" variant="secondary" className="w-full text-[10px]">
                        + ADD TO MY TRIP
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-foreground text-background font-bold">
              <PlaneTakeoff className="h-4 w-4" />
            </div>
            <span className="font-serif font-bold text-lg text-foreground">GlobeTrotter</span>
            <span className="text-xs text-muted-foreground">© 2026 GlobeTrotter Inc. Odoo Hackathon Entry</span>
          </div>
          <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
            <Link href="/trips" className="hover:text-foreground">My Trips</Link>
            <Link href="/explore/cities" className="hover:text-foreground">Cities</Link>
            <Link href="/login" className="hover:text-foreground">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
