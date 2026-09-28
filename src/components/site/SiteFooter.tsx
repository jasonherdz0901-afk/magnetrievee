import { Magnet } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800/80">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-zinc-500">
          <Magnet className="h-4 w-4" />
          <span className="text-sm">Magnetrieve &mdash; ferrous retrieval robot, built in-house.</span>
        </div>
        <p className="text-xs text-zinc-600 font-mono">Control layer running on a custom C# service &middot; deployed on Netlify</p>
      </div>
    </footer>
  )
}
