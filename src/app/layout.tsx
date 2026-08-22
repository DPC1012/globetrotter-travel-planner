import type { Metadata } from "next"
import { Plus_Jakarta_Sans, Playfair_Display, Covered_By_Your_Grace } from "next/font/google"
import "./globals.css"

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})

const playfairSerif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
})

const scriptFont = Covered_By_Your_Grace({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
})

export const metadata: Metadata = {
  title: "GlobeTrotter — Backpack Traveler Travel Planner",
  description: "Dream, design, and share multi-city travel adventures with precision.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${jakartaSans.variable} ${playfairSerif.variable} ${scriptFont.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  )
}
