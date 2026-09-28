import { ArrowRight, Cpu, Cog, MonitorDot } from 'lucide-react'

const layers = [
  {
    icon: MonitorDot,
    title: 'Web dashboard',
    subtitle: 'This site, deployed on Netlify',
    points: ['Sends drive, arm, and magnet commands', 'Renders live status cards and alerts', 'Works on desktop and mobile'],
  },
  {
    icon: Cpu,
    title: 'C# control service',
    subtitle: 'Runs on the robot’s onboard computer',
    points: ['Translates commands into motor and servo signals', 'Streams sensor and battery telemetry back', 'Owns the emergency-stop safety logic'],
  },
  {
    icon: Cog,
    title: 'Robot hardware',
    subtitle: 'Motors, sensors, arm, magnet, bin',
    points: ['Inductive coil senses ferrous metal', 'Arm and solenoid electromagnet retrieve it', 'Collector bin holds what’s been picked up'],
  },
]

export function SystemArchitecture() {
  return (
    <section id="architecture" className="border-t border-zinc-800/80">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Three layers, one system</h2>
          <p className="mt-3 text-zinc-400">
            The dashboard never talks to motors directly. Commands and telemetry pass through a dedicated C# service
            running on the robot, which is what actually drives the hardware &mdash; keeping the web layer free to grow
            with new features without touching robot-side code.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-stretch">
          {layers.map((layer, i) => (
            <div key={layer.title} className="flex flex-1 items-stretch gap-4">
              <div className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <layer.icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <h3 className="mt-4 font-semibold text-zinc-100">{layer.title}</h3>
                <p className="text-xs text-zinc-500 mt-0.5">{layer.subtitle}</p>
                <ul className="mt-3 space-y-1.5 text-sm text-zinc-400">
                  {layer.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="text-amber-500/60">&bull;</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              {i < layers.length - 1 && (
                <div className="hidden lg:flex items-center text-zinc-700">
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
