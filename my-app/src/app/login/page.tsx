import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlaneTakeoff } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary via-primary to-indigo-600 text-primary-foreground p-10">
        <Link href="/" className="flex items-center gap-2 font-semibold text-white"><div className="h-8 w-8 rounded-xl bg-white text-primary flex items-center justify-center"><PlaneTakeoff className="h-4 w-4" /></div>GlobeTrotter</Link>
        <div>
          <h2 className="text-4xl font-bold leading-tight">Your next journey starts here.</h2>
          <p className="mt-4 text-white/80">Join thousands planning multi-city trips with beautiful timelines and smart budgets.</p>
          <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800" alt="" className="mt-8 rounded-2xl object-cover aspect-[16/10]" />
        </div>
        <p className="text-xs text-white/60">© 2026 GlobeTrotter</p>
      </div>
      <div className="flex items-center justify-center p-6 bg-muted/20">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-2">
            <div className="lg:hidden flex items-center gap-2 font-semibold"><div className="h-8 w-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center"><PlaneTakeoff className="h-4 w-4" /></div>GlobeTrotter</div>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Enter your credentials to access your trips</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" placeholder="you@example.com" defaultValue="demo@globetrotter.com" /></div>
            <div className="space-y-2"><div className="flex items-center justify-between"><Label htmlFor="password">Password</Label><Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link></div><Input id="password" type="password" defaultValue="password123" /></div>
            <Link href="/dashboard" className="block"><Button className="w-full rounded-full">Login</Button></Link>
            <div className="relative my-2"><div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div></div>
            <div className="grid grid-cols-2 gap-3"><Button variant="outline" className="rounded-full">Google</Button><Button variant="outline" className="rounded-full">Apple</Button></div>
            <p className="text-center text-sm text-muted-foreground">Don&apos;t have an account? <Link href="/login" className="text-primary font-medium hover:underline">Sign up</Link></p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
