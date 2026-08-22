"use client"
import Link from "next/link"
import { FormEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlaneTakeoff } from "lucide-react"
import { signIn } from "@/lib/auth/client"

export default function LoginPage() {
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError("")
    const form = new FormData(event.currentTarget)
    const result = await signIn.email({ email: String(form.get("email")), password: String(form.get("password")), callbackURL: "/dashboard" })
    if (result.error) setError(result.error.message ?? "Unable to sign in")
    setPending(false)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-[#294451] p-10 text-primary-foreground lg:flex">
        <Link href="/" className="flex items-center gap-2 font-semibold text-white"><div className="h-8 w-8 rounded-xl bg-white text-primary flex items-center justify-center"><PlaneTakeoff className="h-4 w-4" /></div>GlobeTrotter</Link>
        <div>
          <h2 className="text-4xl font-black leading-tight">Your next journey starts here.</h2>
          <p className="mt-4 text-white/80">Join thousands planning multi-city trips with beautiful timelines and smart budgets.</p>
          <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800" alt="" className="mt-8 rounded-2xl object-cover aspect-[16/10]" />
        </div>
        <p className="text-xs text-white/60">© 2026 GlobeTrotter</p>
      </div>
      <div className="flex items-center justify-center p-6 bg-muted/20">
        <Card className="w-full max-w-md shadow-xl shadow-[#284552]/10">
          <CardHeader className="space-y-2">
            <div className="lg:hidden flex items-center gap-2 font-semibold"><div className="h-8 w-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center"><PlaneTakeoff className="h-4 w-4" /></div>GlobeTrotter</div>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Enter your credentials to access your trips</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" placeholder="you@example.com" defaultValue="demo@globetrotter.com" /></div>
              <div className="space-y-2"><div className="flex items-center justify-between"><Label htmlFor="password">Password</Label><Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link></div><Input id="password" name="password" type="password" defaultValue="password123" /></div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button disabled={pending} className="w-full">{pending ? "Signing in..." : "Sign in"}</Button>
              <div className="relative my-2"><div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div></div>
              <div className="grid grid-cols-2 gap-3"><Button variant="outline" className="rounded-full">Google</Button><Button variant="outline" className="rounded-full">Apple</Button></div>
              <p className="text-center text-sm text-muted-foreground">Don&apos;t have an account? <Link href="/login" className="font-medium text-primary hover:underline">Sign up</Link></p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
