import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDownToLine,
  ArrowUpFromLine,
  CornerDownRight,
  Home,
  Magnet as MagnetIcon,
  Radar,
  Square,
  Zap,
} from 'lucide-react'
import type { RobotSimulation } from '@/lib/robot-simulation'
import { cn } from '@/lib/cn'

interface ControlPanelProps {
  state: RobotSimulation['state']
  actions: RobotSimulation['actions']
}

export function ControlPanel({ state, actions }: ControlPanelProps) {
  const disabled = state.emergencyStopped || state.connection !== 'online'
  const canCollect = state.metalDetected && state.armPosition === 'lowered'
  const canRelease = state.armPosition === 'over-bin' && state.magnetOn

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Manual Control</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Drive the chassis, position the arm, and energize the electromagnet.
          {disabled && <span className="text-red-400"> Controls locked &mdash; resolve the alert above.</span>}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr_1.1fr]">
        {/* Movement */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h2 className="text-sm font-semibold text-zinc-300 mb-4">Chassis Movement</h2>
          <div className="mx-auto grid w-44 grid-cols-3 grid-rows-3 gap-2">
            <div />
            <DirButton icon={ArrowUp} label="Forward" onPress={() => actions.drive('forward')} onRelease={actions.stopDriving} disabled={disabled} />
            <div />
            <DirButton icon={ArrowLeft} label="Left" onPress={() => actions.drive('left')} onRelease={actions.stopDriving} disabled={disabled} />
            <button
              onClick={actions.stopDriving}
              disabled={disabled}
              className="flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-red-300 hover:border-red-500/40 disabled:opacity-40 transition-colors"
              aria-label="Halt"
            >
              <Square className="h-4 w-4" />
            </button>
            <DirButton icon={ArrowRight} label="Right" onPress={() => actions.drive('right')} onRelease={actions.stopDriving} disabled={disabled} />
            <div />
            <DirButton icon={ArrowDown} label="Backward" onPress={() => actions.drive('backward')} onRelease={actions.stopDriving} disabled={disabled} />
            <div />
          </div>
          <div className="mt-4 flex items-center justify-between rounded-lg bg-zinc-950/60 px-3 py-2 font-mono text-xs text-zinc-500">
            <span>Speed {state.speed.toFixed(1)} m/s</span>
            <span>Heading {state.heading}&deg;</span>
          </div>
          <button
            onClick={() => actions.setScanning(state.mode !== 'scanning')}
            disabled={disabled}
            className={cn(
              'mt-3 flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-40',
              state.mode === 'scanning'
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                : 'border-zinc-700 text-zinc-400 hover:text-zinc-200',
            )}
          >
            <Radar className="h-4 w-4" />
            {state.mode === 'scanning' ? 'Detector sweep active' : 'Start detector sweep'}
          </button>
        </div>

        {/* Arm */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h2 className="text-sm font-semibold text-zinc-300 mb-4">Robotic Arm</h2>
          <div className="grid grid-cols-2 gap-2.5">
            <ArmButton
              icon={ArrowDownToLine}
              label="Lower"
              active={state.armPosition === 'lowered'}
              onClick={() => actions.setArm('lowered')}
              disabled={disabled}
            />
            <ArmButton
              icon={ArrowUpFromLine}
              label="Raise"
              active={state.armPosition === 'raised'}
              onClick={() => actions.setArm('raised')}
              disabled={disabled}
            />
            <ArmButton
              icon={CornerDownRight}
              label="Over bin"
              active={state.armPosition === 'over-bin'}
              onClick={() => actions.setArm('over-bin')}
              disabled={disabled}
            />
            <ArmButton
              icon={Home}
              label="Stow"
              active={state.armPosition === 'stowed'}
              onClick={() => actions.setArm('stowed')}
              disabled={disabled}
            />
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
              <span>Extension</span>
              <span className="font-mono">{state.armExtension}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-500"
                style={{ width: `${state.armExtension}%` }}
              />
            </div>
          </div>
        </div>

        {/* Electromagnet */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 flex flex-col">
          <h2 className="text-sm font-semibold text-zinc-300 mb-4">Electromagnet</h2>

          <button
            onClick={actions.toggleMagnet}
            disabled={disabled}
            className={cn(
              'relative flex items-center justify-center gap-3 rounded-xl border-2 px-4 py-6 transition-all disabled:opacity-40',
              state.magnetOn
                ? 'border-amber-400 bg-amber-500/10 text-amber-300'
                : 'border-zinc-700 bg-zinc-950/40 text-zinc-400 hover:border-zinc-600',
            )}
          >
            <MagnetIcon className={cn('h-7 w-7', state.magnetOn && 'animate-pulse-ring rounded-full')} strokeWidth={1.75} />
            <div className="text-left">
              <p className="text-base font-semibold leading-tight">{state.magnetOn ? 'Energized' : 'Off'}</p>
              <p className="text-xs text-zinc-500 leading-tight">
                {state.magnetOn ? 'Tap to de-energize' : 'Tap to energize'}
              </p>
            </div>
          </button>

          <div className="mt-4 space-y-2 text-xs">
            <Hint
              active={canCollect && !state.magnetOn}
              text="Object detected under the arm — energize the magnet to collect it."
            />
            <Hint
              active={canRelease}
              text="Arm is over the bin — de-energize the magnet to release the object."
            />
          </div>

          <div className="mt-auto pt-4 flex items-center gap-2 rounded-lg bg-zinc-950/60 px-3 py-2 font-mono text-xs text-zinc-500">
            <Zap className="h-3.5 w-3.5" />
            {state.magnetOn ? 'Drawing ~2.4A from main bus' : 'Standby, 0.0A'}
          </div>
        </div>
      </div>
    </div>
  )
}

function DirButton({
  icon: Icon,
  label,
  onPress,
  onRelease,
  disabled,
}: {
  icon: typeof ArrowUp
  label: string
  onPress: () => void
  onRelease: () => void
  disabled: boolean
}) {
  return (
    <button
      onMouseDown={onPress}
      onMouseUp={onRelease}
      onMouseLeave={onRelease}
      onTouchStart={onPress}
      onTouchEnd={onRelease}
      disabled={disabled}
      aria-label={label}
      className="flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800/80 text-zinc-300 hover:border-amber-500/50 hover:text-amber-300 active:bg-amber-500/20 disabled:opacity-40 transition-colors h-14"
    >
      <Icon className="h-5 w-5" />
    </button>
  )
}

function ArmButton({
  icon: Icon,
  label,
  active,
  onClick,
  disabled,
}: {
  icon: typeof Home
  label: string
  active: boolean
  onClick: () => void
  disabled: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-medium transition-colors disabled:opacity-40',
        active
          ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
          : 'border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600',
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

function Hint({ active, text }: { active: boolean; text: string }) {
  if (!active) return null
  return (
    <p className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-amber-300">{text}</p>
  )
}
