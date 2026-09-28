const specs = [
  { label: 'Chassis footprint', value: '54 x 38cm' },
  { label: 'Drive system', value: 'Dual tracked, 0.9 m/s max' },
  { label: 'Arm reach', value: '62cm, 3 joints' },
  { label: 'Detection depth', value: 'Up to 14.5cm' },
  { label: 'Electromagnet hold', value: '38N at full charge' },
  { label: 'Collector bin capacity', value: '~4.2L' },
  { label: 'Battery runtime', value: '2.3hr active sweep' },
  { label: 'Max object mass', value: '0.6kg per lift' },
]

export function SpecsSection() {
  return (
    <section id="specs" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="max-w-2xl">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Hardware at a glance</h2>
        <p className="mt-3 text-zinc-400">
          Specs from the current prototype build. The dashboard surfaces live readings for most of these during
          operation.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-800 sm:grid-cols-4">
        {specs.map((s) => (
          <div key={s.label} className="bg-zinc-950 p-5">
            <p className="text-xs uppercase tracking-wide text-zinc-500">{s.label}</p>
            <p className="mt-2 font-mono text-lg font-semibold text-zinc-100">{s.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
