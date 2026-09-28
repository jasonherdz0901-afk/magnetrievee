import { Magnet, MonitorSmartphone, Radar, ShieldAlert, Trash2, Wifi } from 'lucide-react'
import { cn } from '@/lib/cn'

const features = [
  {
    icon: Radar,
    title: 'Inductive metal detection',
    body: 'A ground-facing coil sweeps for ferrous signatures as the chassis moves, flagging bolts, nails, and scrap the instant they pass underneath.',
    span: 'lg:col-span-2 lg:row-span-2',
    tone: 'amber',
  },
  {
    icon: Magnet,
    title: 'Solenoid electromagnet arm',
    body: 'A three-jointed arm lowers the coil straight onto a detected object and energizes it, lifting the piece clear without ever gripping it.',
    span: 'lg:col-span-1',
    tone: 'teal',
  },
  {
    icon: Trash2,
    title: 'Automatic bin release',
    body: 'Swing the arm over the rear bin and cut power to the coil &mdash; the object drops in on its own, no manual sorting required.',
    span: 'lg:col-span-1',
    tone: 'teal',
  },
  {
    icon: Wifi,
    title: 'C# telemetry link',
    body: 'A dedicated communication layer streams battery, position, and sensor state from the onboard controller to this dashboard several times a second.',
    span: 'lg:col-span-1',
    tone: 'amber',
  },
  {
    icon: ShieldAlert,
    title: 'One-tap emergency stop',
    body: 'A single always-on-screen control halts the drivetrain and de-energizes the magnet immediately, from any tab in the dashboard.',
    span: 'lg:col-span-1',
    tone: 'danger',
  },
  {
    icon: MonitorSmartphone,
    title: 'Built for the field',
    body: 'The control surface adapts from a shop-floor monitor down to a phone in your pocket, so you can run a retrieval pass from wherever you stand.',
    span: 'lg:col-span-2',
    tone: 'amber',
  },
] as const

const toneClasses: Record<string, string> = {
  amber: 'text-amber-400 bg-amber-500/10',
  teal: 'text-teal-300 bg-teal-500/10',
  danger: 'text-red-300 bg-red-500/10',
}

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="max-w-2xl">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">One robot, one dashboard, one loop.</h2>
        <p className="mt-3 text-zinc-400">
          Every part of the retrieval cycle &mdash; sensing, lifting, transporting, releasing &mdash; is visible and
          controllable from the same interface.
        </p>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
        {features.map((f) => (
          <div
            key={f.title}
            className={cn(
              'rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col',
              f.span,
            )}
          >
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', toneClasses[f.tone])}>
              <f.icon className="h-5 w-5" strokeWidth={2} />
            </div>
            <h3 className="mt-4 font-semibold text-zinc-100">{f.title}</h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
