import { AlertTriangle, Ban, BatteryWarning, WifiOff } from 'lucide-react'
import type { RobotState } from '@/lib/robot-simulation'

interface NotificationStackProps {
  state: RobotState
  onResetEmergencyStop: () => void
}

export function NotificationStack({ state, onResetEmergencyStop }: NotificationStackProps) {
  const notices: Array<{ id: string; tone: 'critical' | 'warning'; icon: typeof AlertTriangle; text: string; action?: { label: string; onClick: () => void } }> = []

  if (state.emergencyStopped) {
    notices.push({
      id: 'estop',
      tone: 'critical',
      icon: Ban,
      text: 'Emergency stop engaged. Drive, arm, and electromagnet commands are disabled.',
      action: { label: 'Clear stop', onClick: onResetEmergencyStop },
    })
  }
  if (state.connection !== 'online') {
    notices.push({
      id: 'conn',
      tone: 'critical',
      icon: WifiOff,
      text:
        state.connection === 'reconnecting'
          ? 'Telemetry link unstable. Attempting to reconnect to Magnetrieve...'
          : 'Telemetry link lost. Commands cannot reach the robot.',
    })
  }
  if (state.battery <= 15) {
    notices.push({
      id: 'batt',
      tone: 'warning',
      icon: BatteryWarning,
      text: `Battery at ${Math.round(state.battery)}%. Return Magnetrieve to the charging dock soon.`,
    })
  }
  if (state.binStatus === 'full') {
    notices.push({
      id: 'bin',
      tone: 'warning',
      icon: AlertTriangle,
      text: 'Collector bin is full. Empty it before continuing retrieval runs.',
    })
  }

  if (notices.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      {notices.map((n) => (
        <div
          key={n.id}
          className={
            n.tone === 'critical'
              ? 'flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200'
              : 'flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200'
          }
        >
          <n.icon className="h-5 w-5 shrink-0" strokeWidth={2} />
          <p className="flex-1 min-w-0">{n.text}</p>
          {n.action && (
            <button
              onClick={n.action.onClick}
              className="shrink-0 rounded-lg border border-current/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide hover:bg-white/10 transition-colors"
            >
              {n.action.label}
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
