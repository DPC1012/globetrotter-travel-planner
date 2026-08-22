"use client"
import Link from "next/link"
import { Search, Bell, PlaneTakeoff, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"

export function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b">
      <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
        <Link href="/dashboard" className="lg:hidden flex items-center gap-2 font-semibold"><div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground"><PlaneTakeoff className="h-4 w-4" /></div>GlobeTrotter</Link>
        <div className="hidden lg:flex flex-1 max-w-md items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search trips, cities, activities..." className="pl-9 bg-muted/50 border-0" />
          </div>
        </div>
        <div className="flex-1 lg:hidden" />
        <Button variant="ghost" size="icon" className="hidden lg:inline-flex"><Bell className="h-4 w-4" /></Button>
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://i.pravatar.cc/100?img=32" />
          <AvatarFallback>GT</AvatarFallback>
        </Avatar>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)}><Menu className="h-5 w-5" /></Button>
      </div>
      {open && (
        <div className="lg:hidden border-t bg-background p-4 space-y-2">
          <Link href="/dashboard" className="block py-2 text-sm">Dashboard</Link>
          <Link href="/trips" className="block py-2 text-sm">My Trips</Link>
          <Link href="/explore/cities" className="block py-2 text-sm">Cities</Link>
          <Link href="/explore/activities" className="block py-2 text-sm">Activities</Link>
          <Link href="/profile" className="block py-2 text-sm">Profile</Link>
        </div>
      )}
    </header>
  )
}
