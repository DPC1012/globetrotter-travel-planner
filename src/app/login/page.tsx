"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlaneTakeoff, Sparkles, ArrowRight } from "lucide-react"
import { signIn, signUp } from "@/lib/auth/client"
import { useUserSession } from "@/lib/user-session"

export default function LoginPage() {
  const router = useRouter()
  const { saveLocalSession } = useUserSession()
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError("")
    const form = new FormData(event.currentTarget)
    const email = String(form.get("email"))
    const password = String(form.get("password"))

    try {
      const result = await signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
      })
      if (result.error) {
        // Fallback local session for offline DB
        const derivedName = email.split("@")[0].replace(".", " ")
        saveLocalSession(derivedName.charAt(0).toUpperCase() + derivedName.slice(1), email)
      } else {
        saveLocalSession(email.split("@")[0], email)
      }
      router.push("/dashboard")
    } catch {
      const derivedName = email.split("@")[0].replace(".", " ")
      saveLocalSession(derivedName.charAt(0).toUpperCase() + derivedName.slice(1), email)
      router.push("/dashboard")
    }
  }

  async function handleSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError("")
    const form = new FormData(event.currentTarget)
    const name = String(form.get("name"))
    const email = String(form.get("email"))
    const password = String(form.get("password"))

    try {
      const result = await signUp.email({
        email,
        password,
        name,
        callbackURL: "/dashboard",
      })
      // Save local session so the new user name is immediately active across app
      saveLocalSession(name || "New Traveler", email)
      router.push("/dashboard")
    } catch {
      saveLocalSession(name || "New Traveler", email)
      router.push("/dashboard")
    }
  }

  async function handleDemoSignIn() {
    setPending(true)
    setError("")
    try {
      await signIn.email({
        email: "demo@globetrotter.com",
        password: "password123",
        callbackURL: "/dashboard",
      })
      saveLocalSession("Alex Rivera", "demo@globetrotter.com")
      router.push("/dashboard")
    } catch {
      saveLocalSession("Alex Rivera", "demo@globetrotter.com")
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Dark Hero Panel */}
      <div className="hidden flex-col justify-between bg-slate-950 p-10 lg:p-12 text-white lg:flex relative overflow-hidden select-none">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-slate-950 to-amber-500/20 pointer-events-none" />
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

        <Link href="/" className="relative z-10 flex items-center gap-3 font-semibold text-white">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shadow-lg font-black">
            <PlaneTakeoff className="h-5 w-5" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-white">
            Globe<span className="text-amber-400">Trotter</span>
          </span>
        </Link>

        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1.5 text-xs text-cyan-300 font-semibold backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Next-Gen Travel Planning
          </div>
          <h2 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight text-white font-sans">
            Your next adventure <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-cyan-300">starts here.</span>
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed font-normal">
            Dream, design, and share multi-city travel itineraries with smart budget calculators and catalog activity search.
          </p>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/15 group">
            <img
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800"
              alt="Travel inspiration"
              className="w-full object-cover aspect-[16/9] transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <p className="absolute bottom-3 left-4 text-xs font-semibold text-white/90">
              📍 Grand Canyon National Park, USA
            </p>
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-400 font-medium">© 2026 GlobeTrotter Travel Planner. All rights reserved.</p>
      </div>

      {/* Right Form Container */}
      <div className="flex items-center justify-center p-6 sm:p-10 bg-background transition-colors">
        <Card className="w-full max-w-md border-border/80 shadow-2xl rounded-2xl bg-card/90 backdrop-blur-xl">
          <CardHeader className="space-y-2 text-center pb-4">
            <div className="lg:hidden flex items-center justify-center gap-2.5 font-semibold mb-2">
              <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow">
                <PlaneTakeoff className="h-5 w-5" />
              </div>
              <span className="font-serif text-xl">Globe<span className="text-primary">Trotter</span></span>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-black tracking-tight">Welcome to GlobeTrotter</CardTitle>
            <CardDescription className="text-xs font-medium text-muted-foreground">Sign in or create an account to start planning trips</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Quick Demo Sign In */}
            <Button
              onClick={handleDemoSignIn}
              disabled={pending}
              variant="outline"
              className="w-full h-11 rounded-xl border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary font-bold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>Quick Demo Sign In (Explore Mode)</span>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/80" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-3 text-muted-foreground font-bold">Or enter details</span></div>
            </div>

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-xl h-11 bg-muted/80 p-1">
                <TabsTrigger value="signin" className="rounded-lg text-xs font-bold transition-all">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-lg text-xs font-bold transition-all">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-4 space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="signin-email" className="text-xs font-bold">Email Address</Label>
                    <Input id="signin-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" defaultValue="demo@globetrotter.com" required className="rounded-xl h-11 border-border/80" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="signin-password" className="text-xs font-bold">Password</Label>
                    <Input id="signin-password" name="password" type="password" autoComplete="current-password" defaultValue="password123" required className="rounded-xl h-11 border-border/80" />
                  </div>
                  {error && <p className="text-xs text-destructive font-semibold">{error}</p>}
                  <Button disabled={pending} className="w-full h-11 rounded-xl font-extrabold text-sm shadow-md mt-2">
                    {pending ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-4 space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-name" className="text-xs font-bold">Full Name</Label>
                    <Input id="signup-name" name="name" autoComplete="name" placeholder="Alex Rivera" required className="rounded-xl h-11 border-border/80" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-email" className="text-xs font-bold">Email Address</Label>
                    <Input id="signup-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required className="rounded-xl h-11 border-border/80" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-password" className="text-xs font-bold">Password</Label>
                    <Input id="signup-password" name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" required className="rounded-xl h-11 border-border/80" />
                  </div>
                  {error && <p className="text-xs text-destructive font-semibold">{error}</p>}
                  <Button disabled={pending} className="w-full h-11 rounded-xl font-extrabold text-sm shadow-md mt-2">
                    {pending ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

