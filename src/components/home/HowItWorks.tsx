import { ArrowDownToLine, CornerDownRight, Magnet, Radar, Trash2 } from 'lucide-react'

const steps = [
  {
    icon: Radar,
    title: 'Scan',
    body: 'The chassis rolls forward while the inductive sensor sweeps the ground ahead for ferrous signatures.',
  },
  {
    icon: ArrowDownToLine,
    title: 'Lower & magnetize',
    body: 'On a detection, the arm lowers the solenoid coil to the object and the electromagnet energizes.',
  },
  {
    icon: Magnet,
    title: 'Lift',
    body: 'The object clings to the coil as the arm raises it clear of the ground and any surrounding debris.',
  },
  {
    icon: CornerDownRight,
    title: 'Transport',
    body: 'The arm swings back and positions the coil directly over the collector bin at the rear of the chassis.',
  },
  {
    icon: Trash2,
    title: 'Release',
    body: 'Power to the coil cuts out, the magnetic field collapses, and the object falls into the bin.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-zinc-800/80 bg-zinc-900/20">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="overflow-hidden rounded-2xl border border-zinc-800 shadow-xl shadow-black/30 order-2 lg:order-1">
            <img
              src="/.netlify/images?url=/img/magnetrieve-arm-detail.png&w=900&fm=webp&q=82"
              alt="Close-up of the electromagnet coil holding a cluster of rusty bolts and washers"
              className="w-full h-auto object-cover"
              width={900}
              height={672}
            />
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">The retrieval cycle, step by step</h2>
            <p className="mt-3 text-zinc-400 max-w-lg">
              Every pass follows the same five-stage loop, whether it is triggered automatically during a sweep or
              stepped through manually from the Control tab.
            </p>

            <ol className="mt-8 space-y-5">
              {steps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 font-mono text-sm font-semibold text-amber-300">
                      {i + 1}
                    </span>
                    {i < steps.length - 1 && <span className="mt-1 h-full w-px flex-1 bg-zinc-800" />}
                  </div>
                  <div className="pb-1">
                    <h3 className="flex items-center gap-2 font-semibold text-zinc-100">
                      <step.icon className="h-4 w-4 text-zinc-500" />
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-400 leading-relaxed">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
