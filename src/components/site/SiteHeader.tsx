import { Link } from '@tanstack/react-router'
import { Magnet } from 'lucide-react'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
            <Magnet className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <span className="font-semibold tracking-tight text-lg">Magnetrieve</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-7 text-sm text-zinc-400">
          <a href="#how-it-works" className="hover:text-zinc-100 transition-colors">
            How it works
          </a>
          <a href="#specs" className="hover:text-zinc-100 transition-colors">
            Specs
          </a>
          <a href="#architecture" className="hover:text-zinc-100 transition-colors">
            Architecture
          </a>
        </nav>
        <Link
          to="/dashboard"
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-400 transition-colors"
        >
          Launch Dashboard
        </Link>
      </div>
    </header>
  )
}
