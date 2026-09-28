import { Archive, CheckCircle2, Clock, PackageCheck, TriangleAlert } from 'lucide-react'
import type { RobotState } from '@/lib/robot-simulation'
import { cn } from '@/lib/cn'

interface CollectorBinPanelProps {
  state: RobotState
}

const statusMeta: Record<RobotState['binStatus'], { label: string; tone: string; icon: typeof Archive }> = {
  clear: { label: 'Clear', tone: 'text-teal-300 bg-teal-500/10 border-teal-500/30', icon: CheckCircle2 },
  filling: { label: 'Filling', tone: 'text-zinc-300 bg-zinc-800 border-zinc-700', icon: Archive },
  'nearly-full': { label: 'Nearly full', tone: 'text-amber-300 bg-amber-500/10 border-amber-500/30', icon: TriangleAlert },
  full: { label: 'Full — empty required', tone: 'text-red-300 bg-red-500/10 border-red-500/30', icon: TriangleAlert },
}

export function CollectorBinPanel({ state }: CollectorBinPanelProps) {
  const meta = statusMeta[state.binStatus]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Collector Bin</h1>
        <p className="mt-1 text-sm text-zinc-500">Fill level and retrieval history for the rear collection bin.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <div className="flex items-center justify-between mb-6">
            <span className={cn('flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium', meta.tone)}>
              <meta.icon className="h-3.5 w-3.5" />
              {meta.label}
            </span>
            <span className="font-mono text-3xl font-semibold text-zinc-50">{state.binFillPercent}%</span>
          </div>

          <div className="mx-auto w-28 h-40 relative">
            <div className="absolute inset-0 rounded-b-xl rounded-t-md border-2 border-zinc-700 overflow-hidden bg-zinc-950/60">
              <div
                className={cn(
                  'absolute bottom-0 left-0 right-0 transition-all duration-700',
                  state.binStatus === 'full'
                    ? 'bg-red-500/50'
                    : state.binStatus === 'nearly-full'
                      ? 'bg-amber-500/50'
                      : 'bg-teal-500/40',
                )}
                style={{ height: `${state.binFillPercent}%` }}
              />
              <div className="absolute inset-x-0 top-0 h-2 bg-zinc-800/80 border-b border-zinc-700" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-zinc-950/50 p-3 text-center">
              <p className="font-mono text-xl font-semibold text-zinc-50">{state.objectsCollected}</p>
              <p className="text-[11px] uppercase tracking-wide text-zinc-500 mt-0.5">Objects collected</p>
            </div>
            <div className="rounded-xl bg-zinc-950/50 p-3 text-center">
              <p className="font-mono text-xl font-semibold text-zinc-50">
                {state.lastCollectedAt ? new Date(state.lastCollectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
              </p>
              <p className="text-[11px] uppercase tracking-wide text-zinc-500 mt-0.5">Last deposit</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h2 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
            <PackageCheck className="h-4 w-4 text-amber-400" /> Collected objects
          </h2>
          {state.detectionHistory.filter((d) => d.resolved === 'collected').length === 0 ? (
            <p className="text-sm text-zinc-600">Nothing deposited yet this session.</p>
          ) : (
            <ul className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {state.detectionHistory
                .filter((d) => d.resolved === 'collected')
                .map((d, i, arr) => (
                  <li
                    key={d.id}
                    className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-sm"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500/15 font-mono text-[11px] text-teal-300">
                      {arr.length - i}
                    </span>
                    <span className="flex-1 text-zinc-300">Ferrous object, signal {d.strength}%</span>
                    <span className="flex items-center gap-1 font-mono text-[11px] text-zinc-600 shrink-0">
                      <Clock className="h-3 w-3" />
                      {new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
