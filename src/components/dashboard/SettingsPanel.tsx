import { useState } from 'react'
import { Check, FlaskConical, Save, Server, SlidersHorizontal } from 'lucide-react'
import type { RobotSimulation } from '@/lib/robot-simulation'
import { cn } from '@/lib/cn'

interface SettingsPanelProps {
  state: RobotSimulation['state']
  actions: RobotSimulation['actions']
}

export function SettingsPanel({ actions }: SettingsPanelProps) {
  const [host, setHost] = useState('192.168.4.20')
  const [port, setPort] = useState('7112')
  const [telemetryRate, setTelemetryRate] = useState(5)
  const [armSensitivity, setArmSensitivity] = useState(60)
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">System Settings</h1>
        <p className="mt-1 text-sm text-zinc-500">Connection parameters, calibration, and diagnostic tools.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h2 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
            <Server className="h-4 w-4 text-amber-400" /> Robot connection
          </h2>
          <p className="text-xs text-zinc-500 mb-4">
            Address of the onboard C# control service that talks directly to the motors, arm servos, and electromagnet driver.
          </p>
          <div className="space-y-3">
            <Field label="Host / IP address">
              <input
                value={host}
                onChange={(e) => setHost(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950/60 px-3 py-2 text-sm font-mono text-zinc-200 outline-none focus:border-amber-500/50"
              />
            </Field>
            <Field label="Port">
              <input
                value={port}
                onChange={(e) => setPort(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950/60 px-3 py-2 text-sm font-mono text-zinc-200 outline-none focus:border-amber-500/50"
              />
            </Field>
            <Field label={`Telemetry refresh rate — ${telemetryRate} Hz`}>
              <input
                type="range"
                min={1}
                max={20}
                value={telemetryRate}
                onChange={(e) => setTelemetryRate(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </Field>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h2 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-amber-400" /> Calibration &amp; display
          </h2>
          <div className="space-y-3">
            <Field label={`Arm servo sensitivity — ${armSensitivity}%`}>
              <input
                type="range"
                min={0}
                max={100}
                value={armSensitivity}
                onChange={(e) => setArmSensitivity(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </Field>
            <Field label="Units">
              <div className="flex gap-2">
                {(['metric', 'imperial'] as const).map((u) => (
                  <button
                    key={u}
                    onClick={() => setUnits(u)}
                    className={cn(
                      'flex-1 rounded-lg border px-3 py-2 text-sm capitalize transition-colors',
                      units === u ? 'border-amber-500/50 bg-amber-500/10 text-amber-300' : 'border-zinc-700 text-zinc-400',
                    )}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <button
            onClick={handleSave}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-400 transition-colors"
          >
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? 'Settings saved' : 'Save settings'}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <h2 className="text-sm font-semibold text-zinc-300 mb-1 flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-amber-400" /> Diagnostics &amp; test mode
        </h2>
        <p className="text-xs text-zinc-500 mb-4">
          Exercise the dashboard's alerting and status logic without a physical robot connected.
        </p>
        <div className="flex flex-wrap gap-2.5">
          <TestButton label="Trigger detection" onClick={() => actions.simulate('detect')} />
          <TestButton label="Simulate low battery" onClick={() => actions.simulate('lowBattery')} />
          <TestButton label="Simulate connection loss" onClick={() => actions.simulate('connectionLoss')} />
          <TestButton label="Fill collector bin" onClick={() => actions.simulate('fillBin')} />
          <TestButton label="Reset session" onClick={() => actions.simulate('reset')} tone="danger" />
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-zinc-500">{label}</span>
      {children}
    </label>
  )
}

function TestButton({ label, onClick, tone = 'default' }: { label: string; onClick: () => void; tone?: 'default' | 'danger' }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors',
        tone === 'danger'
          ? 'border-red-500/30 text-red-300 hover:bg-red-500/10'
          : 'border-zinc-700 text-zinc-300 hover:border-amber-500/40 hover:text-amber-300',
      )}
    >
      {label}
    </button>
  )
}
