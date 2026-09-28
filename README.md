# Magnetrieve

Web control interface for Magnetrieve, a metal-detecting and metal-collecting robot. The robot scans for ferrous metal, lowers an arm-mounted solenoid electromagnet to pick objects up, carries them over its collector bin, then releases them by cutting power to the magnet. This site is the homepage and live control dashboard for operating it.

## What's here

- **Homepage** — introduces the robot, how the retrieval cycle works, hardware specs, and the three-layer system architecture (dashboard → C# control service → robot hardware).
- **Control dashboard** (`/dashboard`) — six tabs:
  - **Overview** — status cards (robot status, connection, battery, metal detection, electromagnet, arm position, objects collected, speed), recent activity, and retrieval-cycle progress.
  - **Control** — drive controls (forward/back/left/right + halt), arm positioning, and electromagnet on/off.
  - **Metal Detection** — live detection indicator and detection history.
  - **Collector Bin** — bin fill level, objects collected, collected-object list.
  - **Activity Log** — filterable log of everything the robot has done or reported.
  - **Settings** — connection settings, calibration, and a diagnostics/test-mode panel for exercising every state (low battery, lost connection, full bin, etc.) on demand.
- A persistent **Emergency Stop** button, reachable from every dashboard tab, that halts movement and disables the electromagnet.

The dashboard is fully interactive today, but it isn't talking to a real robot yet — see [Current state](#current-state) below.

## Tech stack

TanStack Start, React 19, TanStack Router, Vite 7, Tailwind CSS 4, TypeScript (strict), deployed on Netlify. Hero/detail imagery was generated via the Netlify AI Gateway (`scripts/generate-images.mts`).

## Running locally

```bash
pnpm install
pnpm dev
# or, for the Netlify-aware dev server (image CDN, redirects):
netlify dev
```

## Current state

All robot telemetry and command handling in this build comes from `src/lib/robot-simulation.ts`, a single simulation hook that stands in for a real connection to the robot — it drains a simulated battery, raises detection events, and narrates activity so the full dashboard experience (including edge cases like low battery or a lost connection) can be used and refined before hardware is wired up. It's the one module that gets replaced when the real backend is ready.

The plan is to build Magnetrieve's C# control service and hardware integration next, then swap the simulation for a live connection without changing the dashboard itself. See [`PLAN.md`](./PLAN.md) for the full roadmap, including persistence and multi-robot support.

## Project structure

See [`AGENTS.md`](./AGENTS.md) for a full breakdown of the codebase layout and conventions.
