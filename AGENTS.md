# AGENTS.md

This document orients developers and AI agents working on this codebase.

## Project Overview

Magnetrieve is the web control interface for a metal-detecting and metal-collecting robot. The robot carries a solenoid electromagnet on a robotic arm: it scans for ferrous metal, lowers the arm and energizes the magnet to pick an object up, transports it over the collector bin, then de-energizes the magnet to drop it in. This site is the homepage plus the live control dashboard for that robot.

Built with TanStack Start and deployed on Netlify.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1 (file-based routing) |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 (CSS-first `@theme`, see `src/styles.css`) |
| Icons | lucide-react |
| Language | TypeScript 5.9 (strict mode) |
| Deployment | Netlify (static build, plus Netlify Image CDN for `public/img/*`) |

## Current State: Milestone 1

This repo currently ships the product surface only — no live robot connection yet:

- **Marketing homepage** (`src/routes/index.tsx`) — introduces Magnetrieve, explains how it works, lists hardware specs, and diagrams the three-layer system architecture (web dashboard → C# control service → robot hardware).
- **Control dashboard** (`src/routes/dashboard.tsx`) — six tabs: Overview, Control, Metal Detection, Collector Bin, Activity Log, Settings. Fully interactive: driving, arm positioning, magnet toggling, emergency stop, and notifications all work end to end.

There is no real robot yet on the other end. All telemetry and command handling is driven by `src/lib/robot-simulation.ts`, a single hook (`useRobotSimulation`) that simulates believable robot behavior (battery drain, detection events, retrieval cycles, connection loss) entirely client-side. Every dashboard component reads state from and dispatches actions through this hook only — **it is the one module to replace** once a real C# control service exists. See `PLAN.md` for what that replacement (and everything else — persistence, auth, hardware integration) involves.

## Directory Structure

```
├── public
│   └── img/
│       ├── magnetrieve-hero.png         # Homepage hero image
│       └── magnetrieve-arm-detail.png   # Arm/electromagnet close-up, used in "How it works"
├── src
│   ├── components
│   │   ├── site/            # SiteHeader, SiteFooter — shared marketing-site chrome
│   │   ├── home/            # Hero, FeatureGrid, HowItWorks, SpecsSection, SystemArchitecture
│   │   └── dashboard/       # DashboardShell + one component per dashboard tab
│   ├── lib
│   │   ├── robot-simulation.ts  # Simulated robot state/actions — the backend swap point
│   │   └── cn.ts                 # Small classNames helper
│   ├── routes
│   │   ├── __root.tsx       # Root layout: fonts, meta, global shell
│   │   ├── index.tsx        # Homepage
│   │   └── dashboard.tsx    # Control dashboard route
│   ├── router.tsx           # TanStack Router setup
│   └── styles.css           # Tailwind theme tokens, fonts, animation keyframes
├── scripts
│   └── generate-images.mts  # One-off script that generated the hero/arm images via Netlify AI Gateway
├── netlify.toml
├── PLAN.md                  # Roadmap for everything beyond Milestone 1
└── AGENTS.md                # This document
```

## Key Concepts

### `useRobotSimulation()` (`src/lib/robot-simulation.ts`)

Owns all robot state (`RobotState`) and exposes `actions`: `drive`, `stopDriving`, `setArm`, `toggleMagnet`, `emergencyStop`, `resetEmergencyStop`, `setScanning`, and `simulate` (diagnostics: force a detection, low battery, connection loss, full bin, or reset). Internally runs a `setInterval` loop that drains the battery, occasionally raises detection pings, and narrates everything into an activity log.

Uses a `mounted` gate so the first render (SSR and initial client render) is fully deterministic — real timestamps and the interval loop only start after mount — avoiding hydration mismatches. `DashboardShell` shows a short "Establishing telemetry link…" state until `mounted` is true.

### Dashboard composition

`DashboardShell` (`src/components/dashboard/DashboardShell.tsx`) owns the `useRobotSimulation()` instance, the tab nav, the notification stack, and a floating Emergency Stop button rendered at the shell level (not per-tab) so it's reachable from every tab. Each tab is a plain component that receives `state`/`actions` as props.

### Design system

Dark industrial/robotics theme, defined in `src/styles.css`:
- Fonts: Chakra Petch (display/UI) and IBM Plex Mono (telemetry/data), loaded via Google Fonts in `__root.tsx`.
- Palette: zinc-950/900/800 backgrounds, amber-500 primary accent, teal-400 for positive/active status, red-500 for danger/emergency.
- Deliberately avoids generic-AI defaults: no Inter/Space Grotesk, no purple/blue gradients, no neon glows, asymmetric bento layouts instead of equal-width card grids, organic (non-round) spec numbers.

## Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite plugins: TanStack Start, React, Tailwind, Netlify, tsconfig-paths |
| `tsconfig.json` | Strict TypeScript, `@/*` → `src/*` |
| `netlify.toml` | Build command (`vite build`), publish dir (`dist/client`), dev server ports |

## Development Commands

```bash
pnpm install
pnpm dev            # vite dev --port 3000
netlify dev         # Netlify-aware dev server (functions, image CDN, redirects)
```

There is no `build`/`test` step to run manually in normal agent workflows in this environment — CI/the deploy pipeline builds the project.

## Conventions

- Components: PascalCase, one per file, colocated by feature under `src/components/{site,home,dashboard}/`.
- Utilities/hooks: camelCase (`cn`, `useRobotSimulation`).
- Import paths use the `@/` alias.
- Tailwind utility classes directly in JSX; `cn()` for conditional class merging.
- No global state library — the dashboard's only shared state is `useRobotSimulation()`, threaded via props from `DashboardShell`.

## What's Next

See `PLAN.md` for the roadmap: replacing `useRobotSimulation` with a real C# control-service connection, persisting activity logs/settings/collection history via Netlify's database primitives, and any remaining feature work.
