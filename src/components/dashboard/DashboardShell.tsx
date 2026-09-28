import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Activity,
  Gamepad2,
  Gauge,
  Magnet as MagnetIcon,
  PackageSearch,
  Settings as SettingsIcon,
  Wifi,
  WifiOff,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  ArrowLeft,
} from 'lucide-react'
import { useRobotSimulation } from '@/lib/robot-simulation'
import { cn } from '@/lib/cn'
import { NotificationStack } from './NotificationStack'
import { OverviewPanel } from './OverviewPanel'
import { ControlPanel } from './ControlPanel'
import { MetalDetectionPanel } from './MetalDetectionPanel'
import { CollectorBinPanel } from './CollectorBinPanel'
import { ActivityLogPanel } from './ActivityLogPanel'
import { SettingsPanel } from './SettingsPanel'

const TABS = [
  { id: 'overview', label: 'Overview', icon: Gauge },
  { id: 'control', label: 'Control', icon: Gamepad2 },
  { id: 'detection', label: 'Metal Detection', icon: MagnetIcon },
  { id: 'bin', label: 'Collector Bin', icon: PackageSearch },
  { id: 'log', label: 'Activity Log', icon: Activity },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
] as const

type TabId = (typeof TABS)[number]['id']

function BatteryIcon({ level }: { level: number }) {
  if (level <= 20) return <BatteryLow className="h-4 w-4" />
  if (level <= 60) return <BatteryMedium className="h-4 w-4" />
  return <BatteryFull className="h-4 w-4" />
}

export function DashboardShell() {
  const sim = useRobotSimulation()
  const [tab, setTab] = useState<TabId>('overview')
  const { state, actions, mounted } = sim

  const connectionMeta = {
    online: { label: 'Online', color: 'text-teal-400', dot: 'bg-teal-400' },
    reconnecting: { label: 'Reconnecting', color: 'text-amber-400', dot: 'bg-amber-400' },
    offline: { label: 'Offline', color: 'text-red-400', dot: 'bg-red-400' },
  }[state.connection]

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 grid-texture">
      <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">Home</span>
          </Link>
          <div className="h-5 w-px bg-zinc-800" />
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <MagnetIcon className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <span className="font-semibold tracking-tight">Magnetrieve</span>
            <span className="hidden sm:inline text-xs text-zinc-500 font-mono">/ control</span>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm">
              <span className={cn('relative flex h-2 w-2 rounded-full', connectionMeta.dot)}>
                {state.connection === 'online' && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-60" />
                )}
              </span>
              <span className={connectionMeta.color}>{connectionMeta.label}</span>
              {state.connection === 'online' ? (
                <Wifi className="h-3.5 w-3.5 text-zinc-600" />
              ) : (
                <WifiOff className="h-3.5 w-3.5 text-zinc-600" />
              )}
            </div>
            <div className="hidden xs:flex items-center gap-1.5 font-mono text-xs sm:text-sm text-zinc-300">
              <BatteryIcon level={state.battery} />
              {Math.round(state.battery)}%
            </div>
          </div>
        </div>

        <nav className="mx-auto flex max-w-[1400px] gap-1 overflow-x-auto px-4 pb-2 sm:px-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                tab === t.id
                  ? 'bg-amber-500/15 text-amber-300'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60',
              )}
            >
              <t.icon className="h-4 w-4" strokeWidth={2} />
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 space-y-6">
        <NotificationStack state={state} onResetEmergencyStop={actions.resetEmergencyStop} />

        {!mounted ? (
          <div className="flex h-64 items-center justify-center text-zinc-600 text-sm font-mono">
            Establishing telemetry link...
          </div>
        ) : (
          <>
            {tab === 'overview' && <OverviewPanel state={state} onNavigate={setTab} />}
            {tab === 'control' && <ControlPanel state={state} actions={actions} />}
            {tab === 'detection' && <MetalDetectionPanel state={state} actions={actions} />}
            {tab === 'bin' && <CollectorBinPanel state={state} />}
            {tab === 'log' && <ActivityLogPanel state={state} />}
            {tab === 'settings' && <SettingsPanel state={state} actions={actions} />}
          </>
        )}
      </main>

      <button
        onClick={state.emergencyStopped ? actions.resetEmergencyStop : actions.emergencyStop}
        className={cn(
          'fixed bottom-5 right-4 sm:bottom-8 sm:right-8 z-40 flex h-16 w-16 sm:h-20 sm:w-20 flex-col items-center justify-center rounded-full border-4 font-bold uppercase tracking-wide shadow-2xl transition-transform hover:scale-105 active:scale-95',
          state.emergencyStopped
            ? 'border-zinc-700 bg-zinc-800 text-zinc-300'
            : 'border-red-400/40 bg-red-600 text-white animate-pulse-ring',
        )}
        aria-label={state.emergencyStopped ? 'Clear emergency stop' : 'Emergency stop'}
      >
        <span className="text-[9px] sm:text-[10px] leading-tight">{state.emergencyStopped ? 'Clear' : 'STOP'}</span>
        <span className="text-[8px] sm:text-[9px] font-medium normal-case text-white/70">
          {state.emergencyStopped ? 'to resume' : 'emergency'}
        </span>
      </button>
    </div>
  )
}
