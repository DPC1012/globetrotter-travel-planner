import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function ProfilePage() {
  return (
    <AppShell>
      <div className="max-w-3xl space-y-6">
        <div><h1 className="text-2xl font-bold">Profile & Settings</h1><p className="text-muted-foreground">Manage your account and preferences</p></div>
        <Card>
          <CardHeader><CardTitle>Personal Information</CardTitle><CardDescription>Update your photo and details</CardDescription></CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20"><AvatarImage src="https://i.pravatar.cc/100?img=32" /><AvatarFallback>AL</AvatarFallback></Avatar>
              <div><Button variant="outline" size="sm" className="rounded-full">Change Photo</Button><p className="text-xs text-muted-foreground mt-2">JPG, PNG up to 2MB</p></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Full Name</Label><Input defaultValue="Alex Morgan" /></div>
              <div className="space-y-2"><Label>Email</Label><Input defaultValue="alex@globetrotter.com" /></div>
            </div>
            <div className="space-y-2"><Label>Language</Label><Input defaultValue="English (US)" /></div>
            <Separator />
            <div className="space-y-2"><h3 className="font-medium">Saved Destinations</h3><div className="flex flex-wrap gap-2"><span className="rounded-full bg-muted px-3 py-1 text-sm">Paris</span><span className="rounded-full bg-muted px-3 py-1 text-sm">Kyoto</span><span className="rounded-full bg-muted px-3 py-1 text-sm">Bali</span></div></div>
            <div className="flex gap-3"><Button className="rounded-full">Save Changes</Button><Button variant="outline" className="rounded-full">Cancel</Button></div>
          </CardContent>
        </Card>
        <Card className="border-destructive/50">
          <CardHeader><CardTitle className="text-destructive">Danger Zone</CardTitle><CardDescription>Delete your account and all trips</CardDescription></CardHeader>
          <CardContent><Button variant="destructive" className="rounded-full">Delete Account</Button></CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
