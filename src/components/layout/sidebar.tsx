"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  MapPinned,
  Plane,
  Compass,
  Wallet,
  CalendarRange,
  Share2,
  User,
  ShieldCheck,
  LogOut,
  PlaneTakeoff,
  Sparkles,
  Ticket,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { currentUser } from "@/lib/data"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/trips", label: "My Trips", icon: Plane },
  { href: "/trips/new", label: "Create Trip", icon: MapPinned },
  { href: "/explore/cities", label: "Explore Cities", icon: Compass },
  { href: "/explore/activities", label: "Activities", icon: Ticket },
  { href: "/budget", label: "Trip Budget", icon: Wallet },
  { href: "/calendar", label: "Calendar", icon: CalendarRange },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/60 bg-sidebar/90 backdrop-blur-xl lg:flex transition-colors">
      {/* Brand Header */}
      <div className="p-6 pb-4">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-foreground text-background shadow-md transition-all duration-300 group-hover:scale-105">
            <PlaneTakeoff className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-script text-3xl font-normal leading-none tracking-tight group-hover:text-primary transition-colors">
              GlobeTrotter
            </h1>
            <p className="mt-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Modern Travel Planner</p>
          </div>
        </Link>
      </div>

      <Separator className="my-2 opacity-60" />

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Workspace
        </div>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 group relative",
                isActive
                  ? "bg-foreground text-background shadow-md"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110", isActive ? "text-background" : "text-muted-foreground group-hover:text-foreground")} />
              <span>{item.label}</span>
              {isActive && (
                <span className="absolute right-2.5 h-2 w-2 rounded-full bg-background animate-pulse" />
              )}
            </Link>
          )
        })}

        <Separator className="my-4 opacity-60" />

        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Community & Account
        </div>
        <Link
          href="/shared/demo"
          className={cn(
            "flex items-center gap-3 rounded-sm px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all group",
            pathname.startsWith("/shared") || pathname.startsWith("/t/")
              ? "bg-foreground text-background shadow-md"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <Share2 className="h-4 w-4 shrink-0 group-hover:scale-110 transition-transform" />
          <span>Public Itineraries</span>
        </Link>

        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-3 rounded-sm px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all group",
            pathname.startsWith("/profile")
              ? "bg-foreground text-background shadow-md"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <User className="h-4 w-4 shrink-0 group-hover:scale-110 transition-transform" />
          <span>Profile & Settings</span>
        </Link>

        <Link
          href="/admin"
          className={cn(
            "flex items-center gap-3 rounded-sm px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all group",
            pathname.startsWith("/admin")
              ? "bg-foreground text-background shadow-md"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <ShieldCheck className="h-4 w-4 shrink-0 group-hover:scale-110 transition-transform" />
          <span>Admin Analytics</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-border/60">
        <Link
          href="/login"
          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out ({currentUser.name})</span>
        </Link>
      </div>
    </aside>
  )
}
