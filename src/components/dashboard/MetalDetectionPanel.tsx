import { CheckCircle2, CircleDashed, Radar, TriangleAlert, Waves } from 'lucide-react'
import type { RobotSimulation } from '@/lib/robot-simulation'
import { cn } from '@/lib/cn'

interface MetalDetectionPanelProps {
  state: RobotSimulation['state']
  actions: RobotSimulation['actions']
}

export function MetalDetectionPanel({ state, actions }: MetalDetectionPanelProps) {
  const disabled = state.emergencyStopped || state.connection !== 'online'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Metal Detection</h1>
          <p className="mt-1 text-sm text-zinc-500">Inductive sensor sweep and detection history.</p>
        </div>
        <button
          onClick={() => actions.setScanning(state.mode !== 'scanning')}
          disabled={disabled}
          className={cn(
            'flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40',
            state.mode === 'scanning'
              ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
              : 'border-zinc-700 text-zinc-300 hover:text-zinc-100',
          )}
        >
          <Radar className="h-4 w-4" />
          {state.mode === 'scanning' ? 'Sweep active' : 'Start sweep'}
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col items-center justify-center text-center">
          <div className="relative flex h-44 w-44 items-center justify-center">
            <div
              className={cn(
                'absolute inset-0 rounded-full border-2',
                state.metalDetected ? 'border-amber-500/50' : 'border-zinc-800',
              )}
            />
            {[1, 2, 3].map((ring) => (
              <div
                key={ring}
                className={cn(
                  'absolute rounded-full border',
                  state.metalDetected ? 'border-amber-500/25' : 'border-zinc-800/60',
                )}
                style={{ inset: `${ring * 14}px` }}
              />
            ))}
            <div className="relative z-10 flex flex-col items-center">
              {state.metalDetected ? (
                <TriangleAlert className="h-10 w-10 text-amber-400" />
              ) : (
                <CircleDashed
                  className={cn('h-10 w-10 text-zinc-600', state.mode === 'scanning' && 'animate-spin [animation-duration:3s]')}
                />
              )}
              <p className={cn('mt-2 font-mono text-2xl font-semibold', state.metalDetected ? 'text-amber-300' : 'text-zinc-500')}>
                {state.metalDetected ? `${state.detectionStrength}%` : '—'}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">signal strength</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-zinc-400 max-w-xs">
            {state.metalDetected
              ? 'Ferrous object detected below the sensor array. Switch to Control to lower the arm and energize the electromagnet.'
              : state.mode === 'scanning'
                ? 'Sweeping for ferrous material...'
                : 'Detector idle. Start a sweep or begin driving to search for objects.'}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h2 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
            <Waves className="h-4 w-4 text-amber-400" /> Detection history
          </h2>
          {state.detectionHistory.length === 0 ? (
            <p className="text-sm text-zinc-600">No detections yet this session.</p>
          ) : (
            <ul className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {state.detectionHistory.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-sm"
                >
                  {d.resolved === 'collected' ? (
                    <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
                  ) : d.resolved === 'pending' ? (
                    <TriangleAlert className="h-4 w-4 text-amber-400 shrink-0" />
                  ) : (
                    <CircleDashed className="h-4 w-4 text-zinc-600 shrink-0" />
                  )}
                  <span className="flex-1 text-zinc-300">
                    Signal {d.strength}% &mdash;{' '}
                    <span className={d.resolved === 'collected' ? 'text-teal-400' : 'text-zinc-500'}>
                      {d.resolved === 'collected' ? 'collected' : d.resolved === 'pending' ? 'pending retrieval' : 'missed'}
                    </span>
                  </span>
                  <span className="font-mono text-[11px] text-zinc-600 shrink-0">
                    {new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
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
