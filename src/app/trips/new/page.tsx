"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload, Sparkles, Plus } from "lucide-react"
import { useUserSession } from "@/lib/user-session"
import { saveNewUserTrip } from "@/lib/user-trips"

export default function CreateTripPage() {
  const router = useRouter()
  const { user } = useUserSession()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError("")
    const form = new FormData(e.currentTarget)
    const name = String(form.get("name"))
    const startDate = String(form.get("startDate"))
    const endDate = String(form.get("endDate"))
    const description = String(form.get("description") || "")
    const coverImageUrl = String(form.get("coverImageUrl") || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200")

    const createdTrip = await saveNewUserTrip(user.id, {
      name,
      startDate,
      endDate,
      description,
      coverImageUrl,
    })

    if (createdTrip && createdTrip.id) {
      router.push(`/trips/${createdTrip.id}/builder`)
    } else {
      router.push("/trips")
    }
    setPending(false)
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/trips" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-bold">
          <ArrowLeft className="h-4 w-4" /> Back to trips
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Create New Trip</h1>
          <p className="text-muted-foreground text-sm">Give your journey a name, dates and a cover style.</p>
        </div>

        <Card className="border-border/60 shadow-xl rounded-2xl">
          <CardHeader className="border-b border-border/40 pb-4">
            <CardTitle className="text-xl">Trip Specification</CardTitle>
            <CardDescription className="text-xs">Basic information — you will add stops and activities in the builder</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Trip Name</Label>
                <Input id="name" name="name" placeholder="e.g., European Grand Tour" defaultValue="Mediterranean Explorer 2026" required className="rounded-xl h-10" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" name="startDate" type="date" defaultValue="2026-09-10" required className="rounded-xl h-10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" name="endDate" type="date" defaultValue="2026-09-22" required className="rounded-xl h-10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="What's the vibe? Coastal cities, museums, dining..." defaultValue="Exploring historic coastal towns, local food, and cultural highlights." rows={3} className="rounded-xl" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImageUrl">Cover Image URL (optional)</Label>
                <Input id="coverImageUrl" name="coverImageUrl" placeholder="https://images.unsplash.com/..." defaultValue="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200" className="rounded-xl h-10" />
              </div>

              {error && <p className="text-xs text-destructive font-medium">{error}</p>}

              <div className="flex gap-3 justify-end pt-2">
                <Link href="/trips">
                  <Button type="button" variant="outline" className="rounded-xl font-bold">Cancel</Button>
                </Link>
                <Button type="submit" disabled={pending} className="rounded-xl font-bold">
                  {pending ? "Creating..." : "Save & Build Itinerary"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}

