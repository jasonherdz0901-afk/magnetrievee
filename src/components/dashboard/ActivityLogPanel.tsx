import { useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from 'lucide-react'
import type { RobotState, LogLevel } from '@/lib/robot-simulation'
import { cn } from '@/lib/cn'

interface ActivityLogPanelProps {
  state: RobotState
}

const levelMeta: Record<LogLevel, { icon: typeof Info; color: string; label: string }> = {
  info: { icon: Info, color: 'text-zinc-400', label: 'Info' },
  success: { icon: CheckCircle2, color: 'text-teal-400', label: 'Success' },
  warning: { icon: AlertTriangle, color: 'text-amber-400', label: 'Warning' },
  critical: { icon: ShieldAlert, color: 'text-red-400', label: 'Critical' },
}

const FILTERS: Array<LogLevel | 'all'> = ['all', 'info', 'success', 'warning', 'critical']

export function ActivityLogPanel({ state }: ActivityLogPanelProps) {
  const [filter, setFilter] = useState<LogLevel | 'all'>('all')

  const entries = useMemo(
    () => (filter === 'all' ? state.log : state.log.filter((e) => e.level === filter)),
    [state.log, filter],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Activity Log</h1>
          <p className="mt-1 text-sm text-zinc-500">Full system and telemetry event history for this session.</p>
        </div>
        <div className="flex gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors',
                filter === f ? 'bg-amber-500/15 text-amber-300' : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60',
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
        {entries.length === 0 ? (
          <p className="p-6 text-sm text-zinc-600">No events match this filter.</p>
        ) : (
          <ul className="divide-y divide-zinc-800/70 max-h-[32rem] overflow-y-auto">
            {entries.map((entry) => {
              const meta = levelMeta[entry.level]
              return (
                <li key={entry.id} className="flex items-start gap-3 px-4 py-3 sm:px-5">
                  <meta.icon className={cn('h-4 w-4 mt-0.5 shrink-0', meta.color)} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-zinc-200">{entry.message}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[11px] text-zinc-600">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
