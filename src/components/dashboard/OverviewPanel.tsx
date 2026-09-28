import {
  Activity,
  ArrowRight,
  BatteryMedium,
  Bot,
  Gauge,
  Magnet as MagnetIcon,
  MoveDiagonal,
  PackageSearch,
  Radar,
  Wifi,
} from 'lucide-react'
import type { RobotState } from '@/lib/robot-simulation'
import { StatusCard } from './StatusCard'
import { cn } from '@/lib/cn'

const modeLabels: Record<RobotState['mode'], string> = {
  idle: 'Idle',
  scanning: 'Scanning',
  driving: 'Driving',
  retrieving: 'Retrieving',
  depositing: 'Depositing',
  'e-stopped': 'E-Stopped',
}

const armLabels: Record<RobotState['armPosition'], string> = {
  stowed: 'Stowed',
  lowered: 'Lowered',
  raised: 'Raised',
  'over-bin': 'Over Bin',
}

interface OverviewPanelProps {
  state: RobotState
  onNavigate: (tab: 'control' | 'detection' | 'bin' | 'log' | 'settings' | 'overview') => void
}

export function OverviewPanel({ state, onNavigate }: OverviewPanelProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mission Overview</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Live telemetry snapshot &mdash; uptime{' '}
            <span className="font-mono text-zinc-400">
              {formatUptime(Date.now() - state.sessionStart)}
            </span>
          </p>
        </div>
        <button
          onClick={() => onNavigate('control')}
          className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-400 transition-colors"
        >
          Open Control <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
        <StatusCard
          icon={Bot}
          label="Robot Status"
          value={modeLabels[state.mode]}
          detail={state.emergencyStopped ? 'Awaiting reset' : 'Nominal'}
          tone={state.mode === 'e-stopped' ? 'danger' : state.mode === 'idle' ? 'neutral' : 'good'}
        />
        <StatusCard
          icon={Wifi}
          label="Connection"
          value={state.connection === 'online' ? 'Online' : state.connection === 'reconnecting' ? 'Unstable' : 'Offline'}
          detail="Telemetry link"
          tone={state.connection === 'online' ? 'good' : state.connection === 'reconnecting' ? 'warning' : 'danger'}
        />
        <StatusCard
          icon={BatteryMedium}
          label="Battery"
          value={`${Math.round(state.battery)}%`}
          detail={state.charging ? 'Charging' : 'Discharging'}
          tone={state.battery <= 15 ? 'danger' : state.battery <= 40 ? 'warning' : 'good'}
        />
        <StatusCard
          icon={Radar}
          label="Metal Detection"
          value={state.metalDetected ? `${state.detectionStrength}%` : 'Clear'}
          detail={state.metalDetected ? 'Signal strength' : 'No target'}
          tone={state.metalDetected ? 'accent' : 'neutral'}
        />
        <StatusCard
          icon={MagnetIcon}
          label="Electromagnet"
          value={state.magnetOn ? 'Energized' : 'Off'}
          detail={state.magnetOn ? 'Drawing current' : 'Standby'}
          tone={state.magnetOn ? 'accent' : 'neutral'}
        />
        <StatusCard
          icon={MoveDiagonal}
          label="Arm Position"
          value={armLabels[state.armPosition]}
          detail={`Extension ${state.armExtension}%`}
          tone="neutral"
        />
        <StatusCard
          icon={PackageSearch}
          label="Objects Collected"
          value={String(state.objectsCollected)}
          detail={`Bin ${state.binFillPercent}% full`}
          tone={state.binStatus === 'full' ? 'danger' : state.binStatus === 'nearly-full' ? 'warning' : 'good'}
        />
        <StatusCard
          icon={Gauge}
          label="Speed"
          value={`${state.speed.toFixed(1)} m/s`}
          detail={`Heading ${state.heading}°`}
          tone="neutral"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-300">Recent activity</h2>
            <button
              onClick={() => onNavigate('log')}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              Full log <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <ul className="mt-3 space-y-2.5">
            {state.log.slice(0, 5).map((entry) => (
              <li key={entry.id} className="flex items-start gap-2.5 text-sm">
                <span
                  className={cn(
                    'mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full',
                    entry.level === 'critical' && 'bg-red-400',
                    entry.level === 'warning' && 'bg-amber-400',
                    entry.level === 'success' && 'bg-teal-400',
                    entry.level === 'info' && 'bg-zinc-600',
                  )}
                />
                <span className="text-zinc-400 flex-1">{entry.message}</span>
                <span className="font-mono text-[11px] text-zinc-600 shrink-0">
                  {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 flex flex-col">
          <h2 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
            <Activity className="h-4 w-4 text-amber-400" /> Retrieval cycle
          </h2>
          <ol className="mt-4 space-y-3 text-sm">
            {(
              [
                ['Scan', state.mode === 'scanning' || state.metalDetected || state.mode === 'retrieving'],
                ['Detect', state.metalDetected],
                ['Lower & magnetize', state.armPosition === 'lowered' && state.magnetOn],
                ['Transport to bin', state.armPosition === 'over-bin'],
                ['Release', state.binFillPercent > 8],
              ] as const
            ).map(([label, done], i) => (
              <li key={label} className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-mono font-semibold',
                    done ? 'bg-teal-500/20 text-teal-300' : 'bg-zinc-800 text-zinc-500',
                  )}
                >
                  {i + 1}
                </span>
                <span className={done ? 'text-zinc-200' : 'text-zinc-500'}>{label}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}

function formatUptime(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
