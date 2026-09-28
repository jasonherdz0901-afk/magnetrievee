import { Link } from '@tanstack/react-router'
import { ArrowRight, Magnet, Radar } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-amber-300">
            <Radar className="h-3.5 w-3.5" /> Autonomous ferrous retrieval
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold tracking-tight leading-[1.05]">
            It hunts down loose metal, <span className="text-amber-400">then puts it away.</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed">
            Magnetrieve is a tracked robot built to sweep a work site, sense ferrous debris underfoot, and lift it clear
            with a solenoid electromagnet mounted on its arm &mdash; dropping every bolt, nail, and scrap into its own
            collector bin without anyone reaching for a dustpan.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-amber-400 transition-colors"
            >
              Launch control dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 rounded-lg border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-300 hover:border-zinc-600 hover:text-zinc-100 transition-colors"
            >
              See how it works
            </a>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-6 max-w-md">
            <div>
              <dt className="text-xs uppercase tracking-wide text-zinc-500">Detection range</dt>
              <dd className="mt-1 font-mono text-xl font-semibold text-zinc-100">14.5cm</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-zinc-500">Arm reach</dt>
              <dd className="mt-1 font-mono text-xl font-semibold text-zinc-100">62cm</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-zinc-500">Runtime</dt>
              <dd className="mt-1 font-mono text-xl font-semibold text-zinc-100">2.3hr</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-amber-500/10 via-transparent to-teal-500/10 blur-2xl" />
          <div className="overflow-hidden rounded-2xl border border-zinc-800 shadow-2xl shadow-black/40">
            <img
              src="/.netlify/images?url=/img/magnetrieve-hero.png&w=1100&fm=webp&q=82"
              alt="Magnetrieve tracked robot extending its arm-mounted electromagnet toward scattered metal debris"
              className="w-full h-auto object-cover"
              width={1100}
              height={614}
            />
          </div>

          <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/95 px-4 py-3 shadow-xl backdrop-blur">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10 text-teal-300">
              <Magnet className="h-4 w-4" />
            </div>
            <div>
              <p className="font-mono text-lg font-semibold leading-none text-zinc-50">2.4A</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">electromagnet draw at full hold</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
