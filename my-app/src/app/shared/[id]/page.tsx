import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlaneTakeoff, Copy, Share2, Heart, Eye } from "lucide-react"

export default function SharedPage() {
  return (
    <div className="min-h-screen bg-muted/20">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold"><div className="h-8 w-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center"><PlaneTakeoff className="h-4 w-4" /></div>GlobeTrotter</Link>
          <div className="flex gap-2"><Button variant="outline" className="rounded-full"><Heart className="h-4 w-4" />Save</Button><Button className="rounded-full"><Copy className="h-4 w-4" />Copy Trip</Button></div>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        <div className="rounded-[1.5rem] overflow-hidden relative h-64">
          <img src="https://images.unsplash.com/photo-1499856871958-5b9627505d1a?w=1200" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 p-6 text-white">
            <div className="flex gap-2"><Badge className="bg-white text-black">Public</Badge><Badge variant="secondary" className="bg-white/20 text-white border-0"><Eye className="h-3 w-3" />2.4k views</Badge></div>
            <h1 className="text-3xl font-bold mt-2">European Explorer — by Alex</h1>
            <p className="text-white/80 text-sm">12 days • Paris • Rome • Barcelona • Budget $3,420</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-full"><Share2 className="h-4 w-4" />Share on X</Button>
          <Button variant="outline" className="rounded-full">Share on Instagram</Button>
          <Button variant="outline" className="rounded-full">Copy Link</Button>
        </div>
        <Card><CardContent className="p-6"><h2 className="font-semibold">Itinerary Summary</h2><p className="text-sm text-muted-foreground mt-2">A perfectly paced 12-day loop through Europe&apos;s most iconic cities. Culture, food, and sunsets.</p><div className="mt-4 grid md:grid-cols-3 gap-4 text-sm"><div className="rounded-xl bg-muted p-4"><p className="font-medium">Paris (4 days)</p><p className="text-muted-foreground text-xs">Eiffel, Seine cruise, Montmartre</p></div><div className="rounded-xl bg-muted p-4"><p className="font-medium">Rome (4 days)</p><p className="text-muted-foreground text-xs">Colosseum, Vatican, Trastevere</p></div><div className="rounded-xl bg-muted p-4"><p className="font-medium">Barcelona (4 days)</p><p className="text-muted-foreground text-xs">Sagrada, Park Güell, Beach</p></div></div><Link href="/dashboard"><Button className="w-full mt-6 rounded-full">Copy This Trip to My Account</Button></Link></CardContent></Card>
        <p className="text-center text-xs text-muted-foreground">Read-only public view — login to copy & customize</p>
      </div>
    </div>
  )
}
