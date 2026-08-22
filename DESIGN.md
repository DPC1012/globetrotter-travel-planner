# GlobeTrotter Design System — DESIGN.md

An Impeccable, high-aesthetic visual design specification for GlobeTrotter, built for the Odoo Hackathon.

---

## 1. Vision & Aesthetic Identity

**Theme Strategy**: *Ocean Emerald & Deep Midnight Glassmorphic Luxury*

- **Dark Mode First**: Immersive slate-950/900 background (`oklch(0.14 0.025 240)`) with glowing cyan/emerald accent highlights (`oklch(0.65 0.16 200)`).
- **Glassmorphism Layering**: Backdrop blur surfaces (`backdrop-blur-xl bg-card/80 border-border/60`) providing depth, hierarchy, and tactile feel.
- **Micro-Interactions**: Smooth 300ms hover lifts (`hover:-translate-y-1 hover:shadow-2xl hover:border-primary/50`), glowing focus rings, and animated badges.

---

## 2. Color Palette & Semantic Tokens

### Core OKLCH Tokens

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `--background` | `oklch(0.985 0.008 220)` | `oklch(0.14 0.025 240)` | Canvas background |
| `--card` | `oklch(1 0 0)` | `oklch(0.19 0.025 240)` | Glass cards, modals, popovers |
| `--primary` | `oklch(0.48 0.15 210)` | `oklch(0.65 0.16 200)` | Active buttons, brand accents, badges |
| `--emerald` | `#10b981` | `#34d399` | Budget success, total cost highlights |
| `--amber` | `#f59e0b` | `#fbbf24` | Rating stars, popular badges |
| `--border` | `oklch(0.90 0.015 220)` | `oklch(0.26 0.025 240)` | Subtle card & header borders |

---

## 3. Typography Hierarchy

Using Next.js Font Optimization (`Geist Sans` & `Geist Mono`):

- **Display Hero**: `text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08]`
- **Page Titles**: `text-3xl sm:text-4xl font-black tracking-tight`
- **Section Headers**: `text-xl font-bold text-foreground`
- **Card Headings**: `text-lg font-bold text-foreground`
- **Kicker / Overline Badges**: `text-xs font-bold uppercase tracking-wider text-primary`
- **Body**: `text-sm text-muted-foreground leading-relaxed`

---

## 4. Component Patterns & Guidelines

### Cards (`<Card />`)
- Rounded corners: `rounded-2xl`
- Border styling: `border border-border`
- Hover state: `hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl transition-all duration-300`

### Buttons (`<Button />`)
- Primary CTA: `bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 hover:opacity-95 rounded-xl`
- Secondary / Outline: `border-border bg-card hover:bg-accent rounded-xl font-semibold`

### Modals (`<Dialog />`)
- Backdrop: `bg-black/70 backdrop-blur-sm`
- Container: `rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95`
