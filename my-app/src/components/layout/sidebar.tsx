"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, MapPinned, Plane, Compass, Wallet, CalendarRange, Share2, User, ShieldCheck, LogOut, PlaneTakeoff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/trips", label: "My Trips", icon: Plane },
  { href: "/trips/new", label: "Create Trip", icon: MapPinned },
  { href: "/explore/cities", label: "Explore Cities", icon: Compass },
  { href: "/explore/activities", label: "Activities", icon: Compass },
  { href: "/budget", label: "Budget", icon: Wallet },
  { href: "/calendar", label: "Calendar", icon: CalendarRange },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden lg:flex w-[280px] shrink-0 flex-col border-r bg-sidebar sticky top-0 h-screen">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground"><PlaneTakeoff className="h-5 w-5" /></div>
          <div>
            <p className="font-semibold leading-none tracking-tight">GlobeTrotter</p>
            <p className="text-xs text-muted-foreground">Plan • Explore • Share</p>
          </div>
        </Link>
      </div>
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {nav.map(i => {
          const active = pathname === i.href || pathname.startsWith(i.href + "/")
          return <Link key={i.href} href={i.href} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors", active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground")}><i.icon className="h-4 w-4" />{i.label}</Link>
        })}
        <Separator className="my-4" />
        <Link href="/shared/demo" className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium", pathname.startsWith("/shared") ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent")}><Share2 className="h-4 w-4" />Public Trips</Link>
        <Link href="/profile" className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium", pathname.startsWith("/profile") ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent")}><User className="h-4 w-4" />Profile</Link>
        <Link href="/admin" className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium", pathname.startsWith("/admin") ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent")}><ShieldCheck className="h-4 w-4" />Admin</Link>
      </nav>
      <div className="p-4">
        <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/70 p-4 text-primary-foreground">
          <p className="text-sm font-semibold">Upgrade to Pro</p>
          <p className="text-xs opacity-80 mt-1">Get AI itinerary & unlimited trips</p>
          <Button variant="secondary" size="sm" className="mt-3 w-full rounded-full">Upgrade</Button>
        </div>
        <Link href="/login" className="flex items-center gap-2 mt-4 text-sm text-muted-foreground hover:text-foreground px-2"><LogOut className="h-4 w-4" />Sign out</Link>
      </div>
    </aside>
  )
}
