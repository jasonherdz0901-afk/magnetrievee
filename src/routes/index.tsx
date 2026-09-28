import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { SiteHeader } from '@/components/site/SiteHeader'
import { SiteFooter } from '@/components/site/SiteFooter'
import { Hero } from '@/components/home/Hero'
import { FeatureGrid } from '@/components/home/FeatureGrid'
import { HowItWorks } from '@/components/home/HowItWorks'
import { SpecsSection } from '@/components/home/SpecsSection'
import { SystemArchitecture } from '@/components/home/SystemArchitecture'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteHeader />
      <Hero />
      <FeatureGrid />
      <HowItWorks />
      <SpecsSection />
      <SystemArchitecture />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-zinc-900 to-zinc-900 p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Ready to take the controls?</h2>
          <p className="mt-3 text-zinc-400 max-w-xl mx-auto">
            Open the live dashboard to drive Magnetrieve, watch detection events roll in, and manage a retrieval pass
            from start to finish.
          </p>
          <Link
            to="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-zinc-950 hover:bg-amber-400 transition-colors"
          >
            Launch control dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
