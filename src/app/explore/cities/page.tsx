"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cities as fallbackCities, City } from "@/lib/data"
import { apiGetCities, apiGetSavedCities, apiSaveCity, apiRemoveSavedCity } from "@/lib/api-client"
import { Search, MapPin, TrendingUp, DollarSign, Plus, Heart } from "lucide-react"

export default function CitiesPage() {
  const [cityList, setCityList] = useState<City[]>(fallbackCities)
  const [savedCityIds, setSavedCityIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [loading, setLoading] = useState(true)

  const loadCities = async (query = searchQuery, region = selectedRegion) => {
    setLoading(true)
    const [cityData, savedData] = await Promise.all([
      apiGetCities(query, region),
      apiGetSavedCities(),
    ])
    if (cityData && cityData.items.length > 0) {
      setCityList(cityData.items)
    }
    if (savedData) {
      setSavedCityIds(savedData.map((c) => c.id))
    }
    setLoading(false)
  }

  useEffect(() => {
    loadCities()
  }, [selectedRegion])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loadCities(searchQuery, selectedRegion)
  }

  const handleToggleSaved = async (cityId: string) => {
    const isSaved = savedCityIds.includes(cityId)
    if (isSaved) {
      await apiRemoveSavedCity(cityId)
      setSavedCityIds((prev) => prev.filter((id) => id !== cityId))
    } else {
      await apiSaveCity(cityId)
      setSavedCityIds((prev) => [...prev, cityId])
    }
  }

  return (
    <AppShell>
      <div className="space-y-6 animate-in fade-in duration-300">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Explore Destinations</h1>
          <p className="text-muted-foreground text-sm">Discover top world cities — filter by region, cost index, and popularity rating.</p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Paris, Tokyo, Rome, Barcelona..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-xl h-11"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant={selectedRegion === "all" ? "default" : "outline"}
              onClick={() => setSelectedRegion("all")}
              className="rounded-xl font-bold text-xs"
            >
              All Regions
            </Button>
            <Button
              type="button"
              variant={selectedRegion === "Europe" ? "default" : "outline"}
              onClick={() => setSelectedRegion("Europe")}
              className="rounded-xl font-bold text-xs"
            >
              Europe
            </Button>
            <Button
              type="button"
              variant={selectedRegion === "Asia" ? "default" : "outline"}
              onClick={() => setSelectedRegion("Asia")}
              className="rounded-xl font-bold text-xs"
            >
              Asia
            </Button>

            <Button type="submit" className="rounded-xl font-bold text-xs px-5">
              Search
            </Button>
          </div>
        </form>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cityList.map((c) => {
            const isWishlisted = savedCityIds.includes(c.id)
            return (
              <Card key={c.id} className="overflow-hidden border-border/60 rounded-2xl hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <img src={c.image} alt={c.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <Badge className="absolute top-3 left-3 bg-slate-950/80 text-cyan-300 font-bold">{c.region}</Badge>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => handleToggleSaved(c.id)}
                    className="absolute top-3 right-3 h-9 w-9 rounded-xl bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md"
                    title={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
                  >
                    <Heart className={`h-4 w-4 ${isWishlisted ? "text-red-500 fill-red-500" : "text-white"}`} />
                  </Button>
                </div>

                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-lg flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-primary" /> {c.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.country}</p>
                    </div>
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5" /> {c.popularity}%
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2">{c.description}</p>

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                    <Badge variant="secondary" className="text-[10px] font-bold">
                      Cost Index {c.costIndex}/100
                    </Badge>
                    <Link href={`/trips/new?destination=${encodeURIComponent(c.name)}`}>
                      <Button size="sm" className="rounded-xl text-xs font-bold h-8">
                        <Plus className="h-3.5 w-3.5 mr-1" /> Add to Trip
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}

