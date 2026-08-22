"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { activities, formatCurrency, Activity } from "@/lib/data"
import { Search, Sparkles, Clock, Star, Plus, Check, Eye } from "lucide-react"

export default function ActivitySearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [targetActivity, setTargetActivity] = useState<Activity | null>(null)
  const [addedIds, setAddedIds] = useState<string[]>([])

  const filteredActivities = activities.filter((act) => {
    const matchesSearch =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCat = selectedCategory === "all" || act.category === selectedCategory
    return matchesSearch && matchesCat
  })

  const toggleAddActivity = (id: string) => {
    if (addedIds.includes(id)) {
      setAddedIds(addedIds.filter((item) => item !== id))
    } else {
      setAddedIds([...addedIds, id])
    }
  }

  return (
    <AppShell>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Experience Catalog
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">Explore Activities</h1>
            <p className="text-sm text-muted-foreground">
              Discover sightseeing tours, gourmet tastings, and cultural adventures across global destinations.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by activity title or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-sm rounded-xl"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {["all", "sightseeing", "food", "adventure", "culture"].map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="rounded-xl text-xs font-semibold capitalize shrink-0"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((act) => {
            const isAdded = addedIds.includes(act.id)

            return (
              <Card
                key={act.id}
                className="group overflow-hidden border-border transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={act.image}
                      alt={act.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <Badge className="absolute left-3 top-3 bg-slate-950/80 text-cyan-300 font-bold capitalize">
                      {act.category}
                    </Badge>
                    <Badge variant="emerald" className="absolute right-3 top-3">
                      {formatCurrency(act.costCents)}
                    </Badge>
                  </div>

                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base text-foreground leading-snug group-hover:text-primary transition-colors">
                        {act.title}
                      </h3>
                      <span className="text-xs font-bold text-amber-400 shrink-0 flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400" /> {act.rating}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">{act.description}</p>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t border-border/60">
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-primary" /> {act.durationMins} mins</span>
                      <span>•</span>
                      <span className="font-semibold text-foreground capitalize">City: {act.cityId}</span>
                    </div>
                  </CardContent>
                </div>

                <div className="p-5 pt-0 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTargetActivity(act)
                      setDetailModalOpen(true)
                    }}
                    className="flex-1 rounded-xl text-xs font-semibold"
                  >
                    <Eye className="mr-1.5 h-3.5 w-3.5" /> Details
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => toggleAddActivity(act.id)}
                    variant={isAdded ? "secondary" : "default"}
                    className={`flex-1 rounded-xl text-xs font-bold ${isAdded ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : ""}`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="mr-1.5 h-3.5 w-3.5" /> Added
                      </>
                    ) : (
                      <>
                        <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Activity
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Activity Detail Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
          {targetActivity && (
            <div>
              <div className="relative h-56 overflow-hidden">
                <img src={targetActivity.image} alt={targetActivity.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <Badge className="absolute left-4 top-4 bg-slate-950/80 text-cyan-300 capitalize">
                  {targetActivity.category}
                </Badge>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xl font-bold text-foreground">{targetActivity.title}</h3>
                  <span className="text-lg font-black text-emerald-500">{formatCurrency(targetActivity.costCents)}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{targetActivity.description}</p>
                <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground pt-2 border-t border-border">
                  <span>Duration: {targetActivity.durationMins} minutes</span>
                  <span>Rating: ⭐ {targetActivity.rating}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
