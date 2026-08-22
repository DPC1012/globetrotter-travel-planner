import Link from "next/link"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload, Sparkles } from "lucide-react"

export default function CreateTripPage() {
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/trips" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Back to trips</Link>
        <div><h1 className="text-2xl font-bold">Create New Trip</h1><p className="text-muted-foreground">Give your journey a name, dates and a vibe</p></div>

        <Card>
          <CardHeader><CardTitle>Trip Details</CardTitle><CardDescription>Basic info — you can edit stops & activities later</CardDescription></CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2"><Label>Trip Name</Label><Input placeholder="e.g., European Explorer" defaultValue="Mediterranean Summer 2026" /></div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Start Date</Label><Input type="date" defaultValue="2026-09-10" /></div>
              <div className="space-y-2"><Label>End Date</Label><Input type="date" defaultValue="2026-09-22" /></div>
            </div>
            <div className="space-y-2"><Label>Description</Label><Textarea placeholder="What's the vibe? Beaches, history, food..." defaultValue="Island hopping, sunsets, and street food across the Med." rows={3} /></div>
            <div className="space-y-2">
              <Label>Cover Photo (optional)</Label>
              <div className="rounded-2xl border-2 border-dashed p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-sm font-medium mt-2">Drop image or click to upload</p><p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
              </div>
            </div>
            <div className="rounded-xl bg-accent p-4 flex gap-3">
              <Sparkles className="h-5 w-5 text-primary shrink-0" />
              <div><p className="text-sm font-medium">AI Tip</p><p className="text-xs text-muted-foreground">Add 2-3 cities and we&apos;ll auto-suggest activities & budget breakdown.</p></div>
            </div>
            <div className="flex gap-3 justify-end">
              <Link href="/trips"><Button variant="outline" className="rounded-full">Cancel</Button></Link>
              <Link href="/trips/1/builder"><Button className="rounded-full">Save & Build Itinerary</Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
