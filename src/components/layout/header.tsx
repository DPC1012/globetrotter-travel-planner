"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Bell, PlaneTakeoff, Menu, Compass, Sparkles, Sun, Moon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { currentUser } from "@/lib/data"

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark")
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        {/* Mobile Brand Link */}
        <Link href="/dashboard" className="lg:hidden flex items-center gap-2.5 font-bold tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow">
            <PlaneTakeoff className="h-4 w-4" />
          </div>
          <span className="font-serif text-lg">Globe<span className="text-primary">Trotter</span></span>
        </Link>

        {/* Desktop Quick Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-md items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search destinations, activities, trips... (⌘K)"
              className="h-10 border-border bg-card/60 pl-10 text-xs rounded-xl font-medium outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground rounded-xl"
            title="Toggle Light/Dark Theme"
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-foreground rounded-xl hidden sm:inline-flex"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
          </Button>

          <Link href="/profile">
            <div className="flex items-center gap-2.5 pl-2 border-l border-border/60 cursor-pointer group">
              <Avatar className="h-9 w-9 border border-border shadow-sm group-hover:border-primary transition-colors">
                <AvatarImage src={currentUser.image} alt={currentUser.name} />
                <AvatarFallback>AR</AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold leading-none text-foreground group-hover:text-primary transition-colors">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">Pro Traveler</p>
              </div>
            </div>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-xl"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-card p-4 space-y-2 animate-in slide-in-from-top-2">
          <Link href="/dashboard" className="block py-2 text-sm font-bold hover:text-primary">Dashboard</Link>
          <Link href="/trips" className="block py-2 text-sm font-bold hover:text-primary">My Trips</Link>
          <Link href="/explore/cities" className="block py-2 text-sm font-bold hover:text-primary">Explore Cities</Link>
          <Link href="/explore/activities" className="block py-2 text-sm font-bold hover:text-primary">Activities</Link>
          <Link href="/budget" className="block py-2 text-sm font-bold hover:text-primary">Trip Budget</Link>
          <Link href="/calendar" className="block py-2 text-sm font-bold hover:text-primary">Calendar</Link>
          <Link href="/profile" className="block py-2 text-sm font-bold hover:text-primary">Profile & Settings</Link>
        </div>
      )}
    </header>
  )
}
